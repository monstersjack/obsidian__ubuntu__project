# 08-06 - run_motor.py 详解

> **完整路径**: `ros_pack/wheels_driver/wheels_driver/run_motor.py`  
> **语言**: Python 3.10  
> **重要性**: ★★ (差速驱动核心)

---

## 1. 功能概述

两轮差速驱动核心节点，接收 `/cmd_vel` → 逆运动学 → CANopen 伺服轮控制 → 编码器反馈 → 正运动学 → `/odom` 里程计。

## 2. 核心类: DifferentialWheelsDriver

### 2.1 `__init__()`

```
初始化:
  - 加载 YAML 配置 (轮半径/轮距/编码器/串口/速度限制)
  - 创建 cmd_vel 订阅者
  - 创建 odom/joint_states 发布者
  - 创建 TF 广播器
  - 初始化伺服轮: connect() → enable_servo() → set_operation_mode(3=速度)
  - 创建 50Hz 定时器 → control_loop()
```

### 2.2 `cmd_vel_callback(msg)` — 速度指令接收

```
更新 last_cmd_vel_time = now()
target_v = msg.linear.x
target_ω = msg.angular.z
```

### 2.3 `control_loop()` — 主控制循环 (50Hz) ★★

```
control_loop():
  1. 超时保护
     if now() - last_cmd_vel_time > cmd_vel_timeout:
         v = 0, ω = 0  // 安全停车

  2. 速度限幅
     v = clamp(v, -max_linear, max_linear)
     ω = clamp(ω, -max_angular, max_angular)

  3. 逆运动学 → 轮速 (rad/s)
     v_left  = (v - wheel_base/2 × ω) / wheel_radius
     v_right = (v + wheel_base/2 × ω) / wheel_radius

  4. rad/s → RPM → DEC
     rpm_left  = v_left  × 60 / (2π)
     rpm_right = v_right × 60 / (2π)
     dec = rpm × 512 × encoder_resolution / 1875

  5. CANopen SDO写入
     servo_left.set_target_velocity_rpm(rpm_left)
     servo_right.set_target_velocity_rpm(rpm_right)

  6. 读取实际速度
     actual_rpm_left  = servo_left.read_actual_velocity()
     actual_rpm_right = servo_right.read_actual_velocity()

  7. 正运动学 + 里程计
     v_actual  = (rpm_left+rpm_right)/2 × 2π/60 × wheel_radius
     ω_actual = (rpm_right-rpm_left) × 2π/60 × wheel_radius / wheel_base
     
     解析积分:
     if |ω_actual| < ε:
       dx = v_actual × cos(θ) × dt
       dy = v_actual × sin(θ) × dt
     else:
       R = v_actual / ω_actual
       dx = R × (sin(θ+ω_actual×dt) - sin(θ))
       dy = R × (cos(θ) - cos(θ+ω_actual×dt))
     odom_θ += ω_actual × dt (不限幅)

  8. 发布
     publish odom
     publish joint_states
     publish TF (odom → base_link)
```

### 2.4 `shutdown()` — 安全关闭

```
1. 设置 v=0, ω=0 → 停车
2. disconnect() 伺服轮
3. 关闭串口
```

## 3. 关键配置

| 参数 | 说明 |
|------|------|
| `wheel_radius` | 轮半径 (m) |
| `wheel_base` | 左右轮间距 (m) |
| `encoder_resolution` | 编码器分辨率 (线/转) |
| `gear_ratio` | 减速比 |
| `cmd_vel_timeout` | cmd_vel超时 (s) |
| `max_linear_velocity` | 最大线速度 (m/s) |
| `max_angular_velocity` | 最大角速度 (rad/s) |
| `simulation_mode` | 仿真模式 (不需硬件) |

## 4. 安全机制

- **超时保护**: 超时自动置零停车，防止断联后继续跑车
- **速度限幅**: 软件软限幅
- **零速停车**: shutdown时先发零速再断开连接
- **仿真模式**: 调试时无需硬件
