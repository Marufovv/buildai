
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.static("public"));

const GEMINI_KEY = process.env.GEMINI_API_KEY || "";

const suppliers = [
  {
    id: 1, name: "Orange Build Market", city: "Toshkent", district: "Chilonzor", status: "Verified",
    rating: 4.9, trust: 96, delivery: "1 kun", phone: "+998 90 111 22 33",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",
    location: "Toshkent, Chilonzor, Qurilish bozori 12",
    stock: { cement: 1300, brick: 70000, rebar: 15, concrete: 220, sand: 160, gravel: 150, roof: 450, windows: 95, excavator: 3, mixer: 4, truck: 7, crane: 2, tools: 25 }
  },
  {
    id: 2, name: "Farg‘ona Master Beton", city: "Farg‘ona", district: "Marg‘ilon yo‘li", status: "Verified",
    rating: 4.7, trust: 88, delivery: "2 kun", phone: "+998 91 222 44 55",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
    location: "Farg‘ona, Marg‘ilon yo‘li, 45",
    stock: { cement: 800, brick: 32000, rebar: 6, concrete: 110, sand: 100, gravel: 90, roof: 200, windows: 45, excavator: 1, mixer: 2, truck: 3, crane: 0, tools: 14 }
  },
  {
    id: 3, name: "Samarqand House Pro", city: "Samarqand", district: "Siyob", status: "Moderation",
    rating: 4.5, trust: 76, delivery: "2-3 kun", phone: "+998 93 333 66 77",
    image: "https://images.unsplash.com/photo-1597047084897-51e81819a499?auto=format&fit=crop&w=900&q=80",
    location: "Samarqand, Siyob tumani, 18",
    stock: { cement: 500, brick: 23000, rebar: 3, concrete: 75, sand: 65, gravel: 60, roof: 130, windows: 28, excavator: 1, mixer: 1, truck: 2, crane: 0, tools: 9 }
  }
];

const equipment = [
  { key:"excavator", name:"Ekskavator", type:"Texnika", price:"1 200 000 so‘m/kun", city:"Toshkent", location:"Chilonzor", image:"https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=900&q=80", purpose:"Poydevor va yer qazish" },
  { key:"mixer", name:"Beton mixer", type:"Texnika", price:"850 000 so‘m/kun", city:"Toshkent", location:"Sergeli", image:"https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=900&q=80", purpose:"Beton quyish" },
  { key:"truck", name:"Yuk mashina", type:"Texnika", price:"650 000 so‘m/kun", city:"Farg‘ona", location:"Qo‘qon yo‘li", image:"https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=80", purpose:"Material tashish" },
  { key:"crane", name:"Kran", type:"Texnika", price:"2 400 000 so‘m/kun", city:"Toshkent", location:"Yashnobod", image:"https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80", purpose:"Yuqori qavatga yuk ko‘tarish" },
  { key:"tools", name:"Perforator + bolgarka set", type:"Asbob", price:"250 000 so‘m/kun", city:"Samarqand", location:"Siyob", image:"https://images.unsplash.com/photo-1581147036324-c1c88bb6d78a?auto=format&fit=crop&w=900&q=80", purpose:"Montaj va kesish ishlari" },
  { key:"tools", name:"Lazer nivelir", type:"Asbob", price:"120 000 so‘m/kun", city:"Toshkent", location:"Olmazor", image:"https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=900&q=80", purpose:"Aniq o‘lchov va tekislash" }
];

const workers = [
  { name:"Premium Qurilish Brigadasi", role:"Umumiy brigada", price:"350 000 so‘m/ishchi/kun", city:"Toshkent", location:"Yunusobod", rating:4.9, workers:8, experience:"7 yil", image:"https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80" },
  { name:"Usta Akmal jamoasi", role:"G‘isht teruvchi ustalar", price:"280 000 so‘m/ishchi/kun", city:"Farg‘ona", location:"Qo‘qon", rating:4.8, workers:6, experience:"9 yil", image:"https://images.unsplash.com/photo-1605152276897-4f618f831968?auto=format&fit=crop&w=900&q=80" },
  { name:"Elektr Pro Service", role:"Elektriklar", price:"300 000 so‘m/kun", city:"Toshkent", location:"Sergeli", rating:4.7, workers:3, experience:"5 yil", image:"https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80" },
  { name:"Santexnika Master", role:"Santexnik xizmat", price:"280 000 so‘m/kun", city:"Samarqand", location:"Registon atrofida", rating:4.6, workers:4, experience:"6 yil", image:"https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=900&q=80" }
];

