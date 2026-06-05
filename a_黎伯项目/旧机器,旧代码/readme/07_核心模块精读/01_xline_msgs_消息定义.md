# 07-01 - xline_msgs 消息定义

> **位置**: `ros_pack/xline_msgs/`  
> **语言**: C++ (ROS 2 IDL)  
> **依赖**: 无 (最底层的消息包)

---

## 1. 模块定位

xline_msgs 是整个系统的**通信协议层**，定义了所有自定义的 Action/Service/Message。所有其他包通过它进行跨节点通信。

```
xline_msgs (通信基础)
  ↑ 依赖
  ├── xline_base_controller (ExecutePlan Action)
  ├── xline_server (ExecutePlan Action + 多个srv)
  ├── xline_inkjet_printer (PrinterCommand srv)
  └── stepper_motor_driver (MotorCommand srv)
```

## 2. 文件清单

| 文件 | 用途 |
|------|------|
| `src/xline_msgs/CMakeLists.txt` | 构建配置 (rosidl_default_generators) |
| `src/xline_msgs/package.xml` | 包元信息 |
| `action/ExecutePlan.action` | ★★ 核心执行动作定义 |
| `srv/MotorCommand.srv` | 步进电机控制 |
| `srv/PrinterCommand.srv` | 打印机命令 |
| `srv/LnCommand.srv` | LN150设备命令 |
| `srv/QuickCommand.srv` | 快速命令 |
| `srv/ConfigurePrint.srv` | 打印配置 |
| `srv/SetLine.srv` | 设置线段 |
| `srv/SetPrinterActive.srv` | 激活打印机 |
| `srv/SetPrinterEnabled.srv` | 启用打印机 |
| `srv/SetText.srv` | 设置文字 |

## 3. ExecutePlan.action — 核心通信协议

### 三段式结构

```
# Goal (请求)
string plan_json    # JSON格式的执行计划 (单条路径)
string plan_uid     # 计划唯一标识
---
# Feedback (实时反馈, 执行中持续推送)
int32 current_id    # 当前执行到的路径索引
string status       # 执行状态: idle|executing|paused|canceling
---
# Result (最终结果)
bool success        # 是否成功
string error_msg    # 错误信息 (失败时)
```

### 通信模型图

```
ExecutionManager          MotionControlCenter
(xline_server)               (base_controller)
    │                                │
    │── send_goal(plan_json,uid)──►│
    │                                │── handleGoal() → 接受/拒绝
    │                                │
    │◄── feedback(current_id=1)────│  (执行路径1时)
    │◄── feedback(current_id=2)────│  (执行路径2时)
    │◄── feedback(current_id=N)────│  (执行路径N时)
    │                                │
    │◄── result(success, error)────│  (全部执行完成)
```

## 4. 对外接口

| 类型 | 名称 | 说明 |
|------|------|------|
| Action Server | `/execute_plan` | base_controller 提供 |
| Action Client | `/execute_plan` | xline_server (ExecutionManager) 调用 |
| Service Server | `/printer_command` | inkjet_printer 提供 |
| Service Server | `/motor_command` | stepper_motor 提供 |
| Service Server | `/ln_driver/command_srv` | ln150_driver 提供 |

## 5. 与其他模块的交互

- **上游依赖**: 无 (最底层通信包)
- **下游消费方**: xline_base_controller / xline_server / xline_inkjet_printer / stepper_motor_driver / xline_ln150_driver
