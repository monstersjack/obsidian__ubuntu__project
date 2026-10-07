# 04 - API接口参考文档

> **阅读目标**: 掌握 X-LINE 所有对外通信接口（REST API / WebSocket / TCP）  
> **建议用时**: 45分钟  
> **参考**: 可配合 [05_通信拓扑.md](05_通信拓扑.md) 阅读

---

## 1. 概览

X-LINE Server 基于 Flask + Socket.IO，提供三种通信方式：

| 通信方式 | 端点 | 数量 | 用途 |
|----------|------|------|------|
| **REST API** | `/api/v1/*` | 29个端点 | 文件管理、执行历史、路径规划、同步、监控 |
| **WebSocket** | Socket.IO | 17个事件 | 实时执行编排、文件变更推送、心跳 |
| **TCP** | 4个端口 | 4个协议 | 执行状态推送(9998)、控制命令(9997)、设备控制(9996)、位置服务(9999) |

### 通用信息

| 项目 | 值 |
|------|-----|
| 默认地址 | `http://192.168.0.123:5000` |
| API 前缀 | `/api/v1/` |
| 默认 API Key | `xline-production-api-key-12345` |

### 认证方式

所有 REST API 端点均需认证：

```bash
# 方式1: Header
curl -H "X-API-Key: xline-production-api-key-12345" http://192.168.0.123:5000/api/v1/files

# 方式2: Query参数
curl http://192.168.0.123:5000/api/v1/files?api_key=xline-production-api-key-12345
```

### 统一响应格式

```json
// 成功
{"success": true, "message": "操作成功", "code": 200, "data": {...}}

// 错误
{"success": false, "message": "错误描述", "code": 400, "error_type": "BadRequest"}
```

### 标准错误码

| HTTP | error_type | 说明 |
|------|-----------|------|
| 400 | BadRequest | 通用错误 |
| 401 | Unauthorized | 缺少/无效API密钥 |
| 404 | NotFound | 资源不存在 |
| 422 | ValidationError | 参数验证失败 |
| 500 | InternalServerError | 服务器内部错误 |
| 503 | — | 服务降级 (health检查) |

---

## 2. REST API 端点（按模块分组）

### 2.1 文件管理 API

#### `GET /api/v1/files` — 获取文件列表

**Query参数**:

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `status` | string | 否 | — | `active` / `deleted` |
| `conversion_status` | string | 否 | — | `pending` / `processing` / `success` / `failed` |
| `has_json` | string | 否 | — | `true` / `false` |
| `page` | int | 否 | 1 | 页码(>=1) |
| `per_page` | int | 否 | 20 | 每页数量(1-100) |

**响应示例**:
```json
{
  "success": true, "code": 200,
  "data": {
    "files": [{
      "file_id": "abc123",
      "original_name": "project.dxf",
      "status": "active",
      "conversion_status": "success",
      "size_bytes": 1024000,
      "created_at": "2026-05-06T10:00:00"
    }],
    "total": 42, "page": 1, "per_page": 20, "total_pages": 3
  }
}
```

#### `POST /api/v1/files/upload` — 上传CAD并自动转换

**Content-Type**: `multipart/form-data`

**Body**: `file` (文件，支持 `*.dwg`, `*.dxf`, `*.dgn`, `*.pdf`, `*.plt`, `*.hpgl`)

**说明**: 同名文件直接覆盖，异步触发DXF转换

**WebSocket推送**: `file_uploaded` → `conversion_complete`

**响应**:
```json
{
  "success": true, "message": "文件上传并转换成功", "code": 200,
  "data": {"file_id": "abc123", "original_name": "project.dxf", "conversion_status": "processing"}
}
```

#### `GET /api/v1/files/<file_id>` — 获取文件详情

**响应**:
```json
{
  "success": true, "code": 200,
  "data": {
    "file_id": "abc123", "original_name": "project.dxf",
    "status": "active", "conversion_status": "success",
    "has_json": true, "size_bytes": 1024000
  }
}
```

