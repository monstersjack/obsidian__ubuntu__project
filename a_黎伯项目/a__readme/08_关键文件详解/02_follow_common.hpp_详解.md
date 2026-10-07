# 08-02 - follow_common.hpp 详解

> **完整路径**: `ros_pack/xline_follow_controller/include/xline_follow_controller/common/follow_common.hpp`  
> **语言**: C++17  
> **所属模块**: xline_follow_controller (第三层)  
> **重要性**: ★★★ (所有控制器的算法基础)

---

## 1. 文件功能概述

`follow_common.hpp` 是整个系统的**算法工具箱**，包含5个核心滤波器和控制器：
1. **HampelFilter** — 异常值检测与处理
2. **SavitzkyGolayFilter** — 数据平滑
3. **PIDController** — PID闭环控制
4. **SecondOrderSmoother** — 二阶物理平滑器
5. **FourthOrderLowpassFilter** — 四阶低通滤波

所有跟随控制器 (LineFollow/RPP/LQR) 都直接或间接依赖此文件。

## 2. HampelFilter 详解

### 2.1 核心原理

```
基于 MAD (Median Absolute Deviation) 的异常值检测

窗口: [x₁, x₂, ..., xₙ] (最近N个样本)
1. median = 排序后的中位数
2. MAD = median(|x_i - median|) × 1.4826 (归一化因子)
3. threshold = k × MAD

异常判定:
  if |x_new - median| > threshold:
      → 异常值 → 按策略处理
  else:
      → 正常值 → 直接输出
```

### 2.2 四种异常值处理策略

| 策略 | 算法 | 适用场景 |
|------|------|----------|
| **LINEAR_PREDICTION** (默认) | 基于最近2个有效历史值的加权线性预测 | 连续运动场景，数据变化有趋势性 |
| **SOFT_THRESHOLD** | Sigmoid混合: output = α×original + (1-α)×median | 过渡平滑性要求高的场景 |
| **EXPONENTIAL_DECAY** | output = median + sign×threshold×exp(-|diff|/scale) | 短时波动场景 |
| **REPLACE_MEDIAN** | 直接替换为中位数 | 最简单，但可能导致运动突变 |

### 2.3 配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `window_size` | 5 | 滑动窗口大小 |
| `k` | 3 | 异常判定阈值倍数 |
| `strategy` | LINEAR_PREDICTION | 异常值处理策略 |

## 3. SavitzkyGolayFilter

### 3.1 核心原理

```
对窗口内数据做多项式最小二乘拟合，用拟合值平滑数据

步骤:
1. 设定窗口大小 N 和多项式阶数 M
2. 预计算卷积系数 (Eigen 矩阵求逆):
   A = [1 x x² ... x^M] (Vandermonde矩阵)
   C = (AᵀA)⁻¹Aᵀ 的第一行 (只取拟合值)
3. 运行时: output = C · window_data (卷积)
```

### 3.2 配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `window_size` | 5 | 窗口大小 (奇数) |
| `poly_order` | 3 | 多项式阶数 |

## 4. PIDController

### 4.1 核心原理

```
标准PID: output = Kp×e + Ki×∫e + Kd×de/dt

关键改进:
  - 积分限幅: |∫e| ≤ max_integral
    防止积分饱和 (integral windup)
  - 输出限幅: |output| ≤ max_output
    防止指令超出物理限制

离散化 (控制周期 dt):
  积分: ∫e += e × dt (梯形积分)
  微分: de/dt = (e - e_prev) / dt
```

### 4.2 配置参数

| 参数 | 说明 |
|------|------|
| `Kp` | 比例增益 |
| `Ki` | 积分增益 |
| `Kd` | 微分增益 |
| `dt` | 控制周期 |
| `max_integral` | 积分项上限 |
| `max_output` | 输出上限 |

## 5. SecondOrderSmoother

### 5.1 物理模型

```
质量-弹簧-阻尼系统的二阶微分方程:
  x'' + 2ζωn×x' + ωn²×(x-u) = 0

  x  = 输出 (平滑后位置)
  u  = 输入 (原始值/目标值)
  ζ  = 阻尼比 (0~1)
  ωn = 自然频率 (rad/s)

ζ < 1:  欠阻尼 (振荡)
ζ = 1:  临界阻尼 (最快无振荡)
ζ > 1:  过阻尼 (缓慢)

推荐: ζ = 0.7~0.9, 兼顾响应速度和平滑性
```

### 5.2 离散化实现

```
欧拉法:
  acceleration = ωn² × (u - x) - 2ζωn × velocity
  velocity = velocity + acceleration × dt
  output = x + velocity × dt
```

## 6. 滤波器级联顺序

```
直线跟随管道:
  error → HampelFilter → SavitzkyGolayFilter → PIDController → 
          FourthOrderLowpassFilter → SecondOrderSmoother → 角速度指令

RPP管道:
  α → SavitzkyGolayFilter → HampelFilter → ω_raw → 
      SecondOrderSmoother → ω_smoothed
```
