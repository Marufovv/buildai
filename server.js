
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import OpenAI from "openai";
import fs from "node:fs/promises";
import path from "node:path";
import { constructionKnowledge } from "./data/constructionKnowledge.js";

dotenv.config();
const app = express();
const upload = multer({ storage: multer.memoryStorage() });
app.use(cors());
app.use(express.json({limit:"20mb"}));
app.use(express.static("public"));

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const aiProvider = (process.env.AI_PROVIDER || (process.env.HUGGINGFACE_API_TOKEN ? "huggingface" : "local")).toLowerCase();
const hfModel = process.env.HUGGINGFACE_MODEL || "bekhzod-olimov/Qwen3-0.6B-Instruct-Uz";

const suppliers = [
  {name:"Orange Build Market", city:"Toshkent", status:"Verified", rating:4.9, trust:96, delivery:"1 kun", phone:"+998 90 111 22 33",
   stock:{cement:1300, brick:70000, rebar:15, concrete:220, sand:160, gravel:150, roof:450, windows:95, excavator:3, mixer:4, truck:7, crane:2, tools:25}},
  {name:"Farg‘ona Master Beton", city:"Farg‘ona", status:"Verified", rating:4.7, trust:88, delivery:"2 kun", phone:"+998 91 222 44 55",
   stock:{cement:800, brick:32000, rebar:6, concrete:110, sand:100, gravel:90, roof:200, windows:45, excavator:1, mixer:2, truck:3, crane:0, tools:14}},
  {name:"Samarqand House Pro", city:"Samarqand", status:"Moderation", rating:4.5, trust:76, delivery:"2-3 kun", phone:"+998 93 333 66 77",
   stock:{cement:500, brick:23000, rebar:3, concrete:75, sand:65, gravel:60, roof:130, windows:28, excavator:1, mixer:1, truck:2, crane:0, tools:9}}
];

const prices = {cement:68000, brick:1850, rebar:9200000, concrete:720000, sand:180000, gravel:210000, roof:125000, windows:1800000};
const listingsFile = path.join(process.cwd(), "data", "listings.json");

async function readListings(){
  try{
    const raw = await fs.readFile(listingsFile, "utf8");
    return JSON.parse(raw);
  }catch(e){
    if(e.code !== "ENOENT") console.error("Listings read error:", e.message);
    return [];
  }
}

async function writeListings(items){
  await fs.mkdir(path.dirname(listingsFile), { recursive: true });
  await fs.writeFile(listingsFile, JSON.stringify(items, null, 2), "utf8");
}

const listings = await readListings();

const listingTypeLabels = {material:"Material sotuvchi", equipment:"Texnika ijara", service:"Usta / brigada"};

function asPositiveNumber(value, field, min = 1, max = 1000000){
  const number = Number(value);
  if(!Number.isFinite(number) || number < min || number > max){
    const err = new Error(`${field} noto‘g‘ri kiritilgan`);
    err.status = 400;
    throw err;
  }
  return number;
}

function cleanText(value, fallback = ""){
  return String(value ?? fallback).trim().slice(0, 500);
}

function normalizeProject(body){
  const wallType = cleanText(body.wallType, "brick");
  const foundationType = cleanText(body.foundationType, "strip");
  const roofType = cleanText(body.roofType, "metal");
  const seismicZone = asPositiveNumber(body.seismicZone || 8, "Seysmik zona", 6, 10);
  return {
    prompt: cleanText(body.prompt),
    user: body.user || null,
    area: asPositiveNumber(body.area, "Maydon", 20, 1000),
    floors: asPositiveNumber(body.floors, "Qavat", 1, 5),
    rooms: asPositiveNumber(body.rooms, "Xona", 1, 30),
    budget: asPositiveNumber(body.budget || 1, "Budjet", 1, 100000),
    city: cleanText(body.city, "Toshkent"),
    style: cleanText(body.style, "Modern"),
    wallType: ["brick", "gazoblock", "monolith"].includes(wallType) ? wallType : "brick",
    foundationType: ["strip", "slab", "pile"].includes(foundationType) ? foundationType : "strip",
    roofType: ["metal", "soft", "flat"].includes(roofType) ? roofType : "metal",
    seismicZone
  };
}

