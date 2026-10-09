/**
 * FIRE-NINE MATRIX: 2026 九紫离火运空间吉凶与工位防御推演引擎
 */

import type {
  SpaceScenario,
  ShaRemedyItem,
  FireNineMatrixCardData,
} from '../types/viral-fengshui';

// ── 常见高频形煞 × 现代轻奢无痕软装化解库 ──
export const COMMON_SHA_REMEDIES: Record<string, ShaRemedyItem> = {
  chuan_tang: {
    shaKey: 'chuan_tang',
    shaName: '穿堂煞（门窗直通）',
    modernVibe: '开门一眼望穿阳台或窗户，气流急速穿堂而过。居住者易心绪不宁，存款如流水难有积攒。',
    remedySoftDecor: {
      decorName: '通顶长虹玻璃折叠屏风 / 大型阔叶琴叶榕',
      actionTip: '在玄关与阳台视线轴线上摆放透光屏风或大型阔叶绿植，让直冲气流迂回减速。',
      fiveElementRole: '聚气缓冲，将煞气化为生生不息的生气。',
    },
  },
  men_chong_chuang: {
    shaKey: 'men_chong_chuang',
    shaName: '门冲床头（气冲元神）',
    modernVibe: '卧室门或卫生间门一开直冲床头，缺乏私密安全界限，易导致多梦、浅眠、神经衰弱。',
    remedySoftDecor: {
      decorName: '重磅棉麻遮光门帘 + 床尾矮柜阻隔',
      actionTip: '房门加装长度超过门框2/3的素色门帘，或微调床头错开门冲直线。',
      fiveElementRole: '隐蔽结界，守护睡眠神经元磁场。',
    },
  },
  liang_ya_ding: {
    shaKey: 'liang_ya_ding',
    shaName: '横梁压顶（重力负荷）',
    modernVibe: '客厅沙发或卧室床头上方有水泥粗梁，心理产生巨大无形压迫感，职场易感背负重担。',
    remedySoftDecor: {
      decorName: '隐藏式上照线性暖光灯带 / 白水晶簇',
      actionTip: '在梁下安装向上漫射的灯带打破下压阴影，或在梁两侧悬挂白水晶球化解重压。',
      fiveElementRole: '以光破阴，向上生发虚化压顶之气。',
    },
  },
  wei_sheng_jian_zhong: {
    shaKey: 'wei_sheng_jian_zhong',
    shaName: '水浸中宫（卫生间居宅中心）',
    modernVibe: '卫生间位于整套房屋正中心心脏位，湿气异味四周扩散，影响全家运势与消化系统。',
    remedySoftDecor: {
      decorName: '智能除湿香氛机 + 天然粗盐晶石盒 + 虎尾兰',
      actionTip: '卫生间常关门并长开排风，洗手台常置一碗天然海盐与耐阴虎尾兰吸湿除秽。',
      fiveElementRole: '土克水制湿，以天然香气与木植净化中宫。',
    },
  },
  gong_wei_wu_kao: {
    shaKey: 'gong_wei_wu_kao',
    shaName: '工位背后空虚（玄武无靠）',
    modernVibe: '办公室座位背后是走廊过道或透明玻璃，总感觉身后有人走动窥视，极易焦虑烦躁。',
    remedySoftDecor: {
      decorName: '高靠背人体工学椅 + 土黄色/棕色厚羊毛披肩',
      actionTip: '在椅背常搭一件厚实质感披肩，桌上放置稳重小山形泰山石摆件作为靠山。',
      fiveElementRole: '厚土培元，人工构建玄武实墙靠山。',
    },
  },
  gong_wei_chong_zhu: {
    shaKey: 'gong_wei_chong_zhu',
    shaName: '工位尖角直冲（暗箭伤人）',
    modernVibe: '工位正对走道直冲、承重墙锐角或文件柜尖棱，形成无形视线压制，职场易犯口舌是非。',
    remedySoftDecor: {
      decorName: '圆叶绿萝盆栽 + 暖白磨砂桌面护眼台灯',
      actionTip: '在尖角冲射的对应桌角放置一盆饱满圆叶绿植遮挡，或用圆形台灯柔化视线冲击。',
      fiveElementRole: '化煞为柔，圆融化解锐角火金煞气。',
    },
  },
};

// ── 8 大主流朝向在 2026 九紫离火运中的推演映射 ──
export interface FacingPreset {
  key: string;
  name: string;
  description: string;
  baseScore: number;
  wealthCorner: {
    sector: string;
    starName: string;
    triggerVibe: string;
    activationDecor: string;
  };
  wisdomCorner: {
    sector: string;
    starName: string;
    triggerVibe: string;
    activationDecor: string;
  };
}

