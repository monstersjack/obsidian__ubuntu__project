---
标题: Ubuntu 通过 can0 控制左轮 ID2 的完整命令
创建时间: 2026-07-05
修改时间: 2026-07-05
---

下面是一套 **Ubuntu 通过 `can0` 控制左轮 ID2** 的完整命令，直接复制执行即可。

```bash
sudo ip link set can0 down
sudo ip link set can0 type can bitrate 1000000 restart-ms 100
sudo ip link set can0 up

# 停止所有电机
cansend can0 032#0000000000000000

# 使能左轮 ID2
cansend can0 105#000A000000000000

# 设置左轮 ID2 为速度环
cansend can0 105#0002000000000000

# 设置左轮 ID2 主动反馈 10ms
cansend can0 106#000A000000000000

# 左轮 ID2 正转 30RPM，持续 2 秒
for i in {1..100}; do cansend can0 032#0000012C00000000; sleep 0.02; done

# 停止
cansend can0 032#0000000000000000

# 左轮 ID2 反转 30RPM，持续 2 秒
for i in {1..100}; do cansend can0 032#0000FED400000000; sleep 0.02; done

# 停止
cansend can0 032#0000000000000000
```

另开一个终端监听反馈：

```bash
candump can0
```

正常左轮 ID2 应该看到：

```text
can0 098 [8] ... ... ... ... ... ... ... 02
```