# 07-04 - xline_follow_controller 跟随控制器

> **位置**: `ros_pack/xline_follow_controller/`  
> **语言**: C++17  
> **核心依赖**: Eigen3, yaml-cpp

---

## 1. 模块定位

跟随控制器位于架构**第三层**，是核心算法的载体。提供4种路径跟随控制器和一个包含5种滤波器的算法库。

## 2. 文件清单

| 文件 | 功能 |
|------|------|
| `include/xline_follow_controller/common/follow_common.hpp` | ★★ 滤波器全家桶: Hampel+SG+PID+二阶平滑+四阶低通 |
| `include/xline_follow_controller/common/base_follow_controller.hpp` | 控制器基类 (统一接口) |
| `include/xline_follow_controller/line_follow/line_follow_controller.hpp` | 直线跟随控制器 |
| `include/xline_follow_controller/rpp_follow/rpp_follow_controller.hpp` | ★★ RPP控制器 |
| `include/xline_follow_controller/rpp_follow/path_strategy.hpp` | 策略模式接口 |
| `src/line_follow/line_follow_controller.cpp` | 直线跟随实现 |
| `src/rpp_follow/rpp_follow_controller.cpp` | ★★ RPP实现 |
| `src/rpp_follow/circle_path_strategy.cpp` | 圆策略 |
| `src/rpp_follow/curve_path_strategy.cpp` | 曲线策略 |
| `config/line.yaml`, `config/rpp_circle.yaml`, `config/rpp_curve.yaml` | 控制器参数配置 |

## 3. 滤波器组速查

| 滤波器 | 作用 | 关键参数 |
|--------|------|----------|
| **HampelFilter** | 异常值检测 | window_size=5, k=3, 策略: LINEAR_PREDICTION |
| **SavitzkyGolayFilter** | 数据平滑 | window_size=5, poly_order=3 |
| **PIDController** | 闭环控制 | Kp, Ki, Kd, max_integral, max_output |
| **SecondOrderSmoother** | 二阶物理平滑 | damping_ratio=0.7, natural_frequency=10 |
| **FourthOrderLowpassFilter** | 四阶低通 | cutoff_frequency=5Hz |

## 4. 直线跟随算法

**状态机**: `IDLE → ALIGNING_START → FOLLOWING_PATH → ALIGNING_END → GOAL_REACHED`

**线速度**: 根据到原始起点/终点的距离分别加速、减速；核心形状是 Sigmoid，但还受短路径限速、减速度上限和平滑约束。
```
S(z) = 1 / (1 + exp(-k×(z-c)))
```

**角速度**: 位姿先做异常值/平滑处理；航向误差经 PID、限幅、Hampel 及二阶平滑等处理后输出。不能把文件中出现的全部滤波器都当作直线控制每一轮必经的固定管道。

### 源码核对：直线从误差到速度

| 函数/阶段 | 输入 | 输出与单位 | 核心原理 | 源码 |
| --- | --- | --- | --- | --- |
| `setPlan` | 起终点、路径点 | 内部状态与延伸路径，米 | 保留原始端点、复位对齐和打印状态 | [line_follow_controller.cpp](../../../ros_pack/xline_follow_controller/src/line_follow/line_follow_controller.cpp) |
| `handlePathFollowing` | 当前 `x/y`、航向、前瞻路径点 | 目标航向与速度 | 路径单位方向 `u`、法向 `n`，横向误差 `e=(P-A)·n`；Stanley 分支用 `atan2(-k·e, abs(v)+v0)` 修正航向 | [line_follow_controller.cpp](../../../ros_pack/xline_follow_controller/src/line_follow/line_follow_controller.cpp) |
| `computeLinearSpeed` | 到起点和终点距离，米 | `linear.x`，米/秒 | 起点加速、终点减速，经短线和变化率限制 | [line_follow_controller.cpp](../../../ros_pack/xline_follow_controller/src/line_follow/line_follow_controller.cpp) |
| `computeAngularVelocity` | 航向误差 rad、`dt` 秒 | `angular.z`，rad/s | PID 后按阶段限幅、滤波和平滑 | [line_follow_controller.cpp](../../../ros_pack/xline_follow_controller/src/line_follow/line_follow_controller.cpp) |
| `computeVelocityCommands` | `PoseStamped`、`Twist` | `TwistStamped` | 按状态调用对齐或跟随；当前实现未使用传入的 `velocity` 形参 | [line_follow_controller.cpp](../../../ros_pack/xline_follow_controller/src/line_follow/line_follow_controller.cpp) |

