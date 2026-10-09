/**
 * FIRE-NINE MATRIX: 2026 九紫离火运全屋吸金结界与工位气场防御卡
 * 核心类型定义规范
 */

// 1. 空间体检模式
export type SpaceScenario = 'home' | 'bedroom' | 'workspace';

// 2. 常见形煞与现代软装化解项
export interface ShaRemedyItem {
  shaKey: string;              // 如 "chuan_tang" (穿堂煞)
  shaName: string;             // 煞气名，如 "穿堂煞（门窗直通）"
  modernVibe: string;          // 现代心理/生理痛点描述
  remedySoftDecor: {           // 现代无痕软装化解法 (拒绝传统土味道具)
    decorName: string;         // 如 "通顶长虹玻璃折叠屏风 / 大型阔叶琴叶榕"
    actionTip: string;         // 摆放指引
    fiveElementRole: string;   // 五行调和原理
  };
}

// 3. 2026 九紫离火运空间吉凶报告卡数据
export interface FireNineMatrixCardData {
  scenario: SpaceScenario;
  scenarioName: string;        // "全屋吸金宅" | "卧室睡眠舱" | "打工人工位"
  facingName: string;          // 如 "坐正北朝正南 (九运双星到向)"
  energyScore: number;         // 能量综评分 (0-100)
  scoreRating: '龙腾离火' | '蓄势纳气' | '潜龙修养' | '急需破煞';
  
  // 核心吉位 (2026 爆发点)
  wealthCorner: {
    sector: string;            // 如 "正南方 (离宫)"
    starName: string;          // 如 "九紫右弼当令旺星"
    triggerVibe: string;       // 搞钱属性
    activationDecor: string;   // 催旺法
  };
  
  wisdomCorner: {
    sector: string;            // 如 "正北方 (坎宫)"
    starName: string;          // 如 "一白贪狼远旺吉星"
    triggerVibe: string;       // 智慧属性
    activationDecor: string;   // 催旺法
  };

  // 煞气自查与化解建议
  detectedShas: ShaRemedyItem[];
  
  // 2026 离火护身金句
  nineFireMotto: string;
  sealText: string;            // 如 "离火当令 · 辟煞聚神"
}
