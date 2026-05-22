<<<<<<< HEAD
# BuildAI / Hackathon Project

VS Code va GitHub uchun tozalangan loyiha strukturasi.

## Struktura

```text
hackathonfr_vscode_github/
├── public/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── planner3d.js
├── data/
│   ├── constructionKnowledge.js
│   └── listings.json
├── scripts/
│   └── audit_knowledge_pdfs.py
├── .vscode/
│   └── launch.json
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── requirements-knowledge.txt
├── server.js
└── README.md
```

## VS Code’da ishga tushirish

=======
# BuildAI Full Demo + Gemini API

## Ishga tushirish
>>>>>>> 2fcf1d1f31468200e5f1ec97e8d0efc9ab3f6725
```bash
npm install
npm run dev
```

<<<<<<< HEAD
Brauzerda oching:

=======
Brauzer:
>>>>>>> 2fcf1d1f31468200e5f1ec97e8d0efc9ab3f6725
```text
http://localhost:5000
```

<<<<<<< HEAD
## API sozlash

`.env.example` faylidan nusxa oling va `.env` deb nomlang:

```env
OPENAI_API_KEY=sk-...
PORT=5000
```

API kalit bo‘lmasa ham loyiha lokal rule-engine orqali asosiy tavsiyalarni chiqaradi.

## GitHubga yuklash

```bash
git init
git add .
git commit -m "Initial clean project structure"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

`USERNAME` va `REPOSITORY` joyiga o‘zingizning GitHub profilingiz va repo nomini yozing.

## Eslatma

`node_modules`, `.env`, `.git`, `.DS_Store`, `__MACOSX` va lokal `.tools` papkalari GitHubga yuklanmaydi. Kerakli paketlar `npm install` orqali qayta o‘rnatiladi.
=======
## Gemini API ulash
1. `.env.example` faylini `.env` deb nomlang.
2. Ichiga yangi API key yozing:
```env
GEMINI_API_KEY=AIza...
PORT=5000
```
3. Serverni qayta ishga tushiring:
```bash
npm run dev
```

## Qo‘shilgan funksiyalar
- Premium oq + sabzi rang dizayn
- Animatsiyali asosiy sahifa
- Planner, Market, Texnikalar, Ishchilar, 3D AI, Natija alohida page
- Materiallar demo ma’lumotlari, narx, rasm va joylashuv
- Texnikalar demo rasm, narx va joylashuv
- Ishchilar xizmati: brigada, usta, elektr, santexnik
- Band qilish formasi: ism, telefon, qurilish manzili
- Gemini API orqali Planner AI xulosa
- Gemini image endpoint orqali 3D AI rasm generatsiya qilishga tayyor
>>>>>>> 2fcf1d1f31468200e5f1ec97e8d0efc9ab3f6725