#### `DELETE /api/v1/files/<file_id>` — 删除文件

**WebSocket推送**: `file_deleted`

#### `GET /api/v1/files/<file_id>/download` — 下载转换后DXF

**响应**: 文件流 (二进制), `Content-Disposition: attachment`

**错误**: `202` — 文件正在转换中

#### `GET /api/v1/files/<file_id>/download-raw` — 下载原始CAD

#### `POST /api/v1/files/<file_id>/json` — 上传关联JSON

**Content-Type**: `multipart/form-data`, **Body**: `file` (JSON文件)

**WebSocket推送**: `json_uploaded`

#### `GET /api/v1/files/<file_id>/json` — 下载关联JSON

#### `DELETE /api/v1/files/<file_id>/json` — 仅删除JSON

**WebSocket推送**: `json_deleted`

#### `POST /api/v1/files/<file_id>/json-transformed` — 上传转换后JSON

保存到专用目录，不修改原始JSON。

#### `GET /api/v1/files/<file_id>/json-transformed` — 下载转换后JSON

#### `POST /api/v1/files/<file_id>/execution-history` — 上传执行历史

#### `GET /api/v1/files/<file_id>/execution-history` — 下载执行历史

#### `DELETE /api/v1/files/<file_id>/execution-history` — 删除执行历史

#### `POST /api/v1/files/<file_id>/retry` — 重试转换失败的文件

**WebSocket推送**: `conversion_complete`

#### `GET /api/v1/files/statistics` — 文件统计

```json
{"success":true,"data":{"total_files":42,"total_size_mb":15.3}}
```

---

### 2.2 执行管理 API

#### `GET /api/v1/execution/history` — 获取执行历史

**Query参数**:

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `file_name` | string | 是 | — | 文件名 |
| `limit` | int | 否 | 10 | 返回记录数上限 |

#### `GET /api/v1/execution/session/<session_id>` — 获取会话详情

```json
{
  "success": true,
  "data": {
    "session": {
      "session_id": "sess_001",
      "plan_uid": "plan_123",
      "status": "completed",
      "completed_lines": 10,
      "failed_lines": 0,
      "start_time": "...",
      "end_time": "..."
    }
  }
}
```

---

### 2.3 规划 API

#### `POST /api/v1/planning/plan` — 生成路径规划

**Content-Type**: `application/json`

**Body**:
```json
{
  "transformed_json": {
    "lines": [
      {"type": "LINE", "vertices": [[0,0], [1,0]], "printer": "left", "ink": "solid"}
    ]
  },
  "plan_path": "custom_name.json"
}
```

**响应**:
```json
{
  "success": true, "message": "规划生成成功",
  "data": {
    "plan_path": "a1b2c3d4.json",
    "saved_to": "/path/to/planned_results/planned_a1b2c3d4.json",
    "plan": {"lines": [...], "planning_metadata": {...}}
  }
}
```

---

### 2.4 同步 API

#### `GET /api/v1/sync/status` — 同步状态

```json
{
  "success": true,
  "data": {
    "server_status": "running",
    "last_sync_time": "2026-05-06T12:00:00",
    "file_count": 42,
    "total_size_mb": 15.3,
    "sync_interval": 5
  }
}
```

#### `GET /api/v1/sync/changes` — 文件变更记录

**Query**: `since` (ISO 8601时间戳, 默认1小时前)

#### `POST /api/v1/sync/heartbeat` — 客户端心跳

**Body**: `{"client_id": "app-001", "client_type": "flutter"}`

**响应**: `{"success": true, "data": {"server_time": "...", "next_heartbeat_interval": 30}}`

#### `GET /api/v1/sync/health` — 同步健康检查

#### `GET /api/v1/sync/clients` — 已连接客户端

#### `POST /api/v1/sync/force-sync` — 强制全量同步

