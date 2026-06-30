---
标题: ubuntu的github同步
创建时间: 2026-06-05
修改时间: 2026-06-05
---

###  一、你的当前仓库信息

你的 Obsidian 仓库路径是：

```bash
/home/jack/a_document/obsidian/obsidian__ubuntu__project
```

你的附件目录是：

```bash
/home/jack/a_document/obsidian/obsidian__ubuntu__project/z_资料库/attachment
```

你的 GitHub 仓库应该是：

```bash
https://github.com/monstersjack/obsidian__ubuntu__project.git
```

你当前分支是：

```bash
main
```

---

###  二、推荐的同步原则

你的 Obsidian 同步建议分成两类：

```text
1. 笔记正文 + 图片附件 + 小 PDF：
   用 GitHub 同步

2. 视频、大数据集、模型权重、大压缩包：
   不走 GitHub，放百度网盘
```

也就是说，GitHub 同步：

```text
.md
.png
.jpg
.jpeg
.svg
.webp
小 PDF
小 Word
小 Excel
Obsidian 必要插件配置
```

百度网盘同步：

```text
.mp4
.avi
.mov
.pt
.onnx
.zip
.rar
.7z
大型数据集
大型训练结果
```

---

###  三、Obsidian 软件里的设置

####  1. 附件保存位置设置

打开 Obsidian：

```text
设置 → 文件与链接
```

找到：

```text
新附件的默认位置
```

建议选择：

```text
指定的附件文件夹
```

附件文件夹路径填：

```text
z_资料库/attachment
```

这样你以后复制图片、粘贴截图、拖入 PDF，都会自动进入：

```bash
z_资料库/attachment
```

这样 Git 才能统一同步。

---

####  2. 链接格式建议

在 Obsidian 里设置：

```text
设置 → 文件与链接
```

建议：

```text
始终更新内部链接：开启
使用 Wiki 链接：开启或关闭都可以
检测所有类型文件：开启
```

如果你习惯 Obsidian 默认格式，可以用 Wiki 链接：

```markdown
![[Pasted image 20260406223739.png]]
```

如果你想兼容 GitHub 网页预览，可以用 Markdown 链接：

```markdown
![图片](z_资料库/attachment/Pasted%20image%2020260406223739.png)
```

你目前更适合继续用 Obsidian 默认的 Wiki 链接。

---

###  四、你的 `.gitignore` 应该这样设置

你现在想同步 `z_资料库/attachment` 里的图片，所以 `.gitignore` 里面**不能再有**这一行：

```gitignore
z_资料库/attachment/
```

打开 `.gitignore`：

```bash
cd /home/jack/a_document/obsidian/obsidian__ubuntu__project
nano .gitignore
```

建议整理成下面这一版：

```gitignore
###  ==================================================
###  Obsidian 本地工作区状态
###  这些文件记录当前打开的标签页、窗口布局、光标位置等
###  不同设备不需要同步
###  ==================================================
.obsidian/workspace.json
.obsidian/workspaces.json
.obsidian/workspace-mobile.json


###  ==================================================
###  Obsidian 缓存文件
###  缓存文件不需要同步，重新打开 Obsidian 会自动生成
###  ==================================================
.obsidian/cache/


###  ==================================================
###  Obsidian 回收站
###  删除文件后的本地回收站，不建议同步
###  ==================================================
.trash/


###  ==================================================
###  系统与临时文件
###  ==================================================
.DS_Store
Thumbs.db
*.tmp
~$*


###  ==================================================
###  不建议同步的 Obsidian 个性化状态
###  这些通常和本机使用习惯有关
###  ==================================================
.obsidian/daily-notes.json
.obsidian/facets.json
.obsidian/starred.json


###  ==================================================
###  Obsidian 插件状态文件
###  这两个会频繁变化，不建议同步
###  ==================================================
.obsidian/plugins/obsidian-quiet-outline/markdown-states.json
.obsidian/plugins/remember-cursor-position/cursor-positions.json


###  ==================================================
###  大文件不走 GitHub，建议放百度网盘
###  ==================================================
*.mp4
*.avi
*.mov
*.mkv
*.zip
*.rar
*.7z
*.tar
*.gz
*.pt
*.pth
*.onnx
*.engine


###  ==================================================
###  数据集、模型、训练结果目录
###  如果以后你在 Obsidian 仓库里建这些目录，就不会被上传到 GitHub
###  ==================================================
datasets/
models/
runs/
weights/
large_files/
videos/
```

