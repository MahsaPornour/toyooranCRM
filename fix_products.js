import fs from 'fs';

const content = fs.readFileSync('src/data/productsData.ts', 'utf8');

const match = content.match(/export const PRODUCTS: Product\[\] = (\[[\s\S]*\n\]);?/);
if (!match) {
    console.error("Could not find array");
    process.exit(1);
}

let arrayString = match[1];

let products;
try {
  products = eval('(' + arrayString + ')');
} catch(e) {
  console.error("Eval failed:", e);
  process.exit(1);
}

products.forEach(p => {
  if (p.id && p.id.startsWith('kt-')) p.id = p.id.replace('kt-', 'ts-');
  if (p.code && p.code.startsWith('KT-')) p.code = p.code.replace('KT-', 'TS-');
  if (p.catalogPdfName && p.catalogPdfName.includes('KT-')) {
    p.catalogPdfName = p.catalogPdfName.replace('KT-', 'TS-');
  }
  
  if (p.code) {
    const imgName = `/images/products/${p.code}.webp`;
    p.image = imgName;
    p.gallery = [imgName];
  }
});

const newArrayStr = JSON.stringify(products, null, 2);

const newContent = `import { Product } from '../types';

export const PRODUCTS: Product[] = ${newArrayStr};
`;

fs.writeFileSync('src/data/productsData.ts', newContent);
console.log("Products fixed");
