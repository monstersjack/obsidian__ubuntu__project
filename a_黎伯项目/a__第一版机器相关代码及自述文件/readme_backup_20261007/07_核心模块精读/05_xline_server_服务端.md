# 07-05 - xline_server 服务端

> **位置**: `ros_pack/xline_server/`  
> **语言**: Python 3.10  
> **核心依赖**: Flask, Flask-SocketIO, eventlet, rclpy

---

## 1. 模块定位

xline_server 位于架构**第一层**，是用户接口与ROS 2系统之间的网关。提供 REST API + WebSocket + TCP 三种对外通信通道。

## 2. 文件清单

| 文件 | 功能 |
|------|------|
| `__main__.py` | ★★ 主启动文件 (10步启动流程) |
| `config/config.py` | 全局配置类 (API_KEY/HOST/PORT/...) |
| `api/execution.py` | 执行历史API |
| `api/files.py` | 文件管理API |
| `api/planning.py` | 规划API (触发xline_path_planner) |
| `api/monitoring.py` | 监控API |
| `api/sync.py` | 同步API |
| `services/execution_manager.py` | ★★★ ROS2 Action客户端+状态管理 |
| `services/file_service.py` | 文件业务逻辑 |
| `services/monitoring_service.py` | 系统资源监控 |
| `services/sync_service.py` | 文件同步 (5秒轮询) |
| `communications/websocket/execution_events.py` | ★★★ 执行编排核心 (execute_plan) |
| `communications/websocket/connection_events.py` | WebSocket连接管理 |
| `communications/websocket/file_events.py` | WebSocket文件事件 |
| `communications/tcp/execution_status_server.py` | TCP执行状态推送 (9998) |
| `communications/tcp/control_command_server.py` | TCP控制命令 (9997) |
| `controllers/execution_controller.py` | ★ 执行流控制器 (Event信号量) |
| `robot/tcp/` | 机器人TCP控制层 (8888/9996/9993/9992) |
| `utils/` | 鉴权/错误处理/日志/响应助手 |

## 3. 启动流程 (10步)

```
__main__.py:
  ① rebuild_index()          文件索引重建
  ② TCP 9998                执行状态推送服务器
  ③ system_monitor           系统监控
  ④ sync_service             文件同步服务
  ⑤ rclpy.init()             ROS2初始化
  ⑥ ExecutionManager         创建Action客户端
  ⑦ WebSocket注册            connection/execution/file事件
  ⑧ ROS2 executor线程        MultiThreadedExecutor
  ⑨ TCP 9997                控制命令服务器
  ⑩ socketio.run()           Flask+SocketIO启动 (5000)
```

## 4. ExecutionManager — 核心状态机

```
状态: idle → executing → completed/failed
              ↓
            paused (可恢复)
              ↓
            canceling → idle
```

**关键方法**:
- `send_goal(plan_json, plan_uid)` — 发送执行目标
- `pause_execution()` — 暂停 (调用/execution/pause ROS Service)
- `resume_execution()` — 恢复
- `cancel_goal()` — 取消 (调用ROS Action cancel_goal)
- `get_state()` — 获取当前状态

## 5. execute_plan 编排流程 (execution_events.py)

```
execute_plan 事件处理:
  1. 校验 plan_path (文件存在性+JSON解析)
  2. 检查队列占用 (一次仅一个)
  3. 调用姿态校正 /motion_control/execute_calibration
     ├── 成功 → 继续
     └── 失败 → plan_rejected
  
  4. 逐条下发:
     for line in plan.lines:
       ├── 检查 _sequence_cancel_event / _sequence_pause_event
       ├── 构造 ExecutePlan Goal
       ├── send_goal → 等待 Result (阻塞)
       └── 发布 line_execution_status
  
  5. 全部完成 → plan_complete / plan_failed
```

## 6. 通信通道总览

| 通道 | 端口 | 用途 |
|------|------|------|
| REST API | 5000 | 文件管理/执行历史/规划/同步/监控 |
| WebSocket | 5000 | 执行编排/文件事件/状态推送 |
| TCP 9998 | 9998 | 执行状态推送 (移动端) |
| TCP 9997 | 9997 | 控制命令 (pause/resume/cancel) |
| TCP 9996 | 9996 | 设备控制 (全站仪/雷达) |
| TCP 9999 | 9999 | 位置服务 |
| TCP 8888 | 8888 | 底盘控制 |

