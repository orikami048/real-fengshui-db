/**
 * FIRE-NINE MATRIX: 2026 九紫离火运空间吉凶体检与工位气场防御卡
 * 独立前端模块化控制器与 3:4 海报渲染器 (Zero Bloat)
 */

(function () {
  'use strict';

  // ── 8 大主流朝向九运离火预设 ──
  const FACING_PRESETS = {
    north_south: {
      key: 'north_south',
      name: '坐正北朝正南 (坎山午向)',
      desc: '九运最旺双星到向，离火极盛',
      baseScore: 94,
      wealthCorner: {
        sector: '正南方 (离宫向首)',
        starName: '九紫右弼当令旺星',
        triggerVibe: '2026绝对正财位，大旺名气、AI网络变现与贵人',
        activationDecor: '南阳台放置暖红氛围灯/扩香石，保持明亮',
      },
      wisdomCorner: {
        sector: '正北方 (坎宫坐山)',
        starName: '一白贪狼远旺吉星',
        triggerVibe: '水火既济，利思维超频、高阶考试与副业灵感',
        activationDecor: '四支水培富贵竹，或摆放白水晶簇净气',
      },
    },
    south_north: {
      key: 'south_north',
      name: '坐正南朝正北 (离山子向)',
      desc: '双星到山，藏风聚气，人才辈出',
      baseScore: 91,
      wealthCorner: {
        sector: '正南方 (离宫坐山)',
        starName: '九紫右弼大吉星',
        triggerVibe: '聚气蓄能财位，利长期资产增值与家庭核心积蓄',
        activationDecor: '南向卧室宜静，放置紫水晶洞或红陶绿植',
      },
      wisdomCorner: {
        sector: '正北方 (坎宫向首)',
        starName: '一白贪狼纳气位',
        triggerVibe: '开门纳流动之气，利对外商务开拓与商机捕捉',
        activationDecor: '玄关处设循环活水小喷泉，流水生财',
      },
    },
    east_west: {
      key: 'east_west',
      name: '坐正东朝正西 (震山酉向)',
      desc: '七赤破军交会，宜火生土克金',
      baseScore: 86,
      wealthCorner: {
        sector: '正南方 (离宫)',
        starName: '九紫离火引动位',
        triggerVibe: '中和西方萧杀金气，化解阻碍，激活多元财源',
        activationDecor: '南角摆放红色挂画或朱砂印泥盒，生发阳气',
      },
      wisdomCorner: {
        sector: '正东方 (震宫坐山)',
        starName: '一白文昌生发位',
        triggerVibe: '利职场向上管理、演讲表达与专业考证',
        activationDecor: '水培文竹或绿萝，书桌案头整洁无尘',
      },
    },
    west_east: {
      key: 'west_east',
      name: '坐正西朝正东 (兑山卯向)',
      desc: '木火通明之象，利创意与社群',
      baseScore: 89,
      wealthCorner: {
        sector: '正东方 (卯向当旺)',
        starName: '三碧八白生气星',
        triggerVibe: '晨曦东来引财气，主朝气蓬勃、业绩破冰与升迁',
        activationDecor: '开窗通风纳朝气，门边配置黄铜金币地垫',
      },
      wisdomCorner: {
        sector: '正南方 (离宫)',
        starName: '九紫离火吉曜',
        triggerVibe: '点亮火运神髓，利女性个人IP打造与艺术审美',
        activationDecor: '点缀暖色调郁金香或香氛蜡烛',
      },
    },
    ne_sw: {
      key: 'ne_sw',
      name: '坐东北朝西南 (艮山坤向)',
      desc: '八运坤艮转九运，西南零神水',
      baseScore: 88,
      wealthCorner: {
        sector: '正南方 (离宫聚气位)',
        starName: '九紫财帛光辉星',
        triggerVibe: '激发沉睡资产活力，招徕跨界合作伙伴与大客户',
        activationDecor: '摆放聚宝盆或发财树大型盆景',
      },
      wisdomCorner: {
        sector: '东北方 (艮宫)',
        starName: '六白武曲贵人星',
        triggerVibe: '稳固团队根基，增强决策定力，防小人内耗',
        activationDecor: '案头置陶瓷玉石或稳重黄水晶球',
      },
    },
    sw_ne: {
      key: 'sw_ne',
      name: '坐西南朝东北 (坤山艮向)',
      desc: '坤土生金转离火，地灵人杰',
      baseScore: 87,
      wealthCorner: {
        sector: '正南方 (离宫)',
        starName: '九紫离火真禄星',
        triggerVibe: '提升消费感知与高溢价变现能力，财源广进',
        activationDecor: '搭配复古红丝绒地毯或暖光小吊灯',
      },
      wisdomCorner: {
        sector: '东北方 (艮宫)',
        starName: '一白文曲吉位',
        triggerVibe: '利学业考研、深度思考与写作创作',
        activationDecor: '放置天然白水晶笔筒与毛笔架',
      },
    },
    nw_se: {
      key: 'nw_se',
      name: '坐西北朝东南 (乾山巽向)',
      desc: '乾天巽风，人脉广博通达',
      baseScore: 90,
      wealthCorner: {
        sector: '正南方 (离宫正照)',
        starName: '九紫太阳真火星',
        triggerVibe: '商机引爆点，利线上裂变营销与全国客群',
        activationDecor: '摆放琉璃九紫马或暖色系水晶晶洞',
      },
      wisdomCorner: {
        sector: '东南方 (巽宫向首)',
        starName: '四绿文曲秀峰位',
        triggerVibe: '文华秀发，名声播远，设计与审美出类拔萃',
        activationDecor: '摆放开运竹四枝，配青花水盂',
      },
    },
    se_nw: {
      key: 'se_nw',
      name: '坐东南朝西北 (巽山乾向)',
      desc: '木火相生，进退自如长风破浪',
      baseScore: 88,
      wealthCorner: {
        sector: '正南方 (离宫)',
        starName: '九紫紫薇吉曜',
        triggerVibe: '利团队破局创新、项目融资与新品热销',
        activationDecor: '布置金属暖铜灯饰，引火生财',
      },
      wisdomCorner: {
        sector: '西北方 (乾宫向首)',
        starName: '一白贪狼远旺星',
        triggerVibe: '开拓高端客群与国际视野，贵人鼎力相助',
        activationDecor: '摆设金属质感地球仪或白水晶塔',
      },
    },
  };

  // ── 常见形煞现代无痕软装化解字典 ──
  const SHA_REMEDIES = {
    chuan_tang: {
      key: 'chuan_tang',
      name: '穿堂煞 (门窗对冲)',
      vibe: '开门见阳台，气流穿堂无留存，积蓄易流失。',
      decor: '透光长虹玻璃折叠屏风 / 大型阔叶琴叶榕',
      tip: '在玄关视线轴线上置屏风或阔叶绿植，让直冲气流减速聚气。',
    },
    men_chong_chuang: {
      key: 'men_chong_chuang',
      name: '门冲床头 (气冲元神)',
      vibe: '房门直冲床头，缺乏安全界限，易浅眠神经衰弱。',
      decor: '棉麻遮光门帘 + 床尾矮柜阻隔',
      tip: '房门加装2/3长棉麻帘，或微移床头错开门冲直线。',
    },
    liang_ya_ding: {
      key: 'liang_ya_ding',
      name: '横梁压顶 (重力负荷)',
      vibe: '沙发或床头上有粗梁，无形心理压迫，职场易负重。',
      decor: '上照线性漫射暖灯带 / 白水晶簇',
      tip: '梁下装向上漫射灯带打破阴影，或梁侧悬白水晶球化压。',
    },
    wei_sheng_jian_zhong: {
      key: 'wei_sheng_jian_zhong',
      name: '水浸中宫 (厕居宅心)',
      vibe: '卫生间在房屋中心，湿气四周散发，影响运势与脾胃。',
      decor: '除湿香氛机 + 天然粗盐晶盒 + 虎尾兰',
      tip: '厕所常关门开排风，台面置海盐与耐阴虎尾兰吸湿除秽。',
    },
    gong_wei_wu_kao: {
      key: 'gong_wei_wu_kao',
      name: '工位背后无靠 (玄武空虚)',
      vibe: '座位后是过道或大窗，感觉有人走动窥视，极易焦虑。',
      decor: '高背工学椅 + 土黄/棕色厚羊毛披肩',
      tip: '椅背常搭厚羊毛披肩，桌面置稳重山形泰山石充当靠山。',
    },
    gong_wei_chong_zhu: {
      key: 'gong_wei_chong_zhu',
      name: '工位尖角冲射 (暗箭是非)',
      vibe: '正对墙角、柱棱或走道直冲，职场易招口舌是非。',
      decor: '圆叶绿萝盆栽 + 暖白磨砂桌面护眼台灯',
      tip: '在尖角冲射的对应桌角放饱满圆叶绿植遮挡锐气。',
    },
  };

  // ── 全局状态 ──
  const state = {
    scenario: 'home', // 'home' | 'bedroom' | 'workspace'
    directionKey: 'north_south',
    selectedShaKeys: ['chuan_tang'],
  };

  // 计算派生卡片数据
  function computeCardData() {
    const preset = FACING_PRESETS[state.directionKey] || FACING_PRESETS.north_south;
    const detected = state.selectedShaKeys.map(k => SHA_REMEDIES[k]).filter(Boolean);

    let score = preset.baseScore;
    if (state.scenario === 'workspace') {
      score -= detected.length * 7;
    } else {
      score -= detected.length * 6;
    }
    score = Math.max(60, Math.min(99, score));

    let scoreRating = '潜龙修养';
    if (score >= 90) scoreRating = '龙腾离火';
    else if (score >= 80) scoreRating = '蓄势纳气';
    else if (score >= 70) scoreRating = '潜龙修养';
    else scoreRating = '急需破煞';

    let scenarioName = '全屋吸金宅';
    let motto = '离火当令，万物昭苏。让空间化为你的隐形充电宝，乘势而起。';
    if (state.scenario === 'bedroom') {
      scenarioName = '卧室睡眠舱';
      motto = '神安气聚，无梦深眠。在私密空间构筑纯净结界，为灵魂回血。';
    } else if (state.scenario === 'workspace') {
      scenarioName = '打工人工位';
      motto = '背有厚土靠山，前有开阔明堂。屏蔽小人内耗，职场步步生金。';
    }

    return {
      scenario: state.scenario,
      scenarioName,
      facingName: preset.name,
      energyScore: score,
      scoreRating,
      wealthCorner: preset.wealthCorner,
      wisdomCorner: preset.wisdomCorner,
      detectedShas: detected,
      nineFireMotto: motto,
      sealText: '离火当令 · 辟煞聚神',
    };
  }

  // ── 渲染 HTML ──
  function renderModalHtml() {
    const cardData = computeCardData();

    return `
    <div id="fireNineModalBackdrop" class="fire-modal-backdrop" onclick="window.closeFireNineModal(event)">
      <div class="fire-modal-container" onclick="event.stopPropagation()">
        <!-- 头部 -->
        <div class="fire-modal-header">
          <div class="fire-modal-title">
            <span>🔥 2026九紫离火运 · 全屋吸金结界与工位防御卡</span>
            <span style="font-size:11px; color:#94a3b8; font-weight:normal;">FIRE-NINE MATRIX 3:4 POSTER</span>
          </div>
          <button class="fire-close-btn" onclick="window.closeFireNineModal()">✕</button>
        </div>

        <!-- 主体 -->
        <div class="fire-modal-body">
          <!-- 左侧配置与文案 -->
          <div class="fire-ctrl-pane">
            <!-- 场景 Tab -->
            <div>
              <div class="fire-section-title"><span>✦</span> 空间体检场景</div>
              <div class="fire-tab-group">
                <button class="fire-tab-btn ${state.scenario === 'home' ? 'active' : ''}" onclick="window.setFireScenario('home')">🏠 全屋吸金宅</button>
                <button class="fire-tab-btn ${state.scenario === 'bedroom' ? 'active' : ''}" onclick="window.setFireScenario('bedroom')">🛏️ 卧室睡眠舱</button>
                <button class="fire-tab-btn ${state.scenario === 'workspace' ? 'active' : ''}" onclick="window.setFireScenario('workspace')">💻 打工人工位</button>
              </div>
            </div>

            <!-- 8 大朝向秒选器 -->
            <div>
              <div class="fire-section-title"><span>🧭</span> 小白朝向秒选器 (免测罗盘)</div>
              <div class="fire-facing-grid">
                ${Object.values(FACING_PRESETS)
                  .map(
                    p => `
                  <div class="fire-facing-card ${state.directionKey === p.key ? 'active' : ''}" onclick="window.setFireFacing('${p.key}')">
                    <div class="fire-facing-name">${p.name.split(' (')[0]}</div>
                    <div class="fire-facing-desc">${p.desc}</div>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>

            <!-- 常见形煞勾选器 -->
            <div>
              <div class="fire-section-title"><span>⚠️</span> 常见空间微煞勾选 (多选自动匹配无痕化解)</div>
              <div class="fire-sha-tags">
                ${Object.values(SHA_REMEDIES)
                  .map(
                    s => `
                  <div class="fire-sha-tag ${state.selectedShaKeys.includes(s.key) ? 'active' : ''}" onclick="window.toggleFireSha('${s.key}')">
                    <span>${state.selectedShaKeys.includes(s.key) ? '✓' : '+'}</span>
                    <span>${s.name.split(' (')[0]}</span>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>
          </div>

          <!-- 右侧 3:4 黄金画幅海报实时渲染 -->
          <div class="fire-poster-wrapper">
            <div id="fire-nine-poster-card">
              <!-- 四角复古金饰 -->
              <div class="poster-corner tl"></div>
              <div class="poster-corner tr"></div>
              <div class="poster-corner bl"></div>
              <div class="poster-corner br"></div>

              <!-- 顶部条 -->
              <div class="poster-top-bar">
                <div class="poster-tag">
                  <div class="poster-badge-dot"></div>
                  <span>#2026九紫离火结界 · FIRE-NINE</span>
                </div>
                <div class="poster-no">NO. 2026-FIRE</div>
              </div>

              <!-- 英雄标题与分数 -->
              <div class="poster-hero">
                <div>
                  <div class="poster-title-sub">SPACE ENERGY REPORT · ${cardData.scenarioName}</div>
                  <div class="poster-hero-name">【 ${cardData.facingName.split(' (')[0]} 】</div>
                  <div style="font-size:10px; color:#cbd5e1; margin-top:2px;">${cardData.facingName.split('(')[1]?.replace(')', '') || '离火极盛'}</div>
                </div>
                <div class="poster-score-box">
                  <div class="poster-score-num">${cardData.energyScore}</div>
                  <div class="poster-score-label">
                    <div>能量评分</div>
                    <div style="color:#fce183; font-weight:800;">${cardData.scoreRating}</div>
                  </div>
                </div>
              </div>

              <!-- 核心吉位催旺指引 -->
              <div class="poster-corners-grid">
                <div class="poster-corner-card">
                  <div class="poster-corner-title">
                    <span>🔥 正财位</span> · <span>${cardData.wealthCorner.sector.split(' ')[0]}</span>
                  </div>
                  <div class="poster-corner-tip">${cardData.wealthCorner.triggerVibe}</div>
                  <div class="poster-corner-decor">💡 催旺: ${cardData.wealthCorner.activationDecor}</div>
                </div>

                <div class="poster-corner-card">
                  <div class="poster-corner-title">
                    <span>✨ 文昌位</span> · <span>${cardData.wisdomCorner.sector.split(' ')[0]}</span>
                  </div>
                  <div class="poster-corner-tip">${cardData.wisdomCorner.triggerVibe}</div>
                  <div class="poster-corner-decor">🎋 催旺: ${cardData.wisdomCorner.activationDecor}</div>
                </div>
              </div>

              <!-- 微煞现代无痕软装化解清单 -->
              <div class="poster-shas-box">
                <div class="poster-shas-title">
                  <span>🛡️</span>
                  <span>空间微煞无痕软装化解 (${cardData.detectedShas.length} 处检出)</span>
                </div>
                ${
                  cardData.detectedShas.length === 0
                    ? `<div style="font-size:10px; color:#34d399; padding:4px 0;">✓ 未检出明显形煞，空间磁场极为纯净通透，气流和煦生生不息。</div>`
                    : cardData.detectedShas
                        .map(
                          s => `
                    <div class="poster-sha-item">
                      <span class="poster-sha-name">[${s.name.split(' (')[0]}]:</span>
                      <span class="poster-sha-remedy">${s.decor}</span>
                      <div style="color:#94a3b8; font-size:9px; margin-top:1px;">${s.tip}</div>
                    </div>
                  `
                        )
                        .join('')
                }
              </div>

              <!-- 离火护身金句 -->
              <div class="poster-motto-box">
                <div class="poster-motto-text">“${cardData.nineFireMotto}”</div>
              </div>

              <!-- 底部防伪与印章 -->
              <div class="poster-bottom-bar">
                <div class="poster-auth-group">
                  <div class="poster-seal-box">
                    <span>离火</span><br><span>当令</span>
                  </div>
                  <div class="poster-auth-text">
                    <div class="poster-auth-main">九紫离火正宗 · 现代软装风水</div>
                    <div>长按保存3:4高清壁纸 · 让空间持续为你充电</div>
                  </div>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:9.5px; font-weight:bold; color:#f2c975;">#九紫离火风水</div>
                  <div style="font-size:8px; color:#64748b;">REAL FENG SHUI STUDIO</div>
                </div>
              </div>
            </div>

            <!-- 下载按钮 -->
            <button class="fire-download-btn" id="fireDownloadBtn" onclick="window.downloadFirePoster()">
              <span>📥 一键下载 3:4 超清海报 (1080×1440)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  // 挂载或更新模态框
  function updateModal() {
    let container = document.getElementById('fireNineModalContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'fireNineModalContainer';
      document.body.appendChild(container);
    }
    container.innerHTML = renderModalHtml();
  }

  // ── 全局 API 挂载 ──
  window.openFireNineModal = function () {
    updateModal();
    const backdrop = document.getElementById('fireNineModalBackdrop');
    if (backdrop) {
      setTimeout(() => backdrop.classList.add('active'), 10);
    }
  };

  window.closeFireNineModal = function (e) {
    if (e && e.target && e.target.id !== 'fireNineModalBackdrop' && !e.target.classList.contains('fire-close-btn')) {
      return;
    }
    const backdrop = document.getElementById('fireNineModalBackdrop');
    if (backdrop) {
      backdrop.classList.remove('active');
    }
  };

  window.setFireScenario = function (scenario) {
    state.scenario = scenario;
    if (scenario === 'workspace') {
      state.selectedShaKeys = ['gong_wei_wu_kao', 'gong_wei_chong_zhu'];
    } else if (scenario === 'bedroom') {
      state.selectedShaKeys = ['men_chong_chuang', 'liang_ya_ding'];
    } else {
      state.selectedShaKeys = ['chuan_tang'];
    }
    updateModal();
    const backdrop = document.getElementById('fireNineModalBackdrop');
    if (backdrop) backdrop.classList.add('active');
  };

  window.setFireFacing = function (dirKey) {
    state.directionKey = dirKey;
    updateModal();
    const backdrop = document.getElementById('fireNineModalBackdrop');
    if (backdrop) backdrop.classList.add('active');
  };

  window.toggleFireSha = function (shaKey) {
    const idx = state.selectedShaKeys.indexOf(shaKey);
    if (idx >= 0) {
      state.selectedShaKeys.splice(idx, 1);
    } else {
      state.selectedShaKeys.push(shaKey);
    }
    updateModal();
    const backdrop = document.getElementById('fireNineModalBackdrop');
    if (backdrop) backdrop.classList.add('active');
  };

  window.downloadFirePoster = async function () {
    const btn = document.getElementById('fireDownloadBtn');
    const card = document.getElementById('fire-nine-poster-card');
    if (!card) return;

    if (btn) {
      btn.innerHTML = '<span>⏳ 正在生成 1080×1440 超清海报...</span>';
      btn.disabled = true;
    }

    try {
      if (typeof html2canvas === 'undefined') {
        alert('海报渲染引擎加载中，请稍后重试');
        return;
      }

      const canvas = await html2canvas(card, {
        scale: 2.4, // 超清 1080x1440 级输出
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      const dataURL = canvas.toDataURL('image/png');
      const filename = `2026九紫离火结界卡_3比4海报_${Date.now()}.png`;

      const link = document.createElement('a');
      link.href = dataURL;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('海报导出失败:', err);
      alert('海报生成失败，请在浏览器中直接截图保存');
    } finally {
      if (btn) {
        btn.innerHTML = '<span>📥 一键下载 3:4 超清海报 (1080×1440)</span>';
        btn.disabled = false;
      }
    }
  };
})();
