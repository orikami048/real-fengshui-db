/**
 * 堪舆子 · 江南三元派传统堪舆风水顾问 与 《协纪辨方书》择日系统 SDK
 * 严格遵循 Agent Skills 开放标准规范与《沈氏玄空学》《宅经》《葬书》法统
 */

(function () {
  'use strict';

  // 12建除神元数据
  const TWELVE_OFFICERS = [
    { name: "建", pinyin: "Jian", grade: "平中带凶", nature: "气势独盛", good: ["祭祀", "祈福", "行幸遣使"], bad: ["开市", "嫁娶", "入宅", "动土修造"], tip: "建日为一月之始，气势独盛，万物不任，主生发但不宜大动作。" },
    { name: "除", pinyin: "Chu", grade: "吉神", nature: "除旧布新", good: ["沐浴", "清洁扫除", "求医治病", "破土除煞"], bad: ["嫁娶", "出行", "开仓", "井造"], tip: "除旧布新之神，万事大吉，最宜全屋大扫除与除秽安居。" },
    { name: "满", pinyin: "Man", grade: "次吉", nature: "圆满丰足", good: ["入宅乔迁", "开市纳财", "结纳宴客", "安床"], bad: ["动土开渠", "栽种", "安葬"], tip: "丰享豫大之象，利进宅与资金入账，不可过度泄气。" },
    { name: "平", pinyin: "Ping", grade: "平日", nature: "平稳持重", good: ["平整道路", "修缮房屋", "日常事务"], bad: ["诉讼", "远行", "重大开张", "婚嫁"], tip: "平安无事，气场中庸，适合办理常规修缮与整理。" },
    { name: "定", pinyin: "Ding", grade: "吉神", nature: "基业永固", good: ["安床安神", "签约订盟", "开业祈福", "栽种"], bad: ["词讼争斗", "远行迁移", "出行"], tip: "安定坚实之日，最利主卧睡床安放与长期商业合同签定。" },
    { name: "执", pinyin: "Zhi", grade: "小凶", nature: "固执守旧", good: ["捕猎防盗", "安防设施", "修堤筑墙"], bad: ["开市开门", "动土搬迁", "婚姻迎娶"], tip: "执拗偏狭，宜静守安防，不宜开创纳新。" },
    { name: "破", pinyin: "Po", grade: "大凶", nature: "日月相冲", good: ["拆迁旧房", "破旧立新", "破土求医"], bad: ["入宅", "开张", "婚嫁", "几乎万事不宜"], tip: "日月相冲，极凶极煞，百事回避，绝不可用于乔迁与开工。" },
    { name: "危", pinyin: "Wei", grade: "次凶", nature: "临深履薄", good: ["祭祀", "安居", "宴会合会"], bad: ["登高涉险", "开市动工", "远行出行"], tip: "危惧不安之象，只宜谨小慎微，不宜冒进开工。" },
    { name: "成", pinyin: "Cheng", grade: "大吉", nature: "功成名就", good: ["入宅乔迁", "开张开市", "婚嫁嫁娶", "动土开工", "订约交易"], bad: ["词讼打官司", "争执纷扰"], tip: "黄道大吉之辰，万事皆成，堪舆阳宅动工与迁居首选吉日。" },
    { name: "收", pinyin: "Shou", grade: "次吉", nature: "聚气纳财", good: ["收受财物", "纳财入库", "签定合同", "购房订金"], bad: ["出殡安葬", "远行探病", "出财借贷"], tip: "聚气纳财之日，适合商业收款进仓与房产合同签定。" },
    { name: "开", pinyin: "Kai", grade: "大吉", nature: "生气勃发", good: ["开市开业", "入宅大吉", "迎亲嫁娶", "动土出行", "签约"], bad: ["破土破旧", "安葬封穴"], tip: "生气勃发，大开利市，百神欢悦，百事迎祥之大吉日。" },
    { name: "闭", pinyin: "Bi", grade: "凶日", nature: "闭门塞窦", good: ["修堵缝隙", "防洪筑堤", "安葬封藏"], bad: ["开张营业", "入宅动土", "看病就医", "远行"], tip: "天地闭塞，气脉不畅，忌开门纳气与新房入伙。" }
  ];

  const MONTH_CLASH_MAP = {
    1: "申", 2: "酉", 3: "戌", 4: "亥", 5: "子", 6: "丑",
    7: "寅", 8: "卯", 9: "辰", 10: "巳", 11: "午", 12: "未"
  };

  const SAN_SHA_DATA = [
    { years: [2024, 2028, 2032, 2036, 2040], stem: "甲辰/戊申", group: "申子辰", name: "正南方 (巳午未)", wuhuang: "西北乾宫" },
    { years: [2025, 2029, 2033, 2037, 2041], stem: "乙巳/己酉", group: "巳酉丑", name: "正东方 (寅卯辰)", wuhuang: "正西兑宫" },
    { years: [2026, 2030, 2034, 2038, 2042], stem: "丙午/庚戌", group: "寅午戌", name: "正北方 (亥子丑)", wuhuang: "东北艮宫" },
    { years: [2027, 2031, 2035, 2039, 2043], stem: "丁未/辛亥", group: "亥卯未", name: "正西方 (申酉戌)", wuhuang: "正南离宫" }
  ];

  const YEAR_INFO_MAP = {
    2024: { gz: "甲辰", animal: "龙", taisui: "东南 (辰方 120°)", sansha: "正南方", wuhuang: "西北乾宫" },
    2025: { gz: "乙巳", animal: "蛇", taisui: "东南 (巳方 150°)", sansha: "正东方", wuhuang: "正西兑宫" },
    2026: { gz: "丙午", animal: "马", taisui: "正南 (午方 180°)", sansha: "正北方", wuhuang: "东北艮宫" },
    2027: { gz: "丁未", animal: "羊", taisui: "西南 (未方 210°)", sansha: "正北方", wuhuang: "正南离宫" },
    2028: { gz: "戊申", animal: "猴", taisui: "西南 (申方 240°)", sansha: "正南方", wuhuang: "正北坎宫" },
    2029: { gz: "己酉", animal: "鸡", taisui: "正西 (酉方 270°)", sansha: "正东方", wuhuang: "西南坤宫" },
    2030: { gz: "庚戌", animal: "狗", taisui: "西北 (戌方 300°)", sansha: "正北方", wuhuang: "正东震宫" }
  };

  // 动态创建堪舆子模态弹窗 DOM
  function createKanyuModalDom() {
    if (document.getElementById('modalKanyuAdvisor')) return;

    const modal = document.createElement('div');
    modal.id = 'modalKanyuAdvisor';
    modal.className = 'kanyu-modal-backdrop';
    modal.innerHTML = `
      <div class="kanyu-modal-card">
        <div class="kanyu-card-header">
          <div class="kanyu-persona-wrap">
            <div class="kanyu-avatar">☯️</div>
            <div>
              <div class="kanyu-persona-title">
                <span>堪舆子 · 传统风水顾问</span>
                <span class="metric-badge badge-green" style="font-size:11px;padding:2px 8px;">Agent Skill 规范认证</span>
              </div>
              <div class="kanyu-persona-subtitle">
                江南三元派世家传人 · 沈氏玄空飞星 · 八宅明镜 · 《协纪辨方书》择日
              </div>
              <div class="kanyu-quote">
                「峦头为体，理气为用；峦头差，理气无用；理气差，峦头吉地亦减分。」
              </div>
            </div>
          </div>
          <button type="button" class="modal-close" onclick="window.closeKanyuModal()" style="font-size:24px;background:none;border:none;color:#94a3b8;cursor:pointer;">&times;</button>
        </div>

        <div class="kanyu-card-body">
          <!-- VIP 智能大模型服务状态条 -->
          <div class="kanyu-ai-toolbar">
            <div style="display:flex; align-items:center; gap:8px;">
              <span id="kanyuEnginePill" class="kanyu-engine-pill offline">🔒 VIP 智能大模型推演</span>
              <span style="font-size:11.5px; color:#94a3b8;" id="kanyuModelLabel"></span>
            </div>
            <button type="button" class="kanyu-settings-btn" id="kanyuVipActionBtn" onclick="window.handleKanyuVipAction()" style="cursor:pointer;">
              👑 开通 VIP 会员
            </button>
          </div>

          <div class="kanyu-preset-grid">
            <div class="kanyu-preset-chip" onclick="window.triggerKanyuPreset('yangzhai')">
              <span class="kanyu-chip-title">🏡 阳宅全息研判</span>
              <span class="kanyu-chip-desc">结合当前罗盘坐向与九星，生成三元世家流派断语</span>
            </div>
            <div class="kanyu-preset-chip" onclick="window.triggerKanyuPreset('zeri')">
              <span class="kanyu-chip-title">📅 协纪选吉择日</span>
              <span class="kanyu-chip-desc">入宅/开业/动土黄道吉日与太岁三煞避忌</span>
            </div>
            <div class="kanyu-preset-chip" onclick="window.triggerKanyuPreset('xingsha')">
              <span class="kanyu-chip-title">🛡️ 常见形煞化解</span>
              <span class="kanyu-chip-desc">路冲、天斩、壁刀、反弓与穿堂风古法及软装化解</span>
            </div>
            <div class="kanyu-preset-chip" onclick="window.triggerKanyuPreset('theory')">
              <span class="kanyu-chip-title">📜 堪舆学理答疑</span>
              <span class="kanyu-chip-desc">九运离火运、东西四命、山向飞星顺逆易理详释</span>
            </div>
          </div>

          <div class="kanyu-dialog-container" id="kanyuDialogBox">
            <div class="kanyu-msg-item">
              <div class="kanyu-msg-master">
                <strong>堪舆子云</strong>：同修雅步惠临。老朽承江南三元家法，奉《宅经》《葬书》《协纪辨方书》为纲。不论虚妄之术，不售高价摆件。您可点击上方快捷推演，或在下方详述阳宅朝向、入住年月、动土择日或空间困扰，老朽必据典直论。
              </div>
            </div>
          </div>

          <div class="kanyu-input-bar">
            <input type="text" id="kanyuInputText" class="kanyu-input-text" placeholder="向堪舆子请教（例如：大门正对马路怎么化解？2026年入宅选哪天吉利？主卧床头朝向...）" onkeydown="if(event.key==='Enter') window.askKanyuMaster();">
            <button type="button" class="btn btn-gold" onclick="window.askKanyuMaster()" style="padding:10px 20px;font-weight:700;white-space:nowrap;">请教先生</button>
          </div>

          <div class="kanyu-boundary-footer">
            💡 《宅经》云：『地善则苗茂，宅吉则人荣』。堪舆为辅，人为为主；改善空间磁场左右吉凶概率，修德行善与科学规划方为根本。
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) window.closeKanyuModal();
    });
  }

  // 方剂官方内置绑定的 Gemini 官方 API Key (VIP 专属直连)
  const BUILTIN_VIP_GEMINI_KEY = atob('QVEuQWI4Uk42TGs1RzFoTFhGVFdVZktDY3lEQ2xnZE1KUXJaY0dCYmdEU1RvOHBSbl9aQnc=');

  // 检查当前用户是否具有 VIP 权限
  function checkIsVipUser() {
    if (window.GuoxueAuth && typeof window.GuoxueAuth.isVip === 'function') {
      return Boolean(window.GuoxueAuth.isVip('fengshui') || window.GuoxueAuth.isVip());
    }
    try {
      const uStr = localStorage.getItem('guoxue_user_cache');
      if (uStr) {
        const u = JSON.parse(uStr);
        if (u.memberships && (u.memberships['fengshui']?.is_vip || u.memberships['fangji']?.is_vip)) return true;
      }
    } catch(e) {}
    return false;
  }

  // 唤起会员中心进行开通
  window.handleKanyuVipAction = function () {
    if (window.GuoxueAuth && typeof window.GuoxueAuth.openMemberModal === 'function') {
      window.GuoxueAuth.openMemberModal();
    } else {
      alert('请点击页面右上角「登录 / 会员中心」免费开通实战风水 VIP！');
    }
  };

  // 更新引擎状态栏 (VIP默认已开通，非VIP显示开通VIP)
  window.updateKanyuEngineStatus = function () {
    const pill = document.getElementById('kanyuEnginePill');
    const label = document.getElementById('kanyuModelLabel');
    const btn = document.getElementById('kanyuVipActionBtn');
    const isVip = checkIsVipUser();

    if (!pill) return;
    if (isVip) {
      pill.className = 'kanyu-engine-pill gemini';
      pill.innerHTML = '👑 VIP 专属 · Google Gemini 极速大模型';
      if (label) label.innerText = '(已激活专属推演特权)';
      if (btn) {
        btn.innerText = '✨ VIP 会员已生效';
        btn.style.borderColor = '#10b981';
        btn.style.color = '#34d399';
        btn.onclick = () => {
          if (window.GuoxueAuth && window.GuoxueAuth.openMemberModal) window.GuoxueAuth.openMemberModal();
        };
      }
    } else {
      pill.className = 'kanyu-engine-pill offline';
      pill.innerHTML = '🔒 VIP 专属智能推演';
      if (label) label.innerText = '(开通 VIP 即可解锁先生智能推演)';
      if (btn) {
        btn.innerText = '👑 免费体验开通 VIP';
        btn.style.borderColor = 'rgba(212,175,55,0.4)';
        btn.style.color = '#fce183';
        btn.onclick = window.handleKanyuVipAction;
      }
    }
  };

// 构建堪舆子完整学术法统 System Prompt
  function buildKanyuSystemPrompt(state, bz) {
    const period = state?.period || 9;
    const sitName = state?.sittingM?.name || '子';
    const faceName = state?.facingM?.name || '午';
    const faceDeg = state?.facingDeg || 180;
    const isSub = state?.isSub;
    const pattern = state?.pattern || '旺山旺向';
    const houseGua = bz?.name || '坎宅 (东四宅)';

    return `你是由古典易学名家道统与现代建筑环境科学深度融合的「堪舆子 · 传统风水顾问（江南三元派玄空名师）」。
你的学术宗师与经典依归：
- 《沈氏玄空学》：二十四山下卦挨星替卦诀、山上龙神不下水、水里龙神不上山、二黑五黄重煞化解；
- 《协纪辨方书》：太岁三煞、岁破月破、建除十二神黄黑道吉凶宜忌；
- 《八宅明镜》《阳宅三要》：东四西四宅命配合、门主灶吉凶互配；
- 《宅经》《葬书》：气乘风则散，界水则止。藏风聚气为本。

用户当前的实测罗盘与房屋理气元数据：
- 元运：下元第 ${period} 运 (2024-2043 九紫离火运当令)
- 坐向：坐【${sitName}】山 向【${faceName}】山 (实测向首度数: ${faceDeg}°)
- 卦象性质：${isSub ? '兼向替卦 (杂气兼向，重在纳气口清纯)' : '正向下卦 (正山正向，气脉纯正)'}
- 全屋格局：【${pattern}】
- 宅命卦系：【${houseGua}】
- 当前流年参数：2026丙午马年（太岁正南午方、三煞正北亥子丑、五黄廉贞东北艮宫）

沟通与解答规范：
1. 语言儒雅谦逊、博学沉稳，自称“老朽”，称呼对方为“同修”或“阁下”；
2. 凡关键论断务必简要援引经典名句，坚持理性科学人居：坚决拒绝神化迷信、绝不推销法器神物；
3. 【极速要领】：请开门见山、直接点破玄机要害。优先输出 180~350 字的核心破局法与典籍依据，语言精炼有力，排版优雅，拒绝冗长套话与无意义填充。`;
  }

  // 调用 Google Gemini 官方 API (仅限 VIP，默认使用官方 VIP 专属通道)
  async function callGeminiApi(userPrompt, systemPrompt) {
    if (!checkIsVipUser()) {
      throw new Error('VIP 专属权益未激活');
    }

    const candidateModels = [
      'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-2.5-flash'
    ];

    let lastError = null;

    for (const m of candidateModels) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${BUILTIN_VIP_GEMINI_KEY}`;
      const payload = {
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.65,
          maxOutputTokens: 800
        }
      };
      if (systemPrompt) {
        payload.system_instruction = { parts: [{ text: systemPrompt }] };
      }

      try {
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (resp.ok) {
          const data = await resp.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
        } else {
          const errData = await resp.json().catch(() => ({}));
          lastError = new Error(errData.error?.message || `HTTP ${resp.status}`);
          // 404 或 503 时立即尝试下一个模型
          if (resp.status === 404 || resp.status === 503 || resp.status === 429) {
            continue;
          }
          throw lastError;
        }
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError || new Error('Gemini API 调用未成功');
  }

  // 打开/关闭模态窗
  window.openKanyuModal = function () {
    createKanyuModalDom();
    const modal = document.getElementById('modalKanyuAdvisor');
    if (modal) {
      modal.style.display = 'flex';
      window.updateKanyuEngineStatus();
      const input = document.getElementById('kanyuInputText');
      if (input) setTimeout(() => input.focus(), 150);
    }
  };

  window.closeKanyuModal = function () {
    const modal = document.getElementById('modalKanyuAdvisor');
    if (modal) modal.style.display = 'none';
  };

  // 监听会员登录与 VIP 状态变化实时刷新引擎标识
  window.addEventListener('guoxue:auth_change', () => {
    if (window.updateKanyuEngineStatus) window.updateKanyuEngineStatus();
  });

  // 在对话框追加消息
  function appendKanyuMessage(role, text) {
    const box = document.getElementById('kanyuDialogBox');
    if (!box) return;
    const item = document.createElement('div');
    item.className = 'kanyu-msg-item';
    
    if (role === 'user') {
      item.innerHTML = `<div class="kanyu-msg-user"><strong>您问道</strong>：${text}</div>`;
    } else {
      const html = window.marked ? window.marked.parse(text) : text.replace(/\n/g, '<br>');
      item.innerHTML = `<div class="kanyu-msg-master"><strong>堪舆子云</strong>：<br>${html}</div>`;
    }
    box.appendChild(item);
    box.scrollTop = box.scrollHeight;
  }

  let kanyuThinkingTimer = null;

  function appendKanyuThinking() {
    const box = document.getElementById('kanyuDialogBox');
    if (!box) return null;
    const item = document.createElement('div');
    item.id = 'kanyuThinkingIndicator';
    item.className = 'kanyu-msg-item';
    item.innerHTML = `
      <div class="kanyu-msg-master kanyu-msg-thinking" style="display:flex; align-items:center; gap:10px;">
        <span style="font-size:22px; animation: rotateTaiji 1.2s linear infinite; display:inline-block;">☯️</span>
        <span id="kanyuThinkingText" style="color:#fce183; font-size:13px; font-weight:500;">
          ☯️ 正在排定二十四山天心飞星盘...
        </span>
      </div>
    `;
    box.appendChild(item);
    box.scrollTop = box.scrollHeight;

    const stages = [
      "☯️ 正在排定二十四山天心飞星盘...",
      "📜 正在调阅《沈氏玄空》《协纪辨方书》古籍法统...",
      "⚡ Google Gemini 官方极速大模型正在推演点拨玄机..."
    ];
    let stageIdx = 0;
    if (kanyuThinkingTimer) clearInterval(kanyuThinkingTimer);
    kanyuThinkingTimer = setInterval(() => {
      stageIdx = (stageIdx + 1) % stages.length;
      const textEl = document.getElementById('kanyuThinkingText');
      if (textEl) textEl.innerText = stages[stageIdx];
    }, 450);

    return item;
  }

  function removeKanyuThinking() {
    if (kanyuThinkingTimer) {
      clearInterval(kanyuThinkingTimer);
      kanyuThinkingTimer = null;
    }
    const el = document.getElementById('kanyuThinkingIndicator');
    if (el) el.remove();
  }

  // 平滑逐字打字机效果渲染（增加极速沉浸感）
  function renderTypewriterMasterMessage(rawText) {
    const box = document.getElementById('kanyuDialogBox');
    if (!box) return;
    const item = document.createElement('div');
    item.className = 'kanyu-msg-item';
    item.innerHTML = `<div class="kanyu-msg-master"><strong>堪舆子云</strong>：<br><div class="kanyu-typewriter-body"></div></div>`;
    box.appendChild(item);
    box.scrollTop = box.scrollHeight;

    const bodyEl = item.querySelector('.kanyu-typewriter-body');
    const finalHtml = window.marked ? window.marked.parse(rawText) : rawText.replace(/\n/g, '<br>');

    // 若内容太长或不需要打字机则快速呈现
    if (rawText.length < 20 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      bodyEl.innerHTML = finalHtml;
      box.scrollTop = box.scrollHeight;
      return;
    }

    // 采用极速流式打字模拟（每批 3-5 字符，总耗时控制在 300ms 以内）
    let charPos = 0;
    const stepLen = Math.max(4, Math.floor(rawText.length / 30));
    const timer = setInterval(() => {
      charPos += stepLen;
      if (charPos >= rawText.length) {
        clearInterval(timer);
        bodyEl.innerHTML = finalHtml;
      } else {
        const slice = rawText.slice(0, charPos);
        bodyEl.innerHTML = (window.marked ? window.marked.parse(slice) : slice.replace(/\n/g, '<br>')) + '<span style="display:inline-block;width:6px;height:14px;background:#fce183;margin-left:3px;vertical-align:middle;animation:blinkCursor 0.6s infinite;"></span>';
      }
      box.scrollTop = box.scrollHeight;
    }, 20);
  }

  // 触发快捷预设
  window.triggerKanyuPreset = async function (type) {
    createKanyuModalDom();
    const state = window.currentChartState || null;
    const bz = (state && state.sittingM && window.BAZHAI_DATA) ? (window.BAZHAI_DATA[state.sittingM.palace] || null) : null;
    const cfg = getGeminiConfig();
    
    let userPromptText = "";
    let offlineResp = "";

    if (type === 'yangzhai') {
      userPromptText = '请先生根据当前实测罗盘与星盘，为舍下作阳宅全息研判。';
      if (!state) {
        offlineResp = '《天玉经》云：『江东一卦从来吉，八神四个一』。当前罗盘尚未完成立极，请先在左侧输入向首度数或拨动罗盘天心，老朽方能起盘断吉凶。';
      } else {
        offlineResp = `《玄空秘旨》云：『山上龙神不下水，水里龙神不上山』。

当前实测舍下坐向乃**坐【${state.sittingM.name}】山向【${state.facingM.name}】山**（实测向首度数 ${state.facingDeg}°），处于**下元九运**之局。

【格局宏观】：此局呈现**【${state.pattern}】**。${state.isSub ? '实测偏角超过三度，已按沈氏《挨星替卦诀》排定兼向替卦，气场带杂，尤重纳气口之洁净。' : '正山正向，气脉纯正无驳杂，主百事安定安泰。'}

【理气点拨】：
1. **向星当旺之所**：九紫离火为九运当令财星，宜设明堂开阔大窗、流通走道与柔和灯彩，此谓『当令向星见明堂，骤发财禄不可挡』；
2. **山星静守之所**：坐山方为人丁健康靠山，床头必须厚重靠实，忌临窗悬空；
3. **二五重煞方**：二黑病符与五黄凶曜飞临之处，绝不可安炉作灶或设主卧安床，宜以纯铜六帝钱尺、天然铜葫芦重金泄化其土煞凶性。`;
      }
    } else if (type === 'zeri') {
      userPromptText = '请教先生乔迁入宅与开工修造，当如何依据《协纪辨方书》选定吉期？';
      offlineResp = `《协纪辨方书》云：『岁破、月破，百神回避；三煞动土，祸患立见』。

【四大事项择日铁律】：
1. **入宅乔迁**：首取**成日**、**开日**、**满日**。严避【岁破日】与【月破日】；入宅吉时宜在巳、午阳气隆盛之时；
2. **开市营业**：首取**开日**、**成日**、**定日**，向首当令旺位宜纳客见水；
3. **动工修造**：严避流年太岁方（2026在正南午方）与流年三煞方（2026在正北方亥子丑），五黄飞临之处（2026在东北艮宫）绝不可先起首锤；
4. **月破速查**：正月破申、二月破酉、三月破戌、四月破亥、五月破子、六月破丑、七月破寅、八月破卯、九月破辰、十月破巳、十一月破午、十二月破未。凡逢月破日，万事莫动。

您亦可在右侧切至 **【📅 协纪择日吉期】** 选项卡，查看精确到月日神煞的交互排演。`;
    } else if (type === 'xingsha') {
      userPromptText = '请教先生，常见住宅外煞与内煞当如何化解？';
      offlineResp = `《葬书》云：『气乘风则散，界水则止』。堪舆化煞，以**「移形易位、物理阻隔」**为上策，摆设风水器物为下策。

【常见外煞调理】：
- **路冲煞（枪煞）**：道路直冲大门或主窗。化解：玄关设透光屏风阻隔直气，窗台设宽阔泰山石或绿植厚帘缓冲；
- **天斩煞**：两高楼狭缝正对窗前。化解：悬挂八卦凸镜或安设百叶厚帘，室外摆放阔叶常绿盆栽化煞；
- **壁刀煞**：邻楼墙角切向本宅。化解：设置凸面镜或磨砂反光贴膜反弹冲力。

【常见内煞调理】：
- **穿堂风**：大门正对阳台大窗，气流直进直出。化解：大门内1.5米设长虹玻璃玄关柜，令气流『曲则有情』；
- **横梁压床**：睡床正上方有承重横梁。化解：床头横移脱离梁下，或吊顶做弧形石膏板完全包裹遮蔽；
- **厨厕相对**：水火相战。化解：两门错开或常闭其一，门上悬挂过膝棉麻长帘。`;
    } else if (type === 'theory') {
      userPromptText = '请先生开示：何为三元九运？下元九运对现代阳宅有何影响？';
      offlineResp = `《青囊序》云：『二十四山分顺逆，共成四十有八局』。

1. **三元九运真源**：以木星土星会合周期为基，一运二十年，三运为一元（六十年），上中下三元共一百八十年大循环。
2. **当前九运（2024–2043）气象**：
   - 乃**九紫离火运**，离卦属火、居正南方，主文明、科技、女性、精神修养与创意文化；
   - **当旺吉星**：九紫当令最旺，一白坎水为生气（将来之旺），八白艮土为退气；
   - **正零神大要**：正神在正南离宫（宜实地、高山、静守），零神在正北坎宫（宜水流、大窗、动气纳财）。若反之正南动水、正北闭塞，则谓『正神下水、零神上山』，主退财败气。`;
    }

    appendKanyuMessage('user', userPromptText);

    // 严格会员权限检验：VIP 默认直连官方 Gemini 大模型，非 VIP 提示开通 VIP
    const isVip = checkIsVipUser();
    if (!isVip) {
      setTimeout(() => {
        const nonVipHtml = `
          <div style="background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 10px; padding: 16px; margin: 8px 0;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
              <span style="font-size:20px;">👑</span>
              <strong style="color:#fce183; font-size:14px;">堪舆子智能大模型推演为 VIP 专享功能</strong>
            </div>
            <p style="font-size:12.5px; color:#cbd5e1; line-height:1.6; margin-bottom:12px;">
              同修雅步。堪舆子先生深度易学推演已全面接入 Google Gemini 官方大模型，为您提供二十四山分金立极、挨星替卦与现代空间工程级调理。<br>
              当前您尚未开通实战风水 VIP 会员。现为免费体验期，点击下方按钮即可一键免费激活 VIP 专属推演特权！
            </p>
            <div style="display:flex; gap:10px; align-items:center;">
              <button type="button" class="btn btn-gold" style="padding:6px 16px; font-size:12.5px; font-weight:700;" onclick="window.handleKanyuVipAction()">
                ✨ 立即免费开通 VIP 体验
              </button>
            </div>
          </div>
        `;
        appendKanyuMessage('master', nonVipHtml);
      }, 250);
      return;
    }

    appendKanyuThinking();
    try {
      const sysPrompt = buildKanyuSystemPrompt(state, bz);
      const geminiReply = await callGeminiApi(userPromptText, sysPrompt);
      removeKanyuThinking();
      renderTypewriterMasterMessage(geminiReply);
    } catch (err) {
      console.warn('Gemini 调用失败：', err);
      removeKanyuThinking();
      appendKanyuMessage('master', `⚠️ 堪舆子推演服务繁忙或网络波动（${err.message}），请稍候重试。`);
    }
  };

  // 自由提问堪舆子
  window.askKanyuMaster = async function () {
    const input = document.getElementById('kanyuInputText');
    if (!input) return;
    const q = input.value.trim();
    if (!q) return;

    appendKanyuMessage('user', q);
    input.value = '';

    const state = window.currentChartState || null;
    const bz = (state && state.sittingM && window.BAZHAI_DATA) ? (window.BAZHAI_DATA[state.sittingM.palace] || null) : null;
    const isVip = checkIsVipUser();

    // 严格会员权限检验：非 VIP 仅展示开通 VIP 引导
    if (!isVip) {
      setTimeout(() => {
        const nonVipHtml = `
          <div style="background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 10px; padding: 16px; margin: 8px 0;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
              <span style="font-size:20px;">👑</span>
              <strong style="color:#fce183; font-size:14px;">堪舆子智能大模型问答为 VIP 专享功能</strong>
            </div>
            <p style="font-size:12.5px; color:#cbd5e1; line-height:1.6; margin-bottom:12px;">
              向堪舆子请教具体住宅格局、形煞化解与择日吉凶需经由官方 AI 大模型深度计算。<br>
              当前为系统体验期，点击下方即可一键免费体验开通 VIP！
            </p>
            <div style="display:flex; gap:10px; align-items:center;">
              <button type="button" class="btn btn-gold" style="padding:6px 16px; font-size:12.5px; font-weight:700;" onclick="window.handleKanyuVipAction()">
                ✨ 立即免费开通 VIP 体验
              </button>
            </div>
          </div>
        `;
        appendKanyuMessage('master', nonVipHtml);
      }, 250);
      return;
    }

    appendKanyuThinking();
    try {
      const sysPrompt = buildKanyuSystemPrompt(state, bz);
      const reply = await callGeminiApi(q, sysPrompt);
      removeKanyuThinking();
      renderTypewriterMasterMessage(reply);
    } catch (err) {
      console.warn('Gemini 请求失败：', err);
      removeKanyuThinking();
      appendKanyuMessage('master', `⚠️ 堪舆子推演服务繁忙（${err.message}），请稍后重试。`);
    }
  };



  // ------------------------------------------------------------
  // 协纪择日 Tab 交互计算与渲染 (tab-zeri)
  // ------------------------------------------------------------
  window.calculateAndRenderZeriTab = function () {
    const selYear = parseInt(document.getElementById('selectZeriYear') ? document.getElementById('selectZeriYear').value : 2026, 10);
    const selMonth = parseInt(document.getElementById('selectZeriMonth') ? document.getElementById('selectZeriMonth').value : 5, 10);
    const selEvent = document.getElementById('selectZeriEvent') ? document.getElementById('selectZeriEvent').value : "入宅";
    const selZodiac = document.getElementById('selectZeriZodiac') ? document.getElementById('selectZeriZodiac').value : "马";

    const yInfo = YEAR_INFO_MAP[selYear] || YEAR_INFO_MAP[2026];
    const clashBranch = MONTH_CLASH_MAP[selMonth] || "子";

    // 渲染统计头
    const statsBox = document.getElementById('zeriStatsBanner');
    if (statsBox) {
      statsBox.innerHTML = `
        <div class="zeri-stat-box">
          <span class="zeri-stat-label">岁次干支纪年</span>
          <span class="zeri-stat-val">${selYear}年 · ${yInfo.gz} (肖${yInfo.animal})</span>
        </div>
        <div class="zeri-stat-box">
          <span class="zeri-stat-label">太岁方位 (严禁先动土)</span>
          <span class="zeri-stat-val" style="color:#fb7185;">${yInfo.taisui}</span>
        </div>
        <div class="zeri-stat-box">
          <span class="zeri-stat-label">年三煞方 (严防破煞)</span>
          <span class="zeri-stat-val" style="color:#fb7185;">${yInfo.sansha}</span>
        </div>
        <div class="zeri-stat-box">
          <span class="zeri-stat-label">流年五黄大煞位</span>
          <span class="zeri-stat-val" style="color:#fcd34d;">${yInfo.wuhuang}</span>
        </div>
      `;
    }

    // 渲染十二建星格子
    const gridBox = document.getElementById('zeriOfficersGrid');
    if (gridBox) {
      gridBox.innerHTML = TWELVE_OFFICERS.map(item => {
        let isBest = item.good.some(g => selEvent.includes(g) || g.includes(selEvent));
        let isBad = item.bad.some(b => selEvent.includes(b) || b.includes(selEvent));
        
        let cellClass = "cell-ping";
        let badgeClass = "badge-ping";
        let statusTag = "平日";

        if (isBest || item.grade === "大吉") {
          cellClass = "cell-daji";
          badgeClass = "badge-daji";
          statusTag = "🌟 首选大吉";
        } else if (item.grade === "次吉" || item.grade === "吉神") {
          cellClass = "cell-ciji";
          badgeClass = "badge-ciji";
          statusTag = "次吉可取";
        } else if (isBad || item.grade.includes("凶")) {
          cellClass = "cell-daxiong";
          badgeClass = "badge-xiong";
          statusTag = "💥 忌避凶日";
        }

        return `
          <div class="zeri-officer-cell ${cellClass}">
            <div class="zeri-officer-name" style="color:${isBest ? '#34d399' : (isBad ? '#fb7185' : '#f8fafc')};">${item.name}日</div>
            <span class="zeri-officer-grade ${badgeClass}">${statusTag}</span>
            <div style="font-size:11px;color:#94a3b8;line-height:1.4;margin-top:2px;">
              <strong>宜</strong>：${item.good.slice(0, 3).join('、')}
            </div>
            <div style="font-size:10.5px;color:#64748b;line-height:1.3;">
              <strong>忌</strong>：${item.bad.slice(0, 2).join('、')}
            </div>
          </div>
        `;
      }).join('');
    }

    // 渲染名师综合建议卡片
    const adviceBox = document.getElementById('zeriAdviceCard');
    if (adviceBox) {
      const state = window.currentChartState || null;
      let facingAdvice = "";
      if (state && state.facingDeg !== undefined) {
        facingAdvice = `结合当前罗盘实测向首 **【坐${state.sittingM.name}山 向${state.facingM.name}山 (${state.facingDeg}°）】**，入宅时建议从当前向星旺气方率先引入米面净水与红火炉，避开三煞直冲。`;
      }

      adviceBox.innerHTML = `
        <h4><span>📜</span> 《协纪辨方书》堪舆学择日总决断（主事人肖【${selZodiac}】· 事项：【${selEvent}】）</h4>
        <p>
          1. <strong>黄道首选日</strong>：针对【${selEvent}】，农历 ${selMonth} 月首选【<strong>成日</strong>】、【<strong>开日</strong>】或【<strong>满日</strong>】，主功成名就、百事通达；<br>
          2. <strong>当月月破严忌</strong>：农历 ${selMonth} 月之月破凶日为<strong>逢【${clashBranch}日】</strong>。月破之日天地阴阳相冲，任何吉星均不能压制，绝不可用于${selEvent}；<br>
          3. <strong>岁煞避忌</strong>：${selYear} ${yInfo.gz}年太岁占在<strong>${yInfo.taisui}</strong>，三煞占在<strong>${yInfo.sansha}</strong>。若涉及开工动土，断不可从太岁与三煞方位第一锤起动；<br>
          4. <strong>主事人生肖冲克</strong>：主事人肖【${selZodiac}】，择日亦须避开与自身生肖相冲之日（子午冲、丑未冲、寅申冲、卯酉冲、辰戌冲、巳亥冲）；<br>
          5. <strong>进宅纳气指引</strong>：${facingAdvice || "吉日宜配吉时，入宅首选辰时(7-9点)、巳时(9-11点)阳气上升之时迎吉纳祥。"}
        </p>
      `;
    }
  };

  // DOM 准备完毕自动初始化
  document.addEventListener('DOMContentLoaded', () => {
    createKanyuModalDom();
  });

})();
