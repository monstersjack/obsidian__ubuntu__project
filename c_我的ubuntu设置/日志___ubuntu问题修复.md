---
标题: 明确问题修复
创建时间: 2026-05-14
修改时间: 2026-05-29
---

# 明确问题修复

## 1、安装显卡驱动,显卡问题修复

[（保姆级教程）Ubuntu系统安装NVIDIA驱动+CUDA超详细安装指南\_ubuntu安装cuda-CSDN博客](https://blog.csdn.net/qq_44475666/article/details/149649201)

[Ubuntu 22.04 NVIDIA 显卡驱动安装与问题解决\_ubuntu22.04安装nvidia驱动-CSDN博客](https://blog.csdn.net/2302_80464300/article/details/158264596)







### 1. Flatpak 模式
每个软件**自带完整运行环境 + 所有依赖库**，独立沙箱：
- 不共用系统库
- **永远不会缺少包、缺库、版本不匹配**
- 不受系统升级、系统组件损坏影响
- 跨 Ubuntu 版本都能正常跑
- 闪退概率极低

缺点：体积稍微大一点点（自带依赖），不能随便改系统底层。

### 2. APT 模式
所有软件**共用系统全局库**：
- 依赖全靠系统自带
- 很容易出现：**缺少某某库、版本太高/太低冲突**
- 系统一升级，容易把桌面组件搞坏
- 你之前 `gnome-extensions` 闪退、异常，就是**APT 系统组件库出问题**

优点：占用空间小、有完整系统权限，适合装**系统底层工具**。

#### 二、哪些适合用 Flatpak
✅ 适合 Flatpak（优先用）：
- GNOME 扩展管理工具
- 浏览器、编辑器、聊天软件、播放器、桌面小工具
- 容易闪退、依赖多的桌面应用

#### 三、哪些**不能**用 Flatpak，只能用 APT
❌ 必须 APT：
- 显卡驱动、内核
- `gnome-shell` 桌面本体
- 终端工具、系统运维、编译环境、驱动、系统核心组件


#### 五、总结人话
1. 普通**桌面软件、扩展工具**：**Flatpak 更稳、不缺包、不冲突、不闪退**
2. **系统底层、驱动、内核**：只能用 APT
3. 你现在这种扩展管理，用 Flatpak 是最优解，彻底避开系统 APT 组件损坏的坑。


# 日志问题修复

## 2026-05-20开发环境修复与优化日志



---

###  一、系统环境

####  当前系统
- Ubuntu 22.04
- Xorg
- GNOME Shell
- NVIDIA RTX 5060 Laptop
- PRIME 模式：on-demand
- CUDA 13.2
- ROS / CUDA / Electron 开发环境

---

###  二、今天出现的问题（核心问题记录）

---

####  1. xdg-desktop-portal 崩溃

#####  错误

```text
xdg-desktop-portal crashed with SIGSEGV
```

#####  现象
- Gradience 导入 json 卡死
- GTK4 文件选择器无响应
- Flatpak 文件对话框异常
- 微信截图异常
- Electron 应用随机崩溃

#####  原因
Portal + GTK4 + NVIDIA + GNOME 扩展冲突。

---

####  2. Obsidian 崩溃

#####  错误

```text
obsidian crashed with signal 5
```

#####  原因
Electron GPU 渲染在：

- NVIDIA
- Xorg
- 多 GNOME 扩展

环境下不稳定。

---

####  3. Gradience 导入主题卡死

#####  现象

点击：

```text
Import -> json
```

直接卡死。

#####  原因
GTK4 FileChooser + Flatpak Portal 崩溃。

不是主题文件本身的问题。

---

####  4. 微信截图异常

#####  现象
- 截图偏移
- 截到外边缘
- 截图黑边

#####  原因
Tiling Shell / Mutter Hook 导致窗口坐标异常。

---

####  5. 搜狗输入法异常

#####  现象
- 自定义短语打不开
- 部分 Qt 窗口打不开
- 候选框异常

#####  原因
GTK Overlay + Electron + GNOME Shell 扩展冲突。

---

###  三、已完成修复

---

####  1. Portal 修复

#####  重装 Portal

```bash
sudo apt install --reinstall \
xdg-desktop-portal \
xdg-desktop-portal-gtk \
xdg-desktop-portal-gnome \
-y
```

#####  重启 Portal

```bash
systemctl --user daemon-reexec

systemctl --user restart xdg-desktop-portal
systemctl --user restart xdg-desktop-portal-gtk
systemctl --user restart xdg-desktop-portal-gnome
```

---

####  2. Electron 全局稳定修复

#####  创建配置

```bash
mkdir -p ~/.config
nano ~/.config/electron-flags.conf
```

#####  内容

```text
--disable-gpu
--disable-gpu-compositing
--enable-features=UseOzonePlatform
--ozone-platform=x11
```

#####  作用

稳定：

- 微信
- Obsidian
- VSCode
- Edge

#####  不影响

- CUDA
- ROS
- PyTorch
- TensorFlow
- AI训练

---

####  3. GTK Portal 强制启用

```bash
echo 'GTK_USE_PORTAL=1' | sudo tee -a /etc/environment
```

---

####  4. 关闭 Mutter 实验特性

```bash
gsettings set org.gnome.mutter experimental-features "[]"
```

---

####  5. 清理缓存

```bash
rm -rf ~/.cache/gnome-shell
rm -rf ~/.cache/thumbnails
rm -rf ~/.cache/fontconfig
```

---

####  6. 重启 GNOME Shell

Xorg 下：

按：

```text
Alt + F2
```

输入：

```text
r
```

回车。

---

###  四、NVIDIA 当前状态

---

####  PRIME 模式

```bash
prime-select query
```

输出：

```text
on-demand
```

---

####  说明

当前是最推荐状态。

适合：

- ROS
- CUDA
- AI训练
- 日常开发
- 外接显示器

---

###  五、当前保留扩展

---

####  已保留

- Dash to Panel
- ArcMenu
- Space Bar
- Tiling Shell
- User Themes
- Just Perfection
- Force Quit
- Alphabetical App Grid
- GNOME Fuzzy App Search

---

###  六、不再推荐安装

---

####  不建议继续魔改

- Gradience 深度主题
- Blur My Shell
- GTK 透明主题
- GNOME 动画增强
- Mutter 实验特性
- Wayland

---

###  七、微信静默自启动

---

####  功能

- 开机自动启动
- 自动登录
- 自动关闭主窗口
- 保留系统托盘

---

####  文件

```bash
~/.config/autostart/wechat-silent.desktop
```

---

####  核心命令

```bash
bash -c 'sleep 8 && wechat & sleep 15 && xdotool key Return && sleep 5 && wmctrl -c 微信'
```

---

###  八、GRUB 双系统配置

---

####  目标

- 显示 GRUB 菜单
- 15 秒自动进入 Windows
- 保留 Ubuntu 手动选择

---

####  配置

```ini
GRUB_DEFAULT="Windows Boot Manager (on /dev/nvme1n1p1)"
GRUB_TIMEOUT_STYLE=menu
GRUB_TIMEOUT=15
```

---

####  更新 GRUB

```bash
sudo update-grub
```

---

###  九、当前最终稳定建议

---

####  推荐长期保留

✔ Xorg
✔ NVIDIA on-demand
✔ Dash to Panel
✔ ArcMenu
✔ Electron 禁 GPU
✔ Portal GTK 修复
✔ ROS + CUDA 开发环境

---

####  不推荐继续折腾

✘ Gradience 深度主题
✘ Blur My Shell
✘ GTK4 魔改
✘ Wayland
✘ GNOME 动画增强

---

###  十、当前系统状态

当前属于：

```text
稳定高定制 Ubuntu 开发工作站
```

适合：

- ROS
- CUDA
- AI训练
- GNOME 深度定制
- Electron 开发
- 日常办公


## 2026年05月29日-配置 Flutter、Android SDK、Android 模拟器以及 Linux 桌面端运行环境。



#### 3. 主要安装内容

| 项目                         | 状态               |
| -------------------------- | ---------------- |
| Flutter SDK                | 已安装              |
| Dart SDK                   | 已安装，随 Flutter 自带 |
| Android SDK                | 已安装              |
| Android Command-line Tools | 已安装              |
| Android Emulator           | 已安装              |
| Android Platform Tools     | 已安装              |
| Android Build Tools        | 已安装              |
| Android 36 Platform        | 已安装              |
| Android 36 x86_64 系统镜像     | 已安装              |
| Linux Desktop 支持           | 已启用              |
| Chrome Web 支持              | 可用               |
| KVM 硬件加速                   | 可用               |

---

#### 4. 关键安装路径

Flutter SDK 路径：

```text
/home/jack/a_program/flutter/flutter
```

Android SDK 路径：

```text
/home/jack/Android/Sdk
```

Android command-line tools 路径：

```text
/home/jack/Android/Sdk/cmdline-tools/latest
```

Android 模拟器路径：

```text
/home/jack/Android/Sdk/emulator
```

Android platform-tools 路径：

```text
/home/jack/Android/Sdk/platform-tools
```

---

#### 5. 环境变量设置

已经在 `~/.bashrc` 中配置 Flutter 和 Android SDK 环境变量。

主要内容包括：

```bash
export PATH="$HOME/a_program/flutter/flutter/bin:$PATH"
export ANDROID_HOME="$HOME/Android/Sdk"
export ANDROID_SDK_ROOT="$HOME/Android/Sdk"
export PATH="$ANDROID_HOME/platform-tools:$PATH"
export PATH="$ANDROID_HOME/emulator:$PATH"
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
```

修改后通过以下命令生效：

```bash
source ~/.bashrc
```

---

#### 6. Flutter 版本信息

当前 Flutter 版本：

```text
Flutter 3.44.0
Channel stable
Dart 3.12.0
DevTools 2.57.0
```

系统环境：

```text
Ubuntu 22.04.5 LTS
Kernel 6.8.0-117-generic
```

---

#### 7. Android SDK 信息

Android SDK 路径：

```text
/home/jack/Android/Sdk
```

Android SDK 版本：

```text
Android SDK 36.0.0
```

已安装主要组件：

```text
platform-tools
emulator
cmdline-tools;latest
platforms;android-36
build-tools;36.0.0
system-images;android-36;google_apis;x86_64
```

---

#### 8. Android 模拟器信息

已创建模拟器：

```text
Pixel_API_36
```

模拟器系统镜像：

```text
Android 36
google_apis
x86_64
```

KVM 检查结果：

```text
/dev/kvm exists
KVM acceleration can be used
```

说明 Android 模拟器可以使用硬件加速。

---

#### 9. Flutter Doctor 最终结果

最终执行：

```bash
flutter doctor
```

结果显示：

```text
[✓] Flutter
[✓] Android toolchain - develop for Android devices
[✓] Chrome - develop for the web
[✓] Linux toolchain - develop for Linux desktop
[✓] Proxy Configuration
[✓] Connected device
[✓] Network resources

• No issues found!
```

说明 Flutter 开发环境已经配置成功。

---

#### 10. 当前可用设备

执行：

```bash
flutter devices
```

当前可以检测到：

```text
Linux desktop
Chrome web
```

如果 Android 模拟器没有启动，可能会显示：

```text
Device emulator-5554 is offline
```

这表示模拟器当前处于离线或未正常启动状态，不影响 Flutter 环境本身。

---

#### 11. 后续常用操作

启动 Android 模拟器：

```bash
flutter emulators --launch Pixel_API_36
```

或者：

```bash
emulator -avd Pixel_API_36
```

查看 Flutter 可用设备：

```bash
flutter devices
```

查看 Android 设备状态：

```bash
adb devices
```

如果模拟器显示 offline，可以重启 ADB：

```bash
adb kill-server
adb start-server
adb devices
```

---

#### 12. 运行 Flutter 项目

进入 X-LINE 移动端目录：

```bash
cd ~/a_program/trae/X-LINE-test2/xline_mobile
```

获取依赖：

```bash
flutter pub get
```

运行到 Linux 桌面端：

```bash
flutter run -d linux
```

运行到 Chrome：

```bash
flutter run -d chrome
```

运行到 Android 模拟器：

```bash
flutter run -d emulator-5554
```

---

#### 13. Trae 中的 SDK 设置

如果 Trae 提示找不到 Flutter SDK，需要手动选择：

```text
/home/jack/a_program/flutter/flutter
```

Android SDK 路径为：

```text
/home/jack/Android/Sdk
```

设置完成后重启 Trae。

---

#### 14. 注意事项

1. `flutter sdk-path` 在当前 Flutter 版本中不可用，不能用它查看 SDK 路径。
2. Flutter SDK 实际路径是 `/home/jack/a_program/flutter/flutter`。
3. Android SDK 实际路径是 `/home/jack/Android/Sdk`。
4. `flutter doctor` 已经显示 `No issues found`，说明环境安装成功。
5. 如果模拟器显示 `offline`，通常是 ADB 或模拟器状态问题，不是 Flutter 安装失败。
6. 加入 `kvm` 和 `libvirt` 用户组后，最好重新登录或重启电脑，使权限完全生效。
7. 后续开发 Flutter 移动端时，优先确认模拟器是否启动，再执行 `flutter run`。



