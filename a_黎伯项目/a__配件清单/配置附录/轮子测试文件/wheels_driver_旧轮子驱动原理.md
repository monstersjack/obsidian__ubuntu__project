---
标题: wheels_driver 旧包二轮差速实现原理说明
创建时间: 2026-07-06
修改时间: 2026-07-06
---

# wheels_driver 旧包二轮差速实现原理说明

本文档整理 `C:\Users\Jack\Downloads\xline_ws\install\wheels_driver` 这个旧 ROS 2 包的实现方式，重点说明它如何把 ROS 的 `/cmd_vel` 转成左右轮速度、如何控制电机、如何根据轮速反推里程计，以及写新的小车轮子驱动包 `wheels_driver` 时应该复用哪些结构、替换哪些协议层。

> 注意：`install` 目录是编译安装产物，不是最理想的源码目录。这里是根据安装后的 Python 文件反推实现原理。旧文件的中文注释已经乱码，但函数、公式、调用关系是完整的。

## 1. 旧包整体结构

旧包安装位置：

```text
C:\Users\Jack\Downloads\xline_ws\install\wheels_driver
```

关键文件：

```text
install/wheels_driver/
  lib/wheels_driver/wheels_driver_node
  lib/python3.10/site-packages/wheels_driver/
    run_motor.py              # ROS 2 主节点，二轮差速核心逻辑
    iwmc_servo_control.py     # iWMC/CANopen 伺服轮控制封装
    slcan_comm.py             # CANopen SDO 读写封装
    socketcan_adapter.py      # Linux SocketCAN 适配层
    waveshare_can.py          # Waveshare USB-CAN-A 串口适配层
  share/wheels_driver/
    package.xml
    config/differential_wheels_params.yaml
```

入口点：

```ini
[console_scripts]
wheels_driver_node = wheels_driver.run_motor:main
```

所以运行节点时，实际执行的是：

```python
wheels_driver.run_motor.main()
```

主类是：

```python
class DifferentialWheelsDriver(Node)
```

它的职责可以分成 5 层：

1. 读取 YAML 参数。
2. 创建左、右电机控制对象。
3. 订阅 `/cmd_vel`。
4. 周期性执行二轮差速逆解并下发电机速度。
5. 周期性发布 `/odom`、`/joint_states` 和 TF。

## 2. ROS 接口

旧包主节点名：

```text
differential_wheels_driver
```

订阅：

```text
cmd_vel: geometry_msgs/msg/Twist
```

发布：

```text
odom: nav_msgs/msg/Odometry
joint_states: sensor_msgs/msg/JointState
tf: odom -> base_link，受 publish_tf 参数控制
```

`cmd_vel` 中真正用到的是：

```text
linear.x   # 小车前后线速度，单位 m/s
angular.z  # 小车绕 z 轴角速度，单位 rad/s
```

主循环频率由参数决定：

```yaml
control_frequency: 50.0
```

状态发布频率在旧代码里固定为：

```python
self.state_timer = self.create_timer(0.05, self.publish_state)
```

也就是 20 Hz。

## 3. 参数文件的作用

旧包参数文件：

```text
share/wheels_driver/config/differential_wheels_params.yaml
```

节点通过：

```python
get_package_share_directory('wheels_driver')
```

找到这个 YAML，然后读取：

```yaml
differential_wheels_driver:
  ros__parameters:
    wheel_radius: 0.075
    wheel_base: 0.31
    encoder_resolution: 65536
    gear_ratio: 6.0
    connection_type: "usb_can"
    serial_port: "/dev/serial/custom/servo"
    can_interface: "can0"
    can_baudrate: 500000
    usb_serial_baudrate: 2000000
    control_frequency: 50.0
    cmd_vel_timeout: 0.5
    publish_tf: true
    base_frame: "base_link"
    odom_frame: "odom"
    left_wheel_joint: "left_wheel_joint"
    right_wheel_joint: "right_wheel_joint"
    max_linear_velocity: 2.0
    max_angular_velocity: 3.14
    debug_mode: false
    simulation_mode: false
```

核心参数含义：