export const FACING_PRESETS: Record<string, FacingPreset> = {
  north_south: {
    key: 'north_south',
    name: '坐正北朝正南 (坎山午向)',
    description: '九运当红最旺格局 (双星到向)，离火极盛，主名利双收与女性掌权。',
    baseScore: 94,
    wealthCorner: {
      sector: '正南方 (离宫向首)',
      starName: '九紫右弼当令旺星',
      triggerVibe: '2026绝对正财爆发位，催旺名气、短视频、AI网络变现与贵人缘。',
      activationDecor: '摆放暖红/橙色系艺术台灯或扩香晶石，保持光线充盈。',
    },
    wisdomCorner: {
      sector: '正北方 (坎宫坐山)',
      starName: '一白贪狼远旺吉星',
      triggerVibe: '水火既济，利思维超频、高阶考试、科研与副业灵感。',
      activationDecor: '布置四支水培富贵竹，或摆放白水晶簇净气。',
    },
  },
  south_north: {
    key: 'south_north',
    name: '坐正南朝正北 (离山子向)',
    description: '坐山当令大吉格局 (双星到山)，藏风聚气，主健康长寿与人才辈出。',
    baseScore: 91,
    wealthCorner: {
      sector: '正南方 (离宫坐山)',
      starName: '九紫右弼大吉星',
      triggerVibe: '聚气蓄能财位，利长期资产增值与家庭核心积蓄。',
      activationDecor: '南向区域宜静，放置紫水晶洞或红陶绿植，固本培元。',
    },
    wisdomCorner: {
      sector: '正北方 (坎宫向首)',
      starName: '一白贪狼纳气位',
      triggerVibe: '开门纳流动之水，利对外开拓商务与敏锐商机捕捉。',
      activationDecor: '玄关处设循环活水小喷泉，流水生财。',
    },
  },
  east_west: {
    key: 'east_west',
    name: '坐正东朝正西 (震山酉向)',
    description: '七赤破军交会格局，宜以木火通明之气调和，防口舌是非。',
    baseScore: 86,
    wealthCorner: {
      sector: '正南方 (离宫)',
      starName: '九紫离火引动位',
      triggerVibe: '中和西方萧杀金气，化解阻碍，激活潜在生财渠道。',
      activationDecor: '在南角摆放红色挂画或朱砂印泥盒，生发阳气。',
    },
    wisdomCorner: {
      sector: '正东方 (震宫坐山)',
      starName: '一白文昌生发位',
      triggerVibe: '利职场向上管理、演讲表达与专业证书考取。',
      activationDecor: '水培文竹或绿萝，书桌案头整洁无尘。',
    },
  },
  west_east: {
    key: 'west_east',
    name: '坐正西朝正东 (兑山卯向)',
    description: '木火通明之象 (三八纳气)，利创意设计与互联网社群裂变。',
    baseScore: 89,
    wealthCorner: {
      sector: '正东方 (卯向当旺)',
      starName: '三碧八白生气星',
      triggerVibe: '晨曦东来引财气，主朝气蓬勃、业绩破冰与升迁。',
      activationDecor: '开窗通风纳朝气，门边配置黄铜金币地垫。',
    },
    wisdomCorner: {
      sector: '正南方 (离宫)',
      starName: '九紫离火吉曜',
      triggerVibe: '点亮火运神髓，利女性个人IP打造与艺术美学审美。',
      activationDecor: '点缀暖色调郁金香或香氛蜡烛。',
    },
  },
  ne_sw: {
    key: 'ne_sw',
    name: '坐东北朝西南 (艮山坤向)',
    description: '八运坤艮转九运，西南纳气，稳健务实，利实业与不动产。',
    baseScore: 88,
    wealthCorner: {
      sector: '正南方 (离宫聚气位)',
      starName: '九紫财帛光辉星',
      triggerVibe: '激发沉睡资产活力，招徕跨界合作伙伴与大客户。',
      activationDecor: '摆放金玉满堂聚宝盆或发财树大型盆景。',
    },
    wisdomCorner: {
      sector: '东北方 (艮宫)',
      starName: '六白武曲贵人星',
      triggerVibe: '稳固团队根基，增强决策定力，不易被外界谣言迷惑。',
      activationDecor: '案头置陶瓷玉石或稳重黄水晶球。',
    },
  },
  sw_ne: {
    key: 'sw_ne',
    name: '坐西南朝东北 (坤山艮向)',
    description: '坤土生金转离火，地灵人杰，母仪生息，家风和睦。',
    baseScore: 87,
    wealthCorner: {
      sector: '正南方 (离宫)',
      starName: '九紫离火真禄星',
      triggerVibe: '提升消费感知与高溢价变现能力，财源如甘泉。',
      activationDecor: '搭配复古红丝绒地毯或暖光小吊灯。',
    },
    wisdomCorner: {
      sector: '东北方 (艮宫)',
      starName: '一白文曲吉位',
      triggerVibe: '利子女学业、深度思考与文字创作撰稿。',
      activationDecor: '放置天然白水晶笔筒与毛笔架。',
    },
  },
  nw_se: {
    key: 'nw_se',
    name: '坐西北朝东南 (乾山巽向)',
    description: '乾天巽风，天风姤卦，社交人脉通达，商机源源不断。',
    baseScore: 90,
    wealthCorner: {
      sector: '正南方 (离宫正照)',
      starName: '九紫太阳真火星',
      triggerVibe: '商机引爆点，利线上裂变营销与全国性客户网络。',
      activationDecor: '摆放琉璃九紫马或暖色系水晶晶洞。',
    },
    wisdomCorner: {
      sector: '东南方 (巽宫向首)',
      starName: '四绿文曲秀峰位',
      triggerVibe: '文华秀发，名声播远，设计与审美出类拔萃。',
      activationDecor: '摆放开运竹四枝，配青花水盂。',
    },
  },
  se_nw: {
    key: 'se_nw',
    name: '坐东南朝西北 (巽山乾向)',
    description: '木火相生，进退自如，长风破浪，适宜开拓新锐项目。',
    baseScore: 88,
    wealthCorner: {
      sector: '正南方 (离宫)',
      starName: '九紫紫薇吉曜',
      triggerVibe: '利团队破局创新、天使轮融资与首发产品热销。',
      activationDecor: '布置金属暖铜灯饰，引火生财。',
    },
    wisdomCorner: {
      sector: '西北方 (乾宫向首)',
      starName: '一白贪狼远旺星',
      triggerVibe: '开拓国际视野与高端客群，贵人鼎力相助。',
      activationDecor: '摆设金属质感地球仪或白水晶塔。',
    },
  },
};