例如线从 `(0,0)` 指向 `(1,0)`，小车在 `(0.4,0.1)`，则左侧横向误差 `e=+0.1 m`，修正角应朝右侧。喷码标记不是 ROS 话题：离原始起点超过约 `0.14 m` 时可置 `start_print`，距原始终点小于约 `0.03 m` 时置 `stop_print`；控制中心还会检查转场及打印机状态。参数与分支见 [line.yaml](../../../ros_pack/xline_follow_controller/config/line.yaml)，完整推导见 [[划线算法与关键函数精读]]。

## 5. RPP（Regulated Pure Pursuit）曲线跟随控制器 —— 详解

### 5.1 算法定义

**RPP** 是 **Regulated Pure Pursuit** 的缩写，中文称为**调节型纯追踪算法**，是一种经典的几何路径跟随控制算法。它起源于自动驾驶领域的 Pure Pursuit 算法（卡内基梅隆大学，1990年代），X-LINE 在此基础上加入了多种调节机制。

### 5.2 纯追踪（Pure Pursuit）核心思想

**基本思路**：把机器人想象成一个"追着胡萝卜跑的驴"——在路径前方放置一个虚拟的目标点（前瞻点），机器人不断转向朝向这个目标点运动。

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   机器人当前位置 ●──── 圆弧轨迹 ────→ ★ 前瞻点(lookahead)      │
│   (x, y, θ)             ↑                (在目标路径上)       │
│                          │                                   │
│                      转向半径 R                              │
│                          │                                   │
│   目标路径 ═══════════════╪══════════════════════════════     │
│                          ★ 前瞻点                             │
└─────────────────────────────────────────────────────────────┘
```

**几何关系推导**：
```
设：α = 前瞻点相对机器人航向的夹角
    L = 前瞻距离 (lookahead_distance)
    R = 转向半径

由正弦定理：L / sin(2α) = R / sin(π/2 - α)
化简得：R = L / (2 × sin(α))

曲率 κ = 1/R = 2 × sin(α) / L

因此角速度：ω = v / R = 2 × v × sin(α) / L
```

这就是 RPP 最核心的公式：`ω = 2 × v × sin(α) / L`

### 5.3 调节型（Regulated）的四大改进

| 调节机制 | 解决的问题 | 实现方式 |
|----------|-----------|----------|
| **前瞻点动态调整** | 低速时前瞻太远导致"走神"，高速时前瞻太近导致"紧张" | `lookahead = k × v + min_distance`，速度越快看得越远 |
| **曲率约束** | 大弯道时转向角度过大导致失控 | 检测路径曲率 → 超过阈值时自动减速：`v = min(v, v_max / curvature)` |
| **接近减速** | 到达终点时急刹车 | 进入终点区域后，速度线性降低：`v = v × (distance_to_goal / approach_distance)` |
| **航向预对准** | 进入圆弧时初始航向偏差大导致振荡 | 在切入圆之前，先原地旋转对准切线方向，再开始跟随 |

### 5.4 完整算法流程

```
computeVelocityCommands():
  ┌─────────────────────────────────────────────┐
  │ 1. pruneGlobalPlan()                        │
  │    裁剪全局路径，移除机器人后方已走过的路径点     │
  │    保留当前点到终点的有效路径段                 │
  └──────────────────┬──────────────────────────┘
                     ▼
  ┌─────────────────────────────────────────────┐
  │ 2. 计算前瞻距离                              │
  │    lookahead = k × current_velocity + min   │
  │    例: k=0.3, min=0.5m                      │
  │    v=0.2m/s → lookahead=0.56m               │
  │    v=1.0m/s → lookahead=0.80m               │
  └──────────────────┬──────────────────────────┘
                     ▼
  ┌─────────────────────────────────────────────┐
  │ 3. 寻找前瞻点 (lookaheadPoint)               │
  │    沿路径从当前位置向前搜索，                   │
  │    找到距离 ≥ lookahead 的第一个点             │
  │    若路径点不够密，进行线性插值                 │
  └──────────────────┬──────────────────────────┘
                     ▼
  ┌─────────────────────────────────────────────┐
  │ 4. 计算转向角度 α                            │
  │    α = atan2(lookahead_y - robot_y,          │
  │              lookahead_x - robot_x) - θ      │
  │    将 α 归一化到 [-π, π]                      │
  └──────────────────┬──────────────────────────┘
                     ▼
  ┌─────────────────────────────────────────────┐
  │ 5. 计算角速度                                │
  │    ω = 2 × v × sin(α) / lookahead           │
  │    (核心公式，由纯追踪几何关系推导)             │
  └──────────────────┬──────────────────────────┘
                     ▼
  ┌─────────────────────────────────────────────┐
  │ 6. applyCurvatureConstraint()                │
  │    计算当前路径段的曲率                        │
  │    if 曲率 > 阈值:                           │
  │        v = min(v, max_velocity / curvature)  │
  │    目的：急弯自动减速，防止脱轨                │
  └──────────────────┬──────────────────────────┘
                     ▼
  ┌─────────────────────────────────────────────┐
  │ 7. applyApproachConstraint()                 │
  │    dist_to_goal = 当前位置到终点的弧长         │
  │    if dist_to_goal < approach_threshold:     │
  │        v = v × (dist_to_goal / threshold)   │
  │    目的：接近终点时平滑减速                    │
  └──────────────────┬──────────────────────────┘
                     ▼
  ┌─────────────────────────────────────────────┐
  │ 8. smoothAngularVelocity()                   │
  │    对角速度做低通滤波，防止指令突变              │
  │    ω_smoothed = α×ω + (1-α)×ω_prev          │
  └──────────────────┬──────────────────────────┘
                     ▼
              返回 (v, ω) → 运动控制中心 → /task_cmd_vel → 仲裁 /cmd_vel
