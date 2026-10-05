import { Solar } from "lunar-typescript";

export type HouseGroup = "EAST_FOUR" | "WEST_FOUR";

export interface GuaInfo {
  number: number;
  name: string;
  group: HouseGroup;
  element: string;
}

export const GUA_DICT: Record<number, GuaInfo> = {
  1: { number: 1, name: "坎卦", group: "EAST_FOUR", element: "水" },
  2: { number: 2, name: "坤卦", group: "WEST_FOUR", element: "土" },
  3: { number: 3, name: "震卦", group: "EAST_FOUR", element: "木" },
  4: { number: 4, name: "巽卦", group: "EAST_FOUR", element: "木" },
  6: { number: 6, name: "乾卦", group: "WEST_FOUR", element: "金" },
  7: { number: 7, name: "兑卦", group: "WEST_FOUR", element: "金" },
  8: { number: 8, name: "艮卦", group: "WEST_FOUR", element: "土" },
  9: { number: 9, name: "离卦", group: "EAST_FOUR", element: "火" }
};

// 八宅大游年九星在八卦各宫位的吉凶排布表（以本宅坐山宫为伏位基准）
// 格式: [伏位, 生气, 五鬼, 延年, 六煞, 祸害, 天医, 绝命]
export const EIGHT_MANSIONS_TABLE: Record<number, Record<number, { star: string; isAuspicious: boolean; element: string }>> = {
  // 坎宅 (坐北 1)
  1: {
    1: { star: "伏位", isAuspicious: true, element: "木" },
    9: { star: "延年", isAuspicious: true, element: "金" },
    3: { star: "天医", isAuspicious: true, element: "土" },
    4: { star: "生气", isAuspicious: true, element: "木" },
    6: { star: "六煞", isAuspicious: false, element: "水" },
    2: { star: "绝命", isAuspicious: false, element: "金" },
    8: { star: "五鬼", isAuspicious: false, element: "火" },
    7: { star: "祸害", isAuspicious: false, element: "土" }
  },
  // 坤宅 (坐西南 2)
  2: {
    2: { star: "伏位", isAuspicious: true, element: "木" },
    8: { star: "生气", isAuspicious: true, element: "木" },
    6: { star: "延年", isAuspicious: true, element: "金" },
    7: { star: "天医", isAuspicious: true, element: "土" },
    1: { star: "绝命", isAuspicious: false, element: "金" },
    3: { star: "祸害", isAuspicious: false, element: "土" },
    4: { star: "五鬼", isAuspicious: false, element: "火" },
    9: { star: "六煞", isAuspicious: false, element: "水" }
  },
  // 震宅 (坐东 3)
  3: {
    3: { star: "伏位", isAuspicious: true, element: "木" },
    9: { star: "生气", isAuspicious: true, element: "木" },
    4: { star: "延年", isAuspicious: true, element: "金" },
    1: { star: "天医", isAuspicious: true, element: "土" },
    7: { star: "绝命", isAuspicious: false, element: "金" },
    6: { star: "五鬼", isAuspicious: false, element: "火" },
    8: { star: "六煞", isAuspicious: false, element: "水" },
    2: { star: "祸害", isAuspicious: false, element: "土" }
  },
  // 巽宅 (坐东南 4)
  4: {
    4: { star: "伏位", isAuspicious: true, element: "木" },
    1: { star: "生气", isAuspicious: true, element: "木" },
    3: { star: "延年", isAuspicious: true, element: "金" },
    9: { star: "天医", isAuspicious: true, element: "土" },
    6: { star: "祸害", isAuspicious: false, element: "土" },
    7: { star: "六煞", isAuspicious: false, element: "水" },
    2: { star: "五鬼", isAuspicious: false, element: "火" },
    8: { star: "绝命", isAuspicious: false, element: "金" }
  },
  // 乾宅 (坐西北 6)
  6: {
    6: { star: "伏位", isAuspicious: true, element: "木" },
    7: { star: "生气", isAuspicious: true, element: "木" },
    2: { star: "延年", isAuspicious: true, element: "金" },
    8: { star: "天医", isAuspicious: true, element: "土" },
    4: { star: "祸害", isAuspicious: false, element: "土" },
    1: { star: "六煞", isAuspicious: false, element: "水" },
    9: { star: "绝命", isAuspicious: false, element: "金" },
    3: { star: "五鬼", isAuspicious: false, element: "火" }
  },
  // 兑宅 (坐正西 7)
  7: {
    7: { star: "伏位", isAuspicious: true, element: "木" },
    6: { star: "生气", isAuspicious: true, element: "木" },
    8: { star: "延年", isAuspicious: true, element: "金" },
    2: { star: "天医", isAuspicious: true, element: "土" },
    3: { star: "绝命", isAuspicious: false, element: "金" },
    4: { star: "六煞", isAuspicious: false, element: "水" },
    1: { star: "祸害", isAuspicious: false, element: "土" },
    9: { star: "五鬼", isAuspicious: false, element: "火" }
  },
  // 艮宅 (坐东北 8)
  8: {
    8: { star: "伏位", isAuspicious: true, element: "木" },
    2: { star: "生气", isAuspicious: true, element: "木" },
    7: { star: "延年", isAuspicious: true, element: "金" },
    6: { star: "天医", isAuspicious: true, element: "土" },
    9: { star: "祸害", isAuspicious: false, element: "土" },
    1: { star: "五鬼", isAuspicious: false, element: "火" },
    3: { star: "六煞", isAuspicious: false, element: "水" },
    4: { star: "绝命", isAuspicious: false, element: "金" }
  },
  // 离宅 (坐正南 9)
  9: {
    9: { star: "伏位", isAuspicious: true, element: "木" },
    3: { star: "生气", isAuspicious: true, element: "木" },
    1: { star: "延年", isAuspicious: true, element: "金" },
    4: { star: "天医", isAuspicious: true, element: "土" },
    8: { star: "祸害", isAuspicious: false, element: "土" },
    2: { star: "六煞", isAuspicious: false, element: "水" },
    6: { star: "绝命", isAuspicious: false, element: "金" },
    7: { star: "五鬼", isAuspicious: false, element: "火" }
  }
};

