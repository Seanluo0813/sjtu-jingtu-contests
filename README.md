# 竞途 · 本科生竞赛导航

面向计算机与电子信息类本科生的静态竞赛导航网站，沿用上海交通大学红色、校园渐变与高清校徽水印设计。主标题为“学海砺羽，赛场亮剑”。本项目是课程作品，不是学校官方服务。

## 当前内容

- 30项赛事：保留原14项，补充16项；覆盖5类方向、25门关联课程。
- 所有赛制与报名资料采用2023届／2023赛季历史证据；跨至2022年的报名窗口保留真实日期。
- 报名窗口17项完整、9项单端日期、4项精确日期未知；28项支持团队参赛。未知日期不填预测值。
- 聚焦软件、算法、数据、AI、电子设计、嵌入式、机器人、通信和信息安全等直接技术方向；上一轮41项中关联较远的11项已移除。

支持方向、年级、课程、个人／团队筛选，关键词搜索、收藏、最多3项对比、报名日历、统计和CSV导出。搜索“电赛”或“NUEDC”可找到全国大学生电子设计竞赛。右上圆环中心恢复所有方向，保留其他筛选，并平滑滚动到探索区。桌面双栏900px，中屏920px，手机列表470px。

## GitHub Pages 已发布

正式网址：[竞途 · GitHub Pages](https://seanluo0813.github.io/sjtu-jingtu-contests/)。

本仓库根目录就是完整静态站点，入口为 [index.html](index.html)。当前从 `main` 分支根目录发布，已启用HTTPS，随附 `.nojekyll`。无需安装前端依赖或运行构建；GitHub自动完成Pages部署。

相对资源、字体、数据下载和锚点路由已按 `/sjtu-jingtu-contests/` 子路径验证。公开首页及 `data.json` 匿名访问均返回HTTP 200，数据为30项赛事、25门课程、2023届历史资料。

仓库：[Seanluo0813/sjtu-jingtu-contests](https://github.com/Seanluo0813/sjtu-jingtu-contests)。首次[Pages部署运行](https://github.com/Seanluo0813/sjtu-jingtu-contests/actions/runs/41994101389)已成功。原有[Sites页面](https://sjtu-jingtu-contests.fuzzypond513.chatgpt.site/)继续保留。

离线查看可直接打开 `index.html`，数据由随附 `data.js` 载入。收藏仅保存在当前浏览器，无账号、数据库或后端服务。

## 数据与资料

- [结构化数据](data.json)、[逐项官方资料来源](sources.md)。
- [2023竞赛目录依据](ranking-source.md)、[当前30项范围与增删记录](catalog-audit.md)。
- 赛事目录来自中国高等教育学会2023目录；目录序号不是赛事排名，列入目录不代表所在学校A类认定。
- 方向、课程关联和推荐年级为项目整理；正式资格、队伍人数、报名安排以所引2023届次、赛道或赛区资料为准。

## 素材和许可

素材来源见 [ASSET_SOURCES.md](assets/ASSET_SOURCES.md)。Noto Sans CJK SC、Noto Serif CJK SC自托管字体为SIL Open Font License 1.1，完整许可随 [OFL-1.1.txt](assets/fonts/OFL-1.1.txt) 保留；字体元数据与校验见 [subset-manifest.json](assets/fonts/subset-manifest.json)。三份字体共998,024字节，保留覆盖当前30项全部中文的字形超集。

校园照片与校徽版权归各自原权利人，来源及引用范围见素材说明；字体许可不授予照片、校徽的再许可。新增页面文字时应核验字体字形覆盖。
