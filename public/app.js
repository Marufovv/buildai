<<<<<<< HEAD
let currentUser = JSON.parse(localStorage.getItem("buildai_user") || "null");
let currentPlan = null;
let roleMode = currentUser?.role || "customer";
let currentListings = [];

const $ = (id) => document.getElementById(id);
const valueOf = (id, fallback = "") => $(id)?.value ?? fallback;
const numberOf = (id, fallback = 0) => Number(valueOf(id, fallback));

function init(){
  if(currentUser){
    $("registerPage").classList.add("hidden");
    $("app").classList.remove("hidden");
    $("userMini").textContent = `${currentUser.name} · ${currentUser.city} · ${currentUser.role === "provider" ? "E’lon beruvchi" : "Uy quruvchi"}`;
    setRoleMode(currentUser.role || "customer");
    loadListings();
  }
}

function registerUser(){
  const name = valueOf("regName").trim();
  const phone = valueOf("regPhone").trim();
  const city = valueOf("regCity", "Toshkent");
  const role = valueOf("regRole", "customer");
  if(!name || !phone){
    alert("Ism va telefon kiriting");
    return;
  }
  currentUser = { name, phone, city, role };
  roleMode = role;
  localStorage.setItem("buildai_user", JSON.stringify(currentUser));
  init();
}

function logout(){
  localStorage.removeItem("buildai_user");
  location.reload();
}