/**
 * 根据公历出生年月日精确计算个人三元本命卦（严格以立春为界）
 */
export function calculateLifeGua(birthDate: Date, gender: "MALE" | "FEMALE"): GuaInfo {
  const solar = Solar.fromDate(birthDate);
  const lunar = solar.getLunar();
  const year = lunar.getYear(); // 严格以立春分界的干支年

  // 计算年份各位数之和并化为单数
  const sumDigits = (n: number): number => {
    let s = n.toString().split("").reduce((acc, c) => acc + parseInt(c), 0);
    while (s > 9) {
      s = s.toString().split("").reduce((acc, c) => acc + parseInt(c), 0);
    }
    return s;
  };

  const remainder = sumDigits(year);
  let guaNum: number;

  if (gender === "MALE") {
    guaNum = 11 - remainder;
    if (guaNum > 9) guaNum -= 9;
    if (guaNum <= 0) guaNum += 9;
    if (guaNum === 5) guaNum = 2; // 男五寄坤
  } else {
    guaNum = 4 + remainder;
    while (guaNum > 9) guaNum -= 9;
    if (guaNum === 5) guaNum = 8; // 女五寄艮
  }

  return GUA_DICT[guaNum];
}

/**
 * 根据坐山所属八卦宫位获取房屋宅卦
 */
export function getHouseGua(sittingPalaceNumber: number): GuaInfo {
  return GUA_DICT[sittingPalaceNumber];
}

/**
 * 生成八宅明镜八宫吉凶游年星分布明细
 */
export function getEightMansionsChart(sittingPalaceNumber: number) {
  const house = getHouseGua(sittingPalaceNumber);
  const table = EIGHT_MANSIONS_TABLE[sittingPalaceNumber];
  const palaces = Object.keys(table).map((key) => {
    const palace = parseInt(key);
    const starData = table[palace];
    return {
      palaceNumber: palace,
      palaceName: GUA_DICT[palace].name,
      starName: starData.star,
      isAuspicious: starData.isAuspicious,
      element: starData.element
    };
  });

  return {
    houseGuaName: house.name + "宅",
    houseGroup: house.group,
    element: house.element,
    palaces
  };
}
