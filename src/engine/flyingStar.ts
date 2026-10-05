import { MountainInfo } from "./twentyFourMountain";
import mountainsData from "../../data/twenty_four_mountains.json";

const mountains: MountainInfo[] = mountainsData as MountainInfo[];

// 洛书轨迹宫位编号顺序: 中(5) -> 乾(6) -> 兑(7) -> 艮(8) -> 离(9) -> 坎(1) -> 坤(2) -> 震(3) -> 巽(4)
export const LUO_SHU_ORDER = [5, 6, 7, 8, 9, 1, 2, 3, 4];

export const PALACE_NAMES: Record<number, string> = {
  1: "坎一宫（正北）",
  2: "坤二宫（西南）",
  3: "震三宫（正东）",
  4: "巽四宫（东南）",
  5: "中五宫（中天）",
  6: "乾六宫（西北）",
  7: "兑七宫（正西）",
  8: "艮八宫（东北）",
  9: "离九宫（正南）"
};

/**
 * 洛书飞星九宫排布函数
 * @param centerStar 入中星数 (1~9)
 * @param direction "FORWARD"(顺飞) | "BACKWARD"(逆飞)
 * @returns Map<宫位ID(1~9), 飞临星数(1~9)>
 */
export function flyStars(centerStar: number, direction: "FORWARD" | "BACKWARD" = "FORWARD"): Map<number, number> {
  const result = new Map<number, number>();
  for (let step = 0; step < LUO_SHU_ORDER.length; step++) {
    const palace = LUO_SHU_ORDER[step];
    let star: number;
    if (direction === "FORWARD") {
      star = ((centerStar - 1 + step) % 9) + 1;
    } else {
      star = ((centerStar - 1 - step) % 9 + 9) % 9 + 1;
    }
    result.set(palace, star);
  }
  return result;
}

/**
 * 根据元运及入中星，推导飞星阴阳与顺逆性
 * @param star 入中星 (1~9)
 * @param dragon 元龙类型 (天元龙 / 地元龙 / 人元龙)
 */
export function getStarFlightPolarity(star: number, dragon: string): "FORWARD" | "BACKWARD" {
  // 当运星入中为 5 (五黄中宫) 时，五黄无卦，根据山向本宫的原元龙阴阳来定（阳顺阴逆）
  if (star === 5) {
    return "FORWARD";
  }

  // 找到星数对应八卦宫位中，同元龙的那座山
  const targetMountain = mountains.find(
    (m) => m.palaceNumber === star && m.yuanDragon === dragon
  );

  if (!targetMountain) {
    return "FORWARD";
  }

  return targetMountain.polarity === "阳" ? "FORWARD" : "BACKWARD";
}

export interface FlyingStarPalaceDetail {
  palaceNumber: number;
  directionName: string;
  baseStar: number;       // 运星
  mountainStar: number;   // 山星
  mountainFlight: "FORWARD" | "BACKWARD";
  facingStar: number;     // 向星
  facingFlight: "FORWARD" | "BACKWARD";
  combinationDesc: string; // 星宿组合意象
  starAuspicious: "大吉" | "吉" | "平" | "凶" | "大凶";
}

export interface FlyingStarChartResult {
  period: number;
  sittingMountain: MountainInfo;
  facingMountain: MountainInfo;
  chartType: "下卦（正向）" | "替卦（兼向）";
  patternName: "旺山旺向" | "双星到向" | "双星到山" | "上山下水" | "普通格局";
  palaces: FlyingStarPalaceDetail[];
}

/**
 * 完整玄空飞星排盘计算
 */
