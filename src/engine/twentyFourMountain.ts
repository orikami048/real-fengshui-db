import mountainsData from "../../data/twenty_four_mountains.json";

export interface MountainInfo {
  name: string;
  chineseTrigram: string;
  palaceNumber: number;
  element: string;
  yuanDragon: string;
  polarity: "阳" | "阴";
  centerDegree: number;
  minDegree: number;
  maxDegree: number;
  substituteStar: number;
  substituteGua: string;
}

export interface OrientationAnalysis {
  facingDegree: number;
  sittingDegree: number;
  facingMountain: MountainInfo;
  sittingMountain: MountainInfo;
  isSubstitute: boolean;
  deviationDegree: number; // 偏离中心角度数
  orientationType: "下卦（正向）" | "替卦（兼向）";
  description: string;
}

const mountains: MountainInfo[] = mountainsData as MountainInfo[];

/**
 * 标准化角度至 [0, 360) 范围内
 */
export function normalizeDegree(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

/**
 * 根据实测向首度数匹配二十四山
 */
export function getMountainByDegree(degree: number): MountainInfo {
  const norm = normalizeDegree(degree);

  // 特殊处理跨越 0 度的子山 (352.5 ~ 7.5)
  for (const m of mountains) {
    if (m.name === "子") {
      if (norm >= 352.5 || norm < 7.5) {
        return m;
      }
    } else {
      if (norm >= m.minDegree && norm < m.maxDegree) {
        return m;
      }
    }
  }

  // 兜底返回子山
  return mountains[0];
}

/**
 * 完整解析朝向罗盘测量数据（向度与坐度）
 * 实战标准：偏离正山中心线超过 3.0°（沈氏玄空及现代实务界定）即论兼向替卦
 */
export function analyzeOrientation(facingDegree: number, magneticDeclination = 0.0): OrientationAnalysis {
  const trueFacingDegree = normalizeDegree(facingDegree + magneticDeclination);
  const trueSittingDegree = normalizeDegree(trueFacingDegree + 180);

  const facingMountain = getMountainByDegree(trueFacingDegree);
  const sittingMountain = getMountainByDegree(trueSittingDegree);

  // 计算向首偏离该山中心线的角度绝对值
  let diff = Math.abs(trueFacingDegree - facingMountain.centerDegree);
  if (diff > 180) diff = 360 - diff;

  const isSubstitute = diff > 3.0; // 偏离超过3度起替卦兼向

  return {
    facingDegree: trueFacingDegree,
    sittingDegree: trueSittingDegree,
    facingMountain,
    sittingMountain,
    isSubstitute,
    deviationDegree: parseFloat(diff.toFixed(2)),
    orientationType: isSubstitute ? "替卦（兼向）" : "下卦（正向）",
    description: `坐${sittingMountain.name}向${facingMountain.name}（${isSubstitute ? "兼向替卦" : "正向下卦"}，偏离${diff.toFixed(1)}°）`
  };
}
