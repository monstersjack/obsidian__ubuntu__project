# 07-02 - xline_path_planner 路径规划器

> **位置**: `ros_pack/xline_path_planner/`  
> **语言**: C++17  
> **核心依赖**: Eigen3, OpenCV, nlohmann-json

---

## 1. 模块定位

路径规划器位于架构**第二层**，是数据的生产者。从CAD JSON生成机器人可执行的路径计划。

## 2. 文件清单

| 文件 | 功能 |
|------|------|
| `include/xline_path_planner/common_types.hpp` | ★★ 所有几何数据结构 (Point/Line/Circle/Arc/...) |
| `include/xline_path_planner/cad_parser.hpp` | CAD JSON解析器 |
| `include/xline_path_planner/geometry_preprocessor.hpp` | Polyline拆分/路径扩展 |
| `include/xline_path_planner/collinear_merger.hpp` | 共线线段合并 |
| `include/xline_path_planner/grid_map_generator.hpp` | 栅格地图生成 |
| `include/xline_path_planner/path_planner.hpp` | ★★ 路径规划主类 |
| `include/xline_path_planner/trajectory_generator.hpp` | 轨迹生成器 |
| `include/xline_path_planner/output_formatter.hpp` | JSON输出格式化 |
| `src/main.cpp` | 节点入口 (drawing_planner_node) |
| `config/planner.yaml` | 规划器总配置 |
| `test/` | 8个测试文件 |

## 3. 核心速查

| 类/函数 | 文件 | 功能 |
|----------|------|------|
| `CADParser::parse()` | cad_parser.cpp | 解析cad_transformed.json → CADData |
| `GeometryPreprocessor::preprocess()` | geometry_preprocessor.cpp | 拆分Polyline/扩展路径 |
| `GridMapGenerator::generate_from_cad()` | grid_map_generator.cpp | Bresenham光栅化 |
| `PathPlanner::plan_paths()` | path_planner.cpp | ★ 主规划入口 |
| `PathPlanner::planConnectionPath()` | path_planner.cpp | 贝塞尔转场 |
| `PathPlanner::findNearestUnprocessedLine()` | path_planner.cpp | 贪心搜索 |

## 4. 6阶段流水线

```
[cad_transformed.json]
    ↓ 阶段1: CADParser::parse()
    ├── parse_line / parse_polyline / parse_circle / parse_arc / parse_ellipse / parse_spline
    ├── 单位换算 (mm→m, factor=1000)
    └── store_by_layer() → path_lines / obstacle_lines / hole_lines
    ↓ 阶段2: GeometryPreprocessor::preprocess()
    ├── 拆分Polyline → LineSegment[]
    ├── 共线合并 (同一方向的相邻线段)
    └── 路径扩展 (起终点延长)
    ↓ 阶段3: GridMapGenerator::generate_from_cad()
    ├── Bresenham直线光栅化
    └── 圆/弧/椭圆/样条→离散→光栅化 (De Casteljau / NURBS)
    ↓ 阶段4: PathPlanner::plan_paths() ★★
    ├── 贪心排序: findNearestUnprocessedLine()
    ├── 绘图路径: planGeometryPath() + applyPathOffset()
    └── 转场路径: planConnectionPath() + 贝塞尔曲线
    ↓ 阶段5: TrajectoryGenerator::generate_from_path()
    └── 路径点→ExecutionNode (含位姿/速度/喷墨信息)
    ↓ 阶段6: OutputFormatter::format()
    └── 输出 planned_*.json + 可视化图片
```

## 5. 贝塞尔转场参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `enabled` | true | 启用贝塞尔转场 |
| `use_quintic` | false | 五次贝塞尔 (曲率连续) |
| `control_point_ratio` | 0.3 | 控制点距离比例 |
| `min_turning_radius` | 0.5m | 最小转弯半径 |
| `large_angle_threshold` | 90° | 大角度判定阈值 |
| `ratio_boost` | 1.5 | 大角度控制点放大 |
| `endpoint_tangent_mode` | ALIGN_PATH | 终点切线对齐方式 |

## 6. 对外接口

- **输入**: `cad_transformed.json` (通过PlanPath Service请求传入)
- **输出**: `planned_results/planned_*.json` + 可视化PNG图片
- **ROS接口**: `/plan_path` Service (xline_path_planner/PlanPath)

### 源码核对：输入输出及两种规划入口

