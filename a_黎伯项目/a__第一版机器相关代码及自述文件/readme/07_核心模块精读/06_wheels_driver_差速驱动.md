# 07-06 - wheels_driver 差速驱动

> **位置**: `ros_pack/wheels_driver/`  
> **语言**: Python 3.10  
> **核心依赖**: rclpy, pyserial

---

## 1. 模块定位

wheels_driver 位于架构**第四层**，是硬件抽象层的核心。接收 `/cmd_vel` 速度指令，通过 CANopen 协议控制 iWMC 伺服轮，发布 `/odom` 里程计数据。

## 2. 文件清单

| 文件 | 功能 |
|------|------|
| `wheels_driver/run_motor.py` | ★★ 主节点: 差速控制 + 里程计 + 超时保护 |
| `wheels_driver/iwmc_servo_control.py` | ★ iWMC伺服 CANopen 控制 |
| `wheels_driver/slcan_comm.py` | SLCAN串口通信层 (SDO读写) |
| `wheels_driver/waveshare_can.py` | Waveshare CAN适配器驱动 |
| `config/differential_wheels_params.yaml` | 轮参数 + 编码器 + 速度限制 |

## 3. 核心控制循环 (50Hz)

```
run_motor.py control_loop():

1. cmd_vel超时保护
   if (now - last_cmd_vel_time > timeout):
       v = 0, ω = 0

2. 速度限幅
   v = clamp(v, -max_linear, max_linear)
   ω = clamp(ω, -max_angular, max_angular)

3. 逆运动学 → RPM
   v_left  = (v - wheel_base/2 × ω) / wheel_radius
   v_right = (v + wheel_base/2 × ω) / wheel_radius
   RPM_left  = v_left  × 60 / (2π)
   RPM_right = v_right × 60 / (2π)

4. RPM → DEC (iWMC协议)
   DEC = RPM × 512 × encoder_resolution / 1875

5. CANopen SDO写入
   slcan_comm.sdo_write(1, 0x60FF, DEC_left)
   slcan_comm.sdo_write(2, 0x60FF, DEC_right)

6. 读取编码器反馈速度
   actual_rpm_left  = read_actual_velocity(1)
   actual_rpm_right = read_actual_velocity(2)

7. 正运动学 + 里程计
   v_actual  = (rpm_left + rpm_right) × wheel_radius / 2
   ω_actual = (rpm_right - rpm_left) × wheel_radius / wheel_base
   更新 odom.x, odom.y, odom.θ (解析积分)

8. 发布
   /odom (nav_msgs/Odometry)
   /joint_states (sensor_msgs/JointState)
   /tf (odom → base_link)
```

## 4. iWMC伺服CANopen状态机

```
NOT_READY → SWITCH_ON_DISABLED → READY → SWITCHED_ON → OPERATION_ENABLED

enable_servo():
  Shutdown(0x06) → 等待 → SwitchOn(0x07) → 等待 → EnableOperation(0x0F)
  最多重试5次
```

操作模式 (0x6060):
- 1 = 位置模式
- 3 = 速度模式 (本项目使用)
- 4 = 转矩模式
- 6 = 回零模式

## 5. 配置参数

| 参数 | 说明 |
|------|------|
| `wheel_radius` | 轮半径 (m) |
| `wheel_base` | 轮距 (m) |
| `encoder_resolution` | 编码器分辨率 |
| `gear_ratio` | 减速比 |
| `serial_port` | 串口号 (/dev/ttyUSB0) |
| `can_baudrate` | CAN波特率 |
| `control_frequency` | 控制频率 (Hz) |
| `cmd_vel_timeout` | 超时时间 (s) |
| `max_linear_velocity` | 最大线速度 (m/s) |
| `max_angular_velocity` | 最大角速度 (rad/s) |
| `simulation_mode` | 仿真模式 (不需硬件) |

## 6. 对外接口

- **订阅**: `/cmd_vel` (geometry_msgs/Twist) — 速度指令
- **发布**: `/odom` (nav_msgs/Odometry) — 里程计
- **发布**: `/joint_states` (sensor_msgs/JointState) — 关节状态
- **广播**: `/tf` (tf2_msgs/TFMessage) — 坐标变换

## 7. 安全特性

- **超时保护**: cmd_vel 超时自动置零停车
- **速度限幅**: 软件限幅防止电机过速
- **仿真模式**: 不需硬件即可调试控制逻辑
- **优雅关闭**: shutdown() 安全停车 + 断开电机连接

---

