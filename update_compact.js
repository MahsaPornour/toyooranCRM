import fs from 'fs';

let content = fs.readFileSync('src/components/CompactShowcase.tsx', 'utf-8');

// 1. randomProducts -> featuredProducts
content = content.replace(/randomProducts/g, 'featuredProducts');
content = content.replace(/setRandomProducts/g, 'setFeaturedProducts');

// 2. update useEffect filtering
content = content.replace(
  /setFeaturedProducts\(\[\.\.\.products\]\.sort\(\(\) => 0\.5 - Math\.random\(\)\)\.slice\(0, 4\)\);/,
  `const featured = products.filter(p => p.isFeatured);\n      setFeaturedProducts(featured.length > 0 ? featured.slice(0, 4) : products.slice(0, 4));`
);

// 3. Slower slide (4500 -> 7000)
content = content.replace(/4500\)/, '7000)');

// 4. Texts
content = content.replace(/محصولات منتخب/g, 'محصولات پرفروش');
content = content.replace(/پیشنهادهای ویژه و تصادفی/g, 'پیشنهادهای ویژه');
content = content.replace(/کاتالوگ کامل/g, 'مشاهده همه');

// 5. Image frame
const oldFrame = `<div className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 shrink-0 relative rounded-full flex items-center justify-center p-2 sm:p-4">
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/20 rounded-full blur-2xl group-hover/slide:blur-3xl transition-all duration-700" />
                      <LazyImage 
                         src={featuredProducts[currentSlide].image} 
                         alt={featuredProducts[currentSlide].name} 
                         className="w-full h-full relative z-10" 
                         imgClassName="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)] transition-transform duration-700 group-hover/slide:scale-110 group-hover/slide:-rotate-3 group-hover/slide:drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]" 
                       />
                    </div>`;

const newFrame = `<div className="w-40 sm:w-56 md:w-64 aspect-[4/3] shrink-0 relative rounded-3xl overflow-hidden bg-slate-50 shadow-lg border border-white/10">
                      <LazyImage 
                         src={featuredProducts[currentSlide].image} 
                         alt={featuredProducts[currentSlide].name} 
                         className="w-full h-full relative z-10" 
                         imgClassName="w-full h-full object-cover transform transition-transform duration-700 group-hover/slide:scale-105" 
                       />
                       <div className="absolute inset-0 bg-black/0 group-hover/slide:bg-black/5 transition-colors duration-500 z-20 pointer-events-none" />
                    </div>`;

content = content.replace(oldFrame, newFrame);

fs.writeFileSync('src/components/CompactShowcase.tsx', content);
