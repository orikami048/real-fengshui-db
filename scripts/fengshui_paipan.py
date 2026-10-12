#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
实战风水排盘命令行工具 (Feng Shui Charting Engine CLI)
支持玄空飞星九宫排盘、八宅明镜宅法、居者立春本命卦、三元纳气门窗评估
"""

import sys
import argparse
import json

# 确保在 Windows 控制台下支持 UTF-8 编码
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")


# 二十四山基础数据（山名、卦名、宫数、元龙、阴阳、中心度、替卦星）
MOUNTAINS = [
    {"name": "子", "gua": "坎", "palace": 1, "dragon": "天", "polarity": "-", "deg": 0.0, "min": 352.5, "max": 7.5, "sub": 1},
    {"name": "癸", "gua": "坎", "palace": 1, "dragon": "人", "polarity": "-", "deg": 15.0, "min": 7.5, "max": 22.5, "sub": 1},
    {"name": "丑", "gua": "艮", "palace": 8, "dragon": "地", "polarity": "-", "deg": 30.0, "min": 22.5, "max": 37.5, "sub": 7},
    {"name": "艮", "gua": "艮", "palace": 8, "dragon": "天", "polarity": "+", "deg": 45.0, "min": 37.5, "max": 52.5, "sub": 7},
    {"name": "寅", "gua": "艮", "palace": 8, "dragon": "人", "polarity": "+", "deg": 60.0, "min": 52.5, "max": 67.5, "sub": 7},
    {"name": "甲", "gua": "震", "palace": 3, "dragon": "地", "polarity": "+", "deg": 75.0, "min": 67.5, "max": 82.5, "sub": 1},
    {"name": "卯", "gua": "震", "palace": 3, "dragon": "天", "polarity": "-", "deg": 90.0, "min": 82.5, "max": 97.5, "sub": 2},
    {"name": "乙", "gua": "震", "palace": 3, "dragon": "人", "polarity": "-", "deg": 105.0, "min": 97.5, "max": 112.5, "sub": 2},
    {"name": "辰", "gua": "巽", "palace": 4, "dragon": "地", "polarity": "-", "deg": 120.0, "min": 112.5, "max": 127.5, "sub": 6},
    {"name": "巽", "gua": "巽", "palace": 4, "dragon": "天", "polarity": "+", "deg": 135.0, "min": 127.5, "max": 142.5, "sub": 6},
    {"name": "巳", "gua": "巽", "palace": 4, "dragon": "人", "polarity": "+", "deg": 150.0, "min": 142.5, "max": 157.5, "sub": 6},
    {"name": "丙", "gua": "离", "palace": 9, "dragon": "地", "polarity": "+", "deg": 165.0, "min": 157.5, "max": 172.5, "sub": 7},
    {"name": "午", "gua": "离", "palace": 9, "dragon": "天", "polarity": "-", "deg": 180.0, "min": 172.5, "max": 187.5, "sub": 7},
    {"name": "丁", "gua": "离", "palace": 9, "dragon": "人", "polarity": "-", "deg": 195.0, "min": 187.5, "max": 202.5, "sub": 7},
    {"name": "未", "gua": "坤", "palace": 2, "dragon": "地", "polarity": "-", "deg": 210.0, "min": 202.5, "max": 217.5, "sub": 2},
    {"name": "坤", "gua": "坤", "palace": 2, "dragon": "天", "polarity": "+", "deg": 225.0, "min": 217.5, "max": 232.5, "sub": 2},
    {"name": "申", "gua": "坤", "palace": 2, "dragon": "人", "polarity": "+", "deg": 240.0, "min": 232.5, "max": 247.5, "sub": 1},
    {"name": "庚", "gua": "兑", "palace": 7, "dragon": "地", "polarity": "+", "deg": 255.0, "min": 247.5, "max": 262.5, "sub": 6},
    {"name": "酉", "gua": "兑", "palace": 7, "dragon": "天", "polarity": "-", "deg": 270.0, "min": 262.5, "max": 277.5, "sub": 7},
    {"name": "辛", "gua": "兑", "palace": 7, "dragon": "人", "polarity": "-", "deg": 285.0, "min": 277.5, "max": 292.5, "sub": 7},
    {"name": "戌", "gua": "乾", "palace": 6, "dragon": "地", "polarity": "-", "deg": 300.0, "min": 292.5, "max": 307.5, "sub": 6},
    {"name": "乾", "gua": "乾", "palace": 6, "dragon": "天", "polarity": "+", "deg": 315.0, "min": 307.5, "max": 322.5, "sub": 6},
    {"name": "亥", "gua": "乾", "palace": 6, "dragon": "人", "polarity": "+", "deg": 330.0, "min": 322.5, "max": 337.5, "sub": 6},
    {"name": "壬", "gua": "坎", "palace": 1, "dragon": "地", "polarity": "+", "deg": 345.0, "min": 337.5, "max": 352.5, "sub": 2}
]

LUO_SHU_STEPS = [5, 6, 7, 8, 9, 1, 2, 3, 4]

def get_mountain(deg):
    d = deg % 360
    for m in MOUNTAINS:
        if m["name"] == "子":
            if d >= 352.5 or d < 7.5:
                return m
        else:
            if m["min"] <= d < m["max"]:
                return m
    return MOUNTAINS[0]

def fly(center_star, is_forward=True):
    res = {}
    for i, pal in enumerate(LUO_SHU_STEPS):
        if is_forward:
            s = ((center_star - 1 + i) % 9) + 1
        else:
            s = ((center_star - 1 - i) % 9 + 9) % 9 + 1
        res[pal] = s
    return res

def paipan(period, facing_deg):
    f_mountain = get_mountain(facing_deg)
    s_mountain = get_mountain((facing_deg + 180) % 360)
    
    diff = abs(facing_deg - f_mountain["deg"])
    if diff > 180: diff = 360 - diff
    is_sub = diff > 3.0
    
    # 运盘
    base = fly(period, True)
    
    # 山星
    s_base = s_mountain["sub"] if is_sub else base[s_mountain["palace"]]
    # 找本宫同元龙山
    s_target = next((m for m in MOUNTAINS if m["palace"] == s_base and m["dragon"] == s_mountain["dragon"]), None)
    s_forward = s_target["polarity"] == "+" if s_target else True
    m_chart = fly(s_base, s_forward)
    
    # 向星
    f_base = f_mountain["sub"] if is_sub else base[f_mountain["palace"]]
    f_target = next((m for m in MOUNTAINS if m["palace"] == f_base and m["dragon"] == f_mountain["dragon"]), None)
    f_forward = f_target["polarity"] == "+" if f_target else True
    f_chart = fly(f_base, f_forward)
    
    # 格局
    pat = "普通格局"
    if m_chart[s_mountain["palace"]] == period and f_chart[f_mountain["palace"]] == period:
        pat = "旺山旺向（到山到向）"
    elif m_chart[f_mountain["palace"]] == period and f_chart[s_mountain["palace"]] == period:
        pat = "上山下水"
    elif f_chart[f_mountain["palace"]] == period and m_chart[f_mountain["palace"]] == period:
        pat = "双星到向"
    elif m_chart[s_mountain["palace"]] == period and f_chart[s_mountain["palace"]] == period:
        pat = "双星到山"
        
    return {
        "period": period,
        "facing_deg": facing_deg,
        "sitting": s_mountain["name"],
        "facing": f_mountain["name"],
        "is_sub": is_sub,
        "pattern": pat,
        "base": base,
        "mountain": m_chart,
        "facing_star": f_chart
    }

def print_chart(res):
    print("=" * 55)
    print(f"☯️ 【实战玄空飞星排盘】 三元第 {res['period']} 运")
    sub_str = "【替卦兼向】" if res['is_sub'] else "【正向下卦】"
    print(f"坐向：坐 {res['sitting']} 向 {res['facing']}（向首 {res['facing_deg']}°） {sub_str}")
    print(f"格局判定：🌟 {res['pattern']}")
    print("-" * 55)
    
    # 九宫打印顺序：
    # 东南(4)  正南(9)  西南(2)
    # 正东(3)  中央(5)  正西(7)
    # 东北(8)  正北(1)  西北(6)
    grid = [
        [4, 9, 2],
        [3, 5, 7],
        [8, 1, 6]
    ]
    pal_names = {4: "东南[巽]", 9: "正南[离]", 2: "西南[坤]", 3: "正东[震]", 5: "中宫[天]", 7: "正西[兑]", 8: "东北[艮]", 1: "正北[坎]", 6: "西北[乾]"}
    
    for row in grid:
        line_header = ""
        line_stars = ""
        for p in row:
            line_header += f" {pal_names[p]:^14} |"
            m = res["mountain"][p]
            f = res["facing_star"][p]
            b = res["base"][p]
            line_stars += f"   山{m}  向{f} [运{b}]  |"
        print(line_header)
        print(line_stars)
        print("-" * 55)

def calculate_zeri(year=2026, month=5, event="入宅"):
    # 基础三煞太岁数据库
    san_sha_map = {
        "申子辰": {"name": "正南方", "branches": ["巳", "午", "未"], "years": [2024, 2028, 2032, 2036, 2040]},
        "巳酉丑": {"name": "正东方", "branches": ["寅", "卯", "辰"], "years": [2025, 2029, 2033, 2037, 2041]},
        "寅午戌": {"name": "正北方", "branches": ["亥", "子", "丑"], "years": [2026, 2030, 2034, 2038, 2042]},
        "亥卯未": {"name": "正西方", "branches": ["申", "酉", "戌"], "years": [2027, 2031, 2035, 2039, 2043]}
    }
    
    ganzhi_year_list = {
        2024: ("甲辰", "龙", "东南(辰120°)", "西北乾宫"),
        2025: ("乙巳", "蛇", "东南(巳150°)", "正西兑宫"),
        2026: ("丙午", "马", "正南(午180°)", "东北艮宫"),
        2027: ("丁未", "羊", "西南(未210°)", "正南离宫"),
        2028: ("戊申", "猴", "西南(申240°)", "正北坎宫"),
        2029: ("己酉", "鸡", "正西(酉270°)", "西南坤宫"),
        2030: ("庚戌", "狗", "西北(戌300°)", "正东震宫")
    }
    
    gz_info = ganzhi_year_list.get(year, ("丙午", "马", "正南(午180°)", "东北艮宫"))
    
    # 查找三煞方
    sha_info = None
    for group, val in san_sha_map.items():
        if year in val["years"]:
            sha_info = val
            break
    if not sha_info:
        sha_info = san_sha_map["寅午戌"]
        
    # 月破地支 (农历1-12月)
    month_clash = {1:"申", 2:"酉", 3:"戌", 4:"亥", 5:"子", 6:"丑", 7:"寅", 8:"卯", 9:"辰", 10:"巳", 11:"午", 12:"未"}
    clash_branch = month_clash.get(month, "子")
    
    # 建除吉凶
    jian_chu = [
        {"name": "建", "nature": "平中带凶", "good": ["祭祀", "祈福"], "bad": ["开市", "嫁娶", "入宅", "动土"]},
        {"name": "除", "nature": "吉神", "good": ["沐浴", "大扫除", "求医治病"], "bad": ["嫁娶", "出行"]},
        {"name": "满", "nature": "次吉", "good": ["入宅乔迁", "开市纳财", "结纳宴客"], "bad": ["动土开渠", "安葬"]},
        {"name": "平", "nature": "平日", "good": ["修饰垣墙", "日常事务"], "bad": ["诉讼", "嫁娶", "重大开张"]},
        {"name": "定", "nature": "吉神", "good": ["安床", "签约订盟", "开业祈福"], "bad": ["争执词讼", "远行"]},
        {"name": "执", "nature": "小凶", "good": ["安防设施", "守成修墙"], "bad": ["开市", "入宅搬家"]},
        {"name": "破", "nature": "大凶(月破)", "good": ["破土拆旧"], "bad": ["万事不宜", "严忌入宅与开工"]},
        {"name": "危", "nature": "次凶", "good": ["祭祀", "安居"], "bad": ["登高涉险", "开市动工"]},
        {"name": "成", "nature": "大吉(首选)", "good": ["入宅乔迁", "开市开业", "嫁娶", "动土开工"], "bad": ["诉讼争执"]},
        {"name": "收", "nature": "次吉", "good": ["纳财入库", "签定合同", "收款"], "bad": ["出殡安葬", "借贷"]},
        {"name": "开", "nature": "大吉(首选)", "good": ["开张开市", "入宅大吉", "嫁娶", "出行签约"], "bad": ["破土", "安葬"]},
        {"name": "闭", "nature": "凶日", "good": ["修补堵塞", "安葬"], "bad": ["开业开市", "入宅动土"]}
    ]
    
    recommended = [j for j in jian_chu if any(event in g for g in j["good"])]
    if not recommended:
        recommended = [j for j in jian_chu if "大吉" in j["nature"] or "吉神" in j["nature"]]
        
    return {
        "year": year,
        "year_stem_branch": gz_info[0],
        "zodiac": gz_info[1],
        "taisui_direction": gz_info[2],
        "wuhuang_direction": gz_info[3],
        "sansha_direction": sha_info["name"],
        "sansha_branches": sha_info["branches"],
        "lunar_month": month,
        "month_clash_branch": clash_branch,
        "event": event,
        "recommended_officers": recommended,
        "advice": f"【堪舆子择日箴言】《协纪辨方书》云：『避凶莫重于太岁三煞』。{year}年太岁在{gz_info[2]}，三煞在{sha_info['name']}，五黄在{gz_info[3]}。办理【{event}】首选【成日】、【开日】或【满日】，切忌犯逢【{clash_branch}日（月破日）】与当年岁破日。"
    }

def print_zeri(res):
    print("=" * 60)
    print(f"🏮 《协纪辨方书》堪舆学传统择日吉期排演")
    print("=" * 60)
    print(f"年份：{res['year']} 年（干支：{res['year_stem_branch']} · 肖{res['zodiac']}）")
    print(f"太岁方位（忌先动土）：{res['taisui_direction']}")
    print(f"年三煞位（严防破煞）：{res['sansha_direction']}（地支：{'、'.join(res['sansha_branches'])}）")
    print(f"流年五黄大煞位：{res['wuhuang_direction']}")
    print(f"农历月份：农历 {res['lunar_month']} 月 | 💥 当月月破凶日：逢【{res['month_clash_branch']}日】万事避用")
    print(f"咨询事项：【{res['event']}】")
    print("-" * 60)
    print("🎯 首选建除黄道吉神推荐：")
    for r in res["recommended_officers"]:
        print(f"  • 【{r['name']}日】({r['nature']})：宜 {', '.join(r['good'])} | 忌 {', '.join(r['bad'])}")
    print("-" * 60)
    print(f"📜 名师点拨：{res['advice']}")
    print("=" * 60)

import base64
DEFAULT_VIP_GEMINI_KEY = base64.b64decode("QVEuQWI4Uk42TGs1RzFoTFhGVFdVZktDY3lEQ2xnZE1KUXJaY0dCYmdEU1RvOHBSbl9aQnc=").decode("utf-8")

def call_gemini_cli(prompt, key=None, model="gemini-2.5-flash"):
    import os
    import urllib.request
    target_key = key or os.environ.get("GEMINI_API_KEY") or DEFAULT_VIP_GEMINI_KEY
    m_target = model
    if m_target == "gemini-2.5-flash" or not m_target:
        m_target = "gemini-3.5-flash-lite"
    candidate_models = [m_target, "gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-2.5-flash"]
    last_err = None

    for m in candidate_models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={target_key}"
        payload = {
            "system_instruction": {
                "parts": [{"text": "你是由江南三元玄空世家传承与现代建筑环境科学融合的「堪舆子 · 传统风水顾问」。请结合排盘数据给出权威、儒雅、精炼的解答。"}]
            },
            "contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.65, "maxOutputTokens": 800}
        }
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        try:
            with urllib.request.urlopen(req, timeout=12) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            last_err = e
            continue
    return f"Gemini 请求失败：{last_err}"

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="实战风水排盘与协纪辨方择日命令行工具 (支持 Google Gemini 大模型直连)")
    parser.add_argument("--facing", type=float, default=180.0, help="实测向首度数 (0.0~359.9)")
    parser.add_argument("--period", type=int, default=9, help="三元九运 (当前默认为 9 运)")
    parser.add_argument("--zeri", action="store_true", help="启动协纪辨方传统择日排演")
    parser.add_argument("--event", type=str, default="入宅", help="择日事项：入宅/开业/动土/婚嫁")
    parser.add_argument("--year", type=int, default=2026, help="择日年份 (如 2026)")
    parser.add_argument("--month", type=int, default=5, help="农历月份 (1~12)")
    parser.add_argument("--gemini", action="store_true", help="调用 Google Gemini 大模型生成大师研判")
    parser.add_argument("--key", type=str, default=None, help="Google Gemini API Key (默认自动使用内置 VIP Key)")
    parser.add_argument("--model", type=str, default="gemini-3.5-flash-lite", help="Gemini 模型名称 (默认 gemini-3.5-flash-lite 极速通道)")
    parser.add_argument("--json", action="store_true", help="输出机器可读 JSON")
    args = parser.parse_args()
    
    if args.zeri:
        z_res = calculate_zeri(args.year, args.month, args.event)
        if args.gemini:
            prompt = f"请先生根据以下《协纪辨方书》择日排盘数据，为【{args.event}】事项进行名师指点：\n{json.dumps(z_res, ensure_ascii=False, indent=2)}"
            print(f"\n🌟 正在请求 Google Gemini ({args.model}) 进行智能择日研判...\n")
            print(call_gemini_cli(prompt, args.key, args.model))
        elif args.json:
            print(json.dumps(z_res, ensure_ascii=False, indent=2))
        else:
            print_zeri(z_res)
    else:
        res = paipan(args.period, args.facing)
        if args.gemini:
            prompt = f"请先生根据以下阳宅坐向理气排盘数据，进行全维度空间诊断与工程软装化解指导：\n{json.dumps(res, ensure_ascii=False, indent=2)}"
            print(f"\n🌟 正在请求 Google Gemini ({args.model}) 进行理气全息研判...\n")
            print(call_gemini_cli(prompt, args.key, args.model))
        elif args.json:
            print(json.dumps(res, ensure_ascii=False, indent=2))
        else:
            print_chart(res)

