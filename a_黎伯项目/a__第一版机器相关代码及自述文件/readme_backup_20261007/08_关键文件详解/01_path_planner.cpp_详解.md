# 08-01 - path_planner.cpp 详解

> **完整路径**: `ros_pack/xline_path_planner/src/path_planner.cpp`  
> **语言**: C++17  
> **行数**: ~800行  
> **所属模块**: xline_path_planner (第二层)  
> **重要性**: ★★★ (最核心的规划算法)

---

## 1. 文件功能概述

path_planner.cpp 是路径规划器的**核心实现文件**，包含 `PathPlanner` 类的全部方法。它负责：
- 接收解析后的 CADData
- 按贪心策略排序路径
- 应用喷码偏移 (左/中/右)
- 生成贝塞尔转场曲线连接离散路径段
- 可视化路径并保存图片

## 2. 对外接口

| 方向 | 内容 | 说明 |
|------|------|------|
| **输入** | `CADData` (包含 path_lines/obstacle_lines/hole_lines) | 经解析+预处理的几何数据 |
| **输入** | `PathOffsetConfig` | 偏移配置 (left_offset/right_offset/center_offset) |
| **输入** | `BezierTransitionConfig` | 贝塞尔转场配置参数 |
| **输出** | `std::vector<RouteSegment>` | 规划后的路径段 (含绘图+转场) |

## 3. 核心类: PathPlanner

```
class PathPlanner {
    CADData cad_data_;
    GridMap grid_map_;
    BezierTransitionConfig bezier_config_;
    
    // ★ 主方法
    std::vector<RouteSegment> plan_paths(CADData, PathOffsetConfig);
    
    // 路径处理
    void processGeometryGroup(vector<Line>&, RouteSegment&);
    RouteSegment planGeometryPath(Line&, PathOffsetConfig);
    RouteSegment planConnectionPath(Line&, Line&, BezierTransitionConfig);
    
    // 贝塞尔
    vector<Point2D> generate_cubic_bezier_transition(...);
    vector<Point2D> generate_quintic_bezier_transition(...);
    
    // 工具
    Line* findNearestUnprocessedLine(Point2D, vector<Line>&, set<int>&);
    vector<Point2D> applyPathOffset(Line&, offset_amount);
};
```

## 4. 核心函数详解

### 4.1 `plan_paths()` — 主规划入口

```
签名: vector<RouteSegment> plan_paths(CADData cad_data, PathOffsetConfig offsets)

功能: 主入口，依次处理每组绘图路径，规划绘图路径+转场路径

调用链:
  main.cpp → plan_paths()
    ├── processGeometryGroup(path_lines)
    └── processGeometryGroup(hole_lines)

算法步骤:
  1. 将线段按位置分组
  2. 对每组: 贪心排序 → 逐个规划绘图路径 → 规划转场路径
  3. 返回 RouteSegment[] (绘图段用实线/虚线, 转场段标记为spline)
```

### 4.2 `processGeometryGroup()` — 贪心排序+逐个规划

```
签名: void processGeometryGroup(vector<Line>& lines, RouteSegment& result)

功能: 处理一组线段，用贪心算法排序，逐个调用 planGeometryPath + planConnectionPath

贪心策略:
  1. 从当前终点位置开始
  2. findNearestUnprocessedLine() 找到最近的未处理线段
  3. planGeometryPath() 规划该线段的绘图路径
  4. planConnectionPath() 规划到该线段的转场路径
  5. 标记为已处理
  6. 重复2-5直到所有线段处理完毕
```

### 4.3 `planConnectionPath()` — 贝塞尔转场 ★★

```
签名: RouteSegment planConnectionPath(Line& from, Line& to, BezierTransitionConfig cfg)

功能: 规划从 from 终点到 to 起点的转场路径

决策树:
  if (!cfg.enabled):
      return 直线转场
  if (距离 < cfg.min_curve_distance):
      return 直线转场
  if (夹角 < cfg.min_angle_for_curve):
      return 直线转场
  
  if (cfg.use_quintic):
      return generate_quintic_bezier_transition()
  else:
      return generate_cubic_bezier_transition()

贝塞尔控制点计算:
  P0 = from.end_point          // 起点
  P3/P5 = to.start_point       // 终点 (三次/五次)
  
  控制点距离:
    d = cfg.control_point_ratio × distance(P0, P3)
    d_clamped = clamp(d, cfg.min_control_distance, cfg.max_control_distance)
  
  如果夹角 > 90°:
    d_clamped *= cfg.ratio_boost  // 大角度增强，更平缓
  
  方向:
    dir_from = normalize(P0方向)
    dir_to   = normalize(P3方向), 取反
  
  P1 = P0 + d_clamped × dir_from
  P2 = P3 - d_clamped × dir_to
```

### 4.4 `applyPathOffset()` — 路径偏移

```
签名: vector<Point2D> applyPathOffset(Line& line, double offset)

功能: 对线段应用垂直偏移 (喷码时喷头偏移)

算法:
  方向向量: dir = normalize(end - start)
  垂直向量: perpendicular = (-dir.y, dir.x)
  偏移: start' = start + offset × perpendicular
        end'   = end   + offset × perpendicular
```

### 4.5 三次贝塞尔求值

```
generate_cubic_bezier_transition(P0, P1, P2, P3, resolution):
  points = []
  for t = 0; t <= 1; t += resolution:
    // Bernstein多项式
    B0 = (1-t)³
    B1 = 3(1-t)²t
    B2 = 3(1-t)t²
    B3 = t³
    point = B0×P0 + B1×P1 + B2×P2 + B3×P3
    points.push(point)
  return points
```

### 4.6 五次贝塞尔求值

```
generate_quintic_bezier_transition(P0..P5, resolution):
  for t = 0; t <= 1; t += resolution:
    // 6个控制点的Bernstein多项式
    point = Σ C(5,i) × (1-t)^(5-i) × t^i × Pi
    points.push(point)
  return points
```

## 5. 关键算法: 贪心搜索

```
findNearestUnprocessedLine(current_pos, lines, processed_indices):
  min_dist = INF
  nearest = null
  
  for (i, line) in enumerate(lines):
    if i in processed_indices: continue
    
    // 计算当前位置到线段两端的距离
    dist = min(distance(current_pos, line.start),
               distance(current_pos, line.end))
    
    if dist < min_dist:
      min_dist = dist
      nearest = &line
      nearest_index = i
  
  processed_indices.insert(nearest_index)
  return nearest
```

**时间复杂度**: O(N²), N = 线段数量

## 6. 配置关联

配置文件: `config/planner.yaml` 中的 `bezier_transition` 和 `path_planner` 段

## 7. 调试提示

- 路径可视化: 设置 `visualization.enabled=true` 保存图片
- 检查转场质量: 观察生成的 spline 曲率是否在有 `min_turning_radius` 约束内
- 贪心排序验证: 确认路径ID按物理位置递增