| 参数 | 含义 | 用途 |
|---|---|---|
| `wheel_radius` | 轮子半径，单位 m | 轮线速度和 RPM 互转 |
| `wheel_base` | 左右轮中心距，单位 m | 二轮差速解算 |
| `encoder_resolution` | 编码器分辨率 | iWMC 内部 DEC 单位换算 |
| `gear_ratio` | 减速比 | 轮侧 RPM 和电机侧 RPM 换算 |
| `connection_type` | `usb_can` 或 `socketcan` | 选择 CAN 适配方式 |
| `can_interface` | 如 `can0` | SocketCAN 接口名 |
| `control_frequency` | 控制频率 | 定时下发速度 |
| `cmd_vel_timeout` | 指令超时时间 | 上位机断发后自动停车 |
| `max_linear_velocity` | 最大线速度 | 安全限幅 |
| `max_angular_velocity` | 最大角速度 | 安全限幅 |

写新包时建议保留这套参数结构，因为它把机械参数、通信参数、ROS 坐标系、安全限幅都集中到了 YAML 中。

## 4. 旧包启动流程

`DifferentialWheelsDriver.__init__()` 的流程是：

```text
1. update_parameters()
2. _create_can_adapters()
3. 创建 left_motor 和 right_motor
4. 初始化里程计变量 x/y/theta
5. 初始化左右轮位置、速度
6. 创建 cmd_vel 订阅
7. 创建 odom、joint_states 发布器
8. 如果 publish_tf=true，创建 TransformBroadcaster
9. 创建 control_loop 定时器
10. 创建 publish_state 定时器
11. initialize_motors()
```

旧代码中电机对象创建方式：

```python
self.left_motor = iWMCServoControl(node_id=1, ...)
self.right_motor = iWMCServoControl(node_id=2, ...)
```

也就是说，旧包默认：

```text
左电机 ID = 1
右电机 ID = 2
```

如果你的新轮子实际是：

```text
ID1 = 右轮
ID2 = 左轮
```

那么新包不能直接照搬旧包的 ID 映射，必须在新的电机协议层或方向映射层改过来。

## 5. 电机初始化逻辑

旧包初始化电机的步骤：

```text
1. left_motor.connect()
2. right_motor.connect()
3. left_motor.enable_servo()
4. right_motor.enable_servo()
5. left_motor.set_operation_mode(3)
6. right_motor.set_operation_mode(3)
```

其中 `set_operation_mode(3)` 表示速度模式。

旧包的电机是 iWMC/CANopen 风格，因此 `iWMCServoControl` 里做的是：

```text
connect:
  连接 CAN 适配器
  设置 CAN 波特率
  打开 CAN 通道

enable_servo:
  读状态字
  故障复位
  写控制字 Shutdown
  写控制字 Switch On
  写控制字 Enable Operation
  多次读状态字确认进入 Operation Enabled

set_operation_mode(3):
  通过 CANopen SDO 写 0x6060 = 3
```

写新轮子包时，这一层应该替换成你的电机初始化帧。例如 M1505 轮毂电机可以对应成：

```text
停止所有电机:
  032#0000000000000000

使能 ID1/ID2:
  105#0A0A000000000000

设置 ID1/ID2 为速度环:
  105#0202000000000000

设置主动反馈周期 10ms:
  106#0A0A000000000000
```

也就是说，ROS 上层的差速逻辑可以复用，底层 `iWMCServoControl` 这一套 CANopen SDO 要换成你新轮子的直接 CAN 帧协议。

## 6. `/cmd_vel` 如何进入控制闭环

旧包的 `cmd_vel_callback()` 很简单：

```python
self.last_cmd_vel_time = self.get_clock().now()
self.target_linear_vel = msg.linear.x
self.target_angular_vel = msg.angular.z
```

它不直接控制电机，只保存最新目标速度。

真正下发电机速度的是 `control_loop()`，它由定时器周期调用：

```python
self.control_timer = self.create_timer(
    1.0 / self.control_frequency,
    self.control_loop
)
```

这样设计的好处：

1. 上位机发 `/cmd_vel` 的频率可以不稳定。
2. 驱动节点仍然用固定频率向电机发送速度。
3. 可以在控制循环里统一做限幅、超时停车、运动学解算、反馈读取。

## 7. 指令超时保护

旧包在 `control_loop()` 中计算：

```python
cmd_age_s = (now - self.last_cmd_vel_time).nanoseconds / 1e9
```

如果：

```text
cmd_age_s > cmd_vel_timeout
```

就强制：

