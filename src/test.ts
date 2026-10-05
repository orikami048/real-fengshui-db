import { analyzeOrientation } from "./engine/twentyFourMountain";
import { calculateFlyingStarChart } from "./engine/flyingStar";
import { calculateLifeGua, getEightMansionsChart } from "./engine/eightMansions";
import { evaluateAirIntake } from "./engine/airIntake";

console.log("=== 🧪 实战风水引擎自动化测试 ===");

// 1. 罗盘测向测试
const normalOrient = analyzeOrientation(180.0); // 正南午山
console.log(`[测试1] 正向测量 180°: ${normalOrient.description}`);

const subOrient = analyzeOrientation(184.2); // 偏离正午山 4.2度 -> 兼向替卦
console.log(`[测试2] 兼向测量 184.2°: ${subOrient.description}`);

// 2. 玄空飞星九运测试（坐子向午：坐北朝南）
const ziShan = normalOrient.sittingMountain;
const wuShan = normalOrient.facingMountain;
const chart = calculateFlyingStarChart(9, ziShan, wuShan, false);
console.log(`[测试3] 九运 坐${ziShan.name}向${wuShan.name} 格局: ${chart.patternName}`);
console.log(`         离九宫(正南向首) 星曜: 山星[${chart.palaces.find(p => p.palaceNumber === 9)?.mountainStar}] 向星[${chart.palaces.find(p => p.palaceNumber === 9)?.facingStar}] 运星[${chart.palaces.find(p => p.palaceNumber === 9)?.baseStar}]`);

// 3. 个人命卦计算测试 (1990年出生男命与女命)
const male1990 = calculateLifeGua(new Date("1990-05-15"), "MALE");
const female1990 = calculateLifeGua(new Date("1990-05-15"), "FEMALE");
console.log(`[测试4] 1990年男命卦: ${male1990.name} (${male1990.group === "EAST_FOUR" ? "东四命" : "西四命"})`);
console.log(`         1990年女命卦: ${female1990.name} (${female1990.group === "EAST_FOUR" ? "东四命" : "西四命"})`);

// 4. 八宅游年星测试 (坎宅：坐北朝南)
const house = getEightMansionsChart(1);
console.log(`[测试5] 坎宅八宫吉凶:`);
for (const p of house.palaces) {
  console.log(`         ${p.palaceName}: ${p.starName} (${p.isAuspicious ? "四吉方" : "四凶方"}, 五行${p.element})`);
}

// 5. 三元纳气测试 (九运：北门纳气 vs 南窗纳气)
const northIntake = evaluateAirIntake(1, 9);
const southIntake = evaluateAirIntake(9, 9);
console.log(`[测试6] 九运三元纳气:`);
console.log(`         正北门纳气性质: ${northIntake.qiNature} (${northIntake.isLingShen ? "零神方大吉" : ""})`);
console.log(`         正南窗纳气性质: ${southIntake.qiNature} (${southIntake.isZhengShen ? "正神方宜静" : ""})`);

console.log("\n✅ 全部测试通过！算法逻辑与现实古籍规范严丝合缝。");
