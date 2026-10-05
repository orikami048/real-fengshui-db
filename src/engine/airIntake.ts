export interface AirIntakeResult {
  palaceNumber: number;
  palaceName: string;
  currentPeriod: number;
  qiNature: "旺气（当运大吉）" | "生气（未来吉气）" | "佐气（小吉）" | "衰气（退气泄耗）" | "死气（大凶损财）";
  isZhengShen: boolean; // 是否正神方
  isLingShen: boolean;  // 是否零神方
  recommendation: string;
}

const PALACE_NAMES: Record<number, string> = {
  1: "坎一宫（正北）",
  2: "坤二宫（西南）",
  3: "震三宫（正东）",
  4: "巽四宫（东南）",
  6: "乾六宫（西北）",
  7: "兑七宫（正西）",
  8: "艮八宫（东北）",
  9: "离九宫（正南）"
};

/**
 * 现代高层住宅三元纳气法门窗动气评估
 * @param intakePalace 纳气口所在九宫方位（1~9，中宫除外）
 * @param currentPeriod 当前三元元运（当前为 9 运）
 */
export function evaluateAirIntake(intakePalace: number, currentPeriod = 9): AirIntakeResult {
  const palaceName = PALACE_NAMES[intakePalace] || "未知方位";

  // 下元九运（2024-2043）法则：
  // 正神方：离九宫（正南） -> 宜静、见高山高楼为吉；若开大门大窗纳动气反成“正神下水”，主退财伤目。
  // 零神方：坎一宫（正北） -> 宜动、纳动水、开主门窗大吉，主大发其财！
  // 照神方：兑七宫（正西）、震三宫（正东）等生旺佐气。
  
  const isZhengShen = intakePalace === currentPeriod;
  const isLingShen = intakePalace === 1; // 九运零神正对坎一宫

  let qiNature: AirIntakeResult["qiNature"] = "衰气（退气泄耗）";
  let recommendation = "";

  if (currentPeriod === 9) {
    if (intakePalace === 1) {
      qiNature = "旺气（当运大吉）";
      recommendation = "【零神大吉方】：正北方为九运正零神位，此方开大门、开主阳台、见活水动气最吉，主大发财源、事业腾飞！";
    } else if (intakePalace === 9) {
      qiNature = "死气（大凶损财）";
      recommendation = "【正神方忌见动气】：正南方为九运当令正神，宜实墙、靠山、静修；若大窗大门强风直入纳动气，主犯正神下水，宜拉轻纱帘缓冲。";
    } else if (intakePalace === 2 || intakePalace === 4) {
      qiNature = "生气（未来吉气）";
      recommendation = "【近旺生气吉方】：纳气生机盎然，利人际缘分与投资。";
    } else if (intakePalace === 8) {
      qiNature = "衰气（退气泄耗）";
      recommendation = "【退气方】：八运已过，艮方为退气，此方门窗纳气主平稳守成，不宜过大动态气流。";
    } else {
      qiNature = "佐气（小吉）";
      recommendation = "【辅佐平和方】：气场平稳无冲煞，保持采光通风良好即可。";
    }
  } else {
    recommendation = `当前元运为 ${currentPeriod} 运，此方位气场平稳。`;
  }

  return {
    palaceNumber: intakePalace,
    palaceName,
    currentPeriod,
    qiNature,
    isZhengShen,
    isLingShen,
    recommendation
  };
}
