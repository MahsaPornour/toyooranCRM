import fs from 'fs';

let content = fs.readFileSync('src/components/CompactShowcase.tsx', 'utf-8');

const regex = /<div className="flex flex-col gap-4 sm:gap-5 flex-1 relative z-10 justify-center">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\);\s*};\s*$/;

const newHTML = `<div className="flex flex-col gap-3 flex-1 relative z-10">
            {featuredArticles.map((article, idx) => {
              if (idx === 0) {
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    key={article.id}
                    onClick={() => onSelectArticle(article.id)}
                    className="group relative rounded-[2rem] overflow-hidden cursor-pointer h-56 sm:h-64 mb-2 shadow-sm border border-slate-100"
                  >
                    <LazyImage src={article.image} alt={article.title} className="absolute inset-0 w-full h-full" imgClassName="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] sm:text-[11px] font-black px-3 py-1 rounded-full bg-amber-500 text-white shadow-md">
                          {article.categoryLabel}
                        </span>
                        <span className="text-[10px] text-slate-300 font-medium flex items-center gap-1 backdrop-blur-md bg-white/10 px-2 py-1 rounded-full border border-white/10">
                          <Clock className="w-3 h-3" /> {article.readTime}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-white leading-relaxed line-clamp-2 drop-shadow-md">
                        {article.title}
                      </h4>
                    </div>
                  </motion.div>
                )
              }

              return (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  key={article.id}
                  onClick={() => onSelectArticle(article.id)}
                  className="group flex items-center gap-4 bg-white/50 hover:bg-white p-3 rounded-[1.5rem] transition-all duration-300 cursor-pointer border border-slate-100/50 hover:border-amber-200 hover:shadow-md"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl overflow-hidden relative shadow-sm">
                     <LazyImage src={article.image} alt={article.title} className="w-full h-full" imgClassName="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  
                  <div className="flex-1 min-w-0 py-1">
                    <span className="text-[10px] font-black text-amber-600 mb-1.5 block">
                      {article.categoryLabel}
                    </span>
                    <h4 className="text-[13px] sm:text-[14px] font-bold text-slate-700 group-hover:text-[#003F86] transition-colors line-clamp-2 leading-relaxed">
                      {article.title}
                    </h4>
                  </div>
                  
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 mr-2 group-hover:bg-amber-50 transition-colors">
                     <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
`;

content = content.replace(regex, newHTML);
fs.writeFileSync('src/components/CompactShowcase.tsx', content);
