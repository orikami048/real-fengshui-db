# Real Feng Shui Database & Interactive Studio (实战风水数据库与可视化工作台)

<div align="center">

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-yellow.svg)](https://www.python.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-green)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-Prebuilt%20DB-003B57?logo=sqlite)](database/fengshui_master.sqlite)

面向现代住宅、商业空间与别墅的**实战落地级风水知识库、排盘计算引擎与交互式可视化工作台**。

完全对齐 [bazi-liuyao-database](https://github.com/orikami048/bazi-liuyao-database) 规范，独立拆分构建。

</div>

---

## 🌟 Overview & Highlights

1. **多流派数学化严谨排盘**：
   - **沈氏玄空飞星**：洛书九宫轨迹顺逆飞布，支持下元九运（2024–2043）、下卦正向与兼向替卦（挨星替卦诀），自动判定四大格局（旺山旺向/上山下水/双星到向/双星到山）与星曜交会吉凶。
   - **八宅明镜宅法**：严守立春干支计算居者男女三元命卦（东四命/西四命），推演八大宅卦与八宫游年星（生气、延年、天医、伏位、绝命、五鬼、六煞、祸害）。
   - **现代高层三元纳气法**：以门窗阳台为动气口，严格遵循九运正神（离火宜静）、零神（坎水宜动）法则，评估生旺衰死气。
   - **《协纪辨方书》传统择日学**：融入建除十二神黄黑道排演，严避岁破、月破、流年三煞与五黄凶位，专攻入宅乔迁、开业开市、动土开工吉日吉时。
   - **峦头形煞与可落地装修化解**：穿堂煞、卫生间居中、开门见灶、横梁压顶、天斩煞、缺角煞等，提供现代建筑物理软装阻隔与五行化解方案。
2. **多形态交付与即插即用**：
   - **🤖 开放 Agent Skills 规范标准集成 (`SKILL.md` / `skills/fengshui-master/`)**：对齐 [agentskills.io](https://agentskills.io) 标准，内置「堪舆子 · 江南三元派传人」传统顾问，支持在 Claude Code、Codex CLI、Antigravity 等智能体中无缝调用。
   - **🖥️ 开箱即用 Web 交互式界面 (`index.html`)**：零依赖纯前端与本地 Web 服务，提供 360° 交互式罗盘、彩色九宫飞星盘、八宅吉凶卡片、协纪择日矩阵、堪舆子顾问弹窗与一键打印诊断报告。
   - **🐍 独立 CLI 排盘引擎 (`scripts/fengshui_paipan.py`)**：单文件跨平台排盘，支持九宫排盘、`--zeri` 择日推演与 `--json` 机器格式输出。
   - **💾 预构建单文件 SQLite 数据库 (`database/fengshui_master.sqlite`)**：内置 24 山、九星、八宅、形煞、择日及真实住宅实勘案例。
   - **📚 体系化理论与实战案例 (`references/`, `cases/`)**：7 篇核心理论白皮书（含择日学与五行干支）与 2 篇真实住宅勘测工程化解案例。

---

## 🤖 智能体 Skill 使用 (Agent Skill Usage)

本项目已完整接入 [voidforall/fengshui.skill](https://github.com/voidforall/fengshui.skill) 标准，仓库本身即为一个完整的 Agent Skill：

```bash
# 方式 1：使用 npx skills 一键安装
npx skills add orikami048/real-fengshui-db

# 方式 2：在 Claude Code / Codex CLI 中直接作为风水顾问使用
# 触发场景：阳宅朝向分析、入宅开业择日、煞气化解建议、风水典籍答疑
```

---

## 🖥️ 可视化交互工作台 (Web Studio)

本项目内置极具东方美学的交互式风水评估工作台，**两种方式均可一键启动**：

### 方式 1：双击本地运行（零依赖）
直接在文件管理器中双击打开根目录的 [`index.html`](file:///C:/Users/kami/.gemini/antigravity/scratch/real-fengshui-db/index.html)，即可在任意现代浏览器中离线流畅运行！

### 方式 2：本地 Node.js 服务器启动
```bash
npm run start
# 浏览器访问: http://localhost:3000
```

### 界面核心交互特性：
- **🧭 360° 动态罗盘定向器**：拖动滑块或输入向首角度，罗盘指针实时旋转，自动判定坐山、向山、八卦宫位、三元龙极性，并实时侦测“正向下卦”或“兼向替卦”（偏离中心线 $\ge 3^\circ$ 自动切替卦）。
- **九宫洛书交互飞星盘**：彩色渲染山星、向星与运星，醒目高亮九运当令旺星与二五交加大煞；点击任一宫位即可查看星曜组合秘传断语与现代调理指导。
- **八宅宅命配合器**：输入居者出生年份与性别，自动推算三元本命卦与宅卦八宫游年分布。
- **三元纳气门窗体检**：评估大门与阳台纳气属性，指导落地窗纱帘与玄关动线。
- **📅 协纪择日与吉时排演**：一键推演入宅/开市/动土吉日，十二建星黄黑道吉凶矩阵，标示岁破、月破与流年三煞大禁。
- **🎎 堪舆子顾问弹窗**：随时呼出江南三元派传人，提供引经据典的白话专业解惑。
- **🖨️ 一键打印报告**：点击“打印/导出实战风水诊断勘测报告”，生成整洁的 PDF 或纸质施工方案。

---

## 🚀 命令行 CLI 使用 (CLI Usage)

### Python 独立排盘与择日 CLI (`scripts/fengshui_paipan.py`)
```bash
# 1. 默认九运、向首 180°（坐正北子山 向正南午山）
python scripts/fengshui_paipan.py --facing 180

# 2. 兼向替卦测试（偏离正山超过3度）
python scripts/fengshui_paipan.py --facing 184.2

# 3. 《协纪辨方书》择日排演 (2026年农历6月入宅)
python scripts/fengshui_paipan.py --zeri --year 2026 --month 6 --event 入宅

# 4. 输出机器可读 JSON 数据给 API 或大模型
python scripts/fengshui_paipan.py --facing 180 --json
python scripts/fengshui_paipan.py --zeri --year 2026 --month 6 --json
```

---

## 🗂️ 仓库架构目录 (Repository Architecture)

```
real-fengshui-db/
├── index.html                            # 🖥️ 开箱即用 Web 交互式工作台主入口（双击直接运行）
├── app/
│   └── index.html                        # 现代可视化前端应用源码
│
├── scripts/                              # 🐍 核心计算与排盘引擎 CLI
│   └── fengshui_paipan.py                # 独立 Python 排盘工具（终端九宫飞星、格局与 JSON 导出）
│
├── data/                                 # 🗄️ 标准机器可读 JSON 数据集
│   ├── periods.json                      # 三元九运划分标准 (1864 - 2043)
│   ├── twenty_four_mountains.json        # 罗盘二十四山精确角度、三元龙与替卦诀
│   ├── nine_stars.json                   # 紫白九星全属性、疾病与行业象意
│   ├── eight_mansions.json               # 八宅大游年四吉四凶星
│   └── form_sha.json                     # 常见峦头形煞与现代建筑软装物理化解字典
│
├── database/                             # 💾 预构建单文件 SQLite 数据库
│   └── fengshui_master.sqlite            # 开箱即用预填充关系型数据库
│
├── references/                           # 📚 深度理论与计算准则白皮书
│   ├── 00_gainian_suoyin.md              # 概念索引与二十四山分金秘要
│   ├── 01_xuankong_feixing.md            # 沈氏玄空飞星排盘与三元九运吉凶推断
│   ├── 02_bazhai_mingjing.md             # 八宅明镜宅法、东四西四命卦与游年吉凶
│   ├── 03_sanyuan_naqi.md                # 现代高层住宅三元纳气法与零正神动气法则
│   └── 04_luantou_xingsha_huajie.md      # 峦头形煞大全与现代建筑室内物理软装化解手册
│
├── cases/                                # 📝 真实住宅实战勘测工程案例
│   ├── 01_gaoceng_chuangtang_erwu_huajie.md # 现代高层穿堂煞与二五交加综合化解实录
│   └── 02_jiuyun_zhengbei_naqi_office.md    # 下元九运正北零神纳气商业选址与布局实战案
│
├── src/                                  # ⚡ TypeScript 引擎与服务模块
│   ├── engine/                           # 算法核心（24山、飞星、八宅、三元纳气）
│   ├── seed.ts                           # Prisma 数据库种子填充与实战案例建档
│   ├── test.ts                           # 核心算法自动化测试脚本
│   └── server.ts                         # 零依赖本地轻量静态 HTTP 服务器
│
├── prisma/
│   └── schema.prisma                     # 工业级强类型数据库 Prisma Schema 模型
├── package.json
└── tsconfig.json
```

---

## 💾 SQLite 数据库查询示例

你可以使用任意 SQLite 工具或客户端直接打开 `database/fengshui_master.sqlite` 进行 SQL 查询：

```sql
-- 1. 查询九运中正南向（午山）的相关属性
SELECT name, chineseTrigram, palaceNumber, yuanDragon, polarity, substituteStar 
FROM TwentyFourMountain 
WHERE name = '午';

-- 2. 查询现代室内危害评级最高的形煞与物理化解建议
SELECT name, hazardLevel, impactOnWealth, physicalRemedy 
FROM FormShaDict 
WHERE category = 'INTERNAL' AND hazardLevel >= 4;

-- 3. 查询数据库中预存的真实住宅勘测评估得分与朝向
SELECT title, propertyType, facingDegree, mountainSitting, mountainFacing 
FROM Property;
```

---

## 🔮 路线图 (Roadmap)

- [x] 完整对齐 `bazi-liuyao-database` 规格架构并独立拆分
- [x] 预构建独立 `database/fengshui_master.sqlite`
- [x] 独立 `scripts/fengshui_paipan.py` 终端命令行工具
- [x] 深度学术级理论 Markdown 体系 (`references/`)
- [x] 现实生活工程化解实战案例库 (`cases/`)
- [x] 交互式现代 Web 工作台与 360° 动态罗盘 (`index.html`)
- [ ] 户型图 Canvas 交互式天心立极与放射线户型标注组件
- [ ] 结合手机陀螺仪的 Web 实时电子罗盘指向功能
- [ ] 集成 LLM 大模型根据勘测数据一键生成 PDF 深度定制诊断报告

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE) — open and free for personal study, academic research, and commercial applications.
