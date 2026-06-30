---
标题: 文件rclone备份到百度网盘方案
创建时间: 2026-06-05
修改时间: 2026-06-05
---

```
AList 管理员账号：admin
你刚刚设置的密码：YourPassword123
AList 登录密码:YourPassword123
```

#### 获取刷新令牌
![[Pasted image 20260605223344.png]]

client_id: hq9yQ9w9kR4YHj1kyYafLygVocobh7Sf

client_secret: YH2VpZcFJHYNnV6vLfHQXDBhcE7ZChyE

redirect_uri: https://alistgo.com/tool/baidu/callback

refresh_token:

```
122.4fcaa2ae04eeadeb2eea3891b0511b84.Y3F0kWqAdba0culfklCOMXnqIW_iAwRwGTxCPv-.m_D9ww
```

#### rclone设置

```
jack@jack:~/a_applicantions/alist-linux-amd64$ rclone config show baidu
--------------------
[baidu]
type = webdav
url = http://127.0.0.1:5244/dav/baidu
vendor = other
user = admin
pass = *** ENCRYPTED ***
--------------------
jack@jack:~/a_applicantions/alist-linux-amd64$ rclone lsd baidu:
          -1 2026-02-03 14:15:25        -1 11
          -1 2026-05-02 17:42:36        -1 59-八零暖妻：悔过老公宠上天（78集）
          -1 2026-06-05 22:35:48        -1 jack_ubuntu
          -1 2026-01-04 11:17:01        -1 ps
          -1 2025-11-09 12:09:50        -1 test
          -1 2025-06-01 19:00:34        -1 云一朵知识问答
          -1 2026-06-04 16:45:03        -1 我的资源
          -1 2025-10-25 15:56:07        -1 文档加工
          -1 2024-08-15 11:35:21        -1 来自：2203121C
          -1 2025-08-23 01:18:07        -1 来自：AI笔记
          -1 2020-02-11 14:53:03        -1 来自：CUN-AL00
          -1 2023-03-16 19:20:29        -1 来自：GOT-W09
          -1 2021-04-09 11:01:11        -1 来自：JEF-AN00
          -1 2024-06-24 16:49:01        -1 来自：Office
          -1 2020-02-12 19:01:30        -1 来自：Readboy_G90
          -1 2023-07-07 23:35:09        -1 来自：SM-X800
          -1 2022-06-11 12:42:24        -1 来自：微信备份
          -1 2025-02-26 10:33:05        -1 来自：本地电脑
          -1 2024-05-30 12:34:27        -1 来自：流畅播视频
          -1 2023-03-18 21:22:05        -1 来自：百度App
          -1 2024-08-07 10:50:23        -1 来自：简单听记
          -1 2025-11-09 17:19:18        -1 杰的备份
          -1 2026-01-04 01:20:10        -1 杰的资料
          -1 2026-03-11 16:47:30        -1 百度云解压
          -1 2025-05-10 00:32:46        -1 苏的资源
          -1 2025-06-01 23:05:53        -1 音乐
jack@jack:~/a_applicantions/alist-linux-amd64$ 

```

## Ubuntu 22.04 使用 AList + rclone 连接百度网盘备份 Obsidian 操作日记

### 一、这次操作的最终目标

这次配置的目标不是 GitHub 同步，而是给 Ubuntu 上的 Obsidian 知识库做一个**完整百度网盘备份方案**。

最终方案是：

```text
AList 负责连接百度网盘
rclone 负责把本地文件夹复制到百度网盘
百度网盘负责保存完整备份
```

最终备份对象是本地 Obsidian 文件夹：

```bash
/home/jack/a_document/obsidian/obsidian__ubuntu__project
```

最终备份到百度网盘的位置是：

```text
百度网盘 / jack_ubuntu / obsidian__ubuntu__project
```

在 rclone 里的远程路径写法是：

```bash
baidu:jack_ubuntu/obsidian__ubuntu__project
```

这套方案的核心作用是：

```text
GitHub 用来做笔记版本同步
百度网盘用来做完整文件夹备份
AList 把百度网盘转换成 WebDAV
rclone 通过 WebDAV 访问百度网盘
```

---

### 二、为什么要用 AList + rclone

