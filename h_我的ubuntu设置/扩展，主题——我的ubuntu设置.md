---
标题: 重置电脑的操作
创建时间: 2025-12-22
修改时间: 2026-05-19
---

# 重置电脑的操作
### 1. 迁移旧插件完整步骤

####  第一阶段：安装基础工具（Extension Manager）
这是管理GNOME扩展的官方推荐工具，替代旧版的浏览器插件方式：

```bash
###  更新 Flatpak 应用源（对应 apt update）
flatpak update

###  安装 Flatpak 版 扩展管理器（对应 apt 安装）
flatpak install flathub com.mattjakeman.ExtensionManager -y
```

安装完成后，按`Win`键搜索「扩展管理器」即可打开。

```
jack@jack:~/.local/share/gnome-shell$ ls
application_state  extensions  gnome-overrides-migrated  notifications
jack@jack:~/.local/share/gnome-shell$ 

```

旧电脑的插件复制到这个软件上面,然后就打开扩展这个软件上,然后在上面一个个开启就行了.


### 2. 皮肤优化


### 3. 优化的按键设置



# 皮肤

## 现在的皮肤,主题主要参考这个视频

#参考视频  [这个博主的视频，美化工具](https://www.bilibili.com/video/BV1RF4m1A7ei?spm_id_from=333.788.videopod.sections&vd_source=ea35c10f59aa46851935d37df4345603)
[主要参考这个视频,,,3. 让ubuntu果味十足\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1sC411b78X?spm_id_from=333.788.videopod.sections&vd_source=ea35c10f59aa46851935d37df4345603)



1. 主要优化方案
![[Pasted image 20260516222306.png]]
![[Pasted image 20260423135629.png]]
2. 文件在这个地方
![[Pasted image 20260423135521.png|811]]

### 总结：GTK 窗口标题栏按钮放大方法

#### 问题根源
GTK 优先读取 `~/.local/share/themes/` 而不是 `~/.themes/`，所以改错了目录一直没效果。

---

#### 修改的文件

```
~/.local/share/themes/adw-gtk3/gtk-3.0/gtk.css
```

#### 修改的两处代码

**第 687 行**（权重更高的规则，必须改）：

```css
/* 改前 */
.default-decoration.titlebar:not(headerbar) button.titlebutton, headerbar.default-decoration button.titlebutton { border-radius: 100%; background-color: alpha(currentColor,0.1); min-height: 24px; min-width: 24px; margin: 0 4px 0 4px; padding: 0; transition: all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94); }

/* 改后 */

//整行代码
.default-decoration.titlebar:not(headerbar) button.titlebutton, headerbar.default-decoration button.titlebutton { border-radius: 100%; background-color: alpha(currentColor,0.1); min-height: 56px; min-width: 56px; margin: 0 6px 0 6px; padding: 10px; transition: all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94); -gtk-icon-size: 32px; }

.default-decoration.titlebar:not(headerbar) button.titlebutton, headerbar.default-decoration button.titlebutton { border-radius: 100%; background-color: alpha(currentColor,0.1); min-height: 36px; min-width: 36px; margin: 0 5px 0 5px; padding: 4px; transition: all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94); -gtk-icon-size: 20px; }

```

**第 1891 行**（基础规则）：

```css
/* 改前 */
button.titlebutton:not(.appmenu) { border-radius: 9999px; padding: 0px; margin: 0 4px; min-width: 24px; min-height: 24px; transition: all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94); background-color: alpha(currentColor,0.1); }


/* 改后 */

//整行代码
button.titlebutton:not(.appmenu) { border-radius: 9999px; padding: 10px; margin: 0 6px; min-width: 56px; min-height: 56px; transition: all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94); background-color: alpha(currentColor,0.1); -gtk-icon-size: 32px; }

button.titlebutton:not(.appmenu) { border-radius: 9999px; padding: 4px; margin: 0 5px; min-width: 36px; min-height: 36px; transition: all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94); background-color: alpha(currentColor,0.1); -gtk-icon-size: 20px; }
```

---

#### 操作步骤

```bash
# 1. 编辑正确的文件
code ~/.local/share/themes/adw-gtk3/gtk-3.0/gtk.css

# 2. 保存后重载
pkill -HUP gnome-shell
```

如果同时使用深色主题，`gtk-dark.css` 也要做同样修改，或者直接复制过去：

