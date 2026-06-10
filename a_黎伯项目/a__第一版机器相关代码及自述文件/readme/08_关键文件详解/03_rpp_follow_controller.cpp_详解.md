# 08-03 - rpp_follow_controller.cpp 详解

> **完整路径**: `ros_pack/xline_follow_controller/src/rpp_follow/rpp_follow_controller.cpp`  
> **语言**: C++17  
> **重要性**: ★★★ (RPP算法核心)

---

## 1. 功能概述

实现 **Regulated Pure Pursuit (RPP)** 路径跟随控制器的核心逻辑。从全局路径中找前瞻点，计算转向角速度，施加曲率约束和接近减速。

## 2. 对外接口

- **输入**: 全局路径 P[], 当前位姿 (x,y,θ), 当前速度 v
- **输出**: `cmd_vel` (linear.x, angular.z)
- **基类**: `BaseFollowController` (多态接口)

## 3. 核心函数

### 3.1 `computeVelocityCommands()` — 主入口

```
computeVelocityCommands(current_pose, current_speed):
  1. pruneGlobalPlan(current_pose)    // 裁剪已走路径
  2. lookahead = getLookAheadDistance(current_speed)
  3. lookahead_point = getLookAheadPoint(lookahead)
  4. α = atan2(lookahead_point.y-y, lookahead_point.x-x) - θ
  5. ω = 2 × current_speed × sin(α) / lookahead
  6. ω_filtered = smoothAngularVelocity(ω, lookahead, α)
  7. v = applyCurvatureConstraint(current_speed, ω_filtered)
  8. v = applyApproachConstraint(v, remaining_dist)
  9. return cmd_vel(v, ω_filtered)
```

### 3.2 `getLookAheadDistance(speed)` — 前瞻距离

```
前瞻距离 = k × speed + min_lookahead
clamped to [min_lookahead, max_lookahead]

原理: 速度越快，需要看得越远
配置: k=0.3, min_lookahead=0.2m, max_lookahead=2.0m
```

### 3.3 `getLookAheadPoint(lookahead_dist)` — 前瞻点查找

```
1. 从最近路径点开始，沿路径累积距离
2. 当累积距离 >= lookahead_dist 时:
    在两相邻路径点之间线性插值
    return 插值点
3. 如果到达路径末尾:
    return 最后一个路径点
```

### 3.4 `applyCurvatureConstraint(v, ω)` — 曲率约束

```
曲率 = |ω| / v
if 曲率 > max_curvature:
    v = v × max_curvature / 曲率  // 弯道减速

原理: 转弯半径不能小于最小转弯半径
  R = v²/a_lateral  (侧向加速度限制)
  v_max = sqrt(a_max × R_min)
```

### 3.5 `applyApproachConstraint(v, remaining_dist)` — 接近减速

```
if remaining_dist < approach_threshold:
    v = v × remaining_dist / approach_threshold
    v = max(v, min_approach_velocity)  // 不低于最小速度

原理: 接近目标时线性减速，保证精确停止
```

### 3.6 `performYawPrealignment()` — 航向预对准 (仅圆策略)

```
圆轨迹切入前:
1. 计算切入点的切线方向
2. 原地旋转使机器人朝向与切线方向对齐
3. 对齐后才开始跟随

条件: shouldPrealign() 返回 true 且 角度偏差 > threshold
```

## 4. 策略模式切换

```
PathStrategy* strategy_ (多态)
├── CirclePathStrategy  → 圆轨迹时
│   特点: performYawPrealignment()
│   前瞻点: 圆上参数方程计算
└── CurvePathStrategy   → 曲线轨迹时
    特点: NURBS插值
    前瞻点: 沿NURBS参数化前进
```

## 5. 配置关联

`config/rpp_circle.yaml` / `config/rpp_curve.yaml`:
- `lookahead_k`, `min_lookahead`, `max_lookahead`
- `max_curvature`
- `approach_threshold`, `min_approach_velocity`
- `yaw_prealignment_threshold`
- 滤波器参数 (Hampel/SG/二阶平滑)
