# 08-04 - motion_control_center.cpp 详解

> **完整路径**: `ros_pack/xline_base_controller/src/motion_control_center.cpp`  
> **语言**: C++17  
> **重要性**: ★★★ (调度中枢)

---

## 1. 功能概述

运动控制中枢，作为 ROS 2 Action Server 运行 (`/execute_plan`)。接收 JSON 执行计划，调度4种跟随控制器，协调喷码/步进电机同步。

## 2. 核心方法详解

### 2.1 `handleGoal()` — 目标接收

```
handleGoal(goal_handle):
  if is_executing_:
      return REJECT  // 前一个任务未完成
  accept goal
  is_executing_ = true
  launch execute() thread
```

### 2.2 `execute()` — 主执行循环 ★★★

```
execute(goal_handle):
  plan = json.parse(goal_handle.plan_json)
  
  for (auto& line : plan.lines):
    // 1. 解析路径类型
    if (line.type == "LINE"):
        data = extractLineData(line)
        controller = line_follow_controller_
    elif (line.type == "CIRCLE"):
        data = extractCircleData(line)
        controller = rpp_follow_controller_ (CirclePathStrategy)
    elif (line.type == "ARC"):
        data = extractArcData(line)
        controller = rpp_follow_controller_
    elif (line.type == "SPLINE"):
        data = extractSplineData(line)
        controller = rpp_follow_controller_ (CurvePathStrategy)
    elif (line.type == "ELLIPSE"):
        data = extractEllipseData(line)
        controller = rpp_follow_controller_
    
    // 2. 检查是否转场路径
    if (line.is_transition):
        跳过喷码和步进电机
    
    // 3. 控制步进电机
    if (use_stepper):
        controlStepperMotor(forward/reverse)
    
    // 4. 喷码机
    if (is_drawing):
        inkjet_client_->start()
        inkjet_client_->change_mode(line.ink_mode)
    
    // 5. 设置路径
    controller->setPlan(data)
    
    // 6. 运动控制循环
    rate = 50Hz
    while (!controller->isGoalReached() && !cancel_requested):
        checkPauseState()      // 阻塞等待恢复
        cmd_vel = controller->computeVelocityCommands(current_pose, current_speed)
        cmd_vel_pub_->publish(cmd_vel)
        feedback.current_id = current_path_id
        goal_handle->publish_feedback(feedback)
        rate.sleep()
    
    // 7. 喷码停止
    if (is_drawing):
        inkjet_client_->stop()
    
    // 8. 检查取消
    if (cancel_requested):
        goal_handle->abort()
        return
  
  goal_handle->succeed()
```

### 2.3 `checkPauseState()` — 暂停检查

```
checkPauseState():
  if !is_paused_: return
  while is_paused_ and !cancel_requested:
      sleep(100ms)  // 阻塞等待
```

### 2.4 JSON解析方法

| 方法 | 解析内容 |
|------|----------|
| `extractLineData()` | start_xy, end_xy, backward |
| `extractCircleData()` | center_xy, radius, start_xy |
| `extractArcData()` | center_xy, radius, start_angle, end_angle |
| `extractSplineData()` | vertices[], degree, knots, weights |
| `extractEllipseData()` | center, major_axis, ratio, start_angle, end_angle, rotation |

## 3. 执行状态管理

| 变量 | 说明 |
|------|------|
| `is_executing_` | 是否正在执行 |
| `is_paused_` | 是否暂停 (阻塞控制循环) |
| `current_layer_id` | 当前执行路径ID |
| `current_ink_mode_` | solid / dashed / text |
| `is_transition_path_` | 转场路径 (不喷码) |
| `use_stepper_for_current_path_` | 是否需要步进电机 |