rclone 本身是一个非常强大的命令行网盘同步工具，但普通百度网盘个人版并不是 rclone 官方稳定支持的后端。

所以这次采用的方案是：

```text
百度网盘
↓
AList 挂载百度网盘
↓
AList 提供 WebDAV 地址
↓
rclone 连接 AList WebDAV
↓
rclone 上传本地 Obsidian 文件夹
```

这样做的好处是：

```text
不用依赖百度网盘 Linux 客户端
可以用命令行备份整个文件夹
可以写成脚本一键备份
可以控制是否排除 .git、.trash 等目录
比实时同步更可控，不容易出现误删同步
```

---

### 三、AList 程序所在目录

这次 AList 放在了这个目录：

```bash
/home/jack/a_applicantions/alist-linux-amd64
```

目录中只有一个主要可执行文件：

```bash
alist
```

当时查看目录：

```bash
cd /home/jack/a_applicantions/alist-linux-amd64
ls
```

输出为：

```text
alist
```

这个文件就是 AList 主程序。

---

### 四、给 AList 添加执行权限

进入 AList 目录：

```bash
cd /home/jack/a_applicantions/alist-linux-amd64
```

给 `alist` 添加执行权限：

```bash
chmod +x alist
```

查看 AList 是否能运行：

```bash
./alist
```

如果出现类似下面内容，说明 AList 可执行文件正常：

```text
A file list program that supports multiple storage,
built with love by Xhofe and friends in Go/Solid.js.

Usage:
  alist [command]
```

常见可用命令包括：

```text
admin       管理管理员账户
server      启动 AList 服务
start       静默启动
stop        停止服务
restart     重启服务
version     查看版本
```

---

### 五、创建 AList 数据目录

AList 需要一个数据目录保存配置、数据库、账号信息、挂载信息等内容。

这次使用的数据目录是：

```bash
/home/jack/a_applicantions/alist-linux-amd64/data
```

创建命令：

```bash
cd /home/jack/a_applicantions/alist-linux-amd64
mkdir -p data
```

以后 AList 的配置文件一般会在：

```bash
/home/jack/a_applicantions/alist-linux-amd64/data/config.json
```

---

### 六、手动启动 AList 测试

先进入 AList 目录：

```bash
cd /home/jack/a_applicantions/alist-linux-amd64
```

手动启动 AList：

```bash
./alist server --data /home/jack/a_applicantions/alist-linux-amd64/data
```

启动成功后，浏览器访问：

```text
http://127.0.0.1:5244
```

如果网页能打开，说明 AList 服务正常运行。

如果是在终端中手动启动的，终端窗口不能关闭。
如果要停止手动运行，按：

```text
Ctrl + C
```

---

### 七、查看 AList 管理员账号

查看管理员账号信息：

```bash
cd /home/jack/a_applicantions/alist-linux-amd64
./alist admin --data /home/jack/a_applicantions/alist-linux-amd64/data
```

当时终端输出大意是：

```text
Admin user's username: admin
The password can only be output at the first startup,
and then stored as a hash value, which cannot be reversed.
```

意思是：

```text
管理员用户名是 admin
初始密码只会在第一次启动时显示
之后密码会加密保存，不能再反向查看
如果忘记密码，可以重新设置
```

---

### 八、设置 AList 管理员密码

设置管理员密码命令格式：

```bash
./alist admin set "你的新密码" --data /home/jack/a_applicantions/alist-linux-amd64/data
```

当时测试时使用过：

```bash
./alist admin set YourPassword123 --data /home/jack/a_applicantions/alist-linux-amd64/data
```

终端输出里显示：

```text
admin user has been updated
username: admin
password: YourPassword123
```

说明密码设置成功。

当时还出现过警告：

```text
connect: connection refused
```

这个警告的意思是：

```text
设置密码时 AList 服务还没有运行
所以它没法通知正在运行的 AList 服务刷新缓存
但密码本身已经设置成功
```

如果后续修改密码，建议修改后重启 AList：

```bash
sudo systemctl restart alist
```

---

### 九、创建 AList systemd 后台服务

为了让 AList 像系统服务一样后台运行，并且开机自启，需要创建 systemd 服务。

创建服务文件：

