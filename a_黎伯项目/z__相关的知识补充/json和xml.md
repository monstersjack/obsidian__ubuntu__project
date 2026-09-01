---
标题: json和xml
创建时间: 2026-08-31
修改时间: 2026-09-01
---

[00:01:03.648](jv://?url=https://www.bilibili.com/video/BV1We411y7wn/?spm_id_from=333.337.search-card.all.clickyu26vd_source=ea35c10f59aa46851935d37df4345603&time=00:01:03.648)
![[Pasted image 20260831140538.png]]
可以互相转换


![[Pasted image 20260831140629.png]]

[00:02:01.840](jv://?url=https://www.bilibili.com/video/BV1We411y7wn/?spm_id_from=333.337.search-card.all.clickyu26vd_source=ea35c10f59aa46851935d37df4345603&time=00:02:01.840)
![[Pasted image 20260831140723.png]]




#####  一、JSON 是什么？

JSON 的全称是 **JavaScript Object Notation**，即 JavaScript 对象表示法。

JSON 本质上是一种**数据表示和数据交换格式**。它不是一种编程语言，也不是一个软件，而是一套规定：

> **数据应该以什么结构组织，以及如何用文本表示这些数据。**

例如，一个机器人系统需要记录：

* 机器人是什么型号
* 有多少个关节
* 电机连接在哪个串口
* 摄像头是什么型号
* 摄像头分辨率是多少
* 当前任务是什么
* 一次动作包含哪些参数

这些信息都可以用 JSON 组织起来。

JSON 最大的特点是：

> **结构清晰、层次明确，而且不同编程语言都容易读取。**

因此，它非常适合在不同软件、不同程序甚至不同计算机之间传递数据。

---

####  二、JSON 的核心结构

JSON 最重要的两个结构只有：

```text
{}   Object（对象）
[]   Array（数组）
```

######  1. `{}` —— 对象

对象表示：

> **一个东西，以及这个东西具有哪些属性。**

基本结构：

```text
{
    "属性1": 值,
    "属性2": 值,
    "属性3": 值
}
```

例如一个机器人对象，可以有：

```text
robot
├── type
├── id
├── port
└── motors
```

因此：

```json
{
    "type": "so101",
    "id": "robot_01",
    "port": "/dev/ttyACM0"
}
```

表达的就是一个机器人具有三个属性。

---

######  2. `[]` —— 数组

数组表示：

> **一组按照顺序排列的数据。**

例如：

```text
[1, 2, 3, 4, 5, 6]
```

可以表示六个关节。

数组中的数据可以是数字，也可以是字符串、对象甚至其他数组。

所以 JSON 可以形成非常复杂的层次结构。

---

####  三、JSON 中的 Key 和 Value

JSON 最基本的数据关系是：

```text
"key": value
```

也就是：

> **键（Key）对应一个值（Value）。**

例如：

```json
{
    "port": "/dev/ttyACM0"
}
```

这里：

```text
Key   = port
Value = /dev/ttyACM0
```

Key 相当于“这个数据叫什么”，Value 就是“这个数据具体是什么”。

所以 JSON 本质上是在描述：

> **名称 → 数据**

这也是 JSON 非常容易阅读的原因。

---

####  四、JSON 支持哪些数据类型？

JSON 中最重要的数据类型有：

```text
String     字符串
Number     数字
Boolean    true / false
Null       null
Object     {}
Array      []
```

其中需要特别注意：

```json
true
false
null
```

必须使用 JSON 规定的写法。

JSON 中字符串通常使用：

```text
"双引号"
```

而不是单引号。

---

####  五、JSON 最大的特点：可以嵌套

这是学习 JSON 最重要的一点。

JSON 并不是只能保存简单数据。

一个对象里面可以包含：

```text
对象
```

也可以包含：

```text
数组
```

数组里面又可以包含：

```text
对象
```

对象里面还可以继续包含：

```text
对象
```

因此 JSON 可以形成一个**树形数据结构**。

例如：

```text
Robot
│
├── Basic Information
│
├── Motors
│     ├── Motor 1
│     ├── Motor 2
│     └── Motor 3
│
└── Cameras
      ├── Camera 1
      └── Camera 2
```

这就是为什么 JSON 特别适合描述复杂的软件系统。

---

####  六、为什么机器人领域大量使用 JSON？

这一点非常重要。

机器人系统不是只有一个程序。

一个完整的机器人系统通常包含：

```text
机械臂
   ↓
电机控制程序
   ↓
驱动程序
   ↓
机器人控制软件
   ↓
视觉系统
   ↓
数据采集
   ↓
AI模型
   ↓
服务器 / 数据集
```

这些模块之间需要不断交换数据。

例如：

```text
机器人配置
机器人状态
传感器数据
相机信息
关节角度
动作参数
任务信息
模型参数
数据集信息
```

如果每一个程序都采用完全不同的数据格式，软件之间就很难通信。

JSON 提供了一种**统一、结构化、容易解析的数据格式**。

因此，一个程序可以生成 JSON：

```text
程序 A
   ↓
JSON
   ↓
程序 B
```

程序 B 不需要知道程序 A 是用 Python、C++ 还是 Java 写的。

只要它能够解析 JSON，就能够读取里面的数据。

这就是 JSON 在机器人软件系统中的重要价值。

---

####  七、JSON 在 AI 中有什么作用？

AI 系统同样需要处理大量结构化信息。

一个 AI 系统通常包括：

```text
数据
 ↓
预处理
 ↓
模型
 ↓
推理
 ↓
输出
```

其中很多信息不是图片或者视频本身，而是**描述这些数据的信息**。

例如：

```text
数据集名称
数据集版本
任务名称
机器人型号
摄像头
动作维度
状态维度
训练参数
模型配置
```

这些信息非常适合用 JSON 保存。

因此可以把 JSON 理解成：

> **AI 系统中的“结构化说明书”。**

图片、视频、模型权重负责保存大量实际数据，而 JSON 经常负责描述：

> **这些数据是什么、怎么组织、应该怎么使用。**

---

####  八、JSON 和机器人数据集的关系

这一点对你学习 **LeRobot** 特别重要。

一个机器人数据集并不是只有视频。

通常会包含：

```text
图像
视频
机器人状态
机器人动作
时间戳
任务信息
数据集元信息
```

其中：

```text
图像 / 视频
```

属于大量的实际数据。

而：

```text
数据集配置
机器人信息
任务信息
数据结构
参数
```

属于**元数据（metadata）**。

JSON 非常适合保存这些元数据。

所以你在学习 LeRobot 时，会不断遇到：

```text
json
```

或者 Python 中类似 JSON 的：

```text
dict
```

这并不是偶然的。

因为机器人数据本身具有非常明显的层次结构：

```text
数据集
│
├── Episode
│     │
│     ├── Frame
│     │     ├── Observation
│     │     └── Action
│     │
│     └── ...
│
└── Metadata
```

JSON 很适合表达这种结构。

---

####  九、JSON 和 Python Dictionary 有什么关系？

这个非常容易混淆。

Python 有一种数据结构叫：

```python
dict
```

即：

> Dictionary，字典。

例如：

```python
robot = {
    "type": "so101",
    "port": "/dev/ttyACM0"
}
```

JSON 和 Python Dictionary 看起来非常相似。

原因是：

> **JSON 的 Object 结构和 Python Dictionary 的结构非常接近。**

但是它们不是同一个东西。

简单理解：

```text
JSON
↓
一种数据格式

Python dict
↓
Python 程序中的一种数据结构
```

Python 可以把 JSON 读取成 Dictionary。

例如：

```text
JSON 文件
   ↓
Python json 模块
   ↓
Python Dictionary
   ↓
程序进行处理
```

所以你以后在 LeRobot 代码中看到：

```python
config["robot"]
```

本质上是在从一个类似 JSON 的层级结构中读取数据。

---

####  十、JSON 在机器人系统中的典型作用

可以把 JSON 的作用归纳成四类。

######  ① 配置 Configuration

告诉程序：

```text
机器人是什么
串口在哪里
摄像头是什么
参数是多少
```

程序启动时读取配置，然后按照配置运行。

---

######  ② 数据交换 Data Exchange

不同程序之间传递结构化信息：

```text
程序 A
 ↓
JSON
 ↓
程序 B
```

JSON 就像两个程序之间共同约定的“语言”。

---

######  ③ 元数据 Metadata

描述真正的数据。

例如：

```text
这个数据集是谁创建的
使用什么机器人
有多少帧
有哪些任务
数据如何组织
```

这些内容本身不是训练数据，而是**关于数据的数据**。

---

######  ④ API 通信

机器人、AI 和服务器之间也经常通过 API 通信。

典型结构：

```text
机器人程序
     ↓
 HTTP / API
     ↓
 JSON
     ↓
服务器
```

服务器返回：

```text
JSON
 ↓
Python
 ↓
AI程序
```

所以你以后学习：

```text
ROS
LeRobot
AI API
机器人控制系统
Web API
```

都会经常遇到 JSON。

---

####  十一、JSON 在整个机器人 AI 系统中的位置

可以把它理解成：

```text
                 机器人 AI 系统
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
      硬件           数据             AI模型
        │              │              │
     电机/相机       图像/动作        Policy
        │              │              │
        └──────────────┼──────────────┘
                       ↓
                  配置 / 元数据
                       │
                      JSON
```

所以：

> **JSON 本身不是机器人控制算法，也不是 AI 模型。**

它更像是一个**数据组织和通信工具**。

---

####  十二、学习 JSON 时最应该掌握什么？

你不需要一开始记很多语法。

按照下面顺序学习就够了：

```text
① {} 是 Object
        ↓
② [] 是 Array
        ↓
③ "key": value
        ↓
④ String / Number / Boolean / Null
        ↓
⑤ Object 和 Array 可以嵌套
        ↓
⑥ 理解树形结构
        ↓
⑦ Python dict 和 JSON 的关系
        ↓
⑧ JSON 文件如何被 Python 读取
        ↓
⑨ JSON 在 LeRobot / AI / API 中的作用
```

其中最关键的是：

> **不要把 JSON 当成一堆代码去背。**

应该把它看成：

> **一棵用文本表示的数据树。**

---

####  十三、最终理解

如果把整个概念压缩成一句话：

> **JSON 是一种结构化的数据表示格式，用 Key-Value、Object 和 Array 把复杂信息组织起来，使不同程序能够方便地保存、读取和交换数据。**

在机器人和 AI 中，它主要承担：

```text
配置
↓
数据交换
↓
元数据
↓
API通信
↓
数据集描述
```

而在你现在学习的 **LeRobot + 机械臂 + 模仿学习** 体系里，可以重点理解这条链：

```text
机械臂
 ↓
采集 Observation / Action
 ↓
形成数据集
 ↓
元数据描述数据集
 ↓
JSON / 配置文件
 ↓
Python / LeRobot 读取
 ↓
训练 AI Policy
 ↓
Policy 输出 Action
 ↓
机械臂执行
```

这样你就不只是“知道 JSON 是什么”，而是知道了**为什么 LeRobot 这种机器人 AI 框架里面会大量出现 JSON，以及 JSON 在整个系统中到底处于什么位置**。
