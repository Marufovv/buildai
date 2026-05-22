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

```bash
npm install
npm run dev
```

Brauzerda oching:

```text
http://localhost:5000
```

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