```bash
sudo nano /etc/systemd/system/alist.service
```

写入以下内容：

```ini
[Unit]
Description=AList Service
After=network.target

[Service]
Type=simple
User=jack
WorkingDirectory=/home/jack/a_applicantions/alist-linux-amd64
ExecStart=/home/jack/a_applicantions/alist-linux-amd64/alist server --data /home/jack/a_applicantions/alist-linux-amd64/data
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

保存方式：

```text
Ctrl + O
回车
Ctrl + X
```

配置解释：

```text
User=jack
表示用 jack 用户运行 AList。

WorkingDirectory
表示 AList 的工作目录。

ExecStart
表示启动 AList 的命令。

Restart=on-failure
表示服务异常退出后自动重启。

WantedBy=multi-user.target
表示可以设置开机自启。
```

---

### 十、启动并设置 AList 开机自启

重新加载 systemd 配置：

```bash
sudo systemctl daemon-reload
```

设置 AList 开机自启：

```bash
sudo systemctl enable alist
```

立即启动 AList：

```bash
sudo systemctl start alist
```

查看运行状态：

```bash
sudo systemctl status alist
```

如果看到：

```text
active (running)
```

说明 AList 已经后台运行成功。

---

### 十一、AList 常用服务管理命令

启动 AList：

```bash
sudo systemctl start alist
```

停止 AList：

```bash
sudo systemctl stop alist
```

重启 AList：

```bash
sudo systemctl restart alist
```

查看 AList 状态：

```bash
sudo systemctl status alist
```

查看 AList 实时日志：

```bash
journalctl -u alist -f
```

查看最近 50 行日志：

```bash
journalctl -u alist -n 50 --no-pager
```

设置开机自启：

```bash
sudo systemctl enable alist
```

取消开机自启：

```bash
sudo systemctl disable alist
```

---

### 十二、把 AList 做成 Ubuntu 桌面程序

AList 本质上是本地网页服务，不是传统图形软件。

所以“做成桌面程序”的方式是：

```text
后台 systemd 自动运行 AList
桌面图标负责打开 http://127.0.0.1:5244
应用菜单也可以搜索 AList 打开
```

---

### 十三、创建 AList 桌面图标

执行：

```bash
DESKTOP_DIR="$(xdg-user-dir DESKTOP 2>/dev/null || echo "$HOME/桌面")"

cat > "$DESKTOP_DIR/AList.desktop" <<'EOF'
[Desktop Entry]
Type=Application
Name=AList 百度网盘备份
Comment=打开本机 AList 管理页面
Exec=xdg-open http://127.0.0.1:5244
Icon=folder-cloud
Terminal=false
Categories=Network;Utility;
EOF

chmod +x "$DESKTOP_DIR/AList.desktop"

gio set "$DESKTOP_DIR/AList.desktop" metadata::trusted true 2>/dev/null || true
```

执行后，桌面会出现：

```text
AList 百度网盘备份
```

双击后会打开：

```text
http://127.0.0.1:5244
```

如果 Ubuntu 提示“不受信任启动器”，右键图标，选择：

```text
允许启动
```

---

### 十四、创建 AList 应用菜单入口

为了可以在 Ubuntu 应用菜单里搜索 AList，创建本地应用入口：

```bash
mkdir -p ~/.local/share/applications

cat > ~/.local/share/applications/alist.desktop <<'EOF'
[Desktop Entry]
Type=Application
Name=AList 百度网盘备份
Comment=打开本机 AList 管理页面
Exec=xdg-open http://127.0.0.1:5244
Icon=folder-cloud
Terminal=false
Categories=Network;Utility;
EOF

chmod +x ~/.local/share/applications/alist.desktop

