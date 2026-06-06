---
标题: rclone的同步命令
创建时间: 2026-06-05
修改时间: 2026-06-05
---

## rclone同步两个包的命令

下面这段就是你**每天手动运行一次**的日常同步命令。
作用：把这两个文件夹都备份到百度网盘 `jack_ubuntu` 目录下：

```text
1. /home/jack/a_document/obsidian/obsidian__ubuntu__project
2. /home/jack/a_document/黎博划线小车,资源包
```

直接整段复制到终端执行即可。

```bash
# 1. 检查 AList 服务是否正在运行，rclone 需要通过 AList 连接百度网盘
sudo systemctl status alist

# 2. 启动 AList 服务，如果已经运行，这一步执行也没关系
sudo systemctl start alist

# 3. 测试 rclone 是否能正常连接百度网盘
rclone lsd baidu:

# 4. 创建百度网盘 jack_ubuntu 目录，如果已经存在不会有影响
rclone mkdir "baidu:jack_ubuntu"

# 5. 同步备份 Obsidian 笔记库到百度网盘，排除 .git 和 .trash
rclone copy "/home/jack/a_document/obsidian/obsidian__ubuntu__project" "baidu:jack_ubuntu/obsidian__ubuntu__project" --exclude ".git/**" --exclude ".trash/**" --transfers 2 --checkers 4 --retries 5 --low-level-retries 10 --progress

# 6. 同步备份“黎博划线小车,资源包”到百度网盘
rclone copy "/home/jack/a_document/黎博划线小车,资源包" "baidu:jack_ubuntu/黎博划线小车,资源包" --transfers 2 --checkers 4 --retries 5 --low-level-retries 10 --progress

# 7. 查看百度网盘 jack_ubuntu 目录，确认两个备份文件夹是否存在
rclone lsd "baidu:jack_ubuntu"

# 8. 查看 Obsidian 备份目录的前几项文件，确认上传成功
rclone ls "baidu:jack_ubuntu/obsidian__ubuntu__project" | head

# 9. 查看“黎博划线小车,资源包”备份目录的前几项文件，确认上传成功
rclone ls "baidu:jack_ubuntu/黎博划线小车,资源包" | head

# 10. 查看 Obsidian 百度网盘备份大小
rclone size "baidu:jack_ubuntu/obsidian__ubuntu__project"

# 11. 查看“黎博划线小车,资源包”百度网盘备份大小
rclone size "baidu:jack_ubuntu/黎博划线小车,资源包"
```

日常最核心其实只需要运行这两条：

```bash
# 同步备份 Obsidian 笔记库
rclone copy "/home/jack/a_document/obsidian/obsidian__ubuntu__project" "baidu:jack_ubuntu/obsidian__ubuntu__project" --exclude ".git/**" --exclude ".trash/**" --transfers 2 --checkers 4 --retries 5 --low-level-retries 10 --progress

# 同步备份“黎博划线小车,资源包”
rclone copy "/home/jack/a_document/黎博划线小车,资源包" "baidu:jack_ubuntu/黎博划线小车,资源包" --transfers 2 --checkers 4 --retries 5 --low-level-retries 10 --progress
```

注意：这里用的是 `rclone copy`，不是 `rclone sync`。
`copy` 更适合日常备份，本地误删文件时，百度网盘不会跟着删除，更安全。


## rclone的同步命令
### rclone 常用同步 / 备份 / 查看命令大全

下面这些命令都是基于你现在已经配置好的环境：

```bash
# 本地 Obsidian 目录
/home/jack/a_document/obsidian/obsidian__ubuntu__project

# rclone 百度网盘远程名
baidu:

# 百度网盘目标目录
baidu:jack_ubuntu/obsidian__ubuntu__project
```

---

### 一、最常用：备份 Obsidian 到百度网盘

这是你以后最推荐用的命令：

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

作用：

```text
把本地 Obsidian 文件夹复制到百度网盘
排除 .git
排除 .trash
不会删除百度网盘已有文件
适合日常备份
```

---

### 二、第一次上传前预演，不真正上传

```bash
rclone copy /home/jack/a_document/obsidian/obsidian__ubuntu__project baidu:jack_ubuntu/obsidian__ubuntu__project \
  --exclude ".git/**" \
  --exclude ".trash/**" \
  --dry-run
```

作用：

```text
只模拟上传
不会真正复制文件
用于检查路径是否正确
```

如果看到：