const wallProfiles = {
  brick: { label:"Pishiq g‘isht", brickPerSqm:145, cement:1, sand:1, concrete:1, rebar:1 },
  gazoblock: { label:"Gazoblok", brickPerSqm:42, cement:.86, sand:.82, concrete:1, rebar:.96 },
  monolith: { label:"Monolit karkas + to‘ldiruvchi devor", brickPerSqm:38, cement:1.16, sand:1.05, concrete:1.22, rebar:1.28 }
};
const foundationProfiles = {
  strip: { label:"Lentasimon poydevor", cement:1, concrete:1, rebar:1, sand:1, gravel:1 },
  slab: { label:"Plita poydevor", cement:1.12, concrete:1.28, rebar:1.32, sand:1.1, gravel:1.12 },
  pile: { label:"Qoziqli poydevor", cement:1.08, concrete:1.18, rebar:1.38, sand:.92, gravel:.9 }
};
const roofProfiles = {
  metal: { label:"Metallocherepitsa", areaCoef:1.25, priceCoef:1, extraConcrete:0, extraRebar:0 },
  soft: { label:"Yumshoq tom", areaCoef:1.18, priceCoef:1.12, extraConcrete:0, extraRebar:0 },
  flat: { label:"Yassi tom + gidroizolyatsiya", areaCoef:1.08, priceCoef:1.24, extraConcrete:.035, extraRebar:.002 }
};
function seismicCoef(zone){
  if(Number(zone) >= 9) return { label:"9 ball", structural:1.18, general:1.06 };
  if(Number(zone) >= 8) return { label:"8 ball", structural:1.1, general:1.03 };
  return { label:"7 ball", structural:1, general:1 };
}
function materialsCalc({area,floors,rooms,style,wallType,foundationType,roofType,seismicZone}){
  const totalArea = Number(area) * Number(floors);
  const coef = {Modern:1.08,Minimal:0.96,Classic:1.12,Milliy:1.15}[style] || 1;
  const wall = wallProfiles[wallType] || wallProfiles.brick;
  const foundation = foundationProfiles[foundationType] || foundationProfiles.strip;
  const roof = roofProfiles[roofType] || roofProfiles.metal;
  const seismic = seismicCoef(seismicZone);
  const structuralCoef = seismic.structural;
  const generalCoef = seismic.general;
  const concreteQty = Math.ceil((totalArea*.34*wall.concrete*foundation.concrete*structuralCoef) + (Number(area)*roof.extraConcrete));
  const rebarQty = +((totalArea*.018*wall.rebar*foundation.rebar*structuralCoef) + (Number(area)*roof.extraRebar)).toFixed(1);
  const list = [
    {key:"cement", name:"Sement", type:"M400/M500", qty:Math.ceil(totalArea*.55*wall.cement*foundation.cement*generalCoef), unit:"qop", unitPrice:prices.cement, basis:`${wall.label}, ${foundation.label}, ${seismic.label}`},
    {key:"brick", name:"Devor materiali", type:wall.label, qty:Math.ceil(totalArea*wall.brickPerSqm), unit:wallType==="brick"?"dona":"blok/dona", unitPrice:prices.brick, basis:"Devor turi bo‘yicha dastlabki sarf"},
    {key:"rebar", name:"Armatura", type:"A500C 12-16 mm", qty:rebarQty, unit:"tonna", unitPrice:prices.rebar, basis:`Poydevor/karkas va seysmik ${seismic.label} zaxirasi`},
    {key:"concrete", name:"Beton", type:"M250/M300", qty:concreteQty, unit:"m³", unitPrice:prices.concrete, basis:`${foundation.label}, tom/karkas yuklamasi`},
    {key:"sand", name:"Qum", type:"Yuvilgan qurilish qumi", qty:Math.ceil(totalArea*.28*wall.sand*foundation.sand*generalCoef), unit:"m³", unitPrice:prices.sand, basis:"Qorishma va poydevor ishlari"},
    {key:"gravel", name:"Shag‘al", type:"5-20 fraksiya", qty:Math.ceil(totalArea*.22*foundation.gravel*generalCoef), unit:"m³", unitPrice:prices.gravel, basis:"Beton va asos tayyorlash"},
    {key:"roof", name:"Tom materiali", type:roof.label, qty:Math.ceil(Number(area)*roof.areaCoef), unit:"m²", unitPrice:Math.round(prices.roof*coef*roof.priceCoef), basis:"SHNK 2.03.10-24 bo‘yicha tom turi alohida tekshiriladi"},
    {key:"windows", name:"Deraza/eshik", type:"PVC + metall eshik", qty:Math.max(8, Number(rooms)+Number(floors)*3), unit:"ta", unitPrice:Math.round(prices.windows*coef), basis:"Xona va qavat soni bo‘yicha starter hisob"}
  ];
  return list.map(x=>({...x,total:Math.round(x.qty*x.unitPrice)}));
}
function toolsCalc({area,floors}){
  const tools = [
    {key:"excavator", name:"Ekskavator", category:"Texnika", qty:area>120?2:1, purpose:"Poydevor va yer qazish"},
    {key:"mixer", name:"Beton mixer", category:"Texnika", qty:floors>=2?2:1, purpose:"Beton quyish"},
    {key:"truck", name:"Yuk mashina", category:"Texnika", qty:area>160?3:2, purpose:"Material tashish"},
    {key:"tools", name:"Perforator", category:"Asbob", qty:2, purpose:"Montaj ishlari"},
    {key:"tools", name:"Bolgarka", category:"Asbob", qty:2, purpose:"Metall kesish"},
    {key:"tools", name:"Lazer nivelir", category:"Asbob", qty:1, purpose:"Aniq o‘lchov"}
  ];
  if(Number(floors)>=2) tools.push({key:"crane", name:"Kran", category:"Texnika", qty:1, purpose:"Yuk ko‘tarish"});
  return tools;
}
function mastersCalc({area,floors,rooms,wallType,roofType}){
  const totalArea = Number(area) * Number(floors);
  const baseMonths = Math.max(2, Math.ceil(totalArea / 65));
  const masters = [
    { key:"foreman", name:"Prorab / texnik nazoratchi", category:"Boshqaruv", qty:1, months:baseMonths, purpose:"Ish ketma-ketligi, brigada va sifat nazorati" },
    { key:"concrete", name:"Betonchi-armaturachi", category:"Konstruksiya", qty:Math.max(2, Math.ceil(totalArea / 95)), months:Math.max(1, Math.ceil(baseMonths * .35)), purpose:"Poydevor, beton va armatura ishlari" },
    { key:"mason", name:wallType === "monolith" ? "Monolit karkas brigadasi" : "G‘isht/gazoblok teruvchi", category:"Devor", qty:Math.max(2, Math.ceil(totalArea / 80)), months:Math.max(1, Math.ceil(baseMonths * .42)), purpose:"Tashqi va ichki devorlarni ko‘tarish" },
    { key:"roofer", name:roofType === "flat" ? "Gidroizolyatsiya ustasi" : "Tom yopuvchi", category:"Tom", qty:Math.max(2, Math.ceil(Number(area) / 90)), months:1, purpose:"Tom konstruksiyasi, qoplama va suvdan himoya" },
    { key:"electrician", name:"Elektrik", category:"Muhandislik", qty:Math.max(1, Math.ceil(Number(rooms) / 5)), months:Math.max(1, Math.ceil(baseMonths * .22)), purpose:"Elektr tarmog‘i, щит, rozetka va yoritish nuqtalari" },
    { key:"plumber", name:"Santexnik", category:"Muhandislik", qty:Math.max(1, Math.ceil(Number(rooms) / 6)), months:Math.max(1, Math.ceil(baseMonths * .2)), purpose:"Suv, kanalizatsiya va isitish tarmoqlari" },
    { key:"plaster", name:"Suvoqchi-pardozchi", category:"Pardoz", qty:Math.max(2, Math.ceil(totalArea / 70)), months:Math.max(1, Math.ceil(baseMonths * .38)), purpose:"Ichki/tashqi suvoq, tekislash va pardozga tayyorlash" }
  ];
  if(Number(floors) >= 2){
    masters.push({ key:"safety", name:"Mehnat xavfsizligi mas’uli", category:"Xavfsizlik", qty:1, months:baseMonths, purpose:"Balandlikda ishlash, kran va maydon xavfsizligi" });
  }
  return masters;
}
function matchSuppliers(materials, tools, city){
  return suppliers.map(s=>{
    let ok=0,total=0;
    for(const m of materials){total++; if((s.stock[m.key]||0)>=m.qty) ok++}
    for(const t of tools){total++; if((s.stock[t.key]||0)>=t.qty) ok++}
    const inventoryFit=Math.round(ok/total*100);
    const score=Math.min(100, Math.round(inventoryFit*.55 + s.trust*.35 + (s.city===city?10:0)));
    return {...s,inventoryFit,score};
  }).sort((a,b)=>b.score-a.score);
}
function prediction({area,floors}){
  const totalArea=Number(area)*Number(floors);
  return {workers:Math.max(5,Math.ceil(totalArea/45)), months:Math.max(2,Math.ceil(totalArea/65)),
    stages:["Arxitektura loyiha","Poydevor qazish","Beton va armatura","Devor ko‘tarish","Tom yopish","Elektr/santexnika","Ichki pardoz"]};
}
function projectTypeFrom(project){
  if(Number(project.floors) >= 2) return "private_house_2f";
  return "private_house_1f";
}
function applicableKnowledgeRules(project){
  const projectType = projectTypeFrom(project);
  return constructionKnowledge.knowledgeRules
    .filter(rule => rule.appliesTo.includes(projectType))
    .slice(0, 8);
}
function buildAiAssessment({project,materials,tools,pred,materialTotal,totalCost,suppliersMatched}){
  const totalArea = Number(project.area) * Number(project.floors);
  const perSqm = Math.round(totalCost / totalArea);
  const budgetSom = Number(project.budget) * 1000000;
  const budgetGap = budgetSom - totalCost;
  const topSupplier = suppliersMatched[0];
  const wall = wallProfiles[project.wallType]?.label || wallProfiles.brick.label;
  const foundation = foundationProfiles[project.foundationType]?.label || foundationProfiles.strip.label;
  const roof = roofProfiles[project.roofType]?.label || roofProfiles.metal.label;
  const rules = applicableKnowledgeRules(project);
  const requiredDocuments = constructionKnowledge.requiredDocuments
    .filter(doc => doc.requiredFor.includes("private_house"));
  const engineeringSystems = constructionKnowledge.engineeringSystems.map(system => ({
    id: system.id,
    name: system.name,
    standardCode: system.standardCode,
    requiredInputs: system.requiredInputs.slice(0, 4)
  }));
  const riskFlags = [];
  if(Number(project.floors) >= 2) riskFlags.push("2 qavat va undan yuqori uy uchun konstruktor hisob-kitobi shart.");
  if(Number(project.seismicZone) >= 9) riskFlags.push("9 ball seysmik zona konstruktiv yechim va armatura zaxirasini mutaxassis bilan tekshirishni talab qiladi.");
  if(project.foundationType === "slab" || project.foundationType === "pile") riskFlags.push(`${foundation} uchun geologiya xulosasi va grunt ko‘rsatkichlari ayniqsa muhim.`);
  if(project.roofType === "flat") riskFlags.push("Yassi tomda gidroizolyatsiya, suv chiqarish va ekspluatatsiya qatlamlari alohida tekshiriladi.");
  if(budgetGap < 0) riskFlags.push("Kiritilgan budjet dastlabki hisobdan past; scope yoki material variantlarini qayta tanlash kerak.");
  if(topSupplier?.inventoryFit < 75) riskFlags.push("Eng mos ta’minotchida ham material/texnika to‘liq yetmasligi mumkin.");
  const missingInputs = [
    "yer uchastkasi o‘lchami va chegaralari",
    "geologiya xulosasi",
    "topos’yomka",
    "texnik shartlar: elektr, gaz, suv, kanalizatsiya",
    "xona joylashuvi va konstruktiv sxema",
    "tom qiyaligi va tom materiali spetsifikatsiyasi"
  ];
  const readinessScore = Math.max(35, Math.min(86,
    45 +
    (project.area ? 8 : 0) +
    (project.floors ? 8 : 0) +
    (project.rooms ? 6 : 0) +
    (project.wallType ? 5 : 0) +
    (project.foundationType ? 5 : 0) +
    (project.roofType ? 5 : 0) -
    riskFlags.length * 4
  ));
  const assumptions = [
    "Hisob dastlabki smeta uchun, yakuniy loyiha yoki ekspertiza xulosasi emas.",
    "Narxlar hozircha demo va provider e’lonlari bilan kalibrlanishi kerak.",
    "Material sarfi loyiha chizmasi, grunt, seysmik zona va muhandislik tarmoqlari aniqlangandan keyin o‘zgaradi."
  ];
  const nextSteps = [
    "Kadastr, mulk huquqi, topos’yomka va geologiya fayllarini yig‘ish.",
    "Arxitektor bilan xonalar rejasini va konstruktiv sxemani aniqlash.",
    "Elektr, gaz, suv va kanalizatsiya texnik shartlarini olish.",
    "Provider e’lonlari orqali real narxlarni solishtirish.",
    "Konstruktor va smetachi bilan yakuniy material vedomostini tekshirish."
  ];
  return {
    projectType: projectTypeFrom(project),
    totalArea,
    perSqm,
    budgetSom,
    budgetGap,
    selectedProfiles: { wall, foundation, roof, seismicZone: `${project.seismicZone} ball` },
    readinessScore,
    assumptions,
    missingInputs,
    riskFlags,
    nextSteps,
    requiredDocuments,
    engineeringSystems,
    knowledgeRules: rules,
    topSupplier: topSupplier ? { name: topSupplier.name, score: topSupplier.score, inventoryFit: topSupplier.inventoryFit, city: topSupplier.city } : null
  };
}
function localAiAdvice({project,materials,tools,pred,materialTotal,totalCost,suppliersMatched,assessment}){
  const ai = assessment || buildAiAssessment({project,materials,tools,pred,materialTotal,totalCost,suppliersMatched});
  const requiredDocs = ai.requiredDocuments.map(doc => doc.name).join(", ");
  const standards = ai.knowledgeRules.map(rule => `${rule.rule}${rule.sourceCode ? ` (${rule.sourceCode})` : ""}`);
  const engineering = ai.engineeringSystems
    .map(system => `${system.name}: ${system.requiredInputs.slice(0,3).join(", ")}`)
    .join("; ");
  const budgetLine = ai.budgetGap >= 0
    ? `Kiritilgan budjet bilan dastlabki hisob orasida ${ai.budgetGap.toLocaleString("uz-UZ")} so‘m zaxira bor.`
    : `Budjet taxminan ${Math.abs(ai.budgetGap).toLocaleString("uz-UZ")} so‘mga yetmayapti; scope, tom materiali, pardoz va yetkazib berish variantlarini qayta ko‘rish kerak.`;
  return [
    `AI xulosa: loyiha tayyorgarlik darajasi ${ai.readinessScore}%. Bu hali yakuniy loyiha emas, lekin dastlabki smeta va qaror qabul qilish uchun yetarli boshlang‘ich hisob.`,
    `Loyiha: ${project.area} m² maydon, ${project.floors} qavat, ${project.rooms} xona. Umumiy qurilish maydoni ${ai.totalArea} m² deb olindi.`,
    `Tanlangan konstruktiv parametrlar: devor - ${ai.selectedProfiles.wall}, poydevor - ${ai.selectedProfiles.foundation}, tom - ${ai.selectedProfiles.roof}, seysmik zona - ${ai.selectedProfiles.seismicZone}.`,
    `Materiallar taxminiy qiymati ${materialTotal.toLocaleString("uz-UZ")} so‘m, ishchi kuchi, ijara va transport bilan jami ${totalCost.toLocaleString("uz-UZ")} so‘m. 1 m² uchun o‘rtacha ${ai.perSqm.toLocaleString("uz-UZ")} so‘m chiqmoqda.`,
    budgetLine,
    `Eng mos ta’minotchi: ${ai.topSupplier?.name || "hali tanlanmagan"} (${ai.topSupplier?.score || 0}% moslik, ombor mosligi ${ai.topSupplier?.inventoryFit || 0}%).`,
    `Kerakli texnika: ${tools.map(t=>`${t.name} ${t.qty} ta`).join(", ")}.`,
    `Boshlashdan oldin kerak bo‘ladigan hujjatlar: ${requiredDocs}.`,
    `Muhandislik tizimlari uchun so‘raladigan boshlang‘ich ma’lumotlar: ${engineering}.`,
    "Knowledge base bo‘yicha tekshiruvlar:\n- " + standards.join("\n- "),
    "Risklar:\n- " + (ai.riskFlags.length ? ai.riskFlags.join("\n- ") : "Hozircha katta risk belgilanmadi, lekin loyiha hujjatlari bilan tekshirish kerak."),
    "Keyingi amaliy qadamlar:\n- " + ai.nextSteps.join("\n- "),
    `Muhim ogohlantirish: bu real qurilishni boshlash uchun yakuniy loyiha emas; geologiya, konstruktor hisobi, yong‘in/sanitariya talablari va arxitektura ruxsati mutaxassislar tomonidan tasdiqlanishi kerak.`
  ].join("\n\n");
}