```python
linear_vel = 0.0
angular_vel = 0.0
```

这可以防止上位机、导航节点或遥控节点断开后，小车继续保持最后一次速度一直跑。

写新包时强烈建议保留这个逻辑。

## 8. 速度限幅

没有超时时，旧包对目标速度做限幅：

```python
linear_vel = clamp(target_linear_vel, -max_linear_velocity, max_linear_velocity)
angular_vel = clamp(target_angular_vel, -max_angular_velocity, max_angular_velocity)
```

这一步是软件安全边界：

```text
ROS 上层可以发很大的速度，但驱动层只接受参数允许范围内的速度。
```

写新包时也建议保留，并且根据轮子、车体、供电能力重新设置：

```yaml
max_linear_velocity: 0.3
max_angular_velocity: 1.0
max_motor_rpm: 60.0
```

调试初期应该先小一点。

## 9. 二轮差速逆运动学

二轮差速底盘的输入通常是：

```text
v = 小车中心线速度，单位 m/s，对应 cmd_vel.linear.x
w = 小车角速度，单位 rad/s，对应 cmd_vel.angular.z
L = 左右轮中心距，单位 m，对应 wheel_base
```

要控制左右轮，需要把小车速度分解成左右轮的地面线速度：

```text
v_left  = v - (L / 2) * w
v_right = v + (L / 2) * w
```

旧包代码就是：

```python
left_wheel_vel = linear_vel - (self.wheel_base / 2.0) * angular_vel
right_wheel_vel = linear_vel + (self.wheel_base / 2.0) * angular_vel
```

### 9.1 为什么是这个公式

二轮差速转弯时，车体绕某个瞬时圆心旋转：

```text
左轮路径半径  = R - L/2
右轮路径半径  = R + L/2
车体中心速度  = w * R
左轮线速度    = w * (R - L/2) = v - w * L/2
右轮线速度    = w * (R + L/2) = v + w * L/2
```

所以：

```text
角速度为正时，右轮速度比左轮快，小车向左转。
角速度为负时，左轮速度比右轮快，小车向右转。
```

### 9.2 几个典型动作

直行：

```text
w = 0
v_left = v
v_right = v
```

原地左转：

```text
v = 0, w > 0
v_left = -L/2*w
v_right = +L/2*w
```

原地右转：

```text
v = 0, w < 0
v_left = -L/2*w  -> 正
v_right = +L/2*w -> 负
```

## 10. 轮线速度和 RPM 的转换

差速逆解得到的是轮子地面线速度，单位是 m/s。电机速度命令一般需要 RPM 或驱动器内部单位，所以旧包先转成轮侧 RPM。

公式：

```text
wheel_angular_velocity = wheel_linear_velocity / wheel_radius
wheel_rpm = wheel_angular_velocity * 60 / (2*pi)
```

旧包代码：

```python
wheel_angular_vel = wheel_speed_ms / self.wheel_radius
wheel_rpm = wheel_angular_vel * 60.0 / (2.0 * math.pi)
```

反向转换：

```text
wheel_angular_velocity = wheel_rpm * 2*pi / 60
wheel_linear_velocity = wheel_angular_velocity * wheel_radius
```

旧包代码：

```python
wheel_angular_vel = wheel_rpm * 2.0 * math.pi / 60.0
wheel_speed = wheel_angular_vel * self.wheel_radius
```

## 11. 旧包的左右轮方向修正

旧包在下发速度时做了一个非常关键的方向修正：

```python
self.left_motor.set_target_velocity_rpm(-left_motor_rpm, verify=False)
self.right_motor.set_target_velocity_rpm(right_motor_rpm, verify=False)
```

读取反馈时也做了对应反向：

```python
left_actual_rpm = self.left_motor.dec_to_rpm(left_actual_vel_dec)
self.left_wheel_vel = -self.wheel_rpm_to_linear_speed(left_actual_rpm)

right_actual_rpm = self.right_motor.dec_to_rpm(right_actual_vel_dec)
self.right_wheel_vel = self.wheel_rpm_to_linear_speed(right_actual_rpm)
```

含义：

```text
旧包认为左轮电机的正方向和小车左轮前进方向相反。
所以：
  下发左轮速度时取负号。
  读取左轮反馈时再取负号还原成车体坐标下的左轮线速度。
```

