# 08-08 - __main__.py 详解

> **完整路径**: `ros_pack/xline_server/__main__.py`  
> **语言**: Python 3.10  
> **重要性**: ★★ (系统启动入口)

---

## 1. 功能概述

xline_server 的主启动文件，按严格顺序初始化并启动所有服务组件。是整个系统的启动入口。

## 2. 10步启动流程

```
def main():
    # ① 重建文件索引
    rebuild_file_index()
    # 扫描 uploads/ 目录，建立文件数据库
    
    # ② 启动执行状态推送 TCP 服务器 (端口 9998)
    execution_status_server = ExecutionStatusServer(host, 9998)
    threading.Thread(target=execution_status_server.start, daemon=True)
    
    # ③ 启动系统监控
    system_monitor = SystemMonitor()
    system_monitor.start()
    
    # ④ 启动文件同步服务 (5秒轮询)
    sync_service = SyncService(interval=5)
    threading.Thread(target=sync_service.start, daemon=True)
    
    # ⑤ ROS2 初始化
    rclpy.init()
    
    # ⑥ 创建 ExecutionManager (ROS2 Node + Action Client)
    execution_manager = ExecutionManager()
    # 创建 execute_plan Action 客户端
    # 创建 pause/resume/calibrate Service 客户端
    
    # ⑦ 注册 WebSocket 事件处理器
    from communications.websocket import register_all_events
    register_all_events(socketio, execution_manager)
    # connection_events.py → connect/disconnect/heartbeat/join_room
    # execution_events.py → execute_plan/pause/resume/cancel/subscribe
    # file_events.py → subscribe_files/unsubscribe_files
    
    # ⑧ 启动 ROS2 executor 线程
    ros_executor = MultiThreadedExecutor()
    ros_executor.add_node(execution_manager)
    ros_thread = threading.Thread(
        target=lambda: ros_executor.spin(), daemon=True
    )
    
    # ⑨ 启动控制命令 TCP 服务器 (端口 9997)
    control_server = ControlCommandServer(host, 9997)
    threading.Thread(target=control_server.start, daemon=True)
    
    # ⑩ 启动 Flask + Socket.IO (端口 5000)
    socketio.run(app, host='0.0.0.0', port=5000, debug=False)
```

## 3. 信号处理 (优雅关闭)

```
def signal_handler(sig, frame):
    logger.info("正在关闭系统...")
    
    # 1. 停止 TCP 服务器
    execution_status_server.stop()
    control_server.stop()
    
    # 2. 停止 ROS2
    rclpy.shutdown()
    
    # 3. 停止同步服务
    sync_service.stop()
    
    # 4. 停止监控
    system_monitor.stop()
    
    logger.info("系统已关闭")
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)
```

## 4. 启动依赖顺序

```
启动顺序很重要，不能随意调整:

① → ② → ③ → ④ (独立服务，可并行)
    ↓
⑤ → ⑥ (必须先ROS2初始化才能创建节点)
    ↓
⑦ → ⑧ (必须先注册WebSocket事件才能启动executor)
    ↓
⑨ (必须在Flask之前启动)
    ↓
⑩ (最后启动，阻塞主线程)
```

## 5. 全局变量

```
app = Flask(__name__)
socketio = SocketIO(app, 
    cors_allowed_origins='*',
    async_mode='eventlet',
    ping_timeout=Config.SOCKETIO_PING_TIMEOUT,
    ping_interval=Config.SOCKETIO_PING_INTERVAL
)
execution_manager = None  # 运行时赋值

# 配置加载
app.config.from_object(Config)
CORS(app)
```

## 6. API Blueprint 注册 (在 create_app 中调用)

```
from api.files import files_bp
from api.execution import execution_bp
from api.planning import planning_bp
from api.monitoring import monitoring_bp
from api.sync import sync_bp

app.register_blueprint(files_bp, url_prefix='/api/v1/files')
app.register_blueprint(execution_bp, url_prefix='/api/v1/execution')
app.register_blueprint(planning_bp, url_prefix='/api/v1/planning')
app.register_blueprint(monitoring_bp, url_prefix='/api/v1/monitoring')
app.register_blueprint(sync_bp, url_prefix='/api/v1/sync')
```

## 7. 运行方式

```bash
# 开发模式
python3 -m xline_server

# 作为ROS2 launch的一部分
ros2 run xline_server xline_server

# 调试模式
python3 -m xline_server --debug
```

## 8. 注意事项

1. **启动顺序不可调整**: ⑩ 必须在最后，因为是阻塞调用
2. **ROS2 必须在 Flask 之前初始化**: rclpy 需要先 init
3. **所有 TCP 服务器都是守护线程**: daemon=True，主线程退出时自动停止
4. **信号处理**: 必须注册 SIGINT/SIGTERM 确保优雅关闭
5. **端口冲突**: 检查 5000/9998/9997 等端口是否被占用
