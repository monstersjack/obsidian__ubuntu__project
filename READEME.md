---
标题: READEME
创建时间: 2026-04-14
修改时间: 2026-06-04
---


## 系统环境准备,运行环境说明

### 安装双系统
![4b83c33c00c67f7ee2f493e61805ec7b](https://cdn.jsdelivr.net/gh/monstersjack/obsidian_image@main/image/4b83c33c00c67f7ee2f493e61805ec7b.jpg)
![Pasted image 20260414160041](https://cdn.jsdelivr.net/gh/monstersjack/obsidian_image@main/image/Pasted%20image%2020260414160041.png)
### 安装完成Ubuntu 22.04和ROS2(humble版本)
ROS2 版本：humble
Ubuntu 版本：22.04
![Pasted image 20260414155952](https://cdn.jsdelivr.net/gh/monstersjack/obsidian_image@main/image/Pasted%20image%2020260414155952.png)

## 考核一:入门
主要仿照鱼香ros2，第三章，第二、三节改的代码，主要是参考，3.3.2的代码。

原理，原本在默认出生点 = (5.54, 5.54)开始

### 运行流程

1. 创建功能包：

```bash
cd ros_test/src
ros2 pkg create demo_turtle_draw --build-type ament_python --dependencies rclpy geometry_msgs turtlesim std_srvs --license Apache-2.0

```

1. 在`src/demo_turtle_draw/demo_turtle_draw`下

导入代码，乌龟画图的函数，依赖和方法，`turtle_base.py`

```python
import rclpy
from rclpy.node import Node
# 速度控制消息类型
from geometry_msgs.msg import Twist
# 订阅小乌龟的实时坐标(x,y)和朝向(theta)消息类型
from turtlesim.msg import Pose
import math


class TurtleController(Node):
    def __init__(self):
        # 调用父类(Node)的构造函数，定义节点名称为 turtle_controller
        super().__init__("turtle_controller")

        # 目标点X坐标：小乌龟需要到达的目标X位置
        self.target_x_ = 1.0
        # 目标点Y坐标：小乌龟需要到达的目标Y位置
        self.target_y_ = 1.0
        # 比例控制系数：控制运动响应速度，数值越大响应越快，这就是闭环控制的体现将距离和速度联系起来，距离越远速度越快，距离越近速度越慢
        self.k_ = 1.5
        # 最大线速度：限制小乌龟前进的最高速度，保证运动平稳
        self.max_speed_ = 3.0
        # 旋转速度：控制小乌龟原地转向的速度
        self.angular_speed = 1.0

        # 路径点列表
        self.path = []
        # 当前路径点的索引：记录正在前往第几个目标点，初始为0
        self.current_index = 0

        #发布速度指令的发布者
        self.velocity_publisher_ = self.create_publisher(
            Twist, 
            "/turtle1/cmd_vel", 
            10
        )

        # 创建位置订阅者，用了回调函数：on_pose_received_
        self.pose_subscription_ = self.create_subscription(
            Pose,
            "/turtle1/pose",
            self.on_pose_received_,
            10
        )


    # 海龟位姿回调函数，收到pose就发布速度指令
    def on_pose_received_(self, pose):
        message = Twist()
        current_x = pose.x
        current_y = pose.y

        # 欧几里得距离公式
        distance = math.sqrt(
            (self.target_x_ - current_x) ** 2 +
            (self.target_y_ - current_y) ** 2
        )

        # 计算海龟需要旋转的角度
        # math.atan2：计算目标点相对于当前点的方向角，减去当前朝向theta，得到角度误差
        angle = math.atan2(
            self.target_y_ - current_y,
            self.target_x_ - current_x
        ) - pose.theta

        # 角度归一化处理：将角度限制在 [-π, π] 之间，防止海龟转圈旋转，保证转向最短路径
        angle = math.atan2(math.sin(angle), math.cos(angle))

        # 如果当前距离目标点小于0.02，判定为到达目标点，坐标误差允许范围:0.02
        if distance < 0.02:
            # 打印日志：提示已到达当前目标点
            self.get_logger().info(f"到达目标点：({self.target_x_}, {self.target_y_})")
            
            # 路径点索引+1，准备前往下一个点
            self.current_index += 1

            if self.current_index >= len(self.path):
                self.get_logger().info("✅ 所有点绘制完成！")
                # 发布空速度指令，让海龟停止运动
                self.velocity_publisher_.publish(Twist())
                rclpy.shutdown()
                # 退出回调函数，不再执行后续逻辑
                return

            self.target_x_ = self.path[self.current_index][0]
            self.target_y_ = self.path[self.current_index][1]
            return

        # 判断1：角度误差大于0.05弧度 → 角度未对准
        if abs(angle) > 0.05:
            # 仅原地旋转，不前进，根据角度误差正负，决定左转/右转
            message.angular.z = self.angular_speed if angle > 0 else -self.angular_speed
            message.linear.x = 0.0

        else:
            message.angular.z = 0.0
            # 线速度根据距离成比例控制，距离越远速度越快，距离越近速度越慢，同时限制最大速度，保证运动平稳
            message.linear.x = min(self.k_ * distance, self.max_speed_)

        # 发布速度指令：将计算好的运动指令发送给海龟
        self.velocity_publisher_.publish(message)
```

画R的代码，`turtle_R.py`

```python
import rclpy
from rclpy.node import Node
# 导入空服务类型，turtlesim的复位服务/reset使用该类型（无请求/响应数据）
from std_srvs.srv import Empty
# 从本地模块导入自定义的海龟控制基类，继承其所有运动控制、话题通信功能
from .turtle_base import TurtleController


class DrawR(TurtleController):
    def __init__(self):
        super().__init__()

        self.path = [
            (5.54, 8.54),
            (6.54, 7.54),
            (5.54, 6.54),
            (6.54, 5.54)
        ]
        

        self.target_x_ = self.path[self.current_index][0]
        self.target_y_ = self.path[self.current_index][1]

def main():
    rclpy.init()

    # ===================== 第一步：通过ROS2服务调用，复位海龟到原点 =====================
    # 创建临时节点，专门用于调用复位服务，不参与绘图逻辑
    reset_node = Node("turtle_reset_node")
    # 创建服务客户端：
    # 服务类型：Empty  服务名称：/reset（turtlesim官方复位服务）
    client = reset_node.create_client(Empty, "/reset")
    
    # 循环等待复位服务上线
    # 超时时间1秒，等待期间打印警告日志，等待服务端的服务就绪并建立连接
    while not client.wait_for_service(timeout_sec=1.0):
        reset_node.get_logger().warn("等待 turtlesim 复位服务...")
    
    # 创建空的服务请求对象（/reset服务无需传入参数）
    req = Empty.Request()
    # 异步发送服务请求，不阻塞程序
    future = client.call_async(req)
    # 阻塞等待服务响应，确保复位完成后再执行后续代码
    rclpy.spin_until_future_complete(reset_node, future)
    
    # 复位完成，打印日志提示
    reset_node.get_logger().info("✅ 主函数复位完成，回到原点！")
    # 销毁临时复位节点，释放资源
    reset_node.destroy_node()

    node = DrawR()
    rclpy.spin(node)
    rclpy.shutdown()

if __name__ == "__main__":
    main()
```

画RM的代码，`turtle_RM.py`

```python
import rclpy
from rclpy.node import Node
from std_srvs.srv import Empty
from .turtle_base import TurtleController

class DrawRM(TurtleController):
    def __init__(self):
        super().__init__()
        # RM型路径点
        self.path = [
            (5.54, 8.54),
            (6.54, 7.54),
            (5.54, 6.54),
            (6.54, 5.54),
            (7.04, 8.54),
            (7.54, 5.54),
            (7.84, 8.54),
            (8.54, 5.54)
        ]
        self.target_x_ = self.path[self.current_index][0]
        self.target_y_ = self.path[self.current_index][1]

def main():
    rclpy.init()

    # ===================== 第一步：主函数中先执行复位服务 =====================
    reset_node = Node("turtle_reset_node")
    client = reset_node.create_client(Empty, "/reset")
    # 等待服务
    while not client.wait_for_service(timeout_sec=1.0):
        reset_node.get_logger().warn("等待 turtlesim 复位服务...")
    # 发送复位请求
    req = Empty.Request()
    future = client.call_async(req)
    # 等待复位完成
    rclpy.spin_until_future_complete(reset_node, future)
    reset_node.get_logger().info("✅ 主函数复位完成，回到原点！")
    # 销毁临时复位节点
    reset_node.destroy_node()

    node = DrawRM()
    rclpy.spin(node)
    rclpy.shutdown()

if __name__ == "__main__":
    main()
```

在setup.py上，

```python
entry_points={
        'console_scripts': [
            'turtle_R = demo_turtle_draw.turtle_R:main',
            'turtle_RM = demo_turtle_draw.turtle_RM:main'
        ],
    },
```

3. 在终端构建功能包，设置环境变量

```bash
cd ros_test
colcon build
source install/setup.bash
```

```bash
# 启动小海龟界面节点
ros2 run turtlesim turtlesim_node
# 运行节点
ros2 run demo_turtle_draw turtle_R
ros2 run demo_turtle_draw turtle_RM
```

1. 运行日志

画一个R
![Pasted image 20260415001906](https://cdn.jsdelivr.net/gh/monstersjack/obsidian_image@main/image/Pasted%20image%2020260415001906.png)
![Pasted image 20260415001946](https://cdn.jsdelivr.net/gh/monstersjack/obsidian_image@main/image/Pasted%20image%2020260415001946.png)


画一个RM
![Pasted image 20260415002148](https://cdn.jsdelivr.net/gh/monstersjack/obsidian_image@main/image/Pasted%20image%2020260415002148.png)
![Pasted image 20260415002140](https://cdn.jsdelivr.net/gh/monstersjack/obsidian_image@main/image/Pasted%20image%2020260415002140.png)

### 具体的考核回答

#### 1. 具体考核标准
- [1] 基础标准: 节点完成话题的发布接收,小乌龟画图图形

订阅 /turtle1/pose 位姿话题，实时接收小乌龟的 x/y坐标、theta角度，发布 /turtle1/cmd_vel 速度话题，发送控制指令，
![Pasted image 20260415003046|474](https://cdn.jsdelivr.net/gh/monstersjack/obsidian_image@main/image/Pasted%20image%2020260415003046.png)


- [2] 进阶标准: 体现闭环控制思想,又快又准地画出图形

采用比例控制：速度 = k × 距离误差，小乌龟离目标点越远，速度越快，大幅缩短运动时间。配合最大速度限制，保证高效运动，离目标点越近，速度自动越慢，平稳减速，不会冲过头，角度闭环：没对准方向原地旋转，不前进，保证走直线。

#### 2. 任务提示:
- 通过订阅小乌龟的位姿话题(/turtle1/pose)来判断其是否到达指定位置

可以
![Pasted image 20260415003532](https://cdn.jsdelivr.net/gh/monstersjack/obsidian_image@main/image/Pasted%20image%2020260415003532.png)
- 当小乌龟的速度(/turtle1/cmd_vel)很大时会发生什么? 故此为何要闭环控制.

如果把 max_speed_ 或比例系数 k_ 设置得很大（比如 10、20），会冲过头，因为小乌龟是靠接受命令而保持前进的，靠近目标点时速度太快，没有收到命令导致停不下来，直接越过目标点；会出现震荡晃动小乌龟来回折返，无法稳定停在目标点；

## 考核二，建图仿真


### 1、Gazebo仿真环境搭建

#### 1.2.2 (方法一) 将工作空间环境变量写入系统的环境变量文件 ~/.bashrc
![Pasted image 20260415163833](https://cdn.jsdelivr.net/gh/monstersjack/obsidian_image@main/image/Pasted%20image%2020260415163833.png)

#### 1.3 启动程序运行Gazebo仿真环境
`ros2 launch ros_simulation simulation.launch.py world:=CUBE use_sim_time:=True`
![Pasted image 20260415164001](https://cdn.jsdelivr.net/gh/monstersjack/obsidian_image@main/image/Pasted%20image%2020260415164001.png)
#### 1.4 控制机器人运动
![Pasted image 20260415164016](https://cdn.jsdelivr.net/gh/monstersjack/obsidian_image@main/image/Pasted%20image%2020260415164016.png)

#### 2. 建图功能实现,开始建图
![Pasted image 20260415164054](https://cdn.jsdelivr.net/gh/monstersjack/obsidian_image@main/image/Pasted%20image%2020260415164054.png)
 ![Pasted image 20260415170856](https://cdn.jsdelivr.net/gh/monstersjack/obsidian_image@main/image/Pasted%20image%2020260415170856.png)
 完成建图

#### 2.3 保存地图
![Pasted image 20260415164432](https://cdn.jsdelivr.net/gh/monstersjack/obsidian_image@main/image/Pasted%20image%2020260415164432.png)
![Pasted image 20260415171308](https://cdn.jsdelivr.net/gh/monstersjack/obsidian_image@main/image/Pasted%20image%2020260415171308.png)



#### 3.导航功能包创建

![Pasted image 20260415180449](https://cdn.jsdelivr.net/gh/monstersjack/obsidian_image@main/image/Pasted%20image%2020260415180449.png)


![Pasted image 20260415180829](https://cdn.jsdelivr.net/gh/monstersjack/obsidian_image@main/image/Pasted%20image%2020260415180829.png)


![Pasted image 20260415180919](https://cdn.jsdelivr.net/gh/monstersjack/obsidian_image@main/image/Pasted%20image%2020260415180919.png)

![Pasted image 20260415181036](https://cdn.jsdelivr.net/gh/monstersjack/obsidian_image@main/image/Pasted%20image%2020260415181036.png)



