function buildAiPrompt({user,prompt,project,materials,tools,pred,materialTotal,workCost,rentCost,transportCost,totalCost,assessment}){
  return [
    "Sen BuildAI platformasining qurilish AI konsultantisan.",
    "Faqat berilgan JSON data, material hisobi va knowledgeRules asosida javob ber.",
    "O‘zbek tilida yoz. Yangi SHNK raqamlari yoki aniq qonuniy talablarni o‘ylab topma.",
    "Real qurilish uchun yakuniy loyiha emasligini, geologiya, konstruktor hisobi, yong‘in/sanitariya va ruxsatlar mutaxassislar tomonidan tasdiqlanishi kerakligini aniq ayt.",
    "Javobni bo‘limlarga ajrat: AI xulosa, Smeta, Standart/checklist, Risklar, Keyingi qadamlar.",
    JSON.stringify({user,prompt,project,materials,tools,prediction:pred,costs:{materialTotal,workCost,rentCost,transportCost,totalCost},assessment})
  ].join("\n\n");
}

async function generateWithHuggingFace(prompt){
  if(!process.env.HUGGINGFACE_API_TOKEN) return null;
  if(typeof fetch !== "function") throw new Error("Hugging Face uchun Node 18+ kerak yoki fetch polyfill qo‘shish kerak.");
  const response = await fetch(`https://api-inference.huggingface.co/models/${hfModel}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 900,
        temperature: 0.25,
        return_full_text: false
      }
    })
  });
  if(!response.ok){
    const text = await response.text();
    throw new Error(`Hugging Face xatosi: ${response.status} ${text.slice(0, 200)}`);
  }
  const data = await response.json();
  if(Array.isArray(data)) return data[0]?.generated_text || null;
  return data.generated_text || data[0]?.generated_text || null;
}

app.get("/api/knowledge", (req,res)=>{
  res.json(constructionKnowledge);
});

app.post("/api/plan", async (req,res)=>{
  try{
    const project = normalizeProject(req.body);
    const {prompt,area,floors,rooms,budget,city,style,user,wallType,foundationType,roofType,seismicZone}=project;
    const materials=materialsCalc({area,floors,rooms,style,wallType,foundationType,roofType,seismicZone});
    const tools=toolsCalc({area:Number(area),floors:Number(floors)});
    const masters=mastersCalc({area,floors,rooms,wallType,roofType});
    const suppliersMatched=matchSuppliers(materials,tools,city);
    const pred=prediction({area,floors});
    const materialTotal=materials.reduce((s,m)=>s+m.total,0);
    const workCost=Math.round(materialTotal*.55);
    const rentCost=Math.round(materialTotal*.14);
    const transportCost=Math.round(materialTotal*.12);
    const totalCost=materialTotal+workCost+rentCost+transportCost;
    const assessment = buildAiAssessment({project,materials,tools,pred,materialTotal,totalCost,suppliersMatched});

    let aiText=localAiAdvice({project,materials,tools,pred,materialTotal,totalCost,suppliersMatched,assessment});
    const aiPrompt = buildAiPrompt({user,prompt,project,materials,tools,pred,materialTotal,workCost,rentCost,transportCost,totalCost,assessment});
    if(aiProvider === "huggingface" && process.env.HUGGINGFACE_API_TOKEN){
      try{
        aiText = await generateWithHuggingFace(aiPrompt) || aiText;
      }catch(e){
        console.error("Hugging Face fallback:", e.message);
      }
    }else if(client && aiProvider !== "local"){
      try{
        const response=await client.responses.create({
          model:"gpt-4.1-mini",
          input:[
            {role:"system", content:"Sen BuildAI platformasining qurilish AI konsultantisan. Faqat berilgan data asosida javob ber."},
            {role:"user", content:aiPrompt}
          ]
        });
        aiText=response.output_text;
      }catch(e){
        console.error("OpenAI fallback:", e.message);
      }
    }
    res.json({project,materials,tools,masters,prediction:pred,suppliers:suppliersMatched,assessment,knowledgeRules:assessment.knowledgeRules,costs:{materialTotal,workCost,rentCost,transportCost,totalCost},aiText});
  }catch(e){console.error(e);res.status(e.status || 500).json({error:e.status ? e.message : "Plan yaratishda xatolik"})}
});

app.get("/api/listings", (req,res)=>{
  res.json({listings:listings.slice().reverse()});
});

app.post("/api/listings", async (req,res)=>{
  try{
    const type = cleanText(req.body.type, "material");
    if(!listingTypeLabels[type]){
      const err = new Error("E’lon turi noto‘g‘ri");
      err.status = 400;
      throw err;
    }
    const title = cleanText(req.body.title);
    const business = cleanText(req.body.business);
    const phone = cleanText(req.body.phone);
    if(!title || !business || !phone){
      const err = new Error("Biznes nomi, mahsulot/xizmat va telefon kiriting");
      err.status = 400;
      throw err;
    }
    const item = {
      id: Date.now().toString(36),
      business,
      type,
      typeLabel: listingTypeLabels[type],
      title,
      price: asPositiveNumber(req.body.price, "Narx", 0, 100000000000),
      unit: cleanText(req.body.unit, "dona"),
      stock: asPositiveNumber(req.body.stock, "Ombor", 0, 100000000),
      phone,
      city: cleanText(req.body.city, "Toshkent"),
      note: cleanText(req.body.note),
      status: "Published",
      published: true,
      createdAt: new Date().toISOString()
    };
    listings.push(item);
    await writeListings(listings);
    res.status(201).json({listing:item});
  }catch(e){console.error(e);res.status(e.status || 500).json({error:e.status ? e.message : "E’lon yaratishda xatolik"})}
});

app.post("/api/generate-image", upload.single("siteImage"), async (req,res)=>{
  try{
    const {area,floors,rooms,city,style,prompt}=req.body;
    if(!client) return res.status(400).json({error:".env faylga OPENAI_API_KEY qo‘yilmagan"});
    const imagePrompt=`Premium realistic 3D architectural render, orange and white modern private house, ${area} sqm, ${floors} floors, ${rooms} rooms, ${style} style, in ${city}, Uzbekistan, clean yard, bright sunlight, luxury construction concept, no text. User: ${prompt}`;
    const result=await client.images.generate({model:"gpt-image-1",prompt:imagePrompt,size:"1024x1024"});
    res.json({image:`data:image/png;base64,${result.data[0].b64_json}`});
  }catch(e){console.error(e);res.status(500).json({error:"3D rasm generatsiyada xatolik"})}
});

app.listen(process.env.PORT || 5000,()=>console.log("BuildAI Premium: http://localhost:"+(process.env.PORT||5000)));