这类方向修正必须成对出现：

```text
下发命令取反，反馈也要取反。
```

否则会出现：

```text
小车实际前进，但里程计显示后退。
小车实际左转，但里程计显示右转。
闭环控制方向错误。
```

## 12. 旧包的电机速度单位：RPM 到 DEC

旧包的 iWMC 伺服轮不是直接发 RPM，而是先把 RPM 转成驱动器内部 DEC 单位，然后通过 CANopen SDO 写目标速度对象。

换算在 `iWMCServoControl.rpm_to_dec()`：

```python
motor_rpm = rpm * gear_ratio
dec = motor_rpm * 512 * encoder_resolution / 1875
```

也就是：

```text
DEC = 轮侧RPM * 减速比 * 512 * 编码器分辨率 / 1875
```

反向换算：

```python
motor_rpm = dec * 1875 / (512 * encoder_resolution)
wheel_rpm = motor_rpm / gear_ratio
```

旧包写目标速度时：

```python
set_target_velocity_rpm(rpm):
  dec = rpm_to_dec(rpm)
  set_target_velocity_raw(dec)
```

`set_target_velocity_raw()` 最后写的是 CANopen 对象：

```text
0x60FF Target Velocity
```

读取实际速度时读的是：

```text
0x606C Velocity Actual
```

写新包时，如果你的轮毂电机协议是：

```text
10RPM = 0x0064
30RPM = 0x012C
60RPM = 0x0258
```

那么新包不应该继续使用 `rpm_to_dec()`。应该改成：

```text
raw = int(round(rpm * 10))
```

并按有符号 16 位打包：

```text
+30RPM -> 0x012C
-30RPM -> 0xFED4
```

## 13. 二轮差速正运动学

旧包发布里程计时，需要从左右轮速度反推车体速度：

```text
v = (v_left + v_right) / 2
w = (v_right - v_left) / L
```

旧包代码：

```python
linear_vel = (left_wheel_vel + right_wheel_vel) / 2.0
angular_vel = (right_wheel_vel - left_wheel_vel) / self.wheel_base
```

这和逆解正好对应：

```text
逆解：车体速度 -> 左右轮速度
正解：左右轮速度 -> 车体速度
```

控制电机时用逆解，发布里程计时用正解。

## 14. 里程计积分原理

旧包维护三个位姿变量：

```python
self.x = 0.0
self.y = 0.0
self.theta = 0.0
```

每次发布状态时先计算时间间隔：

```python
dt = (current_time - self.last_time).nanoseconds / 1e9
```

然后调用：

```python
linear_vel, angular_vel = self.update_odometry(
    self.left_wheel_vel,
    self.right_wheel_vel,
    dt
)
```

### 14.1 直线运动

如果角速度非常小：

```text
abs(angular_vel) < 1e-6
```

认为是直线：

```text
dx = v * cos(theta) * dt
dy = v * sin(theta) * dt
dtheta = 0
```

旧包代码：

```python
dx = linear_vel * math.cos(self.theta) * dt
dy = linear_vel * math.sin(self.theta) * dt
dtheta = 0.0
```

### 14.2 曲线运动

如果角速度不为 0，使用圆弧解析积分：

```text
R = v / w
dtheta = w * dt
dx = R * (sin(theta + dtheta) - sin(theta))
dy = R * (-cos(theta + dtheta) + cos(theta))
```

这样比简单欧拉积分更适合差速底盘的圆弧运动。

最后更新：

```python
self.x += dx
self.y += dy
self.theta += dtheta
```

## 15. `/odom` 发布逻辑

旧包发布 `nav_msgs/msg/Odometry`：

```text
header.frame_id = odom_frame
child_frame_id = base_frame
pose.pose.position.x = x
pose.pose.position.y = y
pose.pose.orientation = yaw(theta) 转四元数
twist.twist.linear.x = linear_vel
twist.twist.angular.z = angular_vel
```

Yaw 转四元数：

```python
orientation.z = sin(theta / 2)
orientation.w = cos(theta / 2)
```

如果 `publish_tf` 为 true，还发布：

```text
odom -> base_link
```

TF 内容和 odometry 的 pose 一致。

## 16. `/joint_states` 发布逻辑

旧包维护左右轮角位置：

