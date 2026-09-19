import fs from 'fs';

let content = fs.readFileSync('src/components/CompactShowcase.tsx', 'utf-8');

// Find the start of the right column
const startMarker = '{/* Dynamic Articles Column';
const startIndex = content.indexOf(startMarker);

if (startIndex === -1) throw new Error("Could not find start marker");

// The end of the component is just before the last 3 closing divs
const endMarker = '  );\n};';
const endIndex = content.lastIndexOf(endMarker);

if (endIndex === -1) throw new Error("Could not find end marker");

const newRightColumn = `{/* Dynamic Articles Column (takes 5 cols) - BENTO DESIGN */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-full">
          {/* Floating Modern Header */}
          <div className="bg-white rounded-[2rem] p-4 sm:p-5 flex items-center justify-between shadow-xl shadow-slate-200/40 border border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-400 rounded-[1.25rem] flex items-center justify-center text-white shadow-lg shadow-amber-400/30">
                <Newspaper className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-xl text-slate-800 tracking-tight">مجله تخصصی</h3>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-bold block mt-0.5 uppercase tracking-wider">مقالات و اخبار صنعت</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('magazine')}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-50 hover:bg-slate-900 hover:text-amber-400 text-slate-600 flex items-center justify-center transition-all duration-300 group shadow-sm border border-slate-100"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 group-hover:scale-110 transition-all" />
            </button>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4 flex-1 min-h-[300px]">
            {/* Tall Featured Article */}
            {featuredArticles[0] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => onSelectArticle(featuredArticles[0].id)}
                className="col-span-1 row-span-2 relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-md hover:shadow-xl hover:shadow-slate-200/50 border border-slate-100/50 transition-all duration-500"
              >
                <LazyImage src={featuredArticles[0].image} alt={featuredArticles[0].title} className="absolute inset-0 w-full h-full" imgClassName="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <span className="backdrop-blur-md bg-white/20 border border-white/20 text-white text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Clock className="w-3 h-3" />
                      {featuredArticles[0].readTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-amber-400 mb-2 block drop-shadow-md">{featuredArticles[0].categoryLabel}</span>
                    <h4 className="text-white font-bold text-sm sm:text-base leading-relaxed line-clamp-3 group-hover:-translate-y-1 transition-transform duration-500 drop-shadow-lg">
                      {featuredArticles[0].title}
                    </h4>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Square Article 1 */}
            {featuredArticles[1] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                onClick={() => onSelectArticle(featuredArticles[1].id)}
                className="col-span-1 row-span-1 relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg hover:shadow-slate-200/50 border border-slate-100/50 transition-all duration-500"
              >
                <LazyImage src={featuredArticles[1].image} alt={featuredArticles[1].title} className="absolute inset-0 w-full h-full" imgClassName="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-end">
                  <span className="text-[9px] font-black text-amber-400 mb-1.5 block line-clamp-1 drop-shadow-md">{featuredArticles[1].categoryLabel}</span>
                  <h4 className="text-white font-bold text-xs sm:text-[13px] leading-snug line-clamp-2 group-hover:-translate-y-0.5 transition-transform duration-500 drop-shadow-lg">
                    {featuredArticles[1].title}
                  </h4>
                </div>
              </motion.div>
            )}

            {/* Square Article 2 */}
            {featuredArticles[2] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                onClick={() => onSelectArticle(featuredArticles[2].id)}
                className="col-span-1 row-span-1 relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg hover:shadow-slate-200/50 border border-slate-100/50 transition-all duration-500"
              >
                <LazyImage src={featuredArticles[2].image} alt={featuredArticles[2].title} className="absolute inset-0 w-full h-full" imgClassName="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-end">
                  <span className="text-[9px] font-black text-amber-400 mb-1.5 block line-clamp-1 drop-shadow-md">{featuredArticles[2].categoryLabel}</span>
                  <h4 className="text-white font-bold text-xs sm:text-[13px] leading-snug line-clamp-2 group-hover:-translate-y-0.5 transition-transform duration-500 drop-shadow-lg">
                    {featuredArticles[2].title}
                  </h4>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );\
};
`;

const newContent = content.slice(0, startIndex) + newRightColumn;
fs.writeFileSync('src/components/CompactShowcase.tsx', newContent);