## 8. 硬件背景：伺服轮（Servo Wheel）

wheels_driver 控制的硬件是 **iWMC 伺服轮**，本节补充硬件层面的背景知识，帮助理解驱动代码的逻辑。

### 8.1 什么是伺服轮

**伺服轮**（Servo Wheel）是一种集成了**伺服电机**、**光电编码器**和**伺服驱动器**的智能轮组模块。与普通直流电机相比，它具备：

| 特性 | 普通直流电机 | 伺服轮 (iWMC) |
|------|------------|---------------|
| **控制精度** | 低（开环控制） | 高（闭环控制，编码器反馈） |
| **通信协议** | PWM / 模拟电压 | CANopen（数字协议） |
| **状态反馈** | 无 | 速度、位置、电流、温度 |
| **保护功能** | 需外部实现 | 内置过流/过热/过压保护 |
| **参数配置** | 固定 | 可通过 SDO 在线调整 |
| **多机同步** | 困难 | CAN 总线天然支持多节点 |

### 8.2 iWMC 伺服轮内部结构

```
┌─────────────────────────────────────────┐
│              iWMC 伺服轮                 │
│                                         │
│  ┌─────────┐    ┌──────────┐           │
│  │ 伺服电机  │───→│ 减速器     │───→ 轮毂  │
│  │ (无刷DC) │    │ (齿轮箱)   │          │
│  └────┬────┘    └──────────┘           │
│       │                                 │
│  ┌────▼────────────────────────────┐   │
│  │       伺服驱动器 (内置)           │   │
│  │                                 │   │
│  │  ┌───────────┐  ┌───────────┐  │   │
│  │  │ CANopen   │  │ 速度/位置  │  │   │
│  │  │ 协议栈    │  │ PID 控制器 │  │   │
│  │  └─────┬─────┘  └─────┬─────┘  │   │
│  │        │              │        │   │
│  │  ┌─────▼──────────────▼─────┐  │   │
│  │  │     光电编码器反馈        │  │   │
│  │  │   (分辨率 × 减速比)       │  │   │
│  │  └──────────────────────────┘  │   │
│  └────────────────────────────────┘   │
│                  │                     │
│            CAN 总线接口                 │
│          (CAN_H / CAN_L)              │
└─────────────────────────────────────────┘
```

### 8.3 为什么选择 CANopen 协议

| 优势 | 说明 |
|------|------|
| **多节点** | 一条 CAN 总线可挂载多达 127 个节点 |
| **实时性** | CAN 总线仲裁机制保证高优先级消息优先发送 |
| **可靠性** | 差分信号 + CRC 校验，抗干扰能力强 |
| **标准化** | CANopen (CiA 301/402) 是工业标准，兼容性好 |
| **即插即用** | 标准对象字典 (Object Dictionary)，参数统一访问 |

### 8.4 差速驱动运动学

X-LINE 使用**两轮差速驱动**模型：

```
                    前
                    ↑
                    │
          ┌─────────┼─────────┐
          │                   │
    左轮 ●                   ● 右轮
          │         ●         │
          │    (机器人中心)    │
          │                   │
          └───────────────────┘
          ←─── 轮距 L ───────→
```

**逆运动学**（cmd_vel → 轮速）：
```
v_left  = (v - L/2 × ω) / r      // 左轮线速度
v_right = (v + L/2 × ω) / r      // 右轮线速度

其中: v = 机器人线速度, ω = 角速度
     L = 轮距, r = 轮半径
```

**正运动学**（轮速 → 里程计）：
```
v = (v_left + v_right) × r / 2   // 机器人线速度
ω = (v_right - v_left) × r / L   // 机器人角速度

位姿更新 (精确弧线积分):
Δθ = ω × Δt
Δx = v × cos(θ + Δθ/2) × Δt    // 中点法
Δy = v × sin(θ + Δθ/2) × Δt
```

### 8.5 iWMC 速度转换链

从 ROS 的 cmd_vel 到电机实际转动，需要经过三次单位转换：

```
cmd_vel (m/s, rad/s)
    │
    ▼ 逆运动学
轮线速度 v_left, v_right (m/s)
    │
    ▼ ÷ 轮半径 × 60 / (2π)
RPM (转/分钟)
    │
    ▼ × 512 × 编码器分辨率 / 1875
DEC 值 (iWMC 内部速度单位)
    │
    ▼ SDO 写入 0x60FF
电机实际转动
```

这个转换链在 `run_motor.py` 的 `control_loop()` 中完整实现。
