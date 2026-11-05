# 视觉来源

- 上海交通大学视觉形象识别系统标准色规范：https://vi.sjtu.edu.cn/index.php/articles/base/3 。官方图示RGB为200、22、30，网页十六进制色值为`#C8161E`。访问日期2026-11-04。
- `sjtu-campus.jpg`：上海交通大学视觉形象识别系统首页官方校门背景图，原始URL https://vi.sjtu.edu.cn/img/hero2.jpg ，来源页 https://vi.sjtu.edu.cn/ ，访问日期2026-11-04。图片版权归原权利人；本课程作品引用，代码许可不覆盖图片。保留图像比例，使用CSS渐变/透明蒙层适配内容。
- 网站是课程学习作品，不是学校官方服务。竞途名称与界面组件为项目自制，沿用知径课程项目的视觉风格。

- `icons/*.svg`: 本项目绘制的箭头线条图标，用于替代字体符号。

- `sjtu-cs-logo.png`：上海交通大学计算机学院官网页脚官方标识，来源页 https://cs.sjtu.edu.cn/ ，原始 URL https://cs.sjtu.edu.cn/img/logo2.png ，访问日期 2026-11-04。保留原始比例和透明度，以 CSS 遮罩呈现交大红，仅作为课程项目视觉来源留档，未用于页面身份声明。版权归原权利人。

## 本地自托管字体

- 上游：Noto CJK，https://github.com/notofonts/noto-cjk 。素材取自Ubuntu/Debian `fonts-noto-cjk` 软件包，不从第三方字体下载站获取；字体名称、字重、版权和许可证均读取 TTC 元数据及软件包自带版权文档核对。
- `fonts/noto-sans-sc-regular.woff2`：Noto Sans CJK SC Regular，字重 400，288,204 字节，用于正文；原文件 `NotoSansCJK-Regular.ttc` 的 SC 字体（集合索引 2）。
- `fonts/noto-sans-sc-bold.woff2`：Noto Sans CJK SC Bold，字重 700，294,000 字节，用于强调文字；本机未安装 Medium，使用 Bold。原文件 `NotoSansCJK-Bold.ttc` 的 SC 字体（集合索引 2）。
- `fonts/noto-serif-sc-bold.woff2`：Noto Serif CJK SC Bold，字重 700，415,820 字节，用于标题；本机未安装 SemiBold，使用 Bold。原文件 `NotoSerifCJK-Bold.ttc` 的 SC 字体（集合索引 2）。
- 三个 WOFF2 合计 998,024 字节，版本10保留版本9生成的字形超集，未重新裁剪或改动字体文件。生成时以 `index.html`、`app.js`、`data.js`（含 HTML 实体与 Unicode 转义）、主标题、校园文字及 ASCII 可打印字符为语料，共936个输入字符、809个汉字；该生成语料当时为41项赛事。现已按当前30项赛事、25门课程的页面与动态数据重新核验：896个输入字符、769个汉字，三份字体均完整覆盖，包括“全国大学生电子设计竞赛”、主标题“学海砺羽，赛场亮剑”及恢复的“聚焦计算机与信息类本科生的参赛选择。”。生成语料与当前验证语料的哈希分别保存在 manifest 中。原字体未包含的 `⌕` 符号使用系统字体回退；CSV UTF-8 BOM 不参与页面文字呈现。
- Noto Sans 版权 © 2014–2021 Adobe；Noto Serif 版权 © 2017–2024 Adobe。均按 SIL Open Font License 1.1 保留许可，完整版权及许可文本随附 `fonts/OFL-1.1.txt`；子集与源文件哈希及字符核对见 `fonts/subset-manifest.json`。新增页面文字时需重新生成字符子集，或保留系统字体回退。

- `sjtu-emblem.png`：上海交通大学视觉形象识别系统提供的独立透明校徽原图，2805×2806 px。来源页 https://vi.sjtu.edu.cn/index.php/articles/bulletin/13 ，原始 URL https://vi.sjtu.edu.cn/uploads/files/caf2f5045c47308250fab3812dfe2003-6896b91594f238b24e67696224948251.png ，访问日期 2026-11-05。原图文件未编辑，以 CSS 转白并设为最高9%不透明度（手机7.5%），叠加由左侧透明到右侧逐渐显现的透明度遮罩，右侧放大展示并由容器裁去右侧三分之一。SHA-256：112aa440081904cd37125ccd9b4f383d631461bc570551497ef04afeb41292da。版权归原权利人。
