# GitHub Pages 发布

此文件夹是仓库根目录。将代码推送到 GitHub 的 main 分支，在仓库 Settings → Pages 将 Source 设为 GitHub Actions。

之后：修改内容 → 保存 → commit → push 到 main → Actions 自动构建并发布。只改本地文件不会更新线上网站。

文字与项目链接编辑 content.json。图片在 public 文件夹。音效在 SoundControl.jsx。

不要上传 node_modules、dist 或 .openai。