**WebSocket推送**: `force_sync` (所有文件信息)

---

### 2.5 监控 API

#### `GET /api/v1/monitoring/status` — 系统状态

#### `GET /api/v1/monitoring/metrics` — 性能指标

#### `GET /api/v1/monitoring/health` — 综合健康检查

**响应示例**:
```json
{
  "success": true,
  "data": {
    "overall_status": "healthy",
    "components": {
      "system": "healthy",
      "upload_folder": "accessible",
      "file_service": "healthy",
      "memory": "healthy",
      "disk": "healthy"
    },
    "checks_passed": 5, "total_checks": 5
  }
}
```

---

## 3. WebSocket 事件详解

### 3.1 连接管理事件

#### `connect` (系统事件)

**服务端回复**: `connect_response`
```json
{"status": "connected", "session_id": "sess_123", "server_time": "..."}
```

#### `heartbeat` (客户端→)

**客户端发送**: `{"client_id": "app-001"}`

**服务端回复**: `heartbeat_response`
```json
{"server_time": "...", "client_id": "app-001"}
```

#### `get_server_status` (客户端→)

**服务端回复**: `server_status`
```json
{
  "server_time": "...",
  "connected_clients": 3,
  "file_statistics": {"total": 42},
  "uptime": "2h 30m"
}
```

#### `join_room` / `leave_room`

**客户端发送**: `{"room": "execution_updates"}`

**服务端回复**: `room_joined` / `room_left`
```json
{"room": "execution_updates", "status": "joined"}
```

---

### 3.2 执行控制事件（核心）

#### `execute_plan` (客户端→) ★★★

**最核心的执行入口**。启动离线路径规划任务的顺序下发执行。

**客户端发送**:
```json
{
  "plan_path": "a1b2c3d4.json",
  "plan_uid": "my-plan-001",
  "file_name": "project.dxf",
  "execution_mode": "all",
  "start_index": 1,
  "completed_line_ids": ["line_1", "line_2"]
}
```

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `plan_path` | string | 是 | 计划文件名（相对路径） |
| `plan_uid` | string | 否 | 计划唯一ID（默认自动生成） |
| `file_name` | string | 否 | 关联文件（用于执行历史） |
| `execution_mode` | string | 否 | `all` / `continue` / `restart` / `from_index` |
| `start_index` | int | 否 | 起始行号（1-based, from_index模式） |
| `completed_line_ids` | list | 否 | 已完成ID列表（continue模式参考） |

**执行流程**:
1. 校验计划文件 → 解析JSON
2. 检查队列占用
3. 调用姿态校正服务（成功才继续）
4. 按顺序逐条下发路径

**服务端事件序列**:
```
plan_accepted → calibration_start → calibration_success
→ execution_start → task_start → [line_execution_status]
→ task_complete → ... (下一条) ...
→ execution_complete → plan_complete
```

#### `cancel_plan` (客户端→)

**服务端回复**: `cancel_accepted` (成功) / `cancel_rejected` (失败)

#### `pause_plan` (客户端→)

**服务端回复**: `pause_accepted` / `pause_rejected`

**注意**: 暂停分两步 — ① 停止下发后续路径 ② 暂停当前正在执行的路径

#### `resume_plan` (客户端→)

**服务端回复**: `resume_accepted` / `resume_rejected`

#### `get_execution_state` (客户端→)

**服务端回复**: `execution_state`
```json
{
  "status": "executing",
  "plan_uid": "my-plan-001",
  "current_id": 3,
  "total_orders": 10,
  "start_time": "...",
  "error_message": ""
}
```

状态枚举: `idle` / `executing` / `paused` / `completed` / `failed` / `canceling`

#### `subscribe_execution` / `unsubscribe_execution`

加入/离开 `execution_updates` 房间，接收实时状态推送。

---

### 3.3 文件事件

#### `subscribe_files` (客户端→)