```bash
cp ~/.local/share/themes/adw-gtk3/gtk-3.0/gtk.css \
   ~/.local/share/themes/adw-gtk3/gtk-3.0/gtk-dark.css
```

## gnome-tweaks

![[Pasted image 20260519185403.png]]

## 应用程序

### timeshift ，系统快照，
保存系统，备份系统

### ulauncher
快捷搜索栏




## extension manager扩展管理器
![[Pasted image 20260517223018.png]]

### 用户扩展

| 扩展名称                     | 核心功能                                  |
| :----------------------- | :------------------------------------ |
| Add to Desktop           | 在桌面显示文件、文件夹、挂载盘和快捷方式图标，提供轻量级桌面图标支持    |
| Alphabetical App Grid    | 将应用列表按字母顺序自动排序，让应用查找更高效               |
| ArcMenu                  | 为GNOME添加高度自定义的“开始菜单/启动器”，支持多种布局与样式    |
| Blur my Shell            | 为GNOME界面添加玻璃质感模糊效果，美化顶部栏、活动概览、弹窗等元素   |
| Dash2Dock Animated       | 为Dash to Dock扩展添加各类动画效果，增强交互体验        |
| Dash to Dock             | 将默认Dash应用栏改造为可自定义的停靠栏，支持位置、大小、自动隐藏等设置 |
| Dash to Panel            | 将顶部栏与Dash应用栏合并为统一面板，打造类似Windows的任务栏   |
| Forge                    | 高级窗口管理扩展，支持窗口磁贴、自定义规则与快捷键控制           |
| Gnome 4x UI Improvements | 优化GNOME 40+版本的原生界面细节，调整布局与样式，让界面更精致   |
| GNOME Fuzzy App Search   | 增强应用搜索能力，支持模糊匹配、拼音首字母搜索，提升查找效率        |
| Just Perfection          | 高度自定义GNOME界面，可修改顶部栏、面板、窗口动画等几乎所有元素    |
| Logo Menu                | 在顶部栏添加自定义图标菜单，可快速打开活动概览或自定义快捷方式       |
| Space Bar                | 为工作区添加可视化标识与控制，方便多工作区用户识别与切换          |
| Tiling Shell             | 提供窗口平铺功能，支持类似i3的自动平铺模式，高效管理多个窗口       |
| User Themes              | 解锁GNOME Shell主题修改权限，配合工具可启用自定义界面主题    |
| Vertical overview        | 将默认水平工作区改为垂直排列，优化大屏用户的工作区切换体验         |

---

### 系统扩展

| 扩展名称                    | 核心功能                                   |
| :---------------------- | :------------------------------------- |
| Applications Menu       | 在顶部栏添加分类式应用菜单，按类别整理应用，方便浏览查找           |
| Auto Move Windows       | 自动将指定应用移动到固定工作区，无需手动拖拽窗口               |
| Desktop Icons NG (DING) | Ubuntu官方桌面图标扩展，支持在桌面显示文件、文件夹、挂载盘与回收站图标 |
| Launch new instance     | 为应用右键菜单添加“新建窗口”选项，方便快速开启多个同应用窗口        |
| Native Window Placement | 优化新窗口的默认位置与大小，解决窗口被遮挡或位置异常的问题          |
| Places Status Indicator | 在顶部栏添加快捷访问菜单，快速打开主文件夹、下载、文档等常用目录       |
| Removable Drive Menu    | 在顶部栏添加可移动设备管理菜单，支持一键挂载、卸载U盘/移动硬盘       |
| Screenshot Window Sizer | 调整截图工具的窗口大小与位置，方便精准截取特定区域              |
| Ubuntu Appindicators    | 支持传统应用指示器图标在GNOME顶部栏显示，兼容旧版应用          |
| Ubuntu Dock             | Ubuntu默认的应用停靠栏，提供应用快速启动与窗口管理功能         |
| Window List             | 在顶部栏显示已打开窗口的列表，方便快速切换窗口                |
| windowNavigator         | 增强窗口导航功能，支持通过快捷键快速切换、聚焦不同窗口            |
| Workspace Indicator     | 在顶部栏显示工作区指示器，方便查看当前工作区与快速切换            |

8. Dash to Dock
是 Dash to Dock 的一个精简/动画版，能将原本只在概览中显示的栏常驻在桌面上，并添加了更丰富的动画效果。
底部工具栏
==但是有问题导致打开浏览器，视频全屏时会导致视频的进度条无法动弹==
==所以最好还是用Dash to Dock==
#bug 开启扩展这个软件后,微信截图就会卡
![[Pasted image 20260516011858.png]]
![[Pasted image 20260516012018.png]]
![[Pasted image 20260516153939.png]]