/**
 * 2026九紫离火运空间吉凶体检推演主函数
 */
export function resolveFireNineMatrix(params: {
  scenario: SpaceScenario;
  directionKey: string;
  selectedShaKeys?: string[];
}): FireNineMatrixCardData {
  const { scenario, directionKey, selectedShaKeys = [] } = params;

  // 1. 获取朝向基准数据
  const preset = FACING_PRESETS[directionKey] || FACING_PRESETS.north_south;

  // 2. 匹配检出的形煞
  const detectedShas: ShaRemedyItem[] = [];
  for (const k of selectedShaKeys) {
    if (COMMON_SHA_REMEDIES[k]) {
      detectedShas.push(COMMON_SHA_REMEDIES[k]);
    }
  }

  // 3. 计算能量综评分 (0-100)
  // 基准分根据朝向 (86-94)
  // 每个形煞扣 6-8 分
  let score = preset.baseScore;
  if (scenario === 'workspace') {
    // 工位场景对“背后空虚”和“尖角直冲”更敏感
    score -= detectedShas.length * 7;
  } else {
    score -= detectedShas.length * 6;
  }
  score = Math.max(58, Math.min(99, score));

  // 4. 等级判定
  let scoreRating: FireNineMatrixCardData['scoreRating'] = '潜龙修养';
  if (score >= 90) scoreRating = '龙腾离火';
  else if (score >= 80) scoreRating = '蓄势纳气';
  else if (score >= 70) scoreRating = '潜龙修养';
  else scoreRating = '急需破煞';

  // 5. 场景名称与专属护身金句
  let scenarioName = '全屋吸金宅';
  let nineFireMotto = '离火当令，万物昭苏。让空间化为你的隐形充电宝，乘势而起。';
  if (scenario === 'bedroom') {
    scenarioName = '卧室睡眠舱';
    nineFireMotto = '神安气聚，无梦深眠。在私密空间构筑纯净结界，为灵魂回血。';
  } else if (scenario === 'workspace') {
    scenarioName = '打工人工位';
    nineFireMotto = '背有厚土靠山，前有开阔明堂。屏蔽小人内耗，职场步步生金。';
  }

  return {
    scenario,
    scenarioName,
    facingName: preset.name,
    energyScore: score,
    scoreRating,
    wealthCorner: preset.wealthCorner,
    wisdomCorner: preset.wisdomCorner,
    detectedShas,
    nineFireMotto,
    sealText: '离火当令 · 辟煞聚神',
  };
}
