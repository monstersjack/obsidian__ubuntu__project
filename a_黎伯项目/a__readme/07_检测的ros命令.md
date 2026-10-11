---
标题: 07_检测的ros命令
创建时间: 2026-10-09
修改时间: 2026-10-11
---

ros2 topic echo /reflector_position


/reflector_position : geometry_msgs/msg/PointStamped，定位算法的外部绝对位置输入


/localization/calibrate_pose

/motion_control/execute_calibration和/localization/calibrate_pose

这张图的现场基准点与方向绑定，并确认喷墨设置。



APP 的基准点绑定规则

桌面 CAD APP 的基准点处理代码，正在确认它如何把点击的 CAD 点转换到现场坐标，以及是否存在默认原点/方向。

：先确认这份 JSON 是否已完成地图配准，再刷新小车定位、仲裁器和 Action 状态。

图纸的 transformation_matrix 为空，coordinate_transform_applied=false，ready_for_robot_execution=false。


问题：/execute_plan 报告了 4 个 Action Server，但进程检查只看到一个底盘控制进程。这个数量不一致也需要在执行前查清。

/localization/calibrate_pose 只能处理定位拟合，不能替代 CAD 到现场地图的配准；此时调用它也无法修复图纸坐标问题。因此我没有把它当成可执行划线的替代步骤。