保存：

```text
Ctrl + O
回车
Ctrl + X
```

重点：这一版里面**没有忽略**：

```text
z_资料库/attachment/
```

所以图片附件可以上传。

---

###  五、第一次把附件图片上传到 GitHub

你现在附件目录之前被 `.gitignore` 忽略了，所以先取消忽略，然后重新添加。

####  1. 进入仓库根目录

```bash
cd /home/jack/a_document/obsidian/obsidian__ubuntu__project
```

####  2. 检查附件是否还被忽略

```bash
git check-ignore -v z_资料库/attachment/*
```

如果没有任何输出，说明已经不被忽略。

如果还有类似：

```bash
.gitignore:7:z_资料库/attachment/
```

说明 `.gitignore` 里还有这一行：

```gitignore
z_资料库/attachment/
```

要删掉或注释掉：

```gitignore
###  z_资料库/attachment/
```

---

####  3. 添加附件文件夹

```bash
git add z_资料库/attachment
```

####  4. 查看状态

```bash
git status
```

你应该看到很多新文件，例如：

```text
新文件： z_资料库/attachment/0.jpeg
新文件： z_资料库/attachment/Pasted image 20260406223739.png
新文件： z_资料库/attachment/Pasted image 20260423172937.png
```

####  5. 提交

```bash
git commit -m "同步 Obsidian 附件图片"
```

####  6. 上传

如果你终端 GitHub 账号密码认证失败，就用 GitHub Desktop 点：

```text
Push origin
```

---

###  六、以后每天同步 Obsidian 的终端命令

以后你每次写完 Obsidian，要同步时，就按这一套。

####  标准同步流程

```bash
cd /home/jack/a_document/obsidian/obsidian__ubuntu__project
git status
git add .
git status
git commit -m "更新 Obsidian 笔记"
git push
```

但是你现在终端 `git push` 可能会认证失败，所以最后一步可以改成 GitHub Desktop 点按钮。

也就是：

```bash
cd /home/jack/a_document/obsidian/obsidian__ubuntu__project
git status
git add .
git status
git commit -m "更新 Obsidian 笔记"
```

然后打开 GitHub Desktop：

```bash
github-desktop
```

点击右上角：

```text
Push origin
```

---

###  七、最推荐你的日常操作版本

你后面可以直接复制这个：

```bash
cd /home/jack/a_document/obsidian/obsidian__ubuntu__project

git status

git add .

git status

git commit -m "更新 Obsidian 笔记和附件"
```

然后去 GitHub Desktop 点：

```text
Push origin
```

如果 `git commit` 出现：

```text
无文件要提交，干净的工作区
```

说明没有变化，不需要同步。

---

###  八、GitHub Desktop 图形界面操作

####  1. 打开 GitHub Desktop

终端打开：

```bash
github-desktop
```

或者应用菜单搜索：

```text
GitHub Desktop
```

---

####  2. 添加本地仓库

如果 GitHub Desktop 还没有显示你的仓库：

```text
File → Add local repository
```

选择路径：

```text
/home/jack/a_document/obsidian/obsidian__ubuntu__project
```

点击：

```text
Add repository
```

---

####  3. 查看当前仓库

左上角应该显示：

```text
Current repository:
obsidian__ubuntu__project
```

中间上方应该显示：

```text
Current branch:
main
```

---

####  4. 提交修改

如果左侧出现文件变化，说明有新内容。

左下角填写提交信息，例如：

```text
更新 Obsidian 笔记和附件
```

然后点击：

```text
Commit to main
```

---

####  5. 上传 GitHub

提交后右上角会出现：

```text
Push origin
```

点击它。

如果显示：

```text
Fetch origin
```

说明当前没有需要上传的提交，或者需要先拉取远程变化。

---

###  九、如果另一台电脑也同步 Obsidian

另一台电脑不要直接新建仓库，应该先从 GitHub 克隆。

####  1. 克隆仓库

```bash
cd /home/jack/a_document/obsidian
git clone https://github.com/monstersjack/obsidian__ubuntu__project.git
```

####  2. 打开 Obsidian

Obsidian 里选择：

```text
打开本地仓库
```

路径选择：

```text
/home/jack/a_document/obsidian/obsidian__ubuntu__project
```

---

###  十、另一台电脑同步前先拉取

以后如果你在多台电脑使用，打开 Obsidian 编辑前，先执行：

```bash
cd /home/jack/a_document/obsidian/obsidian__ubuntu__project
git pull
```

