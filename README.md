# Real Feng Shui DB (实战风水数据库与排盘引擎)

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-green)](https://www.prisma.io/)

面向现代住宅、商业空间与别墅的**实战落地级风水数据库与排盘计算引擎**。

不仅涵盖玄学古籍理论算法，更以**现代建筑学、户型平面空间划分、室内动线气流与物理软装化解**为核心，将**玄空飞星、八宅明镜、三元纳气、内外峦头形煞**无缝融合到统一的实体数据模型中。

---

## 🌟 核心特色与现实落地价值

1. **精准罗盘与兼向判定**：
   - 支持 0.00° ~ 359.99° 连续实测度数与地磁偏角校正。
   - 依据古籍规范与实战标准（偏离中心线 $\ge 3^\circ$），自动切分 **正向下卦** 与 **兼向替卦（挨星替卦诀）**。
2. **沈氏玄空飞星全周期排盘**：
   - 包含三元九运（当前 2024–2043 下元九运）。
   - 自动推演运盘、山星盘、向星盘洛书九宫顺逆飞布。
   - 自动识别四大核心格局：**到山到向（旺山旺向）、上山下水、双星到向、双星到山、反吟伏吟**及九星组合断语。
3. **八宅明镜宅命匹配**：
   - 严格按农历立春节气干支推算居者三元本命卦（男命/女命区分）。
   - 依据坐山排定房屋宅卦（坎宅、坤宅、震宅等）与八宫游年九星（生气、延年、天医、伏位、绝命、五鬼、六煞、祸害）。
4. **现代高层三元纳气法**：
   - 针对现代电梯高层住宅、落地窗、主阳台的实战纳气评估。
   - 严格遵循九运正神（离火宜静）、零神（坎水宜动）法则，评估进气口旺气、生气、衰气、死气。
5. **峦头形煞与可落地装修化解百科**：
   - 涵盖穿堂煞、路冲、天斩煞、反弓水、壁刀煞、开门见灶、卫生间居中、横梁压顶、西北/西南缺角等。
   - 提供**现代建筑物理阻隔**（隔断屏风、磨砂门、动线调整、绿植屏障）与**传统五行化解方案**（六帝钱、泰山石敢当、山海镇、安忍水）。

---

## 🌐 网络现成资料库与开源参考调研

在架构设计与数据梳理阶段，本仓库调研并对齐了网络上主流的开源术数资源：

| 开源项目 / 数据源 | 语言 / 平台 | 特点与本仓库借鉴点 |
| :--- | :--- | :--- |
| **[6tail / lunar-typescript](https://github.com/6tail/lunar-typescript)** | TypeScript | 极高精度的公历、农历、二十四节气与干支换算库。本项目用于居者立春本命卦的精准计算。 |
| **[Sudo-Biao / Chinese-Metaphysics-Platform](https://github.com/Sudo-Biao/Chinese-Metaphysics-Platform)** | Python | 严谨的古籍术数逻辑分层，为玄空飞星洛书轨迹和九星组合断语提供了算法依据。 |
| **[Brhiza / mingyu](https://github.com/Brhiza/mingyu)** | Go / MCP | 提供八宅明镜和玄空飞星的 API 标准接口结构。 |
| **[funfwo / Fengshui](https://github.com/funfwo/Fengshui)** | Python | 专注下卦与兼向替卦排盘逻辑校验。 |
| **沈氏玄空学 & 八宅明镜古本** | 文献规范 | 校核了二十四山阴阳顺逆极性、三元龙属性与替卦秘诀口诀（子癸并甲申等）。 |

---

## 🗄️ 数据库架构设计 (Schema Architecture)

本项目采用 **Prisma ORM** 进行强类型建模，默认配置轻量 **SQLite**（开箱即用），仅需修改 `.env` 即可一键平滑切换至 **PostgreSQL**。

### 1. 术数常量与字典层 (Metaphysics Knowledge)
- `Period`: 三元九运字典（一运至九运年份与五行八卦）
- `TwentyFourMountain`: 罗盘二十四山（八卦所属、度数范围、三元龙、阴阳极性、替卦星）
- `NineStar`: 紫白九星全属性（五行、本宫、人体部位、健康影响、生旺与克泄五行）
- `EightMansionsStar`: 八宅游年星（四吉四凶属性、影响力评级）
- `FormShaDict`: 现代空间内外峦头形煞百科（成因、危害评级、物理软装化解、风水物化解）

### 2. 现实空间与物业层 (Spatial Property)
- `Property`: 房产实体（建造/入住年份、归属元运、向首/坐山精确度数、是否兼向）
- `Resident`: 居者人员档案（公历出生日期、立春干支年、男女命卦、东四/西四命）
- `FloorPlan`: 户型平面图（楼层、长宽尺寸、天心十道立极点相对坐标、正北夹角）
- `RoomZone`: 室内功能空间分区（大门、客厅、主卧、灶台、卫生间、阳台；所在九宫与纳气口标记）
- `MissingCorner`: 户型缺角/凸角记录（方位九宫、缺角比例、健康与家庭影响、补角措施）
- `InternalShaRecord` / `ExternalShaRecord`: 室内外实测形煞记录

### 3. 排盘诊断与推演层 (Assessment Engine)
- `Assessment`: 一次完整的风水实勘评估事务（综合评分、流年干支、评估师）
- `FlyingStarChart` / `FlyingStarPalace`: 玄空飞星九宫明细（运星、山向星顺逆、格局断语）
- `EightMansionsChart` / `EightMansionsPalace`: 宅卦与八宫吉凶游年分布
- `AirIntakeChart`: 三元纳气门窗动气评估（正神/零神、生旺衰死气）
- `RemedyPlan`: 实战落地调理清单（优先级、装修施工、家具挪位、材料软装、完成打卡标记）

---

## 🚀 快速开始 (Quick Start)

### 1. 克隆与安装依赖
```bash
git clone https://github.com/orikami048/real-fengshui-db.git
cd real-fengshui-db
npm install
```

### 2. 生成 Prisma Client 与数据库建表
```bash
npx prisma generate
npx prisma db push
```

### 3. 一键初始化种子数据 (包含古籍规范与真实住宅勘测全流程案例)
```bash
npm run db:seed
```
运行后将自动：
1. 导入 9 个三元九运、24 座二十四山精确角度、9 颗紫白九星、8 大游年星、10 条实战形煞百科。
2. 完整建档演示案例：**某高层住宅 1603 室（2024年九运交付、坐子向午、玄关穿堂煞诊断、九宫排盘与落地整改清单）**。

### 4. 运行引擎单元测试
```bash
npm test
```

---

## 💻 代码调用示例 (Engine Usage)

### 1. 罗盘测向与兼向分析
```typescript
import { analyzeOrientation } from "real-fengshui-db";

// 输入实测向首度数（例如向首 184.2°）
const result = analyzeOrientation(184.2);
console.log(result.description);
// 输出: 坐子向午（兼向替卦，偏离4.2°）
```

### 2. 玄空飞星排盘
```typescript
import { calculateFlyingStarChart } from "real-fengshui-db";

// 计算九运、坐子山向午山（正向）星盘
const chart = calculateFlyingStarChart(9, result.sittingMountain, result.facingMountain, false);
console.log(`格局判定: ${chart.patternName}`);
// 查看离九宫（正南方向首）
const southPalace = chart.palaces.find(p => p.palaceNumber === 9);
console.log(`离宫星曜: 山星[${southPalace.mountainStar}] 向星[${southPalace.facingStar}] 运星[${southPalace.baseStar}]`);
```

### 3. 计算居者三元命卦与八宅游年
```typescript
import { calculateLifeGua, getEightMansionsChart } from "real-fengshui-db";

const lifeGua = calculateLifeGua(new Date("1990-05-15"), "MALE");
console.log(`居者命卦: ${lifeGua.name} (${lifeGua.group === "EAST_FOUR" ? "东四命" : "西四命"})`);

// 坎宅（坐北朝南）八宫吉凶
const houseChart = getEightMansionsChart(1);
console.log(houseChart.palaces);
```

### 4. 评估现代门窗三元纳气
```typescript
import { evaluateAirIntake } from "real-fengshui-db";

// 评估九运正北方（坎一宫）大门纳气
const northIntake = evaluateAirIntake(1, 9);
console.log(northIntake.qiNature); // 旺气（当运大吉） (零神方见动气大吉)
```

---

## 📂 项目目录结构

```
real-fengshui-db/
├── data/                         # 现成标准术数资料库 (JSON)
│   ├── periods.json              # 三元九运划分标准 (1864 - 2043)
│   ├── twenty_four_mountains.json# 罗盘二十四山精确角度、三元龙与替卦
│   ├── nine_stars.json           # 紫白九星全属性、疾病与行业象意
│   ├── eight_mansions.json       # 八宅游年四吉四凶星
│   └── form_sha.json             # 峦头形煞与现代物理/五行化解百科
├── prisma/
│   └── schema.prisma             # 完整实战风水数据库 Schema 定义
├── src/
│   ├── engine/                   # 纯 TypeScript 排盘核心算法引擎
│   │   ├── twentyFourMountain.ts # 罗盘度数、山向转换、下卦兼向判定
│   │   ├── flyingStar.ts         # 玄空飞星九宫洛书轨迹顺逆算法
│   │   ├── eightMansions.ts      # 八宅宅卦推演与立春三元命卦算法
│   │   └── airIntake.ts          # 三元纳气法门窗动气评估
│   ├── seed.ts                   # 种子数据填充与真实勘测实战案例建档
│   ├── test.ts                   # 核心算法与古籍规范单元测试
│   └── index.ts                  # 入口导出
├── package.json
└── tsconfig.json
```

---

## 🔮 路线图 (Roadmap)

- [x] 罗盘 24 山度数与兼向替卦自动判定
- [x] 沈氏玄空飞星九宫排盘引擎与四大格局推演
- [x] 八宅明镜宅命配合与三元命卦计算
- [x] 现代高层三元纳气法则
- [x] 实战峦头形煞库与物理装修化解指南
- [x] Prisma SQLite/PostgreSQL 完整数据模型与种子脚本
- [ ] 交互式户型图 Canvas / SVG 九宫放射线立极标注
- [ ] 移动端陀螺仪与电子罗盘实时指向排盘集成
- [ ] 集成 LLM 大模型根据诊断记录自动输出定制风水调理报告

---

## 📄 开源许可证

本项目遵循 [MIT License](LICENSE) 开源协议。
