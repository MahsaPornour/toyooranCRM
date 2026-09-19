import fs from 'fs';
let content = fs.readFileSync('src/components/CompactShowcase.tsx', 'utf-8');

const regex = /<div className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 shrink-0 relative rounded-full flex items-center justify-center p-2 sm:p-4">[\s\S]*?<\/div>/m;
const newFrame = `<div className="w-48 sm:w-56 md:w-64 shrink-0 relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-50 border border-white/10 shadow-xl">
                      <LazyImage 
                         src={featuredProducts[currentSlide].image} 
                         alt={featuredProducts[currentSlide].name} 
                         className="w-full h-full relative z-10" 
                         imgClassName="w-full h-full object-cover transform transition-transform duration-700 group-hover/slide:scale-105" 
                       />
                       <div className="absolute inset-0 bg-black/0 group-hover/slide:bg-black/5 transition-colors duration-500 z-20 pointer-events-none" />
                    </div>`;

content = content.replace(regex, newFrame);
fs.writeFileSync('src/components/CompactShowcase.tsx', content);