update-desktop-database ~/.local/share/applications 2>/dev/null || true
```

以后可以按：

```text
Super 键
搜索 AList
```

打开 AList 管理页面。

---

### 十五、进入 AList 网页后台

AList 后台地址：

```text
http://127.0.0.1:5244
```

登录信息：

```text
用户名：admin
密码：自己设置的 AList 管理员密码
```

进入后左侧能看到：

```text
个人资料
设置
任务
角色
用户
会话
分享
存储
元信息
索引
备份 & 恢复
关于
文档
主页
```

添加百度网盘需要进入：

```text
存储
→ 添加
```

---

### 十六、AList 添加百度网盘存储

在 AList 后台：

```text
管理
→ 存储
→ 添加
```

驱动选择：

```text
百度网盘
```

这次配置里关键字段如下。

挂载路径：

```text
/baidu
```

这个意思是：
以后 AList 首页会出现一个 `baidu` 目录。

rclone 访问这个目录时，WebDAV 地址就是：

```text
http://127.0.0.1:5244/dav/baidu
```

序号：

```text
0
```

缓存过期时间：

```text
30
```

WebDAV 策略：

```text
302 重定向
```

下载代理 URL：

```text
留空
```

根文件夹路径：

```text
/
```

这个表示挂载百度网盘根目录。

如果以后遇到权限问题，可以考虑改成：

```text
/apps/alist
```

但当前已经能成功列出百度网盘根目录，所以用 `/` 是可以的。

---

### 十七、百度网盘刷新令牌说明

AList 挂载百度网盘时，最关键的是：

```text
刷新令牌
```

刷新令牌不是随便网上找一个填进去，而是需要自己登录百度账号授权生成。

获取思路：

```text
打开 AList 官方百度网盘驱动文档
找到“刷新令牌”
点击获取
登录百度账号
完成授权
复制 refresh_token
粘贴回 AList 的刷新令牌栏
保存
```

注意事项：

```text
不要在不可信第三方网站输入百度账号密码
优先从 AList 官方文档里的授权入口获取
刷新令牌属于敏感信息，不要写进公开笔记和 GitHub 仓库
```

---

### 十八、AList 百度网盘挂载成功标志

保存百度网盘存储后，回到 AList 首页。

如果看到：

```text
baidu
```

点进去能看到百度网盘文件夹，说明挂载成功。

当时百度网盘根目录能被 rclone 列出，说明 AList 挂载成功。

---

### 十九、安装 rclone

安装 rclone：

```bash
sudo apt update
sudo apt install -y rclone
```

查看版本：

```bash
rclone version
```

rclone 的作用是：

```text
用命令行复制、同步、查看远程网盘内容
```

这次 rclone 连接的是 AList 提供的 WebDAV，不是直接连接百度网盘。

---

### 二十、rclone 配置 AList WebDAV

执行配置命令：

```bash
rclone config
```

新建 remote：

```text
n
```

远程名称填写：

```text
baidu
```

存储类型选择：

```text
WebDAV
```

当时界面里 WebDAV 编号是：

```text
31
```

也可以直接输入：

```text
webdav
```

URL 填写：

```text
http://127.0.0.1:5244/dav/baidu
```

这里非常重要：

```text
只输入 http://127.0.0.1:5244/dav/baidu
不要把提示符 url> 也输入进去
```

Vendor 选择：

```text
Other site/service or software
```

当时编号是：

```text
4
```

用户名填写：

```text
admin
```

密码选择：

```text
y
```

然后输入 AList 登录密码。

注意：

```text
这里不是百度网盘密码
这里是 AList 网页后台的登录密码
```

bearer_token：

```text
直接回车跳过
```

高级配置：

```text
n
```

保存配置：

```text
y
```

退出配置：

```text
q
```

---

### 二十一、检查 rclone 配置

查看 baidu 配置：

```bash
rclone config show baidu
```

正确结果应类似：

```ini
[baidu]
type = webdav
url = http://127.0.0.1:5244/dav/baidu
vendor = other
user = admin
pass = *** ENCRYPTED ***
```

必须确认：

```text
url = http://127.0.0.1:5244/dav/baidu
user = admin
```

---

### 二十二、rclone 配置错误一：URL 填错

曾经出现错误：

```text
Propfind "url%3E/": unsupported protocol scheme ""
```

原因是：

```text
在 rclone config 的 URL 输入步骤里，把提示符 url> 也输入进去了
导致 rclone 保存的 URL 不是 http://127.0.0.1:5244/dav/baidu
而是类似 url>
```

错误表现：

```text
unsupported protocol scheme ""
```

解决方法：

```bash
rclone config delete baidu
rclone config
```

重新配置时，URL 只填：

```text
http://127.0.0.1:5244/dav/baidu
```

---

### 二十三、rclone 配置错误二：用户名填错

曾经出现错误：

```text
401 Unauthorized
```

检查配置：

```bash
rclone config show baidu
```

发现错误配置是：

```ini
user = other
```

正确应该是：

```ini
user = admin
```

原因是：

```text
vendor 选择了 other
但后面的 user name 也误填成了 other
```

解决方法：

```bash
rclone config delete baidu
rclone config
```

重新配置时：

```text
vendor 选 other
user name 填 admin
password 填 AList 登录密码
```

---

### 二十四、rclone 连接成功标志

执行：

```bash
rclone lsd baidu:
```

成功后列出了百度网盘目录，例如：

```text
11
59-八零暖妻：悔过老公宠上天（78集）
jack_ubuntu
ps
test
云一朵知识问答
我的资源
文档加工
杰的备份
杰的资料
音乐
```

这说明：

```text
rclone 已经成功连接 AList WebDAV
AList 已经成功连接百度网盘
baidu: 这个远程名称可以正常使用
```

---

### 二十五、确认百度网盘目标目录

百度网盘中已有目标目录：

```text
jack_ubuntu
```

rclone 里查看：

```bash
rclone lsd baidu:
```

输出中出现：

```text
jack_ubuntu
```

说明目标目录已经存在。

如果以后目标目录不存在，可以创建：

```bash
rclone mkdir baidu:jack_ubuntu
```

---

### 二十六、先用 dry-run 预演备份

第一次备份前，先用 `--dry-run` 预演，不真正上传：

```bash
rclone copy /home/jack/a_document/obsidian/obsidian__ubuntu__project baidu:jack_ubuntu/obsidian__ubuntu__project --dry-run
```

当时终端输出很多：

```text
skipped copy as --dry-run is set
```

这不是错误。

意思是：

```text
因为加了 --dry-run
所以 rclone 只模拟上传
没有真正复制任何文件
```

dry-run 的作用：

```text
提前看 rclone 准备上传哪些文件
检查路径是否正确
避免第一次就误传到错误目录
```

---

### 二十七、dry-run 中看到 .git 文件的原因

预演时看到很多：

```text
.git/objects/...
```

这些是 Git 仓库内部对象文件。

`.git` 目录的作用是：

```text
保存 Git 历史记录
保存提交对象
保存分支信息
保存远程仓库信息
```

但是百度网盘备份时不建议上传 `.git`，原因：

```text
.git 文件数量非常多
占用空间较多
备份速度慢
Git 历史已经由 GitHub 管理
百度网盘主要备份 Obsidian 文件本体和附件
```

所以正式备份时应该排除：

```bash
--exclude ".git/**"
```

---

### 二十八、正式备份 Obsidian 到百度网盘

推荐正式备份命令：

```bash
rclone copy /home/jack/a_document/obsidian/obsidian__ubuntu__project baidu:jack_ubuntu/obsidian__ubuntu__project \
  --exclude ".git/**" \
  --progress