然后再打开 Obsidian 写笔记。

写完之后再：

```bash
git add .
git commit -m "更新 Obsidian 笔记"
git push
```

如果终端不能 push，就用 GitHub Desktop 点：

```text
Push origin
```

---

###  十一、完整的多设备安全流程

####  每次开始写笔记前

```bash
cd /home/jack/a_document/obsidian/obsidian__ubuntu__project
git pull
```

####  写完笔记后

```bash
cd /home/jack/a_document/obsidian/obsidian__ubuntu__project
git status
git add .
git commit -m "更新 Obsidian 笔记和附件"
```

然后 GitHub Desktop 点：

```text
Push origin
```

这套流程最稳。

---

###  十二、检查附件有没有被 Git 管理

####  查看所有已被 Git 管理的图片

```bash
cd /home/jack/a_document/obsidian/obsidian__ubuntu__project
git ls-files | grep -Ei '\.(png|jpg|jpeg|gif|webp|svg)$'
```

####  查看附件目录里已经被 Git 管理的文件

```bash
git ls-files z_资料库/attachment
```

如果能列出很多图片，说明附件已经进入 Git 管理。

---

###  十三、检查哪些图片还没被加入 Git

```bash
cd /home/jack/a_document/obsidian/obsidian__ubuntu__project
git status --untracked-files=all
```

如果看到：

```text
未跟踪的文件：
  z_资料库/attachment/xxx.png
```

说明这些文件还没有被 Git 同步，需要：

```bash
git add z_资料库/attachment
git commit -m "同步新增附件图片"
```

---

###  十四、检查附件是否被 `.gitignore` 忽略

```bash
cd /home/jack/a_document/obsidian/obsidian__ubuntu__project
git check-ignore -v z_资料库/attachment/*
```

如果没有输出，正常。

如果有输出，例如：

```text
.gitignore:7:z_资料库/attachment/
```

说明附件目录仍然被忽略，需要修改 `.gitignore`。

---

###  十五、强制添加被忽略的附件

如果你暂时不想改 `.gitignore`，也可以强制添加：

```bash
git add -f z_资料库/attachment
git commit -m "强制同步 Obsidian 附件图片"
```

但是长期不建议这样。长期建议把 `.gitignore` 里的忽略规则删掉。

---

###  十六、查看仓库大小

上传附件前，建议检查仓库大小：

```bash
cd /home/jack/a_document/obsidian/obsidian__ubuntu__project
du -sh .
```

查看附件文件夹大小：

```bash
du -sh z_资料库/attachment
```

查看有没有大于 50MB 的文件：

```bash
find . -type f -size +50M
```

查看有没有大于 100MB 的文件：

```bash
find . -type f -size +100M
```

如果出现大于 100MB 的文件，不建议上传 GitHub。

GitHub 普通仓库单文件超过 100MB 会直接报错。

---

###  十七、如果不小心添加了大文件

比如误添加了视频、模型权重，可以先取消暂存：

```bash
git restore --staged 文件路径
```

例如：

```bash
git restore --staged z_资料库/attachment/test.mp4
```

如果已经提交但还没 push，可以撤销最近一次提交，保留文件：

```bash
git reset --soft HEAD~1
```

然后把大文件加入 `.gitignore`，重新提交：

```bash
git add .gitignore
git add .
git commit -m "更新 Obsidian 笔记，排除大文件"
```

---

###  十八、如果 GitHub Desktop 显示没有图片

先用终端检查：

```bash
cd /home/jack/a_document/obsidian/obsidian__ubuntu__project
find z_资料库/attachment -type f | head
git status --untracked-files=all
git check-ignore -v z_资料库/attachment/*
```

判断逻辑：

```text
find 能看到图片，但 git status 看不到：
说明被 .gitignore 忽略了，或者已经被 Git 管理了。

git ls-files z_资料库/attachment 能看到图片：
说明图片已经被 Git 管理，没变化所以 GitHub Desktop 不显示。

git check-ignore 有输出：
说明被 .gitignore 忽略，需要删除对应规则。
```

---

###  十九、你现在立刻应该执行的修复流程

你现在附件目录被 `.gitignore` 忽略了，所以先修复。

```bash
cd /home/jack/a_document/obsidian/obsidian__ubuntu__project
nano .gitignore
```

删除或注释这一行：

```gitignore
z_资料库/attachment/
```

保存后执行：

```bash
git check-ignore -v z_资料库/attachment/*
```

确认没有输出后：