function openPage(name){
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  $(`page-${name}`).classList.add("active");
  if(name === "market" || name === "equipment" || name === "provider") loadListings();
  window.onPageOpen?.(name);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setRoleMode(role){
  roleMode = role;
  $("customerMode")?.classList.toggle("active", role === "customer");
  $("providerMode")?.classList.toggle("active", role === "provider");
  $("customerModules")?.classList.toggle("hidden", role !== "customer");
  $("providerModules")?.classList.toggle("hidden", role !== "provider");
  const subtitle = $("moduleSubtitle");
  if(subtitle) subtitle.textContent = role === "provider"
    ? "E’lon berish, bozor ko‘rinishi va mijoz loyihalariga moslik."
    : "AI hisob-kitob, materiallar, texnika va yakuniy xulosa.";
}

function fmt(n){ return Math.round(n).toLocaleString("uz-UZ") + " so‘m"; }
function mln(n){ return Math.round(n / 1000000) + " mln"; }
function statusClass(v){ return v >= 90 ? "ok" : v >= 75 ? "warn" : "bad"; }
function statusText(v){ return v >= 90 ? "Ishonchli" : v >= 75 ? "O‘rtacha" : "Tekshirish kerak"; }

async function apiJson(url, options = {}){
  const res = await fetch(url, options);
  let data = {};
  try{
    data = await res.json();
  }catch(e){
    throw new Error("Server JSON javob qaytarmadi. Node server ishlayotganini tekshiring.");
  }
  if(!res.ok || data.error) throw new Error(data.error || "Server xatosi");
  return data;
}

function drawPlan(project){
  const area = +project.area;
  const floors = +project.floors;
  const rooms = +project.rooms;
  const style = project.style;
  const svg = $("floorPlan");
  svg.innerHTML = `<rect width="560" height="340" fill="#fff"/><rect x="22" y="22" width="516" height="286" fill="none" stroke="#ff7a00" stroke-width="3"/>`;

  function room(x,y,w,h,n,m,c="room"){
    svg.innerHTML += `<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/><text x="${x+w/2}" y="${y+h/2-5}" fill="#27180a" font-size="14" text-anchor="middle">${n}</text><text x="${x+w/2}" y="${y+h/2+14}" fill="#ff7a00" font-size="12" text-anchor="middle">${m} m²</text>`;
  }

=======

let currentUser = JSON.parse(localStorage.getItem("buildai_user") || "null");
let currentPlan = null;
let demoData = { equipment: [], workers: [], suppliers: [] };
let bookingTarget = "";

function init(){
  if(currentUser){
    document.getElementById("registerPage").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    document.getElementById("userMini").textContent = `${currentUser.name} · ${currentUser.city}`;
  }
  loadDemo();
}
async function loadDemo(){
  try{
    const res = await fetch("/api/demo");
    demoData = await res.json();
    renderDemoCards();
  }catch(e){}
}
function registerUser(){
  const name=document.getElementById("regName").value.trim();
  const phone=document.getElementById("regPhone").value.trim();
  const city=document.getElementById("regCity").value;
  if(!name || !phone){ alert("Ism va telefon kiriting"); return; }
  currentUser={name,phone,city};
  localStorage.setItem("buildai_user",JSON.stringify(currentUser));
  init();
}
function logout(){ localStorage.removeItem("buildai_user"); location.reload(); }
function openPage(name){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(`page-${name}`).classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
}
function fmt(n){return Math.round(n).toLocaleString("uz-UZ")+" so‘m"}
function mln(n){return Math.round(n/1000000)+" mln"}
function statusClass(v){return v>=90?"ok":v>=75?"warn":"bad"}
function statusText(v){return v>=90?"Ishonchli":v>=75?"O‘rtacha":"Tekshirish kerak"}

function openBooking(name){
  bookingTarget = name;
  document.getElementById("bookingItem").textContent = `Tanlangan xizmat/mahsulot: ${name}`;
  document.getElementById("bookName").value = currentUser?.name || "";
  document.getElementById("bookPhone").value = currentUser?.phone || "";
  document.getElementById("bookingModal").classList.remove("hidden");
}
function closeBooking(){ document.getElementById("bookingModal").classList.add("hidden"); }
function submitBooking(){
  const name=document.getElementById("bookName").value.trim();
  const phone=document.getElementById("bookPhone").value.trim();
  const address=document.getElementById("bookAddress").value.trim();
  if(!name || !phone || !address){ alert("Ism, telefon va manzilni to‘ldiring"); return; }
  alert(`Band qilindi!\n\n${bookingTarget}\nIsm: ${name}\nTelefon: ${phone}\nManzil: ${address}`);
  closeBooking();
}

function renderDemoCards(){
  document.getElementById("equipmentCards").innerHTML = (demoData.equipment || []).map(x=>`
    <div class="productCard animUp">
      <img src="${x.image}" alt="${x.name}">
      <div class="productBody">
        <h3>${x.name}</h3>
        <div class="price">${x.price}</div>
        <div class="loc">📍 ${x.city}, ${x.location}</div>
        <p class="mini">${x.purpose}</p>
        <button class="btn full" onclick="openBooking('${x.name}')">Band qilish</button>
      </div>
    </div>
  `).join("");

  document.getElementById("workersCards").innerHTML = (demoData.workers || []).map(x=>`
    <div class="productCard animUp">
      <img src="${x.image}" alt="${x.name}">
      <div class="productBody">
        <h3>${x.name}</h3>
        <div class="price">${x.price}</div>
        <div class="loc">📍 ${x.city}, ${x.location} · ⭐ ${x.rating}</div>
        <p class="mini">${x.role} · ${x.workers} ishchi · tajriba ${x.experience}</p>
        <button class="btn full" onclick="openBooking('${x.name}')">Band qilish</button>
      </div>
    </div>
  `).join("");
}

function drawPlan(project){
  const area=+project.area,floors=+project.floors,rooms=+project.rooms,style=project.style;
  const svg=document.getElementById("floorPlan");
  svg.innerHTML=`<rect width="560" height="340" fill="#fff"/><rect x="22" y="22" width="516" height="286" fill="none" stroke="#ff7a00" stroke-width="3"/>`;
  function room(x,y,w,h,n,m,c="room"){svg.innerHTML+=`<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/><text x="${x+w/2}" y="${y+h/2-5}" fill="#27180a" font-size="14" text-anchor="middle">${n}</text><text x="${x+w/2}" y="${y+h/2+14}" fill="#ff7a00" font-size="12" text-anchor="middle">${m} m²</text>`}
>>>>>>> 2fcf1d1f31468200e5f1ec97e8d0efc9ab3f6725
  room(35,35,200,112,"Mehmonxona",Math.round(area*.22));
  room(235,35,135,112,"Oshxona",Math.round(area*.15),"room2");
  room(370,35,150,75,"Hammom",Math.max(7,Math.round(area*.05)),"room2");
  room(370,110,150,185,"Yotoqxona",Math.round(area*.14));
  room(35,147,155,148,"Yotoqxona 2",Math.round(area*.13));
  room(190,147,180,148,"Koridor/Garaj",Math.round(area*.18),"room2");
<<<<<<< HEAD
  svg.innerHTML += `<text x="280" y="328" fill="#7a5d42" font-size="13" text-anchor="middle">${area} m² · ${floors} qavat · ${rooms} xona · ${style}</text>`;
}

function renderResult(data){
  currentPlan = data;
  drawPlan(data.project);

  $("totalCost").textContent = mln(data.costs.totalCost);
  $("materialCost").textContent = mln(data.costs.materialTotal);
  $("workersCount").textContent = data.prediction.workers + " ta";
  $("duration").textContent = data.prediction.months + " oy";

  if($("rTotal")) $("rTotal").textContent = mln(data.costs.totalCost);
  if($("rDuration")) $("rDuration").textContent = data.prediction.months + " oy";
  if($("rWorkers")) $("rWorkers").textContent = data.prediction.workers + " ta";
  if($("rArea")) $("rArea").textContent = data.assessment?.totalArea ? `${data.assessment.totalArea} m²` : `${data.project.area * data.project.floors} m²`;

  if($("costBreakdown")){
    $("costBreakdown").innerHTML = [
      ["Material", data.costs.materialTotal],
      ["Ishchi kuchi", data.costs.workCost],
      ["Texnika ijara", data.costs.rentCost],
      ["Transport", data.costs.transportCost]
    ].map(([name, value]) => `<div><span>${name}</span><b>${fmt(value)}</b></div>`).join("");
  }

  if($("needsList")){
    const needs = [
      ...data.materials.slice(0, 5).map(m => `${m.name}: ${m.qty.toLocaleString("uz-UZ")} ${m.unit}`),
      ...data.tools.slice(0, 4).map(t => `${t.name}: ${t.qty} ta`)
    ];
    $("needsList").innerHTML = needs.map(item => `<div><span>${item}</span></div>`).join("");
  }

  const best = data.suppliers[0];
  $("materialsBody").innerHTML = data.materials.map(m => {
    const stock = best?.stock?.[m.key] || 0;
    const ok = stock >= m.qty;
    return `<tr><td><b>${m.name}</b></td><td>${m.type}<br><small>${m.basis || ""}</small></td><td>${m.qty.toLocaleString("uz-UZ")} ${m.unit}</td><td><b>${fmt(m.total)}</b></td><td>${best?.name || "-"}<br><small>Ombor: ${stock.toLocaleString("uz-UZ")}</small></td><td><span class="status ${ok ? "ok" : "bad"}">${ok ? "Bor" : "Yetmaydi"}</span></td></tr>`;
  }).join("");

  $("supplierCards").innerHTML = data.suppliers.slice(0,3).map(s => `<div class="itemCard"><h3>${s.name}</h3><p>${s.city} · ⭐ ${s.rating} · ${s.delivery}</p><p><b>Status:</b> ${s.status}</p><p><b>Ombor mosligi:</b> ${s.inventoryFit}%</p><span class="status ${statusClass(s.score)}">${statusText(s.score)} · ${s.score}%</span><p>${s.phone}</p></div>`).join("");
  $("toolsCards").innerHTML = data.tools.map(t => {
    const stock = best?.stock?.[t.key] || 0;
    const ok = stock >= t.qty;
    return `<div class="itemCard"><h3>${t.name}</h3><p>${t.purpose}</p><p><b>Tur:</b> ${t.category}</p><p><b>Kerak:</b> ${t.qty} ta · <b>Omborda:</b> ${stock} ta</p><span class="status ${ok ? "ok" : "bad"}">${ok ? "Mavjud" : "Boshqa joydan kerak"}</span></div>`;
  }).join("");

  if($("mastersCards")){
    $("mastersCards").innerHTML = (data.masters || []).map(m => `<div class="itemCard"><h3>${m.name}</h3><p>${m.purpose}</p><p><b>Kerak:</b> ${m.qty} kishi · <b>Muddat:</b> ${m.months} oy</p><span class="status ok">${m.category}</span></div>`).join("");
  }

  $("stages").innerHTML = data.prediction.stages.map((s,i) => `<div class="stage"><b>${i+1}</b><span>${s}</span></div>`).join("");
  $("aiText").textContent = data.aiText;
}

async function createPlan(){
  const aiBox = $("aiText");
  try{
    window.syncFormFromPlanner?.();
    const payload = {
      user: currentUser,
      prompt: valueOf("prompt"),
      area: numberOf("area", 150),
      floors: numberOf("floors", 2),
      rooms: numberOf("rooms", 5),
      budget: numberOf("budget", 550),
      city: currentUser?.city || "Toshkent",
      style: valueOf("style", "Modern"),
      wallType: valueOf("wallType", "brick"),
      foundationType: valueOf("foundationType", "strip"),
      roofType: valueOf("roofType", "metal"),
      seismicZone: numberOf("seismicZone", 8)
    };

    aiBox.textContent = "AI hisob-kitob qilmoqda...";
    const data = await apiJson("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    renderResult(data);
    openPage("result");
  }catch(e){
    aiBox.textContent = `AI hisob-kitob ishlamadi: ${e.message}`;
    openPage("result");
  }
}

async function generate3D(){
  if(!currentPlan) await createPlan();
  const box = $("imageResult");
  try{
    box.textContent = "3D rasm generatsiya qilinmoqda...";
    const form = new FormData();
    form.append("prompt", valueOf("prompt"));
    form.append("area", valueOf("area"));
    form.append("floors", valueOf("floors"));
    form.append("rooms", valueOf("rooms"));
    form.append("city", currentUser?.city || "Toshkent");
    form.append("style", valueOf("style", "Modern"));
    const file = $("siteImage").files[0];
    if(file) form.append("siteImage", file);
    const data = await apiJson("/api/generate-image", { method: "POST", body: form });
    box.innerHTML = `<img src="${data.image}" alt="AI generated house">`;
  }catch(e){
    box.textContent = e.message;
  }
}

function listingCard(item){
  return `<div class="itemCard"><h3>${item.title}</h3><p>${item.business} · ${item.city}</p><p><b>Tur:</b> ${item.typeLabel}</p><p><b>Narx:</b> ${Number(item.price).toLocaleString("uz-UZ")} so‘m / ${item.unit}</p><p><b>Ombor:</b> ${Number(item.stock).toLocaleString("uz-UZ")}</p><span class="status ok">${item.status}</span><p>${item.phone}</p></div>`;
}

function renderListings(){
  const providerBox = $("listingCards");
  const marketBox = $("marketListings");
  const equipmentBox = $("equipmentListings");
  const materialListings = currentListings.filter(item => item.type === "material");
  const equipmentListings = currentListings.filter(item => item.type === "equipment" || item.type === "service");

  if(providerBox) providerBox.innerHTML = currentListings.length ? currentListings.map(listingCard).join("") : "";
  if(marketBox) marketBox.innerHTML = materialListings.length ? materialListings.map(listingCard).join("") : "<p>Hali material e’loni yo‘q.</p>";
  if(equipmentBox) equipmentBox.innerHTML = equipmentListings.length ? equipmentListings.map(listingCard).join("") : "<p>Hali texnika yoki usta e’loni yo‘q.</p>";

  const status = $("listingStatus");
  if(status) status.textContent = currentListings.length ? "Oxirgi e’lonlar backenddan yuklandi." : "Hali e’lon qo‘shilmagan.";
}

async function loadListings(){
  try{
    const data = await apiJson("/api/listings");
    currentListings = data.listings || [];
    renderListings();
  }catch(e){
    const status = $("listingStatus");
    if(status) status.textContent = `E’lonlarni yuklashda xatolik: ${e.message}`;
  }
}

async function createListing(){
  const status = $("listingStatus");
  try{
    const payload = {
      business: valueOf("listingBusiness").trim() || currentUser?.name,
      type: valueOf("listingType", "material"),
      title: valueOf("listingTitle").trim(),
      price: numberOf("listingPrice", 0),
      unit: valueOf("listingUnit", "dona").trim(),
      stock: numberOf("listingStock", 0),
      phone: valueOf("listingPhone").trim() || currentUser?.phone,
      city: currentUser?.city || "Toshkent",
      note: valueOf("listingNote").trim(),
      owner: currentUser
    };

    status.textContent = "E’lon publish qilinmoqda...";
    await apiJson("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    status.textContent = "E’lon publish qilindi. Userlar Market/Texnika sahifasida ko‘radi.";
    await loadListings();
  }catch(e){
    status.textContent = `E’lon publish bo‘lmadi: ${e.message}`;
  }
}

init();

Object.assign(window, { createPlan, renderResult, drawPlan, generate3D, openPage });
=======
  svg.innerHTML+=`<text x="280" y="328" fill="#7a5d42" font-size="13" text-anchor="middle">${area} m² · ${floors} qavat · ${rooms} xona · ${style}</text>`;
}
async function createPlan(){
  const payload={
    user:currentUser,
    prompt:document.getElementById("prompt").value,
    area:+document.getElementById("area").value,
    floors:+document.getElementById("floors").value,
    rooms:+document.getElementById("rooms").value,
    budget:+document.getElementById("budget").value,
    city:currentUser?.city||"Toshkent",
    style:document.getElementById("style").value
  };
  document.getElementById("aiText").textContent="AI predict qilmoqda...";
  const res=await fetch("/api/plan",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
  const data=await res.json();
  if(data.error){document.getElementById("aiText").textContent=data.error;return}
  currentPlan=data;
  drawPlan(data.project);
  document.getElementById("totalCost").textContent=mln(data.costs.totalCost);
  document.getElementById("materialCost").textContent=mln(data.costs.materialTotal);
  document.getElementById("workersCount").textContent=data.prediction.workers+" ta";
  document.getElementById("duration").textContent=data.prediction.months+" oy";
  const best=data.suppliers[0];

  document.getElementById("materialCards").innerHTML=data.materials.map(m=>`
    <div class="productCard animUp">
      <img src="${m.img}" alt="${m.name}">
      <div class="productBody">
        <h3>${m.name}</h3>
        <div class="price">${fmt(m.unitPrice)} / ${m.unit}</div>
        <div class="loc">📍 ${best?.location || "Demo location"}</div>
        <p class="mini">${m.type} · kerak: <b>${m.qty.toLocaleString("uz-UZ")} ${m.unit}</b></p>
        <button class="btn full" onclick="openBooking('${m.name}')">Band qilish</button>
      </div>
    </div>
  `).join("");

  document.getElementById("materialsBody").innerHTML=data.materials.map(m=>{
    const stock=best?.stock?.[m.key]||0;
    const ok=stock>=m.qty;
    return `<tr><td><b>${m.name}</b></td><td>${m.type}</td><td>${m.qty.toLocaleString("uz-UZ")} ${m.unit}</td><td><b>${fmt(m.total)}</b></td><td>${best?.name}<br><small>${best?.location}</small></td><td><span class="status ${ok?'ok':'bad'}">${ok?'Bor':'Yetmaydi'}</span></td></tr>`;
  }).join("");

  document.getElementById("supplierCards").innerHTML=data.suppliers.slice(0,3).map(s=>`
    <div class="productCard">
      <img src="${s.image}" alt="${s.name}">
      <div class="productBody">
        <h3>${s.name}</h3>
        <div class="loc">📍 ${s.location}</div>
        <p class="mini">⭐ ${s.rating} · ${s.delivery} · ${s.phone}</p>
        <span class="status ${statusClass(s.score)}">${statusText(s.score)} · ${s.score}%</span>
        <button class="btn full" onclick="openBooking('${s.name}')">Sotuvchini band qilish</button>
      </div>
    </div>
  `).join("");

  document.getElementById("stages").innerHTML=data.prediction.stages.map((s,i)=>`<div class="stage"><b>${i+1}</b><span>${s}</span></div>`).join("");
  document.getElementById("aiText").textContent=data.aiText;
  openPage("result");
}
async function generate3D(){
  if(!currentPlan){await createPlan();}
  const box=document.getElementById("imageResult");
  box.textContent="3D rasm generatsiya qilinmoqda...";
  const form=new FormData();
  form.append("prompt",document.getElementById("prompt").value);
  form.append("area",document.getElementById("area").value);
  form.append("floors",document.getElementById("floors").value);
  form.append("rooms",document.getElementById("rooms").value);
  form.append("city",currentUser?.city||"Toshkent");
  form.append("style",document.getElementById("style").value);
  const file=document.getElementById("siteImage").files[0];
  if(file) form.append("siteImage",file);
  const res=await fetch("/api/generate-image",{method:"POST",body:form});
  const data=await res.json();
  if(data.error){box.textContent=data.error;return}
  box.innerHTML=`<img src="${data.image}" alt="AI generated house">`;
}
init();
>>>>>>> 2fcf1d1f31468200e5f1ec97e8d0efc9ab3f6725
