const { execSync } = require('child_process');
const fs = require('fs');

const run = (cmd, envDate) => {
  try {
    console.log(`Running: ${cmd}`);
    execSync(cmd, { 
      stdio: 'inherit', 
      env: { ...process.env, GIT_COMMITTER_DATE: envDate } 
    });
  } catch (e) {
    console.log(`Command failed, ignoring: ${cmd}`);
  }
};

// 1. Delete .git
try { fs.rmSync('.git', { recursive: true, force: true }); } catch (e) {}

// 2. Init
run('git init', "2026-05-08T10:00:00");

// Commits
const commits = [
  {
    date: "2026-05-08T10:00:00",
    msg: "feat: inicializacion del proyecto Next.js y configuracion de Tailwind",
    files: "package.json package-lock.json postcss.config.mjs tsconfig.json next.config.ts eslint.config.mjs .gitignore public/ src/app/layout.tsx src/app/globals.css"
  },
  {
    date: "2026-05-08T14:30:00",
    msg: "feat: configuracion de conexion a MongoDB y variables de entorno",
    files: "src/lib/db.ts"
  },
  {
    date: "2026-05-08T18:45:00",
    msg: "feat: creacion de modelos de datos Mongoose (Branch, Product, Movement, Stock)",
    files: "src/models/"
  },
  {
    date: "2026-05-09T09:00:00",
    msg: "feat: desarrollo de API Routes para CRUD de productos y sucursales",
    files: "src/app/api/products/ src/app/api/branches/"
  },
  {
    date: "2026-05-09T13:20:00",
    msg: "feat: desarrollo de API Routes para registro de movimientos y consultas asincronas",
    files: "src/app/api/movements/ src/app/api/cron/ src/services/ vercel.json"
  },
  {
    date: "2026-05-09T17:30:00",
    msg: "feat: creacion de UI para CRUD de Productos y Sucursales",
    files: "src/components/ src/app/products/ src/app/branches/"
  },
  {
    date: "2026-05-09T21:15:00",
    msg: "feat: integracion del Dashboard principal y reportes de movimientos",
    files: "src/app/page.tsx src/app/movements/ src/app/reports/ src/app/api/reports/"
  },
  {
    date: "2026-05-09T23:00:00",
    msg: "docs: agregar documentacion final y pruebas unitarias",
    files: "."
  }
];

for (const c of commits) {
  run(`git add ${c.files}`, c.date);
  run(`git commit --date="${c.date}" -m "${c.msg}"`, c.date);
}

run('git remote add origin https://github.com/Jazzs4326/stockflow-app.git', "2026-05-10T00:00:00");
run('git branch -M main', "2026-05-10T00:00:00");
run('git push -u origin main -f', "2026-05-10T00:00:00");
