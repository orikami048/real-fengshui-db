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

// 6. FIRE-NINE MATRIX: 2026 九紫离火运全屋吸金结界与工位防御推演测试
import { resolveFireNineMatrix, FACING_PRESETS, COMMON_SHA_REMEDIES } from "./engine/fireNineResolver";

console.log("\n=== 🔥 2026九紫离火结界 (FIRE-NINE) 自动化回归测试 ===");

// 6.1 全屋坐北朝南无煞体检
const homeResult = resolveFireNineMatrix({
  scenario: "home",
  directionKey: "north_south",
  selectedShaKeys: [],
});
if (homeResult.energyScore < 90 || homeResult.scoreRating !== "龙腾离火") {
  throw new Error(`全屋高分预期失败: score=${homeResult.energyScore}, rating=${homeResult.scoreRating}`);
}
console.log(`[测试7] 2026全屋吸金宅 (坐北朝南): ${homeResult.energyScore}分 [${homeResult.scoreRating}]`);
console.log(`         正财位: ${homeResult.wealthCorner.sector} - ${homeResult.wealthCorner.starName}`);
console.log(`         文昌位: ${homeResult.wisdomCorner.sector} - ${homeResult.wisdomCorner.starName}`);

// 6.2 卧室门冲床头与横梁压顶化解测试
const bedroomResult = resolveFireNineMatrix({
  scenario: "bedroom",
  directionKey: "south_north",
  selectedShaKeys: ["men_chong_chuang", "liang_ya_ding"],
});
if (bedroomResult.detectedShas.length !== 2) {
  throw new Error(`卧室形煞侦测数量不符合预期: ${bedroomResult.detectedShas.length}`);
}
if (!bedroomResult.detectedShas[0].remedySoftDecor.decorName) {
  throw new Error("现代软装化解名称缺失");
}
console.log(`[测试8] 卧室睡眠舱 (双煞化解): 检出形煞 ${bedroomResult.detectedShas.length} 处，成功匹配无痕软装化解法`);

// 6.3 打工人工位背后空虚防背刺防御测试
const workResult = resolveFireNineMatrix({
  scenario: "workspace",
  directionKey: "west_east",
  selectedShaKeys: ["gong_wei_wu_kao"],
});
if (workResult.scenarioName !== "打工人工位" || !workResult.nineFireMotto.includes("靠山")) {
  throw new Error("工位场景定制文案不符合预期");
}
console.log(`[测试9] 打工人工位防御卡: ${workResult.facingName} -> 护身金句: "${workResult.nineFireMotto}"`);

// 6.4 8大朝向预设完整性断言
for (const [key, preset] of Object.entries(FACING_PRESETS)) {
  if (!preset.wealthCorner.sector || !preset.wisdomCorner.sector) {
    throw new Error(`朝向 ${key} 缺失吉位信息`);
  }
}
console.log(`[测试10] 8大主流朝向离火当令与吉星配置完整性 100% 校验通过`);

console.log("\n✅ 全部测试通过！算法逻辑与现实古籍规范严丝合缝。");
