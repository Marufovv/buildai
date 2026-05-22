const GRID_M = 0.25;
const PLAN_KEY = "buildai_plan";

let planner = loadPlanner();
let selectedRoomId = planner.rooms[0]?.id || null;
let canvasState = { ctx: null, scale: 38, ox: 28, oy: 28, dragging: null };
let threeState = { renderer: null, frame: null };

function defaultPlanner(){
  return {
    floors: 2,
    floorHeight: 3,
    wallThickness: 0.25,
    style: "Modern",
    wallType: "brick",
    roofType: "metal",
    rooms: [
      { id: rid(), name: "Mehmonxona", x: 0, y: 0, w: 5.5, l: 4.5 },
      { id: rid(), name: "Oshxona", x: 5.5, y: 0, w: 3.5, l: 4.5 },
      { id: rid(), name: "Yotoqxona", x: 0, y: 4.5, w: 4.5, l: 4 },
      { id: rid(), name: "Yotoqxona 2", x: 4.5, y: 4.5, w: 4.5, l: 4 },
      { id: rid(), name: "Hammom", x: 9, y: 0, w: 2.5, l: 2.2 },
      { id: rid(), name: "Koridor", x: 9, y: 2.2, w: 2.5, l: 6.3 }
    ]
  };
}

function rid(){
  return Math.random().toString(36).slice(2, 9);
}

function loadPlanner(){
  try{
    const saved = JSON.parse(localStorage.getItem(PLAN_KEY) || "null");
    if(saved?.rooms?.length) return saved;
  }catch(e){
    console.warn("Planner state o‘qilmadi:", e.message);
  }
  return defaultPlanner();
}

function savePlanner(){
  localStorage.setItem(PLAN_KEY, JSON.stringify(planner));
  syncFormFromPlanner();
}

function totalArea(){
  return planner.rooms.reduce((sum, room) => sum + Number(room.w) * Number(room.l), 0);
}

function syncFormFromPlanner(){
  const area = Math.round(totalArea());
  setValue("area", area);
  setValue("rooms", planner.rooms.length);
  setValue("floors", planner.floors);
  setValue("style", planner.style);
  setValue("wallType", planner.wallType);
  setValue("roofType", planner.roofType);
  setValue("pFloors", planner.floors);
  setValue("pHeight", planner.floorHeight);
  setValue("pStyle", planner.style);
  setValue("pWall", planner.wallType);
  setValue("pRoof", planner.roofType);
  setText("plannerArea", `${area} m²`);
  setText("plannerRoomCount", `${planner.rooms.length} xona`);
}

function setValue(id, value){
  const el = document.getElementById(id);
  if(el) el.value = value;
}

function setText(id, value){
  const el = document.getElementById(id);
  if(el) el.textContent = value;
}

function bounds(){
  if(!planner.rooms.length) return { minX: 0, minY: 0, maxX: 10, maxY: 8, w: 10, h: 8 };
  const minX = Math.min(...planner.rooms.map(r => r.x));
  const minY = Math.min(...planner.rooms.map(r => r.y));
  const maxX = Math.max(...planner.rooms.map(r => r.x + r.w));
  const maxY = Math.max(...planner.rooms.map(r => r.y + r.l));
  return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
}

function fitView(){
  const canvas = document.getElementById("plannerCanvas");
  if(!canvas) return;
  const b = bounds();
  const sx = (canvas.width - 56) / Math.max(1, b.w);
  const sy = (canvas.height - 56) / Math.max(1, b.h);
  canvasState.scale = Math.max(22, Math.min(58, Math.min(sx, sy)));
  canvasState.ox = 28 - b.minX * canvasState.scale;
  canvasState.oy = 28 - b.minY * canvasState.scale;
}

function w2s(mx, my){
  return { x: mx * canvasState.scale + canvasState.ox, y: my * canvasState.scale + canvasState.oy };
}

function s2w(px, py){
  return { x: (px - canvasState.ox) / canvasState.scale, y: (py - canvasState.oy) / canvasState.scale };
}

function snap(v){
  return Math.round(Number(v) / GRID_M) * GRID_M;
}