```python
self.left_wheel_pos += (self.left_wheel_vel / self.wheel_radius) * dt
self.right_wheel_pos += (self.right_wheel_vel / self.wheel_radius) * dt
```

这里：

```text
wheel_vel / wheel_radius = 轮子角速度，单位 rad/s
```

发布：

```python
joint_msg.name = [left_wheel_joint, right_wheel_joint]
joint_msg.position = [left_wheel_pos, right_wheel_pos]
joint_msg.velocity = [
    left_wheel_vel / wheel_radius,
    right_wheel_vel / wheel_radius
]
```

这让 RViz、robot_state_publisher 或 URDF 轮子关节能跟着转。

## 17. 通信层结构

旧包支持两种通信方式：

```text
connection_type = "usb_can"
connection_type = "socketcan"
```

### 17.1 usb_can

`connection_type: usb_can` 时：

```text
iWMCServoControl
  -> SLCANComm
    -> WaveshareCANAdapter
      -> serial.Serial
```

Waveshare 适配器负责把 CAN 帧包装成 USB 串口协议。

### 17.2 socketcan

`connection_type: socketcan` 时：

```text
iWMCServoControl
  -> SLCANComm
    -> SocketCANAdapter
      -> Linux AF_CAN socket
```

`SocketCANAdapter` 使用：

```python
socket.socket(socket.AF_CAN, socket.SOCK_RAW, socket.CAN_RAW)
```

发送帧时使用 Linux CAN 帧格式：

```python
_CAN_FRAME_FMT = "=IB3x8s"
```

它还可以设置接收过滤：

```python
rx_filter_id=0x581
rx_filter_id=0x582
```

这是为了分别接收左右电机 CANopen SDO 响应。

## 18. 新 `wheels_driver` 包应该复用什么

建议复用旧包这些部分：

```text
1. ROS 2 包结构
2. 节点名和入口点
3. /cmd_vel -> control_loop 的模式
4. cmd_vel_timeout 超时停车
5. max_linear_velocity / max_angular_velocity 限幅
6. 二轮差速逆运动学
7. 二轮差速正运动学
8. /odom 发布
9. /joint_states 发布
10. publish_tf 参数
11. YAML 参数配置方式
12. shutdown 停车保护
```

建议替换这些部分：

```text
1. iWMCServoControl
2. CANopen SDO 读写
3. rpm_to_dec / dec_to_rpm
4. 0x60FF / 0x606C 对象字典
5. 旧的左 ID=1、右 ID=2 映射
```

如果新轮子就是 M1505A/B 协议，应改成：

```text
1. SocketCAN 直接发送标准帧
2. 初始化发送 0x105、0x106
3. 控制发送 0x032
4. 反馈监听 0x097、0x098
5. RPM 原始值 = RPM * 10 的 int16
```

## 19. 面向新轮子协议的推荐分层

新包仍叫 `wheels_driver` 时，可以这样组织：

```text
wheels_driver/
  package.xml
  setup.py
  setup.cfg
  resource/wheels_driver
  config/differential_wheels_params.yaml
  launch/wheels_driver.launch.py
  wheels_driver/
    __init__.py
    run_motor.py              # ROS 节点和差速运动学
    m1505_motor_bus.py        # 新轮子 CAN 协议
    socketcan_adapter.py      # SocketCAN 原始帧收发
```

`run_motor.py` 继续负责 ROS 和运动学：

```text
/cmd_vel
  -> 限幅
  -> 差速逆解
  -> m/s 转 RPM
  -> 根据左右轮安装方向修正正负号
  -> motor_bus.set_rpm(...)
```

`m1505_motor_bus.py` 负责电机协议：

```text
connect()
initialize()
set_rpm(right_rpm, left_rpm)
stop()
poll_feedback()
shutdown()
```

这样以后如果换电机，只改 `motor_bus`，差速运动学和 ROS 接口不用动。

## 20. 新轮子 ID 和方向映射

你的测试文档定义：

```text
ID1 = 右轮
ID2 = 左轮

小车前进 = ID1 正转，ID2 反转
小车后退 = ID1 反转，ID2 正转
```

这和旧包默认的：

```text
旧包左电机 ID=1
旧包右电机 ID=2
```

不一样。

所以新包应该明确写成：

```text
right_motor_id = 1
left_motor_id = 2
```

差速逆解得到的是车体语义下的：