**客户端发送** (可选): `{"send_current_list": true}`

**服务端回复**: `subscription_confirmed` + `current_files` (可选)

**服务端主动推送事件** (广播给 `file_updates` 房间):
- `file_uploaded` / `file_updated` / `file_deleted`
- `json_uploaded` / `json_deleted`
- `conversion_complete`
- `force_sync`

#### `unsubscribe_files` (客户端→)

**服务端回复**: `subscription_cancelled`

---

### 3.4 WebSocket事件汇总表

| 客户端发送 | 服务端回复 | 类型 |
|-----------|-----------|------|
| `connect` | `connect_response` | 连接 |
| `heartbeat` | `heartbeat_response` | 心跳 |
| `get_server_status` | `server_status` | 状态 |
| `join_room` | `room_joined` | 房间 |
| `leave_room` | `room_left` | 房间 |
| `execute_plan` | `plan_accepted`→序列推送→`plan_complete` | 执行 |
| `cancel_plan` | `cancel_accepted`/`cancel_rejected` | 控制 |
| `pause_plan` | `pause_accepted`/`pause_rejected` | 控制 |
| `resume_plan` | `resume_accepted`/`resume_rejected` | 控制 |
| `get_execution_state` | `execution_state` | 查询 |
| `subscribe_execution` | `subscription_confirmed` | 订阅 |
| `unsubscribe_execution` | `subscription_cancelled` | 订阅 |
| `subscribe_files` | `subscription_confirmed` | 订阅 |
| `unsubscribe_files` | `subscription_cancelled` | 订阅 |

---

## 4. TCP 协议详解

### 4.1 执行状态推送 (端口 9998)

**协议**: TCP长连接，每行一个JSON (以`\n`分隔)

```
欢迎消息:
{"type":"welcome","message":"已连接到执行状态推送服务器","timestamp":"..."}

心跳:
→ {"action":"ping"}
← {"type":"pong","timestamp":"..."}

广播消息格式:
{
  "event": "line_execution_status",
  "timestamp": "2026-05-06T12:00:00",
  "plan_uid": "my-plan-001",
  "data": {
    "line_id": "line_1",
    "status": "completed",
    "session_id": "session_xxx",
    "order": 1
  }
}
```

支持事件类型: `execution_start`, `line_execution_status`, `execution_complete`, `task_start`, `task_complete`, `task_failed`, `status_change`, `plan_complete`, `plan_failed`, `plan_cancelled`, `plan_rejected`

### 4.2 控制命令 (端口 9997)

**协议**: TCP短连接，请求-响应模式

```json
// 请求
{"cmd": "pause", "plan_uid": "my-plan-001"}

// 响应 - 成功
{"cmd":"pause_response","status":"success","message":"暂停请求已发送","plan_uid":"my-plan-001","timestamp":"..."}

// 响应 - 失败
{"cmd":"pause_response","status":"error","message":"当前状态为 idle","timestamp":"..."}
```

支持命令:
| cmd | 说明 |
|-----|------|
| `pause` | 暂停当前执行 |
| `resume` | 恢复已暂停的执行 |
| `cancel` | 取消当前执行 |
| `watch_status` | 进入5Hz状态推送模式 (长连接) |

**watch_status模式**:
```json
// 每0.2秒推送
{"cmd":"status_update","status":"success","current_status":"executing","plan_uid":"...","timestamp":"..."}
// 任务结束
{"cmd":"status_update","status":"success","message":"no_active_task"}
```

### 4.3 设备控制 (端口 9996)

**协议**: 简单字符串命令，JSON响应

| 命令 | 功能 | ROS2服务 |
|------|------|----------|
| `init_station` | 初始化全站仪 | `/ln_driver/command_srv` (type=1) |
| `auto_track` | 自动跟踪 | `/ln_driver/command_srv` (type=2) |
| `auto_level` | 自动调平 | `/ln_driver/command_srv` (type=3) |

