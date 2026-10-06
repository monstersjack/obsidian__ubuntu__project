# 08-05 - execution_events.py 详解

> **完整路径**: `ros_pack/xline_server/communications/websocket/execution_events.py`  
> **语言**: Python 3.10  
> **重要性**: ★★★ (执行编排核心)

---

## 1. 功能概述

执行编排的核心文件，处理 `execute_plan` WebSocket事件，实现完整的离线路径规划顺序下发流程。

## 2. 核心事件处理

### 2.1 `execute_plan` 事件 ★★★

```
@socketio.on('execute_plan')
def handle_execute_plan(data):
    plan_path = data['plan_path']
    plan_uid = data.get('plan_uid', f'plan_{timestamp}')
    
    # 1. 校验
    if not plan_path:
        emit('error', {'message': '缺少plan_path'})
        return
    
    if not os.path.exists(full_path):
        emit('error', {'message': '计划文件不存在'})
        return
    
    plan = json.load(open(full_path))
    
    # 2. 检查队列占用
    if execution_manager.is_busy():
        emit('plan_rejected', {'reason': '队列忙'})
        return
    
    # 3. 补齐字段
    for i, line in enumerate(plan['lines']):
        line.setdefault('id', f'line_{i}')
        line.setdefault('planned_order', i+1)
        line.setdefault('execution_status', 'pending')
    
    # 4. 姿态校正
    emit('calibration_start')
    calib_result = call_calibration_service()
    if not calib_result.success:
        emit('plan_rejected', {'reason': '校准失败'})
        return
    emit('calibration_success')
    
    # 5. 逐条下发
    emit('plan_accepted')
    emit('execution_start', {'total_lines': len(plan['lines'])})
    
    for i, line in enumerate(plan['lines']):
        # 检查暂停事件
        if _sequence_pause_event.is_set():
            _sequence_pause_event.wait()
        
        # 检查取消事件
        if _sequence_cancel_event.is_set():
            emit('plan_cancelled')
            return
        
        emit('task_start', {'id': line['id'], 'order': i+1})
        
        # 构造单条Goal
        single_goal = {'lines': [line]}
        result = execution_manager.send_goal_sync(json.dumps(single_goal), plan_uid)
        
        if result.success:
            emit('task_complete', {'id': line['id']})
        else:
            emit('task_failed', {'id': line['id'], 'error': result.error_msg})
    
    emit('execution_complete')
    emit('plan_complete')
```

### 2.2 `pause_plan` — 暂停

```
设置 _sequence_pause_event
调用 controller.pause() → 暂停当前路径 + 阻止后续下发
emit('status_change', {'status': 'paused'})
```

### 2.3 `resume_plan` — 恢复

```
清除 _sequence_pause_event
调用 controller.resume() → 恢复当前路径
emit('status_change', {'status': 'executing'})
```

### 2.4 `cancel_plan` — 取消

```
设置 _sequence_cancel_event → 阻止后续下发
清除 _sequence_pause_event
调用 execution_manager.cancel_goal()
emit('status_change', {'status': 'canceling'})
```

## 3. 线程安全设计

```
两个 threading.Event 控制顺序下发:

_sequence_cancel_event (取消)
  set() → 阻止后续路径下发
  通过 cancel_plan 事件设置
  在每次循环开始时检查

_sequence_pause_event (暂停)
  set() → 暂停下发后续路径
  wait() → 阻塞当前下发线程
  通过 pause_plan 设置, resume_plan 清除
```

## 4. 完整事件序列

```
客户端发送: execute_plan
  → plan_accepted
  → calibration_start → calibration_success
  → execution_start {total_lines}
  → [循环每条]:
      task_start {id, order}
      line_execution_status {id, status: "executing"}
      task_complete / task_failed
  → execution_complete
  → plan_complete
```

## 5. 错误处理

- 缺少 plan_path → `error` 事件
- 文件不存在 → `error` 事件
- 队列忙 → `plan_rejected`
- 校准失败 → `plan_rejected`
- JSON解析失败 → `error` 事件
- 执行失败 → `execution_complete` + `plan_failed`