const prices = { cement:68000, brick:1850, rebar:9200000, concrete:720000, sand:180000, gravel:210000, roof:125000, windows:1800000 };

function materialsCalc({ area, floors, rooms, style }) {
  const totalArea = Number(area) * Number(floors);
  const coef = { Modern:1.08, Minimal:0.96, Classic:1.12, Milliy:1.15 }[style] || 1;
  const list = [
    { key:"cement", name:"Sement", type:"M400/M500", qty:Math.ceil(totalArea*.55), unit:"qop", unitPrice:prices.cement, img:"https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=900&q=80" },
    { key:"brick", name:"G‘isht", type:"Pishiq g‘isht / gazoblok", qty:Math.ceil(totalArea*145), unit:"dona", unitPrice:prices.brick, img:"https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=900&q=80" },
    { key:"rebar", name:"Armatura", type:"A500C 12-16 mm", qty:+(totalArea*.018).toFixed(1), unit:"tonna", unitPrice:prices.rebar, img:"https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=900&q=80" },
    { key:"concrete", name:"Beton", type:"M250/M300", qty:Math.ceil(totalArea*.34), unit:"m³", unitPrice:prices.concrete, img:"https://images.unsplash.com/photo-1560439514-4e9645039924?auto=format&fit=crop&w=900&q=80" },
    { key:"sand", name:"Qum", type:"Yuvilgan qurilish qumi", qty:Math.ceil(totalArea*.28), unit:"m³", unitPrice:prices.sand, img:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80" },
    { key:"gravel", name:"Shag‘al", type:"5-20 fraksiya", qty:Math.ceil(totalArea*.22), unit:"m³", unitPrice:prices.gravel, img:"https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&w=900&q=80" },
    { key:"roof", name:"Tom materiali", type:"Metallocherepitsa", qty:Math.ceil(Number(area)*1.25), unit:"m²", unitPrice:Math.round(prices.roof*coef), img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80" },
    { key:"windows", name:"Deraza/eshik", type:"PVC + metall eshik", qty:Math.max(8, Number(rooms)+Number(floors)*3), unit:"ta", unitPrice:Math.round(prices.windows*coef), img:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80" }
  ];
  return list.map(x => ({ ...x, total: Math.round(x.qty*x.unitPrice) }));
}

function toolsForProject({ area, floors }) {
  const needed = [
    { key:"excavator", qty:area>120?2:1 },
    { key:"mixer", qty:floors>=2?2:1 },
    { key:"truck", qty:area>160?3:2 },
    { key:"tools", qty:2 }
  ];
  if (Number(floors) >= 2) needed.push({ key:"crane", qty:1 });
  return needed;
}

function prediction({ area, floors }) {
  const totalArea = Number(area) * Number(floors);
  return {
    workers: Math.max(5, Math.ceil(totalArea / 45)),
    months: Math.max(2, Math.ceil(totalArea / 65)),
    stages: ["Arxitektura loyiha", "Yer va poydevor", "Beton/armatura", "Devor ko‘tarish", "Tom yopish", "Elektr/santexnika", "Ichki pardoz"]
  };
}

function matchSuppliers(materials, tools, city) {
  return suppliers.map(s => {
    let ok = 0, total = 0;
    for (const m of materials) { total++; if ((s.stock[m.key] || 0) >= m.qty) ok++; }
    for (const t of tools) { total++; if ((s.stock[t.key] || 0) >= t.qty) ok++; }
    const inventoryFit = Math.round(ok / total * 100);
    const score = Math.min(100, Math.round(inventoryFit*.55 + s.trust*.35 + (s.city===city?10:0)));
    return { ...s, inventoryFit, score };
  }).sort((a,b)=>b.score-a.score);
}

async function geminiText(prompt) {
  if (!GEMINI_KEY) return null;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
  const r = await fetch(url, {
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ contents:[{ parts:[{ text: prompt }] }] })
  });
  const data = await r.json();
  return data?.candidates?.[0]?.content?.parts?.map(p=>p.text || "").join("\\n") || null;
}

app.get("/api/demo", (req,res) => res.json({ suppliers, equipment, workers }));

app.post("/api/plan", async (req,res)=>{
  try{
    const { prompt, area, floors, rooms, budget, city, style, user } = req.body;
    const materials = materialsCalc({ area, floors, rooms, style });
    const toolsNeeded = toolsForProject({ area:Number(area), floors:Number(floors) });
    const pred = prediction({ area, floors });
    const matched = matchSuppliers(materials, toolsNeeded, city);
    const materialTotal = materials.reduce((s,m)=>s+m.total,0);
    const workCost = Math.round(materialTotal*.55);
    const rentCost = Math.round(materialTotal*.14);
    const transportCost = Math.round(materialTotal*.12);
    const totalCost = materialTotal + workCost + rentCost + transportCost;

    const aiPrompt = `
Sen BuildAI qurilish platformasining AI konsultantisan.
O'zbek tilida premium, aniq va amaliy xulosa yoz.

Foydalanuvchi: ${JSON.stringify(user)}
So'rov: ${prompt}
Loyiha: ${area} m2, ${floors} qavat, ${rooms} xona, ${style}, ${city}, budjet ${budget} mln so'm.
Materiallar: ${JSON.stringify(materials)}
Kerakli texnika/asboblar: ${JSON.stringify(toolsNeeded)}
Ishchilar prognozi: ${JSON.stringify(pred)}
Eng yaxshi sotuvchilar: ${JSON.stringify(matched.slice(0,3))}
Umumiy smeta: ${totalCost}

Xulosa quyidagicha bo'lsin:
1) Qancha material ketadi
2) Qanday texnika/asbob kerak
3) Nechta ishchi kerak
4) Qancha vaqt ketadi
5) Qaysi sotuvchidan olish yaxshi
6) Budjet yetadimi
7) Real qurilishda mutaxassis tekshiruvi kerakligi
`;

    let aiText = await geminiText(aiPrompt);
    if (!aiText) {
      aiText = `Demo xulosa: ${area} m², ${floors} qavatli uy uchun taxminiy smeta ${Math.round(totalCost/1000000)} mln so‘m. ${pred.workers} ta ishchi va ${pred.months} oy vaqt kerak bo‘ladi. Eng mos sotuvchi: ${matched[0]?.name}.`;
    }

    res.json({
      project:{prompt, area, floors, rooms, budget, city, style},
      materials,
      toolsNeeded,
      equipment,
      workers,
      suppliers: matched,
      prediction: pred,
      costs:{materialTotal, workCost, rentCost, transportCost, totalCost},
      aiText
    });
  }catch(e){
    console.error(e);
    res.status(500).json({ error:"Plan yaratishda xatolik bo‘ldi." });
  }
});

app.post("/api/generate-image", upload.single("siteImage"), async (req,res)=>{
  try{
    const { area, floors, rooms, city, style, prompt } = req.body;
    if (!GEMINI_KEY) return res.status(400).json({ error:".env faylga GEMINI_API_KEY qo‘yilmagan." });

    const imagePrompt = `Premium realistic 3D architectural concept render for a ${area} sqm, ${floors}-floor, ${rooms}-room ${style} private house in ${city}, Uzbekistan. Orange and white elegant exterior, clean yard, modern facade, daylight, professional architecture visualization. No text. User request: ${prompt}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_KEY}`;
    const r = await fetch(url, {
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        contents:[{ parts:[{ text:imagePrompt }] }],
        generationConfig: { responseModalities: ["TEXT","IMAGE"] }
      })
    });
    const data = await r.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const img = parts.find(p => p.inlineData?.data);

    if (!img) {
      return res.status(500).json({ error:"Gemini rasm qaytarmadi. API model yoki billing sozlamasini tekshiring.", raw:data });
    }

    res.json({ image:`data:${img.inlineData.mimeType || "image/png"};base64,${img.inlineData.data}` });
  }catch(e){
    console.error(e);
    res.status(500).json({ error:"3D AI rasm generatsiyada xatolik bo‘ldi." });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("BuildAI Full Demo: http://localhost:" + (process.env.PORT || 5000));
});