export function calculateFlyingStarChart(
  period: number,
  sitting: MountainInfo,
  facing: MountainInfo,
  isSubstitute = false
): FlyingStarChartResult {
  // 1. 运盘：元运入中，一律顺飞
  const baseChart = flyStars(period, "FORWARD");

  // 2. 坐山飞星：
  // 查找坐山所在九宫对应的运星
  const sittingPalaceBaseStar = baseChart.get(sitting.palaceNumber)!;
  const mountainStarInCenter = isSubstitute ? sitting.substituteStar : sittingPalaceBaseStar;
  const mountainFlight = getStarFlightPolarity(mountainStarInCenter, sitting.yuanDragon);
  const mountainChart = flyStars(mountainStarInCenter, mountainFlight);

  // 3. 向首飞星：
  const facingPalaceBaseStar = baseChart.get(facing.palaceNumber)!;
  const facingStarInCenter = isSubstitute ? facing.substituteStar : facingPalaceBaseStar;
  const facingFlight = getStarFlightPolarity(facingStarInCenter, facing.yuanDragon);
  const facingChart = flyStars(facingStarInCenter, facingFlight);

  // 4. 分析格局：以当令元运九星为判定核心
  const currentLeaderStar = period;
  const sittingPalaceMountainStar = mountainChart.get(sitting.palaceNumber)!;
  const sittingPalaceFacingStar = facingChart.get(sitting.palaceNumber)!;
  const facingPalaceMountainStar = mountainChart.get(facing.palaceNumber)!;
  const facingPalaceFacingStar = facingChart.get(facing.palaceNumber)!;

  let patternName: FlyingStarChartResult["patternName"] = "普通格局";
  if (sittingPalaceMountainStar === currentLeaderStar && facingPalaceFacingStar === currentLeaderStar) {
    patternName = "旺山旺向"; // 丁财两旺，至吉之局
  } else if (sittingPalaceFacingStar === currentLeaderStar && facingPalaceMountainStar === currentLeaderStar) {
    patternName = "上山下水"; // 损丁破财，需峦头颠倒方可救
  } else if (facingPalaceMountainStar === currentLeaderStar && facingPalaceFacingStar === currentLeaderStar) {
    patternName = "双星到向"; // 旺财损丁，向首宜有水外有案山
  } else if (sittingPalaceMountainStar === currentLeaderStar && sittingPalaceFacingStar === currentLeaderStar) {
    patternName = "双星到山"; // 旺丁损财，坐山宜有山有环水
  }

  // 5. 九宫明细拼装与玄空秘诀断语
  const palaces: FlyingStarPalaceDetail[] = [];
  for (let p = 1; p <= 9; p++) {
    const b = baseChart.get(p)!;
    const m = mountainChart.get(p)!;
    const f = facingChart.get(p)!;

    // 常见玄空古赋断语匹配
    let desc = `山星[${m}] 向星[${f}] 运星[${b}]`;
    let level: FlyingStarPalaceDetail["starAuspicious"] = "平";

    const pair = `${Math.min(m, f)}${Math.max(m, f)}`;
    if (m === 2 && f === 5 || m === 5 && f === 2) {
      desc += "；【二五交加】必损主，主疾病死亡大煞，极凶！宜用六帝钱、安忍水重金化解。";
      level = "大凶";
    } else if (m === 9 && f === 9) {
      desc += "；【九紫双逢】当令旺星聚首，喜气盈门，利文明显达、财运爆发！";
      level = "大吉";
    } else if (pair === "14") {
      desc += "；【一四同宫】准发科名，利读书升学考职、名闻遐迩。";
      level = "吉";
    } else if (pair === "68") {
      desc += "；【六八齐到】武曲左辅汇聚，富比陶朱，利仕途财富。";
      level = "吉";
    } else if (pair === "23") {
      desc += "；【斗牛煞】二黑土逢三碧木，主官非口舌、母子不和、胃疾。";
      level = "凶";
    } else if (pair === "67") {
      desc += "；【交剑煞】乾金克兑金，主刀兵开刀外伤、争斗流血。";
      level = "凶";
    } else if (m === period || f === period) {
      level = "吉";
    }

    palaces.push({
      palaceNumber: p,
      directionName: PALACE_NAMES[p],
      baseStar: b,
      mountainStar: m,
      mountainFlight,
      facingStar: f,
      facingFlight,
      combinationDesc: desc,
      starAuspicious: level
    });
  }

  return {
    period,
    sittingMountain: sitting,
    facingMountain: facing,
    chartType: isSubstitute ? "替卦（兼向）" : "下卦（正向）",
    patternName,
    palaces
  };
}