```text
left_vehicle_rpm
right_vehicle_rpm
```

根据你的硬件方向，下发到电机时应该是：

```text
ID1 右轮命令 = right_vehicle_rpm
ID2 左轮命令 = -left_vehicle_rpm
```

也就是：

```python
right_motor_rpm = right_vehicle_rpm
left_motor_rpm = -left_vehicle_rpm
```

这样当前进时：

```text
left_vehicle_rpm  > 0
right_vehicle_rpm > 0
```

实际 CAN 命令会变成：

```text
ID1 = 正
ID2 = 负
```

符合你的测试文档。

## 21. 新轮子速度帧打包

你的协议：

```text
CAN ID 0x032
数据 8 字节：
ID1高 ID1低  ID2高 ID2低  ID3高 ID3低  ID4高 ID4低
```

速度换算：

```text
10RPM  = 0x0064
30RPM  = 0x012C
60RPM  = 0x0258
-10RPM = 0xFF9C
-30RPM = 0xFED4
-60RPM = 0xFDA8
```

所以：

```text
raw = int(round(rpm * 10))
raw 按 int16 处理
```

打包：

```python
raw &= 0xFFFF
hi = (raw >> 8) & 0xFF
lo = raw & 0xFF
```

比如前进 30 RPM：

```text
ID1 右轮 = +30RPM -> 0x012C
ID2 左轮 = -30RPM -> 0xFED4
CAN 帧 = 032#012CFED400000000
```

## 22. 新包控制循环伪代码

```python
def control_loop():
    now = clock.now()
    cmd_age = now - last_cmd_time

    if cmd_age > cmd_vel_timeout:
        v = 0.0
        w = 0.0
    else:
        v = clamp(target_linear_vel, -max_linear_velocity, max_linear_velocity)
        w = clamp(target_angular_vel, -max_angular_velocity, max_angular_velocity)

    left_speed_mps  = v - wheel_base / 2.0 * w
    right_speed_mps = v + wheel_base / 2.0 * w

    left_vehicle_rpm  = left_speed_mps / wheel_radius * 60.0 / (2.0 * pi)
    right_vehicle_rpm = right_speed_mps / wheel_radius * 60.0 / (2.0 * pi)

    # 按新轮子安装方向修正
    id1_right_rpm = right_vehicle_rpm
    id2_left_rpm = -left_vehicle_rpm

    send_0x032(id1_right_rpm, id2_left_rpm)

    # 如果暂时没有可靠反馈，就用目标速度积分里程计；
    # 如果能解析反馈，就优先用反馈速度。
    left_wheel_vel = left_speed_mps
    right_wheel_vel = right_speed_mps
```

## 23. 新包里程计策略

有两种选择：

### 23.1 开环里程计

用下发目标速度积分：

```text
优点：实现简单，不依赖反馈协议。
缺点：轮子打滑、电机没跟上、CAN 掉线时，odom 仍然会假装小车在动。
```

适合初期测试。

### 23.2 闭环里程计

解析轮子反馈速度，用实际速度积分：

```text
优点：里程计更接近实际。
缺点：必须确认 0x097 / 0x098 反馈帧中速度字段格式。
```

你的测试文档目前只明确：

```text
0x097 = ID1 右轮反馈
0x098 = ID2 左轮反馈
反馈最后 1 字节：
  02 = 速度环
  01 = 电流环
  00 = 电压开环
```

如果还不知道反馈帧里速度字段的位置，建议新包先做开环 odom，同时保留 `poll_feedback()` 记录模式和原始帧，后续再补实际速度解析。

## 24. 新包测试步骤建议

### 24.1 CAN 初始化

```bash
sudo ip link set can0 down
sudo ip link set can0 type can bitrate 1000000 restart-ms 100
sudo ip link set can0 txqueuelen 1000
sudo ip link set can0 up
ip -details link show can0
```

确认：

```text
can state ERROR-ACTIVE
bitrate 1000000
```

### 24.2 先用 candump 看反馈

```bash
candump can0
```

应该能看到：

```text
can0 097 [8] ... 02
can0 098 [8] ... 02
```

### 24.3 运行节点

```bash
ros2 run wheels_driver wheels_driver_node
```

或：

```bash
ros2 launch wheels_driver wheels_driver.launch.py
```

### 24.4 低速前进测试

建议一开始只给很小速度：