## 7. 对外接口

- 提供29个REST API端点
- 提供17个WebSocket事件处理器
- 提供4个TCP服务器
- 作为ROS2 Action Client调用 `/execute_plan`
- 作为ROS2 Service Client调用 `/execution/pause`, `/execution/resume`, `/execution/calibrate`, `/plan_path`

---

## 8. 核心模块分层架构详解

xline_server 内部采用**分层架构**设计，每个目录承担明确的职责边界：

### 8.1 模块分层全景

```
┌──────────────────────────────────────────────────────────────────┐
│                    外部客户端                                      │
│     xline_cad (PyQt6)          xline_mobile (Flutter)             │
└──────┬──────────────────────────────┬────────────────────────────┘
       │ HTTP / WebSocket             │ HTTP / WebSocket / TCP
       ▼                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                    xline_server 内部                               │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  api/               ← 接口层 (Flask Blueprint)               │ │
│  │  - execution.py     ← 执行历史 API 端点                       │ │
│  │  - files.py         ← 文件管理 API 端点                       │ │
│  │  - monitoring.py    ← 监控 API 端点                           │ │
│  │  - planning.py      ← 路径规划 API 端点                       │ │
│  │  - sync.py          ← 同步 API 端点                           │ │
│  │  职责：接收 HTTP 请求 → 参数校验 → 调用 services              │ │
│  └──────────────────────┬──────────────────────────────────────┘ │
│                         │ 调用                                     │
│  ┌──────────────────────▼──────────────────────────────────────┐ │
│  │  services/          ← 业务逻辑层                              │ │
│  │  - execution_manager.py       ← ROS2 Action 客户端 ★★★       │ │
│  │  - execution_history_service.py                               │ │
│  │  - file_service.py                                            │ │
│  │  - monitoring_service.py                                      │ │
│  │  - planning_service.py       ← ROS2 Service 客户端            │ │
│  │  - sync_service.py                                           │ │
│  │  职责：核心业务逻辑、ROS2 通信、状态管理                       │ │
│  └──────┬───────────────────┬──────────────────┬────────────────┘ │
│         │                   │                   │                  │
│  ┌──────▼──────┐  ┌─────────▼────────┐  ┌───────▼──────────────┐ │
│  │ controllers │  │ communications/   │  │ robot/tcp/           │ │
│  │             │  │                   │  │                      │ │
│  │ execution_  │  │ websocket/        │  │ chassis_control_     │ │
│  │ controller  │  │ - connection      │  │ server (8888)        │ │
│  │             │  │ - execution ★★★   │  │ simple_device_       │ │
│  │ Event信号量 │  │ - file            │  │ server (9996)        │ │
│  │ 执行流控制   │  │                   │  │ motor_command_       │ │
│  │             │  │ tcp/              │  │ server (9993)        │ │
│  │             │  │ - exec_status     │  │ ...                  │ │
│  │             │  │   (9998)          │  │                      │ │
│  │             │  │ - control_cmd     │  │ 职责：机器人硬件       │ │
│  │             │  │   (9997)          │  │ TCP 直连控制          │ │
│  │             │  │                  │  │                      │ │
│  │             │  │ 职责：实时通信     │  │                      │ │
│  └─────────────┘  └──────────────────┘  └──────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  utils/             ← 工具层                                  │ │
│  │  auth_helper / error_handler / logger / response_helper      │ │
│  │  ros2_probe / security_helper                                │ │
│  │  职责：鉴权、日志、错误处理、统一响应格式                      │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                               │
                               │ ROS2 Action/Service
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│              底层 ROS2 节点                                       │
│  xline_base_controller / xline_path_planner / ...                │
└──────────────────────────────────────────────────────────────────┘
```

### 8.2 各模块详细职责

#### api/ — REST API 接口层

| 文件 | 职责 | 关键端点示例 |
|------|------|-------------|
| `execution.py` | 执行历史查询 | `GET /api/v1/execution/history` |
| `files.py` | 文件上传/下载/删除 | `POST /api/v1/files/upload` |
| `monitoring.py` | 系统健康检查、资源监控 | `GET /api/v1/monitoring/health` |
| `planning.py` | 触发路径规划 | `POST /api/v1/planning/plan` |
| `sync.py` | 数据同步状态 | `GET /api/v1/sync/status` |

