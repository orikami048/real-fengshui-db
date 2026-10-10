/**
 * DESK-SHIELD MATRIX: 打工人 1㎡ 工位防小人吸金结界指南 (¥9.9 爆款冲动付费闭环系统)
 * 极致极简无依赖原生 JS 架构
 */

(function () {
  'use strict';

  // ── 选项题库 ──
  const QUESTION_BANK = {
    xuanwu: {
      category: '背后玄武位 (靠山与安全感)',
      options: [
        {
          key: 'wu_kao',
          name: '背后是公共走道 / 经常有人走过',
          desc: '【虚空煞】：缺乏隐私与界限感，容易疑神疑鬼，工作成果易被旁人截胡。',
          penalty: 12,
        },
        {
          key: 'kao_chuang',
          name: '背后靠大窗户 / 空旷大玻璃',
          desc: '【悬空煞】：背后无实墙依靠，在气场学上主缺乏上级核心信任与稳固提携。',
          penalty: 10,
        },
        {
          key: 'kao_lingdao',
          name: '背后正对老板 / 主管办公室玻璃',
          desc: '【督战煞】：如芒在背，时刻处于无形心理高压，极易导致焦虑与神经疲劳。',
          penalty: 9,
        },
        {
          key: 'you_kao',
          name: '背后是稳固实墙 (大吉)',
          desc: '【玄武有靠】：后盾坚实，贵人运稳定，气定神闲。',
          penalty: 0,
        },
      ],
    },
    zhuque: {
      category: '前方朱雀明堂 (视野与前途阻隔)',
      options: [
        {
          key: 'chong_men',
          name: '正对大门 / 电梯间直冲',
          desc: '【气冲煞】：气流直冲心浮气躁，杂事繁多奔波劳碌，容易因粗心出纰漏。',
          penalty: 11,
        },
        {
          key: 'chong_ce',
          name: '正对洗手间 / 茶水间垃圾桶',
          desc: '【污浊秽气】：浊气犯主，最易招惹平级同事口舌是非、暗地甩锅或莫须有中伤。',
          penalty: 12,
        },
        {
          key: 'chong_jiao',
          name: '正对水泥柱棱角 / 建筑尖角',
          desc: '【暗箭尖角煞】：如同隐形刀尖相对，人际关系紧绷，开会容易成为被针对焦点。',
          penalty: 11,
        },
        {
          key: 'dui_za',
          name: '桌前堆满厚重文件夹与杂物',
          desc: '【阻滞煞】：眼前狭窄思路闭塞，常常陷入细节瞎忙却看不到长远升职机会。',
          penalty: 8,
        },
      ],
    },
    qinglong_baihu: {
      category: '左右手青龙白虎位 (权力与人际暗战)',
      options: [
        {
          key: 'baihu_gao',
          name: '右手堆放的物品比左手还要高',
          desc: '【白虎压青龙】：气场学大忌“宁叫青龙高千丈，不让白虎高一寸”，易遭下属或平级压制。',
          penalty: 10,
        },
        {
          key: 'ci_dao',
          name: '桌上摆放带刺仙人掌 / 美工刀直露',
          desc: '【尖锐凶曜】：仙人掌虽防辐射但浑身是刺，刀剪外露主血光与口舌冲突，严禁摆设。',
          penalty: 9,
        },
        {
          key: 'nei_juan_da',
          name: '紧挨着内卷焦虑 / 甩锅打小报告的同事',
          desc: '【负向吸血气场】：心理学上的“情绪二手烟”，会持续偷走你的专注力与心力。',
          penalty: 9,
        },
      ],
    },
    environment: {
      category: '头顶压迫与微气候 (体魄与压迫感)',
      options: [
        {
          key: 'liang_ding',
          name: '头顶正上方有横梁 / 粗管道压顶',
          desc: '【横梁压顶】：心理负重效应显著，头痛颈椎不适，职场承重多却难得认可。',
          penalty: 10,
        },
        {
          key: 'feng_chui',
          name: '中央空调冷风口直吹头顶或后颈',
          desc: '【冷风吹散阳气】：颈椎受凉免疫力下降，导致下午极易犯困嗜睡、思维迟钝。',
          penalty: 8,
        },
      ],
    },
  };

  // ── 全局状态 ──
  const state = {
    selectedKeys: new Set(['wu_kao', 'dui_za', 'baihu_gao']),
    step: 1, // 1: 自测问卷, 2: 气场体检结果与付费卡点, 3: 完整解锁交付
    isPaid: false,
    score: 58,
    detectedList: [],
  };

  // 读取本地解锁缓存
  try {
    if (localStorage.getItem('desk_shield_unlocked_99') === 'true') {
      state.isPaid = true;
    }
  } catch (e) {}

  // ── 计算得分与诊断 ──
  function computeDiagnosis() {
    let score = 96;
    const detected = [];

    Object.values(QUESTION_BANK).forEach(cat => {
      cat.options.forEach(opt => {
        if (state.selectedKeys.has(opt.key)) {
          score -= opt.penalty;
          if (opt.penalty > 0) {
            detected.push(opt);
          }
        }
      });
    });

    score = Math.max(48, Math.min(98, score));
    state.score = score;
    state.detectedList = detected;

    let rating = '气象森严 · 辟煞聚神';
    let statusColor = '#10b981';
    let summary = '恭喜！你的工位环境整体上佳，仅需微调即可引爆 2026 离火吸金运！';

    if (score < 65) {
      rating = '高危警报 · 小人暗箭潜伏';
      statusColor = '#ef4444';
      summary = '你最近的疲劳与不顺不是因为能力不够，而是工位存在核心气场煞气正在疯狂耗损你的心力与职场运气！';
    } else if (score < 80) {
      rating = '虚耗警告 · 能量多有渗漏';
      statusColor = '#f59e0b';
      summary = '工位存在数处“暗耗点”，往往导致干得多认可少、容易被琐事缠身。必须立即完成无痕物理化解！';
    }

    return { score, rating, statusColor, summary, detected };
  }

  // ── DOM 挂载与构建 ──
  function ensureModalMounted() {
    if (document.getElementById('desk-shield-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'desk-shield-overlay';
    overlay.className = 'desk-shield-overlay';

    overlay.innerHTML = `
      <div class="desk-shield-dialog">
        <!-- 头部 -->
        <div class="desk-shield-header">
          <div class="desk-shield-title-group">
            <div class="desk-shield-icon-badge">🛡️</div>
            <div>
              <div class="desk-shield-title">打工人 1㎡ 工位防小人吸金结界指南</div>
              <div class="desk-shield-subtitle">九运离火 · 现代职场无痕桌面防御术 · 拒绝迷信 · 极简实战</div>
            </div>
          </div>
          <button class="desk-shield-close-btn" onclick="closeDeskShieldModal()">✕</button>
        </div>

        <!-- 步骤指示条 -->
        <div class="desk-shield-steps">
          <div class="desk-shield-step-item" id="ds-step-tab-1">
            <div class="desk-shield-step-num">1</div>
            <span>30秒工位现状速诊</span>
          </div>
          <div class="desk-shield-step-item" id="ds-step-tab-2">
            <div class="desk-shield-step-num">2</div>
            <span>气场能量诊断与卡点</span>
          </div>
          <div class="desk-shield-step-item" id="ds-step-tab-3">
            <div class="desk-shield-step-num">3</div>
            <span>专属无痕布阵图解 (已解锁)</span>
          </div>
        </div>

        <!-- 内容滚动体 -->
        <div class="desk-shield-body" id="desk-shield-content">
          <!-- 动态渲染 -->
        </div>

        <!-- 底部栏 -->
        <div class="desk-shield-footer" id="desk-shield-footer">
          <!-- 动态渲染 -->
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        closeDeskShieldModal();
      }
    });
  }

  // ── 渲染控制器 ──
  function render() {
    ensureModalMounted();
    updateStepTabs();

    const body = document.getElementById('desk-shield-content');
    const footer = document.getElementById('desk-shield-footer');

    if (state.step === 1) {
      renderStep1(body, footer);
    } else if (state.step === 2) {
      renderStep2(body, footer);
    } else if (state.step === 3) {
      renderStep3(body, footer);
    }
  }

  function updateStepTabs() {
    [1, 2, 3].forEach(num => {
      const el = document.getElementById(`ds-step-tab-${num}`);
      if (!el) return;
      el.classList.remove('active', 'completed');
      if (state.step === num) el.classList.add('active');
      else if (state.step > num) el.classList.add('completed');
    });
  }

  // ── Step 1: 问卷 ──
  function renderStep1(body, footer) {
    let html = `
      <div style="background: rgba(124, 58, 237, 0.1); border: 1px dashed rgba(168, 85, 247, 0.4); border-radius: 12px; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; color: #cbd5e1;">
        💡 <b>测试说明</b>：打工人每天在工位坐 8~10 小时，微环境的气场对情绪、贵人运和注意力有着极强的心理暗示与能量效应。勾选你工位的真实周边情况，算法将为你生成专属防御阵法。
      </div>
    `;

    Object.entries(QUESTION_BANK).forEach(([catKey, cat]) => {
      html += `<div class="desk-section-title">📌 ${cat.category}</div>`;
      html += `<div class="desk-options-grid">`;
      cat.options.forEach(opt => {
        const isSelected = state.selectedKeys.has(opt.key);
        html += `
          <div class="desk-option-card ${isSelected ? 'selected' : ''}" onclick="window.toggleDeskOption('${opt.key}')">
            <div class="desk-option-checkbox"></div>
            <div class="desk-option-text">
              <div class="desk-option-name">${opt.name}</div>
              <div class="desk-option-desc">${opt.desc}</div>
            </div>
          </div>
        `;
      });
      html += `</div>`;
    });

    body.innerHTML = html;

    footer.innerHTML = `
      <div style="font-size: 12px; color: #94a3b8;">
        已勾选 <span style="color: #a855f7; font-weight: 700;">${state.selectedKeys.size}</span> 项环境特征
      </div>
      <button class="desk-pay-btn" onclick="window.goToStep2()">
        <span>立即生成工位气场体检报告</span> ➔
      </button>
    `;
  }

  // ── Step 2: 诊断报告 + 9.9 卡点 ──
  function renderStep2(body, footer) {
    const diag = computeDiagnosis();

    let html = `
      <!-- 诊断大卡 -->
      <div class="desk-result-hero">
        <div class="desk-score-circle" style="border-color: ${diag.statusColor}; color: ${diag.statusColor};">
          <div class="desk-score-num">${diag.score}</div>
          <div class="desk-score-lbl">气场健康分</div>
        </div>
        <div class="desk-hero-meta">
          <div class="desk-hero-title" style="color: ${diag.statusColor};">
            <span>${diag.rating}</span>
          </div>
          <div class="desk-hero-desc">${diag.summary}</div>
        </div>
      </div>

      <!-- 命中痛点明细 -->
      <div class="desk-section-title">🚨 扫描到的工位能量损耗与煞气风险 (${diag.detected.length} 处)</div>
    `;

    if (diag.detected.length > 0) {
      diag.detected.forEach(item => {
        html += `
          <div class="desk-warning-item">
            <div class="desk-warning-title">⚠️ ${item.name}</div>
            <div>${item.desc}</div>
          </div>
        `;
      });
    } else {
      html += `<div style="padding: 12px; color: #10b981; font-size: 13px;">未检测到明显凶煞，你的工位根基极佳！</div>`;
    }

    // 免费赠送的一条基础建议
    html += `
      <div style="background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981; border-radius: 6px; padding: 10px 14px; margin: 16px 0; font-size: 12px; color: #a7f3d0;">
        🎁 <b>【即刻可行的免费止血技巧】</b>：立刻检查桌面上是否有未盖上的剪刀或刀片，无论平时多忙，下班前务必收入抽屉或笔筒内；刀刃外露在环境心理学中极易诱发尖锐矛盾与口舌之争。
      </div>
    `;

    // 付费卡点拦截卡 (如果未支付)
    if (!state.isPaid) {
      html += `
        <div class="desk-paywall-card">
          <div class="desk-paywall-blur-bg"></div>
          <div style="font-size: 20px; font-weight: 900; color: #fff; margin-bottom: 6px;">
            🔒 你的 1㎡ 工位专属无痕物理吸金阵法已锁定
          </div>
          <div style="font-size: 13px; color: #cbd5e1; max-width: 580px; margin: 0 auto; line-height: 1.6;">
            包含老板同事绝对看不出来的<b>「3招无痕软装破局术」</b>、<b>「青龙压白虎 1㎡ 桌面收纳吸金平面图」</b>以及 2026 丙午九紫离火在桌面的<b>「精准催财坐标」</b>。
          </div>

          <div style="margin: 16px 0;">
            <div class="desk-pay-price-tag">
              <span style="font-size: 14px; color: #facc15; font-weight: 700;">限时结印价</span>
              <span class="desk-pay-amount">¥9.9</span>
              <span class="desk-pay-original">原价 ¥39.9</span>
            </div>
            <div style="font-size: 11px; color: #94a3b8;">
              一杯饮料钱 · 终身受用 · 换一整年工位心平气和与防小人提拔运
            </div>
          </div>

          <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
            <button class="desk-pay-btn" onclick="window.triggerPaymentModal()">
              <span>✨ 微信 / 支付宝 ¥9.9 一键解锁</span>
            </button>
            <button class="desk-pay-btn" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);" onclick="window.mockPaymentSuccess()">
              <span>⚡ 立即体验解锁 (演示通道)</span>
            </button>
          </div>
        </div>
      `;
    } else {
      html += `
        <div style="text-align: center; margin-top: 20px;">
          <div style="color: #10b981; font-size: 14px; font-weight: 800; margin-bottom: 10px;">
            🎉 你已成功解锁完整版工位防御指南！
          </div>
          <button class="desk-pay-btn" onclick="window.goToStep3()">
            <span>查看完整工位布阵图解与 3:4 出片卡</span> ➔
          </button>
        </div>
      `;
    }

    body.innerHTML = html;

    footer.innerHTML = `
      <button class="btn btn-outline" onclick="window.goToStep1()">
        ⬅ 返回重测
      </button>
      <div style="font-size: 12px; color: #94a3b8;">
        ${state.isPaid ? '已解锁全功能' : '支付 9.9 元即可解锁高阶交付'}
      </div>
    `;
  }

  // ── Step 3: 解锁交付 (工位布局图 + 3招破局 + 3:4海报导出) ──
  function renderStep3(body, footer) {
    const diag = computeDiagnosis();

    let html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div class="desk-section-title" style="margin: 0;">
          ✨ 1㎡ 极简工位【青龙聚财 · 白虎降伏】实战鸟瞰布阵
        </div>
        <span style="background: rgba(16, 185, 129, 0.2); color: #10b981; font-size: 11px; padding: 2px 8px; border-radius: 4px; font-weight: 700;">
          已获得 2026 九紫当令庇护
        </span>
      </div>

      <!-- 1㎡ 鸟瞰网格图 -->
      <div class="desk-blueprint-grid">
        <!-- 前方朱雀 -->
        <div class="desk-zone-card zhuque">
          <div class="desk-zone-title" style="color: #facc15;">【前朱雀明堂 · 聚财纳气位】</div>
          <div class="desk-zone-desc">
            屏幕正前方与键盘周围：<b>必须留出至少一张 A4 纸大小的净空区域</b>。严禁文件堆积遮挡，明堂通透主思路清晰、前程开阔。
          </div>
        </div>

        <!-- 左侧青龙 -->
        <div class="desk-zone-card qinglong">
          <div class="desk-zone-title" style="color: #60a5fa;">【左青龙位 · 贵人高耸位】</div>
          <div class="desk-zone-desc">
            <b>宜高、宜动、宜明亮</b>：<br>
            放置：高容量水杯、常用厚重专业书、台灯、金色转运笔筒。青龙昂首，大旺职场贵人赏识与决策权力！
          </div>
        </div>

        <!-- 核心屏幕区 -->
        <div class="desk-zone-card screen-core">
          <div style="font-size: 24px; margin-bottom: 4px;">💻</div>
          <div class="desk-zone-title" style="color: #c4b5fd;">中宫·办公主屏</div>
          <div style="font-size: 11px; color: #94a3b8;">电脑壁纸建议选用壮丽高山或暖色调离火风景，为眼睛与心境注能。</div>
        </div>

        <!-- 右侧白虎 -->
        <div class="desk-zone-card baihu">
          <div class="desk-zone-title" style="color: #f472b6;">【右白虎位 · 口舌降伏位】</div>
          <div class="desk-zone-desc">
            <b>宜低、宜静、宜平缓</b>：<br>
            严禁堆放比左边高的杂物！严禁剪刀利刃！<br>
            放置：一盆圆润叶片的小绿萝/豆瓣绿，吸收负能量，化解小人是非与嫉妒。
          </div>
        </div>

        <!-- 背后玄武 -->
        <div class="desk-zone-card xuanwu">
          <div class="desk-zone-title" style="color: #34d399;">【后玄武位 · 靠山防御位】</div>
          <div class="desk-zone-desc">
            在座椅靠背上常年搭一件<b>深色厚实西装外套或厚羊毛披肩</b>（物理创造玄武厚土靠山），彻底解决走道人流窥视与虚空煞！
          </div>
        </div>
      </div>

      <!-- 三大无痕物理秘法 -->
      <div class="desk-section-title" style="margin-top: 24px;">🔮 三大同事看不懂的“无痕物理破局软装秘法”</div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; margin-bottom: 24px;">
        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px;">
          <div style="font-size: 14px; font-weight: 800; color: #c4b5fd; margin-bottom: 6px;">
            1. 外套搭椅背（借厚土靠山）
          </div>
          <div style="font-size: 12px; color: #94a3b8; line-height: 1.5;">
            无需昂贵泰山石。椅背上搭深色/土黄色外套，形成物理阻隔与靠山护体。心理学表明能大幅减少对后方环境的无意识戒备，下班不头痛。
          </div>
        </div>

        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px;">
          <div style="font-size: 14px; font-weight: 800; color: #f472b6; margin-bottom: 6px;">
            2. 圆叶吸秽法（化解小人冷箭）
          </div>
          <div style="font-size: 12px; color: #94a3b8; line-height: 1.5;">
            将带刺植物换成圆叶水培绿萝或多肉。在工位右前方白虎方放置，绿意盎然兼具“化煞柔化”作用，老板以为你热爱生活，同事不易起争执。
          </div>
        </div>

        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px;">
          <div style="font-size: 14px; font-weight: 800; color: #facc15; margin-bottom: 6px;">
            3. 2026九紫当令财位点亮术
          </div>
          <div style="font-size: 12px; color: #94a3b8; line-height: 1.5;">
            2026 丙午九紫火运正旺。在工位**正南或正东**角，放置一盏暖黄色无线小夜灯、或一块红色/焦糖色鼠标垫，以火生土引动正偏财气！
          </div>
        </div>
      </div>

      <!-- 3:4 社交分享海报 -->
      <div class="desk-poster-wrapper">
        <div class="desk-section-title" style="align-self: flex-start; margin-bottom: 12px;">
          📸 3:4 爆款社媒出片海报【此工位已结印 · 闲人退散】
        </div>
        
        <div class="desk-poster-canvas" id="desk-poster-card">
          <div class="desk-poster-seal">九运 · 辟煞结界</div>
          
          <div>
            <div style="font-size: 11px; color: #a855f7; font-weight: 800; letter-spacing: 2px;">
              2026 FIRE-NINE SHIELD
            </div>
            <div style="font-size: 20px; font-weight: 900; color: #fff; margin-top: 4px;">
              打工人 1㎡ 工位吸金防御结界
            </div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">
              气场健康指数：<span style="color: #facc15; font-weight: 800;">${diag.score}分</span> · 已完成无痕物理布局
            </div>
          </div>

          <!-- 海报核心视觉卡 -->
          <div style="background: rgba(124, 58, 237, 0.15); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 12px; padding: 14px; margin: 12px 0;">
            <div style="font-size: 12px; font-weight: 700; color: #f1f5f9; margin-bottom: 6px;">
              🛡️ 工位结界法则：
            </div>
            <div style="font-size: 11px; color: #cbd5e1; line-height: 1.6;">
              • 左青龙昂首高耸：引职场贵人<br>
              • 右白虎圆叶低伏：断小人是非<br>
              • 前朱雀明堂宽阔：聚财气商机<br>
              • 后玄武厚土相依：固职场根基
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
            <div>
              <div style="font-size: 10px; color: #94a3b8;">结印箴言</div>
              <div style="font-size: 12px; color: #facc15; font-weight: 700;">背有厚土靠山 · 眼前步步生金</div>
            </div>
            <div style="font-size: 10px; color: #64748b;">
              Real Feng Shui Lab
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap;">
          <button class="desk-pay-btn" onclick="window.downloadDeskPoster()">
            <span>📥 一键保存 3:4 高清海报 (小红书/朋友圈)</span>
          </button>
          <button class="btn btn-outline" onclick="window.copyXiaohongshuText()">
            <span>📋 复制小红书爆款种草文案</span>
          </button>
        </div>
      </div>
    `;

    body.innerHTML = html;

    footer.innerHTML = `
      <button class="btn btn-outline" onclick="window.goToStep2()">
        ⬅ 查看诊断总结
      </button>
      <div style="font-size: 12px; color: #10b981; font-weight: 600;">
        ✔ 结界已生效，祝你 2026 离火年升职搞钱！
      </div>
    `;
  }

  // ── 全局 API 绑定 ──
  window.openDeskShieldModal = function () {
    render();
    const overlay = document.getElementById('desk-shield-overlay');
    if (overlay) overlay.classList.add('active');
  };

  window.closeDeskShieldModal = function () {
    const overlay = document.getElementById('desk-shield-overlay');
    if (overlay) overlay.classList.remove('active');
  };

  window.toggleDeskOption = function (key) {
    if (state.selectedKeys.has(key)) {
      state.selectedKeys.delete(key);
    } else {
      state.selectedKeys.add(key);
    }
    render();
  };

  window.goToStep1 = function () {
    state.step = 1;
    render();
  };

  window.goToStep2 = function () {
    state.step = 2;
    render();
  };

  window.goToStep3 = function () {
    if (!state.isPaid) {
      window.goToStep2();
      return;
    }
    state.step = 3;
    render();
  };

  // 支付弹窗
  window.triggerPaymentModal = function () {
    const qrDiv = document.createElement('div');
    qrDiv.id = 'desk-qr-backdrop';
    qrDiv.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:999999;display:flex;align-items:center;justify-content:center;padding:16px;';

    qrDiv.innerHTML = `
      <div class="desk-qr-modal">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <span style="font-size:16px;font-weight:800;color:#fff;">收银台 · 工位结界指南</span>
          <button style="background:transparent;border:none;color:#94a3b8;font-size:18px;cursor:pointer;" onclick="document.getElementById('desk-qr-backdrop').remove()">✕</button>
        </div>
        <div style="font-size:13px;color:#cbd5e1;margin-bottom:12px;">
          请使用 <b>微信 / 支付宝</b> 扫码支付 <span style="color:#facc15;font-weight:800;font-size:16px;">¥9.9</span>
        </div>
        <div style="background:#fff;padding:12px;border-radius:12px;display:inline-block;margin-bottom:12px;">
          <svg width="180" height="180" viewBox="0 0 100 100" style="display:block;">
            <rect width="100" height="100" fill="#fff"/>
            <!-- 仿真通用收款二维码图形 -->
            <rect x="10" y="10" width="24" height="24" fill="#000"/>
            <rect x="14" y="14" width="16" height="16" fill="#fff"/>
            <rect x="18" y="18" width="8" height="8" fill="#000"/>
            <rect x="66" y="10" width="24" height="24" fill="#000"/>
            <rect x="70" y="14" width="16" height="16" fill="#fff"/>
            <rect x="74" y="18" width="8" height="8" fill="#000"/>
            <rect x="10" y="66" width="24" height="24" fill="#000"/>
            <rect x="14" y="70" width="16" height="16" fill="#fff"/>
            <rect x="18" y="74" width="8" height="8" fill="#000"/>
            <!-- 内部点阵 -->
            <rect x="42" y="14" width="16" height="6" fill="#7c3aed"/>
            <rect x="42" y="24" width="6" height="14" fill="#000"/>
            <rect x="52" y="24" width="6" height="8" fill="#000"/>
            <rect x="14" y="44" width="8" height="14" fill="#000"/>
            <rect x="28" y="44" width="14" height="6" fill="#000"/>
            <rect x="46" y="44" width="8" height="8" fill="#a855f7"/>
            <rect x="60" y="44" width="12" height="12" fill="#000"/>
            <rect x="76" y="44" width="14" height="8" fill="#000"/>
            <rect x="42" y="66" width="16" height="8" fill="#000"/>
            <rect x="64" y="66" width="8" height="16" fill="#000"/>
            <rect x="76" y="66" width="14" height="20" fill="#7c3aed"/>
            <rect x="42" y="78" width="12" height="12" fill="#000"/>
          </svg>
        </div>
        <div style="font-size:11px;color:#94a3b8;margin-bottom:14px;">
          支付完成后系统将自动实时开通，永久可查
        </div>
        <button class="desk-pay-btn" style="width:100%;justify-content:center;" onclick="window.mockPaymentSuccess(); document.getElementById('desk-qr-backdrop').remove();">
          <span>我已完成支付 (立即解锁)</span>
        </button>
      </div>
    `;

    document.body.appendChild(qrDiv);
  };

  // 模拟支付成功
  window.mockPaymentSuccess = function () {
    state.isPaid = true;
    try {
      localStorage.setItem('desk_shield_unlocked_99', 'true');
    } catch (e) {}
    state.step = 3;
    render();
  };

  // 导出 3:4 海报
  window.downloadDeskPoster = function () {
    const card = document.getElementById('desk-poster-card');
    if (!card) return;

    if (window.html2canvas) {
      window.html2canvas(card, {
        scale: 2,
        backgroundColor: '#090c15',
        useCORS: true,
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `打工人工位吸金结界卡_2026离火年.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    } else {
      alert('正在加载图片渲染引擎，请稍候点击');
    }
  };

  // 复制小红书爆款文案
  window.copyXiaohongshuText = function () {
    const diag = computeDiagnosis();
    const text = `【打工人的命也是命！花9块9布置的工位结界，老板以为我只是爱干净】😭🔥

测了一下工位气场竟然只有 ${diag.score} 分！
果然！我天天下午犯困、经常被甩锅，不是因为能力不行，而是工位风水一直在疯狂偷走我的心力！

按指南做了无痕微调：
✅ 椅背常年搭一件厚外套借【玄武靠山】，再也不怕后面人来人往盯着屏幕了
✅ 右手白虎位把美工刀剪刀收进抽屉，换成一盆圆叶小绿萝，远离口舌是非
✅ 左边青龙位摆高水杯和台灯，青龙昂首大旺贵人
✅ 正南离火财位点亮一盏小暖灯，接住2026九紫当令财气！

调完第三天，整个人精神状态完全不一样了！
#打工人工位风水 #工位吸金结界 #办公室玄学 #九紫离火运工位 #防小人工位 #工位好物`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert('小红书种草爆款文案已复制到剪贴板！');
      });
    } else {
      alert('文案内容：\n' + text);
    }
  };

  // DOM 就绪后预备挂载
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureModalMounted);
  } else {
    ensureModalMounted();
  }
})();
