import fs from 'fs';

let content = fs.readFileSync('src/data/productsData.ts', 'utf-8');

const targetIds = ['ts-011', 'ts-013', 'ts-060', 'ts-014'];

targetIds.forEach(id => {
  content = content.replace(
    new RegExp(`("id":\\s*"${id}",[\\s\\S]*?"categoryTitle":\\s*"[^"]+",)`, 'g'),
    `$1\n    "isFeatured": true,`
  );
});

fs.writeFileSync('src/data/productsData.ts', content);