```

这个命令的含义是：

```text
把本地 Obsidian 文件夹复制到百度网盘 jack_ubuntu/obsidian__ubuntu__project 目录
排除 .git 文件夹
显示上传进度
```

最终百度网盘路径是：

```text
百度网盘 / jack_ubuntu / obsidian__ubuntu__project
```

---

### 二十九、更稳的正式备份命令

为了更稳定，推荐使用这个版本：

```bash
rclone copy /home/jack/a_document/obsidian/obsidian__ubuntu__project baidu:jack_ubuntu/obsidian__ubuntu__project \
  --exclude ".git/**" \
  --exclude ".trash/**" \
  --transfers 2 \
  --checkers 4 \
  --retries 5 \
  --low-level-retries 10 \
  --progress
```

参数解释：

```text
--exclude ".git/**"
排除 Git 内部历史文件。

--exclude ".trash/**"
排除 Obsidian 回收站。

--transfers 2
同时上传 2 个文件，速度适中，更稳定。

--checkers 4
同时检查 4 个文件。

--retries 5
上传失败后重试 5 次。

--low-level-retries 10
底层网络失败时重试 10 次。

--progress
显示实时上传进度。
```

---

### 三十、copy 和 sync 的区别

当前推荐使用：

```bash
rclone copy
```

`copy` 的特点：

```text
本地新增文件会上传
本地修改文件会更新到远程
本地删除文件不会删除远程文件
```

适合：

```text
备份
防误删
长期保存
```

暂时不推荐一开始使用：

```bash
rclone sync
```

`sync` 的特点：

```text
让远程和本地完全一致
本地删除文件后，远程也会删除
```

风险：

```text
如果本地误删文件，再执行 sync，百度网盘里的备份也可能被删掉
```

所以当前策略：

```text
Obsidian 到百度网盘备份使用 copy
不要轻易使用 sync
```

---

### 三十一、上传完成后的检查命令

查看百度网盘 `jack_ubuntu` 目录：

```bash
rclone lsd baidu:jack_ubuntu
```

查看备份目录中的文件：

```bash
rclone ls baidu:jack_ubuntu/obsidian__ubuntu__project | head
```

如果能看到 Obsidian 里的 `.md` 文件、文件夹、附件等，说明备份成功。

也可以查看某个目录：

```bash
rclone lsd baidu:jack_ubuntu/obsidian__ubuntu__project
```

---

### 三十二、创建一键备份脚本

为了以后不用每次复制长命令，创建一键备份脚本。

创建脚本目录：

```bash
mkdir -p /home/jack/a_script
```

创建脚本文件：

```bash
nano /home/jack/a_script/backup_obsidian_to_baidu.sh
```

写入以下内容：

```bash
#!/usr/bin/env bash
set -e