```text
skipped copy as --dry-run is set
```

说明是预演模式，不是报错。

---

### 三、查看百度网盘根目录

```bash
rclone lsd baidu:
```

作用：

```text
列出百度网盘根目录下的文件夹
```

---

### 四、查看 jack_ubuntu 目录

```bash
rclone lsd baidu:jack_ubuntu
```

作用：

```text
查看百度网盘 jack_ubuntu 文件夹下面有哪些目录
```

---

### 五、查看 Obsidian 备份目录里的文件

```bash
rclone ls baidu:jack_ubuntu/obsidian__ubuntu__project | head
```

作用：

```text
查看已经上传到百度网盘的前几条文件记录
```

如果想看更多：

```bash
rclone ls baidu:jack_ubuntu/obsidian__ubuntu__project | less
```

---

### 六、创建百度网盘目录

```bash
rclone mkdir baidu:jack_ubuntu
```

创建 Obsidian 备份目录：

```bash
rclone mkdir baidu:jack_ubuntu/obsidian__ubuntu__project
```

---

### 七、只上传某一个文件

例如只上传一个 Markdown 文件：

```bash
rclone copyto "/home/jack/a_document/obsidian/obsidian__ubuntu__project/ubuntu电脑设置和配置.md" \
  "baidu:jack_ubuntu/obsidian__ubuntu__project/ubuntu电脑设置和配置.md" \
  --progress
```

作用：

```text
只复制单个文件
适合临时补传某个文件
```

---

### 八、只上传某一个文件夹

例如只上传 `c_我的ubuntu设置` 文件夹：

```bash
rclone copy "/home/jack/a_document/obsidian/obsidian__ubuntu__project/c_我的ubuntu设置" \
  "baidu:jack_ubuntu/obsidian__ubuntu__project/c_我的ubuntu设置" \
  --exclude ".git/**" \
  --exclude ".trash/**" \
  --progress
```

---

### 九、备份时排除更多目录

如果你以后还想排除 `.obsidian/cache`、临时目录等，可以这样：

```bash
rclone copy /home/jack/a_document/obsidian/obsidian__ubuntu__project baidu:jack_ubuntu/obsidian__ubuntu__project \
  --exclude ".git/**" \
  --exclude ".trash/**" \
  --exclude ".obsidian/workspace.json" \
  --exclude ".obsidian/workspace-mobile.json" \
  --exclude "*.tmp" \
  --exclude "*.bak" \
  --transfers 2 \
  --checkers 4 \
  --progress
```

---

### 十、完整镜像同步：慎用 sync

这个命令会让百度网盘和本地完全一致：

```bash
rclone sync /home/jack/a_document/obsidian/obsidian__ubuntu__project baidu:jack_ubuntu/obsidian__ubuntu__project \
  --exclude ".git/**" \
  --exclude ".trash/**" \
  --transfers 2 \
  --checkers 4 \
  --progress
```

注意：

```text
sync 会删除远端多余文件
如果本地误删文件，百度网盘也会跟着删除
不建议你日常使用
```

如果要用 sync，先 dry-run：

```bash
rclone sync /home/jack/a_document/obsidian/obsidian__ubuntu__project baidu:jack_ubuntu/obsidian__ubuntu__project \
  --exclude ".git/**" \
  --exclude ".trash/**" \
  --dry-run
```

确认无误后再去掉 `--dry-run`。

---

### 十一、安全版 sync：删除文件先移到备份目录

如果你以后真的想用 `sync`，建议用这个安全版：

```bash
rclone sync /home/jack/a_document/obsidian/obsidian__ubuntu__project baidu:jack_ubuntu/obsidian__ubuntu__project \
  --exclude ".git/**" \
  --exclude ".trash/**" \
  --backup-dir baidu:jack_ubuntu/deleted_backup/$(date +%F_%H-%M-%S) \
  --transfers 2 \
  --checkers 4 \
  --progress
```

作用：

```text
远端被 sync 删除的文件，不是直接消失
而是移动到 deleted_backup/日期时间 文件夹
更安全
```

---

### 十二、从百度网盘恢复到本地新目录

不要直接覆盖原 Obsidian，先恢复到新目录：

```bash
mkdir -p /home/jack/a_document/obsidian_restore
```

```bash
rclone copy baidu:jack_ubuntu/obsidian__ubuntu__project /home/jack/a_document/obsidian_restore \
  --progress
```

恢复完成后检查：

