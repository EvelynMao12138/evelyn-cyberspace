# 手动修改网站文字

打开同目录 content.json，只修改双引号里的文字，保留引号、逗号和括号。保存后，正在运行的本地预览会自动刷新。

- home.titleName / titleSpace：首页标题
- home.education / intro：学历背景与介绍
- home.skills：能力标签，可增删整行
- home.resumeUrl：简历链接
- sceneNames：左侧四站名称，保持四项
- projectGroups：三类作品。name 是标题，intro 是分类介绍，projects 中的 name / desc / type / url / cta 是作品名称、描述、类型、外部链接和按钮文字。

没有链接的项目使用 status。修改时不要填虚构链接。修改会影响本地网站；以后发布网站时需重新构建并上传新版。
