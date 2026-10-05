import { PrismaClient } from "@prisma/client";
import periodsData from "../data/periods.json";
import mountainsData from "../data/twenty_four_mountains.json";
import nineStarsData from "../data/nine_stars.json";
import eightMansionsData from "../data/eight_mansions.json";
import formShaData from "../data/form_sha.json";

import { analyzeOrientation } from "./engine/twentyFourMountain";
import { calculateFlyingStarChart } from "./engine/flyingStar";
import { calculateLifeGua, getEightMansionsChart } from "./engine/eightMansions";
import { evaluateAirIntake } from "./engine/airIntake";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 开始初始化实战风水数据库基础数据 (Seed Data)...");

  // 1. 导入三元九运
  for (const p of periodsData) {
    await prisma.period.upsert({
      where: { id: p.id },
      update: p,
      create: p
    });
  }
  console.log(`✅ 已导入 ${periodsData.length} 个三元九运数据`);

  // 2. 导入罗盘二十四山
  for (const m of mountainsData) {
    await prisma.twentyFourMountain.upsert({
      where: { name: m.name },
      update: m,
      create: m
    });
  }
  console.log(`✅ 已导入 ${mountainsData.length} 座二十四山精确数据`);

  // 3. 导入紫白九星字典
  for (const s of nineStarsData) {
    await prisma.nineStar.upsert({
      where: { number: s.number },
      update: s,
      create: s
    });
  }
  console.log(`✅ 已导入 ${nineStarsData.length} 颗紫白九星全属性数据`);

  // 4. 导入八宅游年星
  for (const em of eightMansionsData) {
    await prisma.eightMansionsStar.upsert({
      where: { id: em.id },
      update: em,
      create: em
    });
  }
  console.log(`✅ 已导入 ${eightMansionsData.length} 个八宅游年星数据`);

  // 5. 导入峦头形煞与化解百科
  for (const fs of formShaData) {
    await prisma.formShaDict.upsert({
      where: { code: fs.code },
      update: fs,
      create: fs
    });
  }
  console.log(`✅ 已导入 ${formShaData.length} 条实战峦头形煞与化解方案`);

  // ====================================================
  // 现实使用示范：某现代高层住宅实战勘测与全量建档
  // ====================================================
  console.log("\n🏠 正在录入真实住宅实战勘测案例：'华润置地九里花园 2栋1603'...");

  // 实测朝向：向首正南偏西 175° (丙向偏午山)，九运建筑 (2024交房)
  const orientation = analyzeOrientation(175.0);
  const periodNumber = 9;

  // 1. 创建房屋实体
  const property = await prisma.property.create({
    data: {
      title: "华润置地九里花园 2栋1603室",
      propertyType: "APARTMENT",
      address: "上海市浦东新区张江高科路888号",
      builtYear: 2024,
      moveInYear: 2025,
      periodId: periodNumber,
      facingDegree: orientation.facingDegree,
      sittingDegree: orientation.sittingDegree,
      mountainSitting: orientation.sittingMountain.name,
      mountainFacing: orientation.facingMountain.name,
      isSubstitute: orientation.isSubstitute,
      substituteAngle: orientation.deviationDegree
    }
  });

  // 2. 录入居者人员（男主人与女主人命卦）
  const masterBirth = new Date("1988-06-18");
  const masterGua = calculateLifeGua(masterBirth, "MALE");
  await prisma.resident.create({
    data: {
      propertyId: property.id,
      name: "男主人",
      gender: "MALE",
      birthDate: masterBirth,
      lunarYear: 1988,
      lifeGuaNumber: masterGua.number,
      lifeGuaName: masterGua.name,
      lifeGroup: masterGua.group,
      role: "MASTER"
    }
  });

  // 3. 创建户型平面与功能区映射
  const floorPlan = await prisma.floorPlan.create({
    data: {
      propertyId: property.id,
      floorLevel: 16,
      widthMeters: 11.5,
      lengthMeters: 12.0,
      centerXRatio: 0.5,
      centerYRatio: 0.5,
      rooms: {
        create: [
          { name: "入户大门玄关", roomType: "ENTRANCE_DOOR", palaceNumber: 1, isAirIntake: true }, // 正北坎位开门
          { name: "客厅与景观主阳台", roomType: "LIVING_ROOM", palaceNumber: 9, isAirIntake: true }, // 正南离位大阳台
          { name: "主卧套间", roomType: "MASTER_BEDROOM", palaceNumber: 4 }, // 东南巽位
          { name: "厨房炉灶", roomType: "KITCHEN_STOVE", palaceNumber: 3 }, // 正东震位
          { name: "主客卫", roomType: "BATHROOM", palaceNumber: 6 } // 西北乾位
        ]
      }
    }
  });

  // 4. 记录发现的实战形煞（室内：穿堂煞，大门通阳台）
  await prisma.internalShaRecord.create({
    data: {
      floorPlanId: floorPlan.id,
      shaCode: "SHA_CHUANG_TANG",
      name: "玄关大门直对客厅全景阳台落地玻璃（穿堂煞）",
      locationPalace: 1,
      severity: 4,
      description: "进门视线与气流一眼到底穿透阳台，气不聚宅，易漏财",
      remedyAction: "设计1.8米高透光不透视磨砂屏风，摆设发财树绿植缓冲气流"
    }
  });

  // 5. 自动推演排盘并生成评估事务 (Assessment)
  const flyingStarResult = calculateFlyingStarChart(
    periodNumber,
    orientation.sittingMountain,
    orientation.facingMountain,
    orientation.isSubstitute
  );

  const eightMansionsResult = getEightMansionsChart(orientation.sittingMountain.palaceNumber);
  const airIntakeSouth = evaluateAirIntake(9, periodNumber);

  const assessment = await prisma.assessment.create({
    data: {
      propertyId: property.id,
      yearPeriod: periodNumber,
      lunarYearStemBranch: "甲辰年",
      overallScore: 82,
      flyingStarChart: {
        create: {
          periodNumber: flyingStarResult.period,
          sittingMountain: flyingStarResult.sittingMountain.name,
          facingMountain: flyingStarResult.facingMountain.name,
          chartType: flyingStarResult.chartType === "替卦（兼向）" ? "SUBSTITUTE" : "NORMAL",
          patternName: flyingStarResult.patternName,
          isWangShanWangXiang: flyingStarResult.patternName === "旺山旺向",
          isShangShanXiaShui: flyingStarResult.patternName === "上山下水",
          isDoubleFacing: flyingStarResult.patternName === "双星到向",
          isDoubleSitting: flyingStarResult.patternName === "双星到山",
          palaces: {
            create: flyingStarResult.palaces.map((p) => ({
              palaceNumber: p.palaceNumber,
              directionName: p.directionName,
              baseStar: p.baseStar,
              mountainStar: p.mountainStar,
              mountainFlight: p.mountainFlight,
              facingStar: p.facingStar,
              facingFlight: p.facingFlight,
              combinationDesc: p.combinationDesc,
              starAuspicious: p.starAuspicious
            }))
          }
        }
      },
      eightMansions: {
        create: {
          houseGuaName: eightMansionsResult.houseGuaName,
          houseGroup: eightMansionsResult.houseGroup,
          doorLocationGua: "坎卦（正北方）",
          doorStarName: "伏位",
          doorAuspicious: true,
          summary: "坐坎朝向离，坎宅开北门，得本位伏位比和气，吉！居者东四命人住东四宅，宅命相符！",
          palaces: {
            create: eightMansionsResult.palaces.map((p) => ({
              palaceNumber: p.palaceNumber,
              starName: p.starName,
              isAuspicious: p.isAuspicious,
              element: p.element,
              suitableUse: p.isAuspicious ? "宜作主卧、大门、书房" : "宜作卫浴、储物以煞制煞"
            }))
          }
        }
      },
      airIntakeCharts: {
        create: [
          {
            zoneName: "客厅南向大落地窗",
            intakePalace: airIntakeSouth.palaceNumber,
            currentPeriod: periodNumber,
            qiNature: airIntakeSouth.qiNature,
            isZhengShen: airIntakeSouth.isZhengShen,
            evaluation: airIntakeSouth.recommendation
          }
        ]
      },
      remedyPlans: {
        create: [
          {
            title: "入户玄关阻隔穿堂气工程",
            palaceNumber: 1,
            priority: 1,
            problemSummary: "大门对穿阳台犯穿堂风漏财",
            actionType: "STRUCTURAL",
            materialNeeded: "长虹磨砂透光玻璃隔断屏风、阔叶盆栽",
            implementationSteps: "玄关入户1.5米处定制180cm高度屏风，地毯下安放五帝古钱",
            isCompleted: false
          },
          {
            title: "九运离宫旺气纳福催旺布局",
            palaceNumber: 9,
            priority: 2,
            problemSummary: "南向大阳台迎来九运紫白喜庆吉气",
            actionType: "METAPHYSIC_CURE",
            materialNeeded: "暖光落地灯、红色挂饰、陶瓷聚宝盆",
            implementationSteps: "阳台常设温馨暖光灯，摆放常青阔叶绿植生旺九紫火",
            isCompleted: false
          }
        ]
      }
    }
  });

  console.log(`🎉 真实住宅全流程风水勘测评估建档成功！评估ID: ${assessment.id}`);
  console.log(`📊 综合评级得分: ${assessment.overallScore} 分 | 宅卦: ${eightMansionsResult.houseGuaName} | 玄空格局: ${flyingStarResult.patternName}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