LOCAL_DIR="/home/jack/a_document/obsidian/obsidian__ubuntu__project"
REMOTE_DIR="baidu:jack_ubuntu/obsidian__ubuntu__project"
LOG_DIR="/home/jack/a_document/rclone_logs"
LOG_FILE="$LOG_DIR/obsidian_baidu_backup_$(date +%F_%H-%M-%S).log"

mkdir -p "$LOG_DIR"

echo "开始备份 Obsidian 到百度网盘"
echo "本地目录：$LOCAL_DIR"
echo "远程目录：$REMOTE_DIR"
echo "日志文件：$LOG_FILE"

rclone copy "$LOCAL_DIR" "$REMOTE_DIR" \
  --exclude ".git/**" \
  --exclude ".trash/**" \
  --transfers 2 \
  --checkers 4 \
  --retries 5 \
  --low-level-retries 10 \
  --log-file "$LOG_FILE" \
  --log-level INFO \
  --progress

echo "备份完成"
```

保存：

```text
Ctrl + O
回车
Ctrl + X
```

添加执行权限：

```bash
chmod +x /home/jack/a_script/backup_obsidian_to_baidu.sh
```

以后只需要执行：

```bash
/home/jack/a_script/backup_obsidian_to_baidu.sh
```

---

### 三十三、一键备份脚本的作用

脚本会自动完成：

```text
读取本地 Obsidian 目录
连接 baidu: 远程
复制到 jack_ubuntu/obsidian__ubuntu__project
排除 .git
排除 .trash
自动重试
显示进度
保存日志
```

日志保存目录：

```bash
/home/jack/a_document/rclone_logs
```

日志文件格式：

```text
obsidian_baidu_backup_年-月-日_时-分-秒.log
```

---

### 三十四、以后恢复备份的方法

如果以后需要从百度网盘恢复，不要直接覆盖原目录，先恢复到新目录。

创建恢复目录：

```bash
mkdir -p /home/jack/a_document/obsidian_restore
```

从百度网盘下载：

```bash
rclone copy baidu:jack_ubuntu/obsidian__ubuntu__project /home/jack/a_document/obsidian_restore --progress
```

确认恢复内容无误后，再手动替换原 Obsidian 目录。

---

### 三十五、当前最重要的路径记录

AList 程序目录：

```bash
/home/jack/a_applicantions/alist-linux-amd64
```

AList 可执行文件：

```bash
/home/jack/a_applicantions/alist-linux-amd64/alist
```

AList 数据目录：

```bash
/home/jack/a_applicantions/alist-linux-amd64/data
```

AList 网页地址：

```text
http://127.0.0.1:5244
```

Obsidian 本地目录：

```bash
/home/jack/a_document/obsidian/obsidian__ubuntu__project
```

rclone 远程名称：

```bash
baidu:
```

百度网盘备份目标：

```bash
baidu:jack_ubuntu/obsidian__ubuntu__project
```

一键备份脚本：

```bash
/home/jack/a_script/backup_obsidian_to_baidu.sh
```

日志目录：

```bash
/home/jack/a_document/rclone_logs
```

---

### 三十六、当前最重要的检查命令

检查 AList 服务状态：

```bash
sudo systemctl status alist
```

重启 AList：

```bash
sudo systemctl restart alist
```

查看 AList 日志：

```bash
journalctl -u alist -f
```

查看 rclone 配置：

```bash
rclone config show baidu
```

检查百度网盘是否连通：

```bash
rclone lsd baidu:
```

查看百度网盘 jack_ubuntu 目录：

```bash
rclone lsd baidu:jack_ubuntu
```

查看备份目录文件：

```bash
rclone ls baidu:jack_ubuntu/obsidian__ubuntu__project | head
```

执行一键备份：

```bash
/home/jack/a_script/backup_obsidian_to_baidu.sh
```

---

### 三十七、当前最终推荐备份命令

如果不用脚本，就直接执行这个命令：

```bash
rclone copy /home/jack/a_document/obsidian/obsidian__ubuntu__project baidu:jack_ubuntu/obsidian__ubuntu__project \
  --exclude ".git/**" \
  --exclude ".trash/**" \
  --transfers 2 \
  --checkers 4 \
  --retries 5 \
  --low-level-retries 10 \
  --progress
