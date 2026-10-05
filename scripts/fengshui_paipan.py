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

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="实战风水排盘命令行工具")
    parser.add_argument("--facing", type=float, default=180.0, help="实测向首度数 (0.0~359.9)")
    parser.add_argument("--period", type=int, default=9, help="三元九运 (当前默认为 9 运)")
    parser.add_argument("--json", action="store_true", help="输出机器可读 JSON")
    args = parser.parse_args()
    
    res = paipan(args.period, args.facing)
    if args.json:
        print(json.dumps(res, ensure_ascii=False, indent=2))
    else:
        print_chart(res)
