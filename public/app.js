
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
  room(35,35,200,112,"Mehmonxona",Math.round(area*.22));
  room(235,35,135,112,"Oshxona",Math.round(area*.15),"room2");
  room(370,35,150,75,"Hammom",Math.max(7,Math.round(area*.05)),"room2");
  room(370,110,150,185,"Yotoqxona",Math.round(area*.14));
  room(35,147,155,148,"Yotoqxona 2",Math.round(area*.13));
  room(190,147,180,148,"Koridor/Garaj",Math.round(area*.18),"room2");
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
