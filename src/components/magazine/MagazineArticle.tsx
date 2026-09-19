import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Clock, Calendar, Share2, Tag, Link as LinkIcon, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { Article, Product } from '../../types';
import { PRODUCTS } from '../../data/mockData';
import { LazyImage } from '../LazyImage';

const IMAGES = [
  '/images/poultry-1.jpg',
  '/images/factory-1.jpg',
  '/images/equipment-1.jpg',
  '/images/tech-1.jpg',
  '/images/control-1.jpg',
  '/images/machine-1.jpg',
  '/images/silo-1.jpg',
];

interface MagazineArticleProps {
  article: Article;
  onBack: () => void;
  onSelectProductById: (productId: string) => void;
}

export const MagazineArticle: React.FC<MagazineArticleProps> = ({ article, onBack, onSelectProductById }) => {
  // Use a hash of the id to pick a pseudo-random stable image
  const hash = article.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const heroImage = article.image || IMAGES[hash % IMAGES.length];
  
  const linkedProducts = PRODUCTS.filter((p) => article.relatedProductIds.includes(p.id));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#F8FAFC] pb-24"
    >
      {/* Hero Header Section */}
      <div className="relative min-h-[60vh] md:min-h-[70vh] w-full flex flex-col justify-end pt-40 sm:pt-44 md:pt-48 pb-16 overflow-hidden">
        {/* Parallax Background */}
        <div className="absolute inset-0 z-0 bg-slate-900">
          <LazyImage 
            src={heroImage} 
            alt={article.title}
            className="w-full h-full absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/70 to-[#0f172a]/30 z-10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 px-4 sm:px-6 lg:px-8 w-full max-w-5xl mx-auto">
          {/* Top Actions (Back Button) */}
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20  border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm"
            >
              <ArrowRight className="w-5 h-5" />
              <span>بازگشت به مجله</span>
            </button>
            
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20  border border-white/20 text-white p-2.5 rounded-full transition-all shadow-sm">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm font-medium mb-6">
              <span className="bg-amber-500/90 text-white border border-amber-400/50 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                {article.categoryLabel}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {article.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> {article.readTime}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.5] md:leading-[1.6] mb-6">
              {article.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl font-light">
              {article.summary}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200 p-6 md:p-12 lg:p-16">
          
          {/* Article Text */}
          <div className="prose prose-lg prose-slate max-w-none text-slate-700 leading-loose">
            {article.content.map((paragraph, idx) => {
              const text = paragraph.trim();
              
              if (text.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-2xl font-black text-slate-900 mt-12 mb-6 border-b border-slate-200 pb-4">
                    {text.replace('## ', '')}
                  </h2>
                );
              }
              
              if (text.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-xl font-bold text-slate-800 mt-8 mb-4">
                    {text.replace('### ', '')}
                  </h3>
                );
              }

              if (text.startsWith('- ')) {
                return (
                  <ul key={idx} className="list-disc list-inside mb-4 mr-4 space-y-2">
                    <li className="text-base md:text-lg font-medium text-slate-700">
                      {text.replace('- ', '')}
                    </li>
                  </ul>
                );
              }

              // Parse IMG: [IMG|Image URL|Alt Text]
              const imgMatch = text.match(/^\[IMG\|([^|]+)\|([^\]]+)\]$/);
              if (imgMatch) {
                const [, src, alt] = imgMatch;
                return (
                  <div key={idx} className="my-10 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-200 bg-white">
                    <LazyImage src={src} alt={alt} className="w-full min-h-[250px] md:min-h-[400px]" imgClassName="w-full h-auto object-cover max-h-[600px]" />
                    {alt && <p className="text-center text-sm text-slate-500 py-3 font-medium bg-slate-50">{alt}</p>}
                  </div>
                );
              }

              // Parse CTA: [CTA|Button Text|Link] e.g. [CTA|درخواست مشاوره رایگان|/contact]
              const ctaMatch = text.match(/^\[CTA\|([^|]+)\|([^\]]+)\]$/);
              if (ctaMatch) {
                const [, btnText, link] = ctaMatch;
                return (
                  <div key={idx} className="my-10 bg-gradient-to-r from-blue-900 to-[#003F86] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-900/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/images/pattern-circuit.svg')] opacity-10 mix-blend-overlay"></div>
                    <div className="relative z-10 flex-1">
                      <h4 className="text-white text-lg md:text-xl font-bold mb-2">نیاز به راهنمایی بیشتر دارید؟</h4>
                      <p className="text-blue-100 text-sm md:text-base font-medium">کارشناسان ما آماده ارائه مشاوره تخصصی و فنی به شما هستند.</p>
                    </div>
                    <button 
                      onClick={() => {
                        // Very simple handling for CTAs targeting contact/quote
                        if (link === '/contact') {
                          // Try to navigate or just open modal
                          window.location.hash = 'contact';
                        }
                      }}
                      className="relative z-10 whitespace-nowrap bg-amber-400 hover:bg-amber-500 text-blue-950 px-8 py-3.5 rounded-xl font-black text-sm transition-all shadow-lg shadow-amber-400/20"
                    >
                      {btnText}
                    </button>
                  </div>
                );
              }

              return (
                <p key={idx} className="mb-6 text-base md:text-lg text-justify font-medium">
                  {text}
                </p>
              );
            })}
          </div>

          {/* Related Products Section */}
          {linkedProducts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-slate-200">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-blue-50 rounded-xl">
                  <LinkIcon className="w-6 h-6 text-[#003F86]" />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  محصولات و تجهیزات مرتبط
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {linkedProducts.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => onSelectProductById(p.id)}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 hover:border-[#003F86]/30 bg-slate-50/50 hover:bg-blue-50/50 transition-all cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <LazyImage src={p.image} alt={p.name} className="w-full h-full" imgClassName="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-[#003F86] transition-colors">{p.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{p.shortDescription}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Tags */}
          <div className="mt-16 pt-8 flex flex-wrap items-center gap-2">
             <Tag className="w-5 h-5 text-slate-400 mr-2" />
             {(article.tags && article.tags.length > 0 ? article.tags : ['دانش فنی', 'صنعت طیور', 'تجهیزات']).map(tag => (
               <span key={tag} className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 cursor-pointer transition-colors">
                 {tag}
               </span>
             ))}
          </div>

        </div>
      </div>
    </motion.div>
  );
};
