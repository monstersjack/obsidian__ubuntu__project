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

**线速度**: Sigmoid曲线平滑启动/停止
```
v(t) = v_target / (1 + exp(-k×(t-t0)))
```

**角速度**: 四层滤波管道
```
横向误差 → [HampelFilter] → [SavitzkyGolayFilter] → [PIDController] →
[FourthOrderLowpassFilter] → [SecondOrderSmoother] → 角速度指令
```

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
              返回 (v, ω) → /cmd_vel
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