```

### 5.5 策略模式（Strategy Pattern）

RPP 控制器使用策略模式将"如何寻找前瞻点"这一变化行为抽象出来，使得同一套 RPP 算法可以适配不同类型的路径：

```
PathStrategy (抽象接口)
│
├── CirclePathStrategy        ← 用于 circle / arc 路径
│   │
│   ├── 前瞻点计算: 基于圆心 + 半径 + 角度的参数方程
│   │    x = center_x + radius × cos(angle)
│   │    y = center_y + radius × sin(angle)
│   │
│   └── ★ performYawPrealignment(): 圆切入前航向预对准
│        1. 计算圆弧起点处的切线方向
│        2. 机器人在当前位置原地旋转
│        3. 直到朝向与切线方向对齐（误差 < 阈值）
│        4. 再开始实际跟随
│        → 避免进入圆弧时的初始振荡
│
└── CurvePathStrategy         ← 用于 spline / ellipse 路径
    │
    ├── 前瞻点计算: NURBS 曲线上参数插值
    │    NURBS: p(t) = Σ(w_i×P_i×N_{i,k}(t)) / Σ(w_i×N_{i,k}(t))
    │    通过二分搜索在曲线上找到距离 = lookahead 的点
    │
    └── 接近处理: 到达曲线末端附近触发提前完成的逻辑
```

### 5.6 四种 RPP 适用场景

| 路径类型 | 策略类 | 配置文件 | 典型用途 |
|----------|--------|---------|---------|
| **circle**（圆形） | CirclePathStrategy | `rpp_circle.yaml` | 地面圆形标线 |
| **arc**（圆弧） | CirclePathStrategy | `rpp_circle.yaml` | 弧形车道线 |
| **spline**（样条曲线） | CurvePathStrategy | `rpp_curve.yaml` | 文字/图案轮廓 |
| **ellipse**（椭圆） | CurvePathStrategy | `rpp_curve.yaml` | 椭圆形标识 |

### 5.7 关键配置参数详解

**rpp_circle.yaml**（圆形/圆弧路径）：
| 参数 | 含义 | 典型值 | 调参建议 |
|------|------|--------|---------|
| `lookahead_min` | 最小前瞻距离 | 0.3m | 太小→路径点间跳跃；太大→轨迹平滑但滞后 |
| `lookahead_k` | 速度-前瞻比例系数 | 0.5 | 大→速度快时看得远；小→紧贴路径 |
| `max_curvature` | 最大允许曲率 | 2.0 | 超过此值自动减速 |
| `approach_distance` | 接近减速距离 | 0.5m | 终点前多少米开始减速 |
| `yaw_prealignment_tolerance` | 预对准角度容差 | 0.05 rad | 太小→对准耗时；太大→切入偏差 |

**rpp_curve.yaml**（样条/椭圆路径）：
| 参数 | 含义 | 典型值 | 调参建议 |
|------|------|--------|---------|
| `lookahead_min` | 最小前瞻距离 | 0.2m | 曲线路径建议比圆更小，保证跟踪精度 |
| `lookahead_k` | 速度-前瞻比例系数 | 0.3 | 曲线建议比圆更小 |
| `max_curvature` | 最大允许曲率 | 3.0 | 曲线可容忍更大曲率 |
| `approach_distance` | 接近减速距离 | 0.3m | — |
| `curve_interpolation_step` | NURBS插值步长 | 0.01m | 越小越精细但计算量越大 |

### 5.8 RPP vs 其他控制器对比

| 维度 | LineFollow | RPP | LQR |
|------|-----------|-----|-----|
| **适用路径** | 直线 | 圆/弧/样条/椭圆 | 圆/曲线 |
| **核心思想** | Sigmoid + PID 纠偏 | 几何前瞻追踪 | 最优控制 |
| **跟踪精度** | 中（±2cm） | 高（±1cm） | 最高（±0.5cm） |
| **计算复杂度** | 低 | 中 | 高 |
| **参数调优难度** | 易 | 中 | 难 |
| **高速稳定性** | 好 | 中 | 最优 |
| **曲线平滑度** | N/A | 好 | 最优 |

### 5.9 简单理解

**RPP 就像是一个经验丰富的驾驶员在走陌生弯道**：
- 🎯 **看着前方**（前瞻点）：不会盯着车轮下面，而是看前方一定距离
- 🔄 **动态调整视野**（lookahead = k×v + min）：速度快时看远一点，速度慢时看近一点
- 🚗 **弯前减速**（曲率约束）：看到前方大弯，提前放慢车速
- 🅿️ **平稳停车**（接近减速）：到达终点前缓缓减速，不会急刹车
- 🔧 **入弯准备**（航向预对准）：进入弯道前先摆正车头方向

---

## 6. 策略模式

```
PathStrategy (抽象接口)
  ├── CirclePathStrategy
  │   核心: performYawPrealignment() 圆切入前航向预对准
  └── CurvePathStrategy
      核心: NURBS路径上的前瞻点插值