```json
→ "init_station"
← {"success": true, "message": "全站仪初始化成功"}

→ "auto_track"
← {"success": false, "message": "LN150控制服务不可用"}
```

---

## 5. 调用示例

### 5.1 完整执行流程 (WebSocket)

```javascript
// 1. 连接
const socket = io('http://192.168.0.123:5000');

// 2. 订阅执行状态
socket.emit('subscribe_execution');

// 3. 监听事件
socket.on('execution_start', (data) => {
  console.log('执行开始:', data.total_lines);
});
socket.on('line_execution_status', (data) => {
  console.log(`路径 ${data.data.order}: ${data.data.status}`);
});
socket.on('plan_complete', (data) => {
  console.log('执行完成!', data);
});

// 4. 启动执行
socket.emit('execute_plan', {
  plan_path: 'a1b2c3d4.json',
  plan_uid: 'test-plan-001'
});

// 5. 暂停
socket.emit('pause_plan');

// 6. 恢复
socket.emit('resume_plan');

// 7. 取消
socket.emit('cancel_plan');
```

### 5.2 文件上传 (REST API)

```bash
# 上传CAD文件
curl -X POST http://192.168.0.123:5000/api/v1/files/upload \
  -H "X-API-Key: xline-production-api-key-12345" \
  -F "file=@project.dxf"

# 获取文件列表
curl http://192.168.0.123:5000/api/v1/files?page=1&per_page=50 \
  -H "X-API-Key: xline-production-api-key-12345"
```

### 5.3 控制命令 (TCP 9997)

```python
import socket, json

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.connect(('192.168.0.123', 9997))

# 暂停
sock.send(json.dumps({"cmd": "pause", "plan_uid": "test-001"}).encode() + b'\n')
resp = json.loads(sock.recv(4096))
print(resp)  # {"cmd":"pause_response","status":"success"...}

sock.close()
```

---

## 6. API端点速查表

| 方法 | 路由 | 功能 |
|------|------|------|
| GET | `/api/v1/files` | 文件列表 |
| POST | `/api/v1/files/upload` | 上传CAD |
| GET | `/api/v1/files/<id>` | 文件详情 |
| DELETE | `/api/v1/files/<id>` | 删除文件 |
| GET | `/api/v1/files/<id>/download` | 下载DXF |
| POST | `/api/v1/files/<id>/json` | 上传JSON |
| GET | `/api/v1/files/<id>/json` | 下载JSON |
| POST | `/api/v1/files/<id>/json-transformed` | 上传转换后JSON |
| GET | `/api/v1/files/<id>/json-transformed` | 下载转换后JSON |
| POST | `/api/v1/files/<id>/execution-history` | 上传执行历史 |
| GET | `/api/v1/files/<id>/execution-history` | 下载执行历史 |
| POST | `/api/v1/files/<id>/retry` | 重试转换 |
| GET | `/api/v1/files/statistics` | 文件统计 |
| GET | `/api/v1/execution/history` | 执行历史 |
| GET | `/api/v1/execution/session/<id>` | 会话详情 |
| POST | `/api/v1/planning/plan` | 路径规划 |
| GET | `/api/v1/sync/status` | 同步状态 |
| GET | `/api/v1/sync/changes` | 文件变更 |
| POST | `/api/v1/sync/heartbeat` | 心跳 |
| GET | `/api/v1/sync/health` | 同步健康 |
| GET | `/api/v1/sync/clients` | 客户端 |
| POST | `/api/v1/sync/force-sync` | 强制同步 |
| GET | `/api/v1/monitoring/status` | 系统状态 |
| GET | `/api/v1/monitoring/metrics` | 性能指标 |
| GET | `/api/v1/monitoring/health` | 综合健康 |

---

*下一篇: [05_通信拓扑.md](05_通信拓扑.md) — Topic/Service/Action/TCP通信全貌（已在上一个批次生成）*