```bash
ls /home/jack/a_document/obsidian_restore
```

---

### 十三、查看本地和百度网盘差异

```bash
rclone check /home/jack/a_document/obsidian/obsidian__ubuntu__project baidu:jack_ubuntu/obsidian__ubuntu__project \
  --exclude ".git/**" \
  --exclude ".trash/**"
```

作用：

```text
检查本地和百度网盘备份是否一致
```

如果文件很多，可能比较慢。

---

### 十四、查看远程文件大小统计

统计百度网盘 Obsidian 备份大小：

```bash
rclone size baidu:jack_ubuntu/obsidian__ubuntu__project
```

统计本地 Obsidian 文件夹大小：

```bash
du -sh /home/jack/a_document/obsidian/obsidian__ubuntu__project
```

---

### 十五、删除百度网盘中的某个远程文件

谨慎使用。

```bash
rclone deletefile baidu:jack_ubuntu/obsidian__ubuntu__project/文件名.md
```

删除远程某个空文件夹：

```bash
rclone rmdir baidu:jack_ubuntu/obsidian__ubuntu__project/空文件夹名
```

删除远程整个目录，极其谨慎：

```bash
rclone purge baidu:jack_ubuntu/obsidian__ubuntu__project
```

`purge` 会删除整个目录，不建议随便用。

---

### 十六、把百度网盘目录挂载到本地

可以把百度网盘挂载成一个本地目录。

先创建挂载点：

```bash
mkdir -p /home/jack/a_mount/baidu
```

挂载：

```bash
rclone mount baidu: /home/jack/a_mount/baidu \
  --vfs-cache-mode writes
```

挂载后可以在文件管理器打开：

```bash
/home/jack/a_mount/baidu
```

如果终端不想被占用，可以后台运行：

```bash
nohup rclone mount baidu: /home/jack/a_mount/baidu \
  --vfs-cache-mode writes \
  > /home/jack/a_document/rclone_logs/baidu_mount.log 2>&1 &
```

卸载：

```bash
fusermount -u /home/jack/a_mount/baidu
```

如果提示没有 `fusermount`，安装：

```bash
sudo apt install -y fuse
```

---

### 十七、查看 rclone 远程配置

```bash
rclone config show baidu
```

正确结果应该类似：

```ini
[baidu]
type = webdav
url = http://127.0.0.1:5244/dav/baidu
vendor = other
user = admin
pass = *** ENCRYPTED ***
```

重点检查：

```text
url 必须是 http://127.0.0.1:5244/dav/baidu
user 必须是 admin
```

---

### 十八、修改 rclone 配置

进入配置界面：

```bash
rclone config
```

常见操作：

```text
n：新建 remote
e：编辑已有 remote
d：删除 remote
r：重命名 remote
q：退出
```

删除错误配置：

```bash
rclone config delete baidu
```

---

### 十九、测试 AList 是否运行

因为 rclone 是通过 AList 连接百度网盘，所以先确认 AList 运行：

```bash
sudo systemctl status alist
```

如果没运行：

```bash
sudo systemctl start alist
```

重启 AList：

```bash
sudo systemctl restart alist
```

查看 AList 日志：

```bash
journalctl -u alist -f
```

---

### 二十、常见错误处理

### 1. 401 Unauthorized

错误：

```text
401 Unauthorized
```

原因通常是：

```text
rclone 里用户名或密码错了
```

检查：

```bash
rclone config show baidu
```

确认：

```text
user = admin
密码是 AList 登录密码，不是百度网盘密码
```

解决：

```bash
rclone config delete baidu
rclone config
```

重新配置。

---

### 2. unsupported protocol scheme

错误：

```text
unsupported protocol scheme
```

常见原因：

```text
URL 填错了
把 url> 这种提示符也输入进去了
```

正确 URL：

```text
http://127.0.0.1:5244/dav/baidu
```

---

### 3. Method Not Allowed: 405

错误：

```text
Method Not Allowed: 405 Method Not Allowed
```

你之前遇到的是 `.trash` 目录文件上传失败。

解决：排除 `.trash`：

```bash
--exclude ".trash/**"
```

完整命令：

```bash
rclone copy /home/jack/a_document/obsidian/obsidian__ubuntu__project baidu:jack_ubuntu/obsidian__ubuntu__project \
  --exclude ".git/**" \
  --exclude ".trash/**" \
  --progress
```

---

### 4. object not found

错误：