```bash
git add .gitignore
git add z_资料库/attachment
git status
git commit -m "同步 Obsidian 附件图片"
```

然后打开 GitHub Desktop：

```bash
github-desktop
```

点击：

```text
Push origin
```

---

###  二十、终端 push 失败的原因和解决方案

你之前报错：

```text
remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: 鉴权失败
```

原因是 GitHub 现在不支持用账号密码执行 `git push`。

解决方式有三个：

```text
方式一：GitHub Desktop 登录后点 Push origin
方式二：使用 GitHub Personal Access Token
方式三：配置 SSH Key
```

你现在最适合：

```text
GitHub Desktop
```

简单、稳定、不用每次输密码。

---

###  二十一、GitHub Desktop 维护流程总结

以后你可以这样：

####  方式 A：全图形界面

打开 GitHub Desktop：

```bash
github-desktop
```

左侧看改动文件。

左下角填写：

```text
更新 Obsidian 笔记和附件
```

点击：

```text
Commit to main
```

再点右上角：

```text
Push origin
```

---

####  方式 B：终端提交 + 图形界面上传

终端：

```bash
cd /home/jack/a_document/obsidian/obsidian__ubuntu__project
git add .
git commit -m "更新 Obsidian 笔记和附件"
```

图形界面：

```text
GitHub Desktop → Push origin
```

这个最适合你。

---

###  二十二、推荐你固定使用的同步命令

以后每次同步直接用这个：

```bash
cd /home/jack/a_document/obsidian/obsidian__ubuntu__project

git pull

git status

git add .

git status

git commit -m "更新 Obsidian 笔记和附件"
```

然后：

```text
GitHub Desktop → Push origin
```

如果 `git commit` 提示没有文件要提交，说明没有新变化，不需要 push。

---

###  二十三、如果出现冲突怎么办

如果执行：

```bash
git pull
```

出现冲突，先不要乱改。

先看：

```bash
git status
```

常见冲突文件可能是：

```text
.obsidian/workspace.json
.obsidian/plugins/xxx.json
```

这类文件通常不重要，可以保留当前版本：

```bash
git checkout --ours 文件路径
git add 文件路径
git commit -m "解决 Obsidian 同步冲突"
```

或者保留远程版本：

```bash
git checkout --theirs 文件路径
git add 文件路径
git commit -m "解决 Obsidian 同步冲突"
```

如果是 `.md` 笔记冲突，不要直接覆盖，要打开文件手动合并。

冲突文件里面会出现：

```text
<<<<<<< HEAD
你本地的内容
=======
远程的内容
>>>>>>> origin/main
```

你需要手动删除这些标记，保留正确内容，然后：

```bash
git add .
git commit -m "解决笔记冲突"
```

---

###  二十四、百度网盘同步大附件建议

不要让百度网盘同步整个 Obsidian 仓库。

不要同步这个目录：

```bash
/home/jack/a_document/obsidian/obsidian__ubuntu__project
```

建议单独建一个百度网盘大附件目录：

```bash
/home/jack/BaiduSync/Obsidian大型附件库
```

里面放：

```text
视频/
数据集/
模型权重/
训练结果/
压缩包/
大PDF/
```

Obsidian 里面只写链接：

```markdown
[打开柑橘数据集目录](file:///home/jack/BaiduSync/Obsidian大型附件库/数据集/)
```

或者：

```markdown
[查看实验视频](file:///home/jack/BaiduSync/Obsidian大型附件库/视频/test.mp4)
```

---

###  二十五、最终固定方案

你以后就按这个方案：

```text
Obsidian 笔记正文：
GitHub 同步

Obsidian 图片附件：
GitHub 同步

小 PDF、SVG、截图：
GitHub 同步

视频、数据集、模型权重、大压缩包：
百度网盘同步

不要用百度网盘同步整个 Obsidian 仓库
不要把 .git 目录放进百度网盘同步
```

---

###  二十六、最短日常版

你以后每天只要记住这个就行：

```bash
cd /home/jack/a_document/obsidian/obsidian__ubuntu__project
git pull
git add .
git commit -m "更新 Obsidian 笔记和附件"
```

然后：

```text
打开 GitHub Desktop → Push origin
```

如果你要检查附件有没有被同步：

```bash
git ls-files z_资料库/attachment
```

如果你要检查附件有没有被忽略：

```bash
git check-ignore -v z_资料库/attachment/*
```

如果你要查看大文件：

```bash
find . -type f -size +50M
```

这套流程后面长期维护就够用了。