9. Add to Desktop：能将应用添加到桌面
在应用程序列表的右键菜单中增加“添加到桌面（Add to Desktop）”选项，方便快速创建桌面快捷方式。

10. Forge：此处为扩展名称，意译可理解为优化窗口布局，==窗口自动排列，优化排序==，
**有时不方便可以取消**
为 GNOME 提供类似平铺式窗口管理器（如 i3）的功能，可以自动排列窗口，实现窗口的无缝拼接

3. GNOME Fuzzy App Search: 让系统的搜索功能支持“模糊匹配”（例如输入 "ff" 就能搜到 Firefox），即便拼写不完全准确也能找到程序。

4. App Menu is Back：应用程序菜单回来了（用于在顶部栏显示当前显示应用名称）
找回较新版本 GNOME 中被取消的“应用程序菜单”（即顶部栏左侧显示当前活动程序名称并提供选项的菜单）。

5. Custom Window Control：自定义窗口控件
高度实验性，可能会导致，桌面驱动有问题

6. logo menu
![[a5b5d29f6a88f79fb67da9560c88c93f.jpg|200]]
将顶部栏左侧的“活动（Activities）”文本替换为发行版图标（或自定义图标），并点击展开一个包含关机、重启等快捷操作的系统菜单。

7. Dash2Dock Animated:



3. Ubuntu Dock
桌面左侧的工具栏

4. Dash to Panel
类似于window的任务栏

5. GNOME 4X UI
Gnome 4x UI Improvements: 针对 GNOME 40 及以上版本的 UI 进行一系列细节微调，例如在概览中隐藏搜索框（仅在输入时显示）、调整工作区缩略图大小等。


6. Space Bar
在顶部栏显示一个类似 i3 或 Sway 的工作区指示器，通常以数字形式展示，方便快速切换和识别当前==工作区==。
老是出现在应用程序上的问题


7. Vitals

8. Tiling shell
![[Pasted image 20260519163353.png]]
9. Cover Flow Tab

10. Compiz Windows Effects

11. Compiz Magic Lamp
一个实验性插件，用于自定义窗口控制按钮（最小化、最大化、关闭）的样式和排列。


14. Blur my Shell: 为 GNOME Shell 的各个部分（如顶部状态栏、Dash 栏和活动概览界面）添加高斯模糊效果，使系统更具现代感。

15. User Themes: 允许从用户目录（~/.themes）加载和使用自定义的 Shell 主题，这是更换系统外观的基础插件。

16. Vertical Workspaces
这是一个功能更强大的扩展，它不仅可以调整应用网格，还能改变整个 GNOME 的交互逻辑。

**（一堆问题）**


17. Alphabetical App Grid（最推荐）
这是解决“自动填补”最直接的插件。它强制将所有图标按字母顺序排列，因此会自动填满所有空隙，让界面始终保持紧凑。

18. Just Perfection: Gnome视图调整设置面板（顶部导航栏）
![[Pasted image 20260110150600.png]]

19. ArcMenu
![[Pasted image 20260423140708.png]]

## 主题设置



## 安装macOS优化
命令

```shell
jack@jack-ubuntu:~$ gsettings set org.gnome.shell.extensions.dash-to-dock click-action 'minimize-or-previews'
#点击最小化功能
jack@jack-ubuntu:~$ git clone https://github.com/vinceliuice/WhiteSur-wallpapers.git
#克隆壁纸仓库
ls *sh
#执行提供的脚本文件安装壁纸
sudo ./inst



```

```
然后打开 https://github.com/kayozxo/GNOME-macOS-Tahoe

git clone https://github.com/kayozxo/GNOME-macOS-Tahoe --depth=1

#克隆仓库得到本地

cd GNOME-macOS-Tahoe

#进入仓库

./install.sh --help

#查看帮助，了解脚本的其他用法


```

### 切换黑白主题
然后在优化设置主题
tweaks
![[Pasted image 20260309191311.png]]
![[Pasted image 20251222185111.png]]

```shell
cd GNOME-macOS-Tahoe/
./install.sh -l -la          # install light theme for libadwaita安装明亮主题
./install.sh -d -la          # install dark theme for libadwaita安装暗黑主题
```