function drawPlanner(){
  const canvas = document.getElementById("plannerCanvas");
  if(!canvas) return;
  const ctx = canvasState.ctx || canvas.getContext("2d");
  canvasState.ctx = ctx;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fffaf4";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const step = GRID_M * canvasState.scale;
  ctx.strokeStyle = "#ffe3c4";
  ctx.lineWidth = 1;
  for(let x = canvasState.ox % step; x < canvas.width; x += step){
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for(let y = canvasState.oy % step; y < canvas.height; y += step){
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  planner.rooms.forEach(room => {
    const p = w2s(room.x, room.y);
    const w = room.w * canvasState.scale;
    const h = room.l * canvasState.scale;
    const active = room.id === selectedRoomId;
    ctx.fillStyle = active ? "#fff0df" : "#ffffff";
    ctx.strokeStyle = active ? "#ff7a00" : "#ffbd73";
    ctx.lineWidth = active ? 3 : 2;
    roundRect(ctx, p.x, p.y, w, h, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#27180a";
    ctx.font = "700 13px Arial";
    ctx.textAlign = "center";
    ctx.fillText(room.name, p.x + w / 2, p.y + h / 2 - 5);
    ctx.fillStyle = "#ff7a00";
    ctx.font = "12px Arial";
    ctx.fillText(`${room.w} x ${room.l} m`, p.x + w / 2, p.y + h / 2 + 14);
    ctx.fillStyle = active ? "#ff7a00" : "#ffbd73";
    ctx.fillRect(p.x + w - 11, p.y + h - 11, 11, 11);
  });
}

function roundRect(ctx, x, y, w, h, r){
  const radius = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function setupCanvas(){
  const canvas = document.getElementById("plannerCanvas");
  if(!canvas || canvas.dataset.ready) return;
  canvas.dataset.ready = "1";
  resizeCanvas();
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointerleave", endDrag);
  window.addEventListener("resize", resizeCanvas);
}

function onPointerDown(event){
  const canvas = event.currentTarget;
  const rect = canvas.getBoundingClientRect();
  const pos = s2w(event.clientX - rect.left, event.clientY - rect.top);
  const hit = [...planner.rooms].reverse().find(room =>
    pos.x >= room.x && pos.x <= room.x + room.w && pos.y >= room.y && pos.y <= room.y + room.l
  );
  if(!hit) return;
  selectedRoomId = hit.id;
  const nearRight = hit.x + hit.w - pos.x < 0.35;
  const nearBottom = hit.y + hit.l - pos.y < 0.35;
  canvasState.dragging = {
    id: hit.id,
    mode: nearRight && nearBottom ? "resize" : "move",
    start: pos,
    room: { ...hit }
  };
  canvas.setPointerCapture(event.pointerId);
  renderRoomList();
  drawPlanner();
}

function onPointerMove(event){
  if(!canvasState.dragging) return;
  const canvas = event.currentTarget;
  const rect = canvas.getBoundingClientRect();
  const pos = s2w(event.clientX - rect.left, event.clientY - rect.top);
  const drag = canvasState.dragging;
  const room = planner.rooms.find(r => r.id === drag.id);
  if(!room) return;
  const dx = snap(pos.x - drag.start.x);
  const dy = snap(pos.y - drag.start.y);
  if(drag.mode === "resize"){
    room.w = Math.max(1.5, snap(drag.room.w + dx));
    room.l = Math.max(1.5, snap(drag.room.l + dy));
  }else{
    room.x = snap(drag.room.x + dx);
    room.y = snap(drag.room.y + dy);
  }
  savePlanner();
  renderRoomList();
  drawPlanner();
}

function endDrag(){
  canvasState.dragging = null;
}

function resizeCanvas(){
  const canvas = document.getElementById("plannerCanvas");
  if(!canvas) return;
  const parent = canvas.parentElement;
  const width = Math.max(320, parent.clientWidth - 40);
  canvas.width = width * devicePixelRatio;
  canvas.height = Math.min(460, Math.max(320, width * 0.58)) * devicePixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${canvas.height / devicePixelRatio}px`;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  canvas.width = width;
  canvas.height = Math.min(460, Math.max(320, width * 0.58));
  fitView();
  drawPlanner();
}

function renderRoomList(){
  const box = document.getElementById("roomList");
  if(!box) return;
  box.innerHTML = planner.rooms.map(room => `
    <div class="roomRow ${room.id === selectedRoomId ? "active" : ""}" onclick="selectRoom('${room.id}')">
      <b>${room.name}</b>
      <input aria-label="Kenglik" type="number" min="1.5" step="0.25" value="${room.w}" onchange="editRoom('${room.id}', 'w', this.value)">
      <input aria-label="Uzunlik" type="number" min="1.5" step="0.25" value="${room.l}" onchange="editRoom('${room.id}', 'l', this.value)">
      <button type="button" onclick="event.stopPropagation();deleteRoom('${room.id}')">O‘chirish</button>
    </div>
  `).join("");
  syncFormFromPlanner();
}

function selectRoom(id){
  selectedRoomId = id;
  renderRoomList();
  drawPlanner();
}

function editRoom(id, key, val){
  const room = planner.rooms.find(r => r.id === id);
  if(!room) return;
  room[key] = key === "name" ? String(val).trim() : Math.max(1.5, snap(Number(val)));
  savePlanner();
  fitView();
  renderRoomList();
  drawPlanner();
}

function deleteRoom(id){
  if(planner.rooms.length <= 1) return;
  planner.rooms = planner.rooms.filter(r => r.id !== id);
  selectedRoomId = planner.rooms[0]?.id || null;
  savePlanner();
  fitView();
  renderRoomList();
  drawPlanner();
}

function addRoom(){
  const b = bounds();
  const room = { id: rid(), name: `Xona ${planner.rooms.length + 1}`, x: snap(b.maxX + 0.25), y: snap(b.minY), w: 3.5, l: 3.5 };
  planner.rooms.push(room);
  selectedRoomId = room.id;
  savePlanner();
  fitView();
  renderRoomList();
  drawPlanner();
}

function renameSelected(){
  const room = planner.rooms.find(r => r.id === selectedRoomId);
  if(!room) return;
  const name = prompt("Xona nomi", room.name);
  if(!name) return;
  room.name = name.trim().slice(0, 32);
  savePlanner();
  renderRoomList();
  drawPlanner();
}

function resetPlanner(){
  planner = defaultPlanner();
  selectedRoomId = planner.rooms[0]?.id || null;
  savePlanner();
  fitView();
  renderRoomList();
  drawPlanner();
}

function setPlannerParam(key, val){
  const numeric = ["floors", "floorHeight", "wallThickness"].includes(key);
  planner[key] = numeric ? Number(val) : val;
  savePlanner();
  renderRoomList();
  drawPlanner();
}

function wallColor(type){
  return { brick: 0xd98a48, gazoblock: 0xdfe7ea, monolith: 0xb7bdc6 }[type] || 0xd98a48;
}

function roofColor(type){
  return { metal: 0xf07a24, soft: 0x54514e, flat: 0xb9c1c9 }[type] || 0xf07a24;
}

function clear3D(container){
  if(threeState.frame) cancelAnimationFrame(threeState.frame);
  threeState.frame = null;
  if(threeState.renderer){
    threeState.renderer.dispose();
    threeState.renderer = null;
  }
  container.innerHTML = "";
}

function build3D(){
  const container = document.getElementById("viewer3d");
  if(!container) return;
  clear3D(container);
  if(!window.THREE){
    container.textContent = "Three.js yuklanmadi. Internet yoki script ulanishini tekshiring.";
    return;
  }
  const width = container.clientWidth || 680;
  const height = container.clientHeight || 420;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfffaf4);
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  const b = bounds();
  camera.position.set(b.w * 1.1 + 8, planner.floorHeight * planner.floors + 7, b.h * 1.25 + 9);
  camera.lookAt(b.minX + b.w / 2, 1.5, b.minY + b.h / 2);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  container.appendChild(renderer.domElement);
  threeState.renderer = renderer;

  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const sun = new THREE.DirectionalLight(0xffffff, 0.9);
  sun.position.set(8, 12, 6);
  scene.add(sun);

  const group = new THREE.Group();
  const floorMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const wallMat = new THREE.MeshLambertMaterial({ color: wallColor(planner.wallType) });
  const roofMat = new THREE.MeshLambertMaterial({ color: roofColor(planner.roofType) });
  const slabMat = new THREE.MeshLambertMaterial({ color: 0xffead2 });
  const glassMat = new THREE.MeshLambertMaterial({ color: 0x8fd4ff, transparent: true, opacity: 0.65 });
  const wallT = planner.wallThickness;

  for(let floor = 0; floor < planner.floors; floor++){
    const yBase = floor * planner.floorHeight;
    planner.rooms.forEach(room => {
      addBox(group, room.x + room.w / 2, yBase - 0.05, room.y + room.l / 2, room.w, 0.1, room.l, floorMat);
      addBox(group, room.x + room.w / 2, yBase + planner.floorHeight / 2, room.y, room.w, planner.floorHeight, wallT, wallMat);
      addBox(group, room.x + room.w / 2, yBase + planner.floorHeight / 2, room.y + room.l, room.w, planner.floorHeight, wallT, wallMat);
      addBox(group, room.x, yBase + planner.floorHeight / 2, room.y + room.l / 2, wallT, planner.floorHeight, room.l, wallMat);
      addBox(group, room.x + room.w, yBase + planner.floorHeight / 2, room.y + room.l / 2, wallT, planner.floorHeight, room.l, wallMat);
      addBox(group, room.x + room.w / 2, yBase + 1.45, room.y - wallT - 0.02, Math.min(1.2, room.w * 0.38), 0.9, 0.04, glassMat);
    });
    addBox(group, b.minX + b.w / 2, yBase - 0.12, b.minY + b.h / 2, b.w + 0.7, 0.18, b.h + 0.7, slabMat);
  }

  const roofY = planner.floors * planner.floorHeight + 0.18;
  if(planner.roofType === "flat"){
    addBox(group, b.minX + b.w / 2, roofY, b.minY + b.h / 2, b.w + 0.9, 0.28, b.h + 0.9, roofMat);
  }else{
    const roofGeo = new THREE.ConeGeometry(Math.max(b.w, b.h) * 0.78, 1.8, 4);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(b.minX + b.w / 2, roofY + 0.8, b.minY + b.h / 2);
    roof.rotation.y = Math.PI / 4;
    roof.scale.z = Math.max(0.75, b.h / Math.max(b.w, 1));
    group.add(roof);
  }

  group.position.set(-(b.minX + b.w / 2), 0, -(b.minY + b.h / 2));
  scene.add(group);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(Math.max(22, b.w + 8), Math.max(22, b.h + 8)),
    new THREE.MeshLambertMaterial({ color: 0xf4efe8 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.22;
  scene.add(ground);

  const controls = window.THREE.OrbitControls ? new THREE.OrbitControls(camera, renderer.domElement) : null;
  if(controls){
    controls.enableDamping = true;
    controls.target.set(0, 1.6, 0);
  }
  const animate = () => {
    threeState.frame = requestAnimationFrame(animate);
    group.rotation.y += 0.002;
    controls?.update();
    renderer.render(scene, camera);
  };
  animate();
}

function addBox(group, x, y, z, w, h, d, material){
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  group.add(mesh);
}

function openModelFromPlanner(){
  savePlanner();
  if(typeof openPage === "function") openPage("ai3d");
  setTimeout(build3D, 80);
}

window.onPageOpen = function(name){
  if(name === "planner"){
    setupCanvas();
    syncFormFromPlanner();
    renderRoomList();
    fitView();
    drawPlanner();
  }
  if(name === "ai3d") setTimeout(build3D, 80);
};

Object.assign(window, {
  selectRoom,
  editRoom,
  deleteRoom,
  addRoom,
  renameSelected,
  resetPlanner,
  setPlannerParam,
  syncFormFromPlanner,
  build3D,
  openModelFromPlanner
});

document.addEventListener("DOMContentLoaded", () => {
  syncFormFromPlanner();
  if(document.getElementById("page-planner")?.classList.contains("active")) window.onPageOpen("planner");
});