```bash
ros2 topic pub -r 10 /cmd_vel geometry_msgs/msg/Twist \
"{linear: {x: 0.05}, angular: {z: 0.0}}"
```

观察 `candump`，应该看到类似：

```text
032# 正数 负数 00000000
```

例如约 30 RPM 时应该接近：

```text
032#012CFED400000000
```

### 24.5 原地转向测试

左转：

```bash
ros2 topic pub -r 10 /cmd_vel geometry_msgs/msg/Twist \
"{linear: {x: 0.0}, angular: {z: 0.3}}"
```

根据你的方向定义，原地左转时旧测试文档是：

```text
ID1 = 负
ID2 = 负
```

右转：

```bash
ros2 topic pub -r 10 /cmd_vel geometry_msgs/msg/Twist \
"{linear: {x: 0.0}, angular: {z: -0.3}}"
```

根据你的方向定义，原地右转时旧测试文档是：

```text
ID1 = 正
ID2 = 正
```

如果方向反了，优先改“电机方向映射层”，不要改差速公式。

## 25. 最容易踩坑的地方

### 25.1 不要把电机 ID 和车体左右弄混

旧包：

```text
ID1 = 左
ID2 = 右
```

你的新轮子测试文档：

```text
ID1 = 右
ID2 = 左
```

这是最重要的差异。

### 25.2 不要随便改二轮差速公式

ROS 标准下：

```text
angular.z > 0 表示逆时针，也就是左转。
```

差速公式应该保持：

```text
v_left  = v - L/2*w
v_right = v + L/2*w
```

如果实际车轮方向不对，改电机正负号映射，不要反过来改公式。

### 25.3 下发方向和反馈方向要一致

如果某个轮子下发时取负号，读取反馈换算回车体速度时也要对应取负号。

### 25.4 `cmd_vel --once` 只会动一下

旧包有：

```yaml
cmd_vel_timeout: 0.5
```

所以：

```bash
ros2 topic pub --once /cmd_vel ...
```

只会让车动不到 0.5 秒。连续测试应该用：

```bash
ros2 topic pub -r 10 /cmd_vel ...
```

### 25.5 `install` 目录不是源码目录

如果你要正式写新包，建议在：

```text
src/wheels_driver
```

下写源码，然后 `colcon build`。不要长期直接改：

```text
install/wheels_driver
```

否则下一次构建会覆盖。

## 26. 新 `wheels_driver` 的最小实现清单

一个能跑的最小新包至少包含：

```text
package.xml
setup.py
setup.cfg
resource/wheels_driver
wheels_driver/__init__.py
wheels_driver/run_motor.py
wheels_driver/socketcan_adapter.py
wheels_driver/m1505_motor_bus.py
config/differential_wheels_params.yaml
launch/wheels_driver.launch.py
```

`run_motor.py` 必须实现：

```text
1. Node 初始化
2. 参数读取
3. cmd_vel 订阅
4. control_loop
5. inverse_kinematics
6. forward_kinematics
7. m/s <-> RPM
8. odom 积分
9. odom 发布
10. joint_states 发布
11. shutdown 停车
```

`m1505_motor_bus.py` 必须实现：

```text
1. connect can0
2. send_frame(can_id, data)
3. initialize:
   - 032#0000000000000000
   - 105#0A0A000000000000
   - 105#0202000000000000
   - 106#0A0A000000000000
4. set_speed:
   - right_rpm -> ID1
   - left_rpm -> ID2
   - 发送 0x032
5. stop:
   - 032#0000000000000000
6. shutdown:
   - stop
   - close socket
```

## 27. 一句话总结旧包原理

旧 `wheels_driver` 的核心不是 CANopen，而是这一条数据链：

```text
/cmd_vel(linear.x, angular.z)
  -> 限幅和超时保护
  -> 二轮差速逆解得到左右轮线速度
  -> 轮线速度转 RPM
  -> 根据电机安装方向修正正负号
  -> 下发电机速度命令
  -> 读取实际轮速
  -> 二轮差速正解反推车体速度
  -> 积分得到 x/y/theta
  -> 发布 /odom、/joint_states、TF
```

写新小车轮子驱动包时，应该保留这条链路，把最后的“iWMC/CANopen 下发速度命令”替换成新轮子的 `0x032` 速度帧协议即可。