```text
Failed to copy: object not found
```

一般是 AList + 百度网盘 WebDAV 临时问题。

处理方式：

```text
重新执行同一个 rclone copy 命令
rclone 会跳过已成功文件，只补传失败文件
```

建议用更稳的参数：

```bash
--transfers 2 --checkers 4 --retries 5 --low-level-retries 10
```

---

### 二十一、创建一键备份脚本

创建脚本：

```bash
mkdir -p /home/jack/a_script
nano /home/jack/a_script/backup_obsidian_to_baidu.sh
```

粘贴：

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

以后执行：

```bash
/home/jack/a_script/backup_obsidian_to_baidu.sh
```

---

### 二十二、创建更安全的镜像同步脚本

这个脚本使用 `sync`，但删除远端文件时会移动到备份目录。

创建：

```bash
nano /home/jack/a_script/sync_obsidian_to_baidu_safe.sh
```

粘贴：

```bash
#!/usr/bin/env bash
set -e

LOCAL_DIR="/home/jack/a_document/obsidian/obsidian__ubuntu__project"
REMOTE_DIR="baidu:jack_ubuntu/obsidian__ubuntu__project"
BACKUP_DIR="baidu:jack_ubuntu/deleted_backup/$(date +%F_%H-%M-%S)"
LOG_DIR="/home/jack/a_document/rclone_logs"
LOG_FILE="$LOG_DIR/obsidian_baidu_sync_$(date +%F_%H-%M-%S).log"

mkdir -p "$LOG_DIR"

echo "开始安全镜像同步 Obsidian 到百度网盘"
echo "本地目录：$LOCAL_DIR"
echo "远程目录：$REMOTE_DIR"
echo "远端删除备份目录：$BACKUP_DIR"
echo "日志文件：$LOG_FILE"

rclone sync "$LOCAL_DIR" "$REMOTE_DIR" \
  --exclude ".git/**" \
  --exclude ".trash/**" \
  --backup-dir "$BACKUP_DIR" \
  --transfers 2 \
  --checkers 4 \
  --retries 5 \
  --low-level-retries 10 \
  --log-file "$LOG_FILE" \
  --log-level INFO \
  --progress

echo "安全同步完成"
```

授权：

```bash
chmod +x /home/jack/a_script/sync_obsidian_to_baidu_safe.sh
```

执行前建议先 dry-run，不要直接同步：

```bash
rclone sync /home/jack/a_document/obsidian/obsidian__ubuntu__project baidu:jack_ubuntu/obsidian__ubuntu__project \
  --exclude ".git/**" \
  --exclude ".trash/**" \
  --backup-dir baidu:jack_ubuntu/deleted_backup/$(date +%F_%H-%M-%S) \
  --dry-run
```

确认无误后再运行：

```bash
/home/jack/a_script/sync_obsidian_to_baidu_safe.sh
```

---

### 二十三、定时自动备份

打开定时任务：

```bash
crontab -e
```

每天晚上 23:30 自动备份：

```bash
30 23 * * * /home/jack/a_script/backup_obsidian_to_baidu.sh
```

查看定时任务：

```bash
crontab -l
```

如果你不想自动备份，就不设置 crontab，手动执行脚本即可。

---

### 二十四、最终推荐命令排序

日常最推荐：

```bash
/home/jack/a_script/backup_obsidian_to_baidu.sh
```

手动正式备份：

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

第一次或不确定时先预演：

```bash
rclone copy /home/jack/a_document/obsidian/obsidian__ubuntu__project baidu:jack_ubuntu/obsidian__ubuntu__project \
  --exclude ".git/**" \
  --exclude ".trash/**" \
  --dry-run
```

需要恢复时：

```bash
rclone copy baidu:jack_ubuntu/obsidian__ubuntu__project /home/jack/a_document/obsidian_restore --progress
```

慎用镜像同步：

```bash
rclone sync /home/jack/a_document/obsidian/obsidian__ubuntu__project baidu:jack_ubuntu/obsidian__ubuntu__project \
  --exclude ".git/**" \
  --exclude ".trash/**" \
  --backup-dir baidu:jack_ubuntu/deleted_backup/$(date +%F_%H-%M-%S) \
  --progress
```

---

### 二十五、最重要的一句话

```text
日常备份用 rclone copy，不轻易用 rclone sync。
copy 是备份，sync 是镜像。
sync 会删除远端多余文件，必须谨慎。
```