```

这个命令是目前最推荐的正式备份命令。

---

### 三十八、这次配置完成后的日常使用方式

平时写完 Obsidian 后，如果想完整备份到百度网盘，就执行：

```bash
/home/jack/a_script/backup_obsidian_to_baidu.sh
```

如果只是临时手动备份，也可以执行：

```bash
rclone copy /home/jack/a_document/obsidian/obsidian__ubuntu__project baidu:jack_ubuntu/obsidian__ubuntu__project \
  --exclude ".git/**" \
  --exclude ".trash/**" \
  --transfers 2 \
  --checkers 4 \
  --retries 5 \
  --low-level-retries 10 \
  --progress
```

备份完成后用下面命令检查：

```bash
rclone lsd baidu:jack_ubuntu
```

或者：

```bash
rclone ls baidu:jack_ubuntu/obsidian__ubuntu__project | head
```

---

### 三十九、以后遇到问题时的排查顺序

如果 rclone 不能连接百度网盘，先检查 AList 是否运行：

```bash
sudo systemctl status alist
```

如果 AList 没运行：

```bash
sudo systemctl start alist
```

如果 AList 运行正常，检查浏览器能不能打开：

```text
http://127.0.0.1:5244
```

如果网页能打开，再检查 rclone 配置：

```bash
rclone config show baidu
```

重点看：

```text
url 是否是 http://127.0.0.1:5244/dav/baidu
user 是否是 admin
```

如果用户名或 URL 错了，删除配置重新来：

```bash
rclone config delete baidu
rclone config
```

如果出现：

```text
401 Unauthorized
```

优先检查：

```text
用户名是不是 admin
密码是不是 AList 登录密码
不是百度网盘密码
```

如果出现：

```text
unsupported protocol scheme
```

优先检查：

```text
URL 是否填错
是否把 url> 这种提示符也输进去了
```

如果 AList 里百度网盘打不开，检查：

```text
百度网盘刷新令牌是否失效
AList 存储配置是否保存成功
挂载路径是否仍是 /baidu
```

---

### 四十、最终记忆口诀

```text
AList 负责挂载百度网盘。
rclone 负责复制本地文件夹。
baidu: 是 rclone 里的百度网盘远程名。
jack_ubuntu 是百度网盘里的目标备份文件夹。
copy 是备份，sync 是镜像。
备份优先用 copy，不轻易用 sync。
正式备份排除 .git 和 .trash。
```

当前最重要的一句话：

```text
以后备份 Obsidian 到百度网盘，就运行 /home/jack/a_script/backup_obsidian_to_baidu.sh
```