| 阶段/函数 | 输入 | 输出及单位 | 何时调用 | 源码 |
| --- | --- | --- | --- | --- |
| `PlannerNode::handle_service` | `PlanPath.Request.file_name` | `success/error/message`；计划写入文件，服务响应不含轨迹 | 调用 ROS `plan_path` 服务时 | [main.cpp](../../../ros_pack/xline_path_planner/src/main.cpp) |
| `CADParser::parse` | 转换后的 CAD JSON | 几何对象；按配置将毫米换为米 | 规划开始时 | [cad_parser.cpp](../../../ros_pack/xline_path_planner/src/cad_parser.cpp)、[planner.yaml](../../../ros_pack/xline_path_planner/config/planner.yaml) |
| `PathPlanner::processGeometryGroup` | 预处理后的几何组 | 画线及转场段，位置单位米 | 几何预处理之后 | [path_planner.cpp](../../../ros_pack/xline_path_planner/src/path_planner.cpp) |
| `PathPlanner::applyPathOffset` | 点列、喷头侧向偏移 | 补偿后的点列，米 | 生成实际喷头轨迹时 | [path_planner.cpp](../../../ros_pack/xline_path_planner/src/path_planner.cpp) |
| `TrajectoryGenerator::generate_from_path` | 路径点 | 可执行节点 | 路径确定后 | [trajectory_generator.cpp](../../../ros_pack/xline_path_planner/src/trajectory_generator.cpp) |

本页的六阶段是 **C++ ROS 规划器**内部流程，不代表服务端 HTTP 规划路由会调用它。当前 [planning.py](../../../ros_pack/xline_server/api/planning.py) 调用的是 [planning_service.py](../../../ros_pack/xline_server/services/planning_service.py) 的 Python `plan_path(dict)`：筛选 `selected=true` 的线条，按当前位置到剩余线段端点的距离贪心排序，必要时反转线段。两条入口都可产出计划 JSON，实际执行哪个计划要看页面选择的文件。规划公式、直线采样例子和更多函数说明见 [[划线算法与关键函数精读]]。

### 贝塞尔转场：为什么要加、如何生成

转场是“上一条需要喷的路径”到“下一条需要喷的路径”之间的非喷墨移动段。直线转场虽然简单，但急转会让底盘角速度突变、车体摆动，下一条线的进入姿态也不稳定。`PathPlanner::planConnectionPath()` 根据起点/终点位置和两端切线方向生成转场点列；它只服务于移动连接，不应被当作新的喷码几何。

| 环节 | 源码逻辑 | 目的 |
| --- | --- | --- |
| 端点确定 | 取上一段终点 `p0` 与下一段起点 `p3` | 保证转场连接两段路径 |
| 控制点方向 | 沿上一段/下一段切线布置控制点 | 让曲线以正确方向离开和进入 |
| 长度调整 | `control_point_ratio`，大角度时可 `ratio_boost`；同时满足 `min_turning_radius` | 防止控制点过近导致急弯 |
| 姿态模式 | `ALIGN_PATH` 偏向下一路径切线；`ALIGN_STRAIGHT` 偏向端点连线；`BLEND` 用 `blend_ratio` 混合 | 在平滑性和到达后对准之间折中 |
| 离散输出 | 三次控制点 `p0..p3` 或五次 `p0..p5`，按 `t∈[0,1]` 求点 | 供轨迹生成器和跟随器使用 |

三次贝塞尔的基本式为：

```text
B(t)=(1-t)^3p0+3(1-t)^2t p1+3(1-t)t^2 p2+t^3p3
```

五次贝塞尔增加中间控制点，使首尾切向变化更连续，适合对抖动敏感的底盘，但计算和调参更复杂。仓库的 `evaluate_bezier_point()` 使用 De Casteljau 递推求点，不依赖手写展开式。注意：当前配置中的 `bezier_transition.enabled` 决定是否启用；若关闭，规划器会回退到直线转场。转场是否喷墨还要看执行计划的转场标志和运动控制中心的判断，不能只看路径类型。

| 配置 | 影响 | 调大/开启后的效果 |
| --- | --- | --- |
| `enabled` | 是否使用贝塞尔转场 | 开启后转场更连续，但需要验证障碍和空间 |
| `use_quintic` | 三次/五次曲线 | 五次更平滑，调试成本更高 |
| `control_point_ratio` | 控制点基础距离比例 | 一般越大弯越缓，但可能占用更多空间 |
| `min_turning_radius` | 最小允许转弯半径 | 越大越保守，急弯会被拉长 |
| `endpoint_tangent_mode` | 首尾切线方向策略 | 决定进入下一条线时是否还需二次对准 |
