# 08-07 - common_types.hpp 详解

> **完整路径**: `ros_pack/xline_path_planner/include/xline_path_planner/common_types.hpp`  
> **语言**: C++17  
> **重要性**: ★★ (全系统数据结构基础)

---

## 1. 功能概述

定义 X-LINE 所有几何数据结构的头文件，是整个系统的**数据语言**。约30个结构体/枚举。

## 2. 数据结构层次

### 2.1 基础几何类型

```
Point2D
  ├── x, y (double)
  ├── distance(Point2D) → double
  └── 运算符: +, -, *, /

Point3D : Point2D
  ├── z (double)
  ├── distance3D(Point3D)
  └── 向量运算: cross, dot

Vector2D
  ├── x, y
  ├── magnitude(), normalize(), dot()
  └── angle() → 方向角
```

### 2.2 几何图元

```
Line
  ├── id, start, end, length
  ├── is_printed, line_type, thickness
  ├── layer, color, metadata
  └── 派生类:
      ├── Polyline: vertices[], closed
      ├── Spline: degree, control_points[], knots[], weights[]
      ├── LineSegment: parent_polyline_id, segment_index
      ├── MergedLine: source_line_ids[]
      ├── Curve: degree, control_points, knots, weights
      ├── Circle: center, radius
      │     └── Arc: start_angle, end_angle
      ├── Ellipse: center, major_axis, ratio, start_angle, end_angle, rotation
      └── Text: position, content, height, rotation, style
```

### 2.3 规划数据容器

```
CADData
  ├── path_lines: vector<Line*>       // 绘图路径
  ├── obstacle_lines: vector<Line*>   // 障碍物
  ├── hole_lines: vector<Line*>       // 空洞
  └── origin_points: vector<Point2D>  // 参考原点

RouteSegment
  ├── points: vector<Point2D>         // 路径点序列
  ├── type: RouteType                 // DRAWING_PATH / TRANSITION_PATH
  ├── printer_type: PrinterType       // LEFT/CENTER/RIGHT
  ├── ink_mode: InkMode              // SOLID/DASHED/TEXT
  ├── backward: bool
  └── steps: vector<StepperStep>     // 步进电机步骤

ExecutionNode
  ├── pose: Pose2D                    // 目标位姿
  ├── velocity: double                // 目标速度
  ├── ink_enabled: bool
  ├── printer: PrinterType
  └── info: string
```

### 2.4 枚举定义

```
GeometryType: LINE / POLYLINE / CIRCLE / ARC / ELLIPSE / SPLINE / CURVE / TEXT
RouteType: DRAWING_PATH / TRANSITION_PATH
PrinterType: LEFT_PRINTER / RIGHT_PRINTER / CENTER_PRINTER
InkMode: SOLID / DASHED / TEXT
EndpointTangentMode: ALIGN_PATH / ALIGN_STRAIGHT / BLEND
```

### 2.5 配置结构体

```
PathPlannerConfig
  ├── extension_start_length/end_length
  ├── arc_extension_length/max_angle
  └── ellipse_extension_length/max_angle

BezierTransitionConfig
  ├── enabled, use_quintic
  ├── min_curve_distance, min_angle_for_curve
  ├── control_point_ratio, min/max_control_distance
  ├── path_resolution
  ├── min_turning_radius, adaptive_control_point
  ├── large_angle_threshold, ratio_boost
  ├── endpoint_tangent_mode
  └── consider_backward

PathOffsetConfig
  ├── left_offset, right_offset, center_offset

GridMapConfig
  ├── resolution, padding
  └── visualization config
```

## 3. 设计模式体现

**为什么用继承？**
- `Arc : Circle` → 圆弧继承圆的所有属性，只需加起始/终止角度
- `Polyline : Line` → 多段线可当作一条线处理，但多了顶点数组
- 多态使用: 通过 `Line*` 统一管理不同类型，通过 `geometry_type` 区分

## 4. 被依赖关系

```
common_types.hpp 被以下文件依赖:
  - xline_path_planner 全部文件 (作为基础数据类型)
  - 部分 xline_base_controller 文件 (JSON解析时用GeometryType)
  - 不在运行时传递 (仅编译时)
```