```

## 7. 对外接口

作为C++库 (`xline_follow_controller`) 被 `xline_base_controller` 编译时链接，不提供独立的ROS节点。

- **上游**: xline_base_controller (调用方)
- **依赖**: Eigen3, yaml-cpp
- **配置文件**: `line.yaml`, `rpp_circle.yaml`, `rpp_curve.yaml`

### RPP：从前瞻点到角速度

RPP（Regulated Pure Pursuit，调节型纯追踪）不是“直接追最近点”，而是先在机器人前方路径上取一个前瞻点，再让机器人沿能到达该点的圆弧行驶。当前实现的主要顺序如下：

```mermaid
flowchart TD
    A[PoseStamped 当前位姿] --> B[裁剪已通过路径点]
    B --> C[按速度计算前瞻距离]
    C --> D[路径插值得到前瞻点]
    D --> E[计算前瞻角 alpha]
    E --> F[曲率 kappa=2sin(alpha)/L]
    F --> G[曲率约束线速度]
    G --> H[omega=v*kappa]
    H --> I[角速度滤波与限幅]
    I --> J[TwistStamped]
```

| 代码步骤 | 公式/处理 | 单位与意义 |
| --- | --- | --- |
| `getLookAheadDistance` | `L=clamp(|v|×lookahead.time,min_dist,max_dist)` | `L` 为米；速度越快通常前瞻更远 |
| `getLookAheadPoint` | 沿已变换路径累计距离插值 | 输出前瞻点，必须和当前位姿处于同一坐标系 |
| `computeAngleToLookahead` | 当前车体朝向到前瞻点的角度 `alpha` | 弧度；正负决定转向方向 |
| `computeCurvature` | `kappa=2 sin(alpha)/L` | `1/m`；圆弧曲率 |
| `applyCurvatureConstraint` | 半径 `R=1/|kappa|` 小于阈值时缩放线速度 | 速度为 m/s；避免急弯高速 |
| `omega=v*kappa` | 曲率转角速度 | `rad/s` |
| `filterAngularVelocity` | 变化率、低通、偏移限制等 | 抑制定位抖动和角速度突变 |

RPP 的“各种矫正”应分开理解：**前瞻矫正**解决看多远；**曲率限速**解决弯道不能过快；**角速度限幅/变化率限制**解决底盘执行能力；**Hampel、低通和二阶平滑**解决 IMU/全站仪噪声；**终点与目标距离判断**解决快到终点时减速和停车。它们不是重复的 PID，而是作用在不同阶段。

#### 圆、曲线和直线控制的区别

| 路径类型 | 主要控制策略 | 特有矫正 |
| --- | --- | --- |
| 直线 | `LineFollowController` | 横向误差、航向误差、起终点对齐、Sigmoid 加减速 |
| 圆/圆弧 | RPP + `CirclePathStrategy` | 半径/目标角速度、动态前瞻距离、圆切入前航向对准 |
| 样条/一般曲线 | RPP + `CurvePathStrategy` | 路径前瞻、曲率约束、曲线切线方向 |
| 椭圆等 LQR 路径 | LQR 控制器 | 依据模型误差反馈求解线速度和角速度，不应套用 RPP 公式 |

圆策略的动态前瞻距离还会结合目标速度和圆半径，并限制在 `min_dist` 与 `max_dist` 之间；因此不能只凭 `rpp_circle.yaml` 中的一个固定 `lookahead` 判断实际运行值。真正调参时要同时看 `rpp_follow_controller.cpp`、`circle_path_strategy.cpp`、`curve_path_strategy.cpp` 及对应 YAML。
