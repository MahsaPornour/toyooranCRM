import fs from 'fs';

let content = fs.readFileSync('src/admin/tabs/ProductsTab.tsx', 'utf-8');

const regex = /(<select[\s\S]*?<\/select>\s*<\/div>)/;

const newHTML = `$1
                    <div className="flex items-center gap-3 pt-6">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={formData.isFeatured || false}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900"
                      />
                      <label htmlFor="isFeatured" className="text-xs font-bold text-slate-300 select-none cursor-pointer">
                        نمایش به عنوان محصول پرفروش (پیشنهاد ویژه در صفحه اصلی)
                      </label>
                    </div>`;

content = content.replace(regex, newHTML);

fs.writeFileSync('src/admin/tabs/ProductsTab.tsx', content);
