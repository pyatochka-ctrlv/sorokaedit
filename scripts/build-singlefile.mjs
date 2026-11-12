import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const assetsDir = path.join(distDir, 'assets');

if (!fs.existsSync(assetsDir)) {
  console.error('Assets dir not found, please run npm run build first');
  process.exit(1);
}

const files = fs.readdirSync(assetsDir);
const jsFile = files.find(f => f.endsWith('.js'));
const cssFile = files.find(f => f.endsWith('.css'));

if (!jsFile || !cssFile) {
  console.error('JS or CSS asset not found in dist/assets');
  process.exit(1);
}

const jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf-8');
const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8');

const singleHtml = `<!doctype html>
<html lang="uk">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Монтажна Сороки — Сорока ТВ</title>
    <meta name="description" content="Інтерактивна монтажна новин для дітей: ріж лезом, прибирай воду, виправляй пастки та вкладайся у 30 секунд за формулою «Думка — Бо — Наприклад»." />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
${cssContent}
    </style>
  </head>
  <body class="bg-[#15181F] text-slate-100 select-none">
    <div id="root"></div>
    <script>
${jsContent}
    </script>
  </body>
</html>
`;

fs.writeFileSync(path.join(distDir, 'single-index.html'), singleHtml, 'utf-8');
console.log('Successfully generated dist/single-index.html (' + (singleHtml.length / 1024).toFixed(1) + ' KB)');