**工作模式**：api 层只负责"接入"——接收 HTTP 请求、提取参数、格式校验，然后委托给 services 层处理。这种分层保证了**接口和业务逻辑的解耦**。

#### services/ — 业务逻辑层

| 文件 | 职责 | 关键能力 |
|------|------|---------|
| `execution_manager.py` | ★★★ 核心：ROS2 Action 客户端 | 发送执行目标、暂停/恢复/取消、状态跟踪 |
| `execution_history_service.py` | 执行历史管理 | 查询历史记录、统计分析 |
| `file_service.py` | 文件管理 | 文件增删改查、格式转换 |
| `monitoring_service.py` | 系统监控 | CPU/内存/磁盘、ROS2 节点健康 |
| `planning_service.py` | 路径规划 | 调用 `/plan_path` ROS2 Service |
| `sync_service.py` | 文件同步 | 5秒轮询同步 |

**工作模式**：services 层是"大脑"——所有业务决策都在这里做出，包括何时调用 ROS2 Action、如何管理执行状态机、何时触发同步等。

#### communications/ — 实时通信层

| 子模块 | 文件 | 端口 | 用途 |
|--------|------|------|------|
| **websocket/** | `connection_events.py` | 5000 | 连接/断开管理 |
| | `execution_events.py` | 5000 | ★★★ 执行编排核心 |
| | `file_events.py` | 5000 | 文件变更事件 |
| **tcp/** | `execution_status_server.py` | 9998 | 执行状态推送（移动端） |
| | `control_command_server.py` | 9997 | 控制命令接收（pause/resume/cancel） |

**为什么同时有 WebSocket 和 TCP？**
- **WebSocket**：适合移动端和桌面端，浏览器友好，双向实时通信
- **TCP**：适合移动端 APP，更低延迟，更轻量协议

#### robot/tcp/ — 机器人硬件直连层

| 服务 | 端口 | 控制对象 | 说明 |
|------|------|---------|------|
| `chassis_control_server.py` | 8888 | 底盘 | 直接控制底盘运动 |
| `simple_device_server.py` | 9996 | 全站仪/雷达 | 传感器设备控制 |
| `motor_command_server.py` | 9993 | 步进电机 | 喷码机升降控制 |
| `button_command_server.py` | 9992 | 按钮 | 面板按钮控制 |
| `robot_position_service/` | 9999 | 位置 | 实时位置推送 |

**工作模式**：robot/tcp 层是"手和脚"——直接控制硬件设备，不经过 ROS2 抽象。适合对延迟敏感的操作（如紧急停止）。

### 8.3 一次典型的 API 调用流程

以"路径规划"为例，完整展示各层的协作：

```
1. 用户操作 (xline_cad 桌面端)
   → POST /api/v1/planning/plan
   → Body: { "file_path": "/data/test.dxf" }

2. api/planning.py (接收请求)
   → 提取 file_path
   → 校验文件是否存在
   → 调用 services/planning_service.py

3. services/planning_service.py (业务逻辑)
   → 调用 ROS2 Service Client → /plan_path
   → 等待 ROS2 响应 (xline_path_planner 节点处理)
   → 解析返回的 planned_xxx.json 路径
   → 返回结果给 api 层

4. api/planning.py
   → 构造 HTTP 响应
   → 返回 JSON: { "success": true, "data": { "plan_uid": "xxx", "paths": [...] } }
```

### 8.4 一次典型的执行编排流程（WebSocket）

```
1. 用户操作 (xline_mobile 移动端)
   → WebSocket 事件: "execute_plan"
   → Payload: { "plan_path": "/data/planned_xxx.json" }

2. communications/websocket/execution_events.py
   → 校验 plan_path
   → 解析 JSON 执行计划
   → 调用姿态校正 (calibrate_pose)

3. services/execution_manager.py
   → 创建 ROS2 Action Goal
   → send_goal(plan_json, plan_uid)
   → 阻塞等待 ROS2 Action Result
   → 逐条下发路径段

4. controllers/execution_controller.py
   → Event 信号量控制流程
   → 管理 pause / resume / cancel 事件

5. 反馈通道
   → ROS2 Action Feedback → execution_manager 状态更新
   → WebSocket 推送: "line_execution_status"
   → 移动端实时更新 UI
```
