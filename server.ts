import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import fs from "fs";
import { ARTICLES, PRODUCTS } from "./src/data/mockData";
import cookieParser from "cookie-parser";
import { audit, changePassword, confirmMfa, consumeRateLimit, createCsrfToken, getAdminState, listSessions, loginAdmin, logoutAdmin, requireAdmin, requireMfaPending, requireRole, resetRateLimit, revokeAllSessions, setAdminState, startMfaSetup, verifyCsrf, verifyMfaSession } from "./server/auth";
import { z } from 'zod';

dotenv.config();

// Helper to get SEO metadata based on route
function getSeoMetadata(reqPath: string): { title: string; description: string; ogType: string } {
  const baseTitle = "Toyooran";
  
  if (reqPath === '/' || reqPath === '') {
    return {
      title: `صفحه اصلی | ${baseTitle}`,
      description: "طیوران صنعت پویا، پیشگام در طراحی، تولید و اجرای مدرن‌ترین تجهیزات پرورشی و کارخانجات خوراک دام و طیور در خاورمیانه.",
      ogType: "website"
    };
  }
  
  if (reqPath.startsWith('/products')) {
    return {
      title: `محصولات | ${baseTitle}`,
      description: "کاتالوگ جامع محصولات و تجهیزات مدرن مرغداری، اتوماسیون سالن‌های پرورشی و ماشین‌آلات کارخانجات خوراک طیوران صنعت پویا.",
      ogType: "website"
    };
  }
  
  if (reqPath.startsWith('/services')) {
    return {
      title: `خدمات | ${baseTitle}`,
      description: "خدمات تخصصی طیوران صنعت پویا شامل طراحی و ساخت سوله‌های صنعتی، راه‌اندازی کارخانجات خوراک دام و طیور و مشاوره تخصصی.",
      ogType: "website"
    };
  }
  
  if (reqPath.startsWith('/projects')) {
    return {
      title: `پروژه‌ها | ${baseTitle}`,
      description: "نمونه کارهای اجرایی و پروژه‌های شاخص طیوران صنعت پویا در سطح کشور و خاورمیانه.",
      ogType: "website"
    };
  }

  if (reqPath.startsWith('/products/') && reqPath !== '/products/') {
    const productId = reqPath.split('/')[2];
    const product = PRODUCTS.find(p => p.id === productId || p.code === productId);
    if (product) {
      return {
        title: `${product.name} | ${baseTitle}`,
        description: product.shortDescription || product.fullDescription,
        ogType: "product"
      };
    }
  }

  if (reqPath.startsWith('/magazine/')) {
    const articleId = reqPath.split('/')[2];
    const article = ARTICLES.find(a => a.id === articleId) as any;
    if (article) {
      return {
        title: `${article.title} | مجله ${baseTitle}`,
        description: article.excerpt || "مقاله تخصصی در مجله طیوران صنعت پویا",
        ogType: "article"
      };
    }
  }
  
  if (reqPath.startsWith('/magazine')) {
    return {
      title: `مجله تخصصی | ${baseTitle}`,
      description: "دانش‌نامه و مجله تخصصی صنعت مرغداری. مقالات آموزشی پرورش طیور، تجهیزات و جدیدترین اخبار.",
      ogType: "website"
    };
  }
  
  if (reqPath.startsWith('/about')) {
    return {
      title: `درباره ما | ${baseTitle}`,
      description: "معرفی شرکت طیوران صنعت پویا، تاریخچه، گواهینامه‌ها و چشم‌انداز فعالیت در حوزه تجهیزات مدرن مرغداری.",
      ogType: "website"
    };
  }
  
  if (reqPath.startsWith('/contact')) {
    return {
      title: `تماس با ما | ${baseTitle}`,
      description: "ارتباط با کارشناسان فروش، پشتیبانی فنی و ثبت درخواست مشاوره برای راه‌اندازی و تجهیز مرغداری.",
      ogType: "website"
    };
  }

  if (reqPath.startsWith('/crm') || reqPath.startsWith('/admin/crm')) {
    return {
      title: `صفحه CRM | ${baseTitle}`,
      description: "سامانه اختصاصی مدیریت ارتباط با مشتریان و فروش شرکت طیوران صنعت پویا.",
      ogType: "website"
    };
  }

  // Default fallback (e.g. 404 pages)
  return {
    title: `پیدا نشد | ${baseTitle}`,
    description: "صفحه مورد نظر در سامانه طیوران صنعت پویا یافت نشد.",
    ogType: "website"
  };
}

// Helper to inject SEO tags into raw HTML
function injectSeoTags(html: string, reqPath: string, baseUrl: string): string {
  const metadata = getSeoMetadata(reqPath);
  const canonicalUrl = `${baseUrl}${reqPath}`;
  
  let modifiedHtml = html;
  
  // Replace <title>
  modifiedHtml = modifiedHtml.replace(
    /<title>.*?<\/title>/i,
    `<title>${metadata.title}</title>`
  );
  
  // Replace or inject meta description
  if (modifiedHtml.includes('name="description"')) {
    modifiedHtml = modifiedHtml.replace(
      /<meta[^>]*name="description"[^>]*>/i,
      `<meta name="description" content="${metadata.description}" />`
    );
  } else {
    modifiedHtml = modifiedHtml.replace(
      '</head>',
      `  <meta name="description" content="${metadata.description}" />\n  </head>`
    );
  }
  
  // Inject OpenGraph, Twitter Cards, Canonical
  const extraMeta = `
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${metadata.title}" />
    <meta property="og:description" content="${metadata.description}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="${metadata.ogType}" />
    <meta property="og:site_name" content="Toyooran" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${metadata.title}" />
    <meta name="twitter:description" content="${metadata.description}" />
  `;
  
  modifiedHtml = modifiedHtml.replace('</head>', `${extraMeta}\n  </head>`);
  
  // Noindex private routes
  if (reqPath.startsWith('/admin') || reqPath.startsWith('/login') || reqPath.startsWith('/dashboard')) {
    modifiedHtml = modifiedHtml.replace('</head>', `  <meta name="robots" content="noindex, nofollow" />\n  </head>`);
  }
  
  return modifiedHtml;
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.disable('x-powered-by');
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Content-Security-Policy', "default-src 'self'; base-uri 'self'; object-src 'none'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com");
    if (process.env.NODE_ENV === 'production') res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });
  app.use(express.json({ limit: '100kb' }));
  app.use(cookieParser());
  app.use('/api', (req, res, next) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && !req.path.startsWith('/auth/login') && !req.path.startsWith('/consultation') && !verifyCsrf(req)) return res.status(403).json({ error: 'CSRF token نامعتبر است.' });
    next();
  });

  const apiHits = new Map<string, { count: number; resetAt: number }>();
  app.use('/api', (req, res, next) => {
    const now = Date.now();
    const key = req.ip || 'unknown';
    const entry = apiHits.get(key) || { count: 0, resetAt: now + 60_000 };
    if (entry.resetAt <= now) { entry.count = 0; entry.resetAt = now + 60_000; }
    entry.count += 1; apiHits.set(key, entry);
    if (entry.count > 60) return res.status(429).json({ success: false, error: 'درخواست‌های بیش از حد' });
    next();
  });

  app.post('/api/auth/login', async (req, res) => {
    const key = `login:${req.ip || 'unknown'}`; const rate = consumeRateLimit(key, 5, 15 * 60_000); if (!rate.allowed) return res.status(429).json({ success: false, error: 'تلاش‌های ورود زیاد است.' });
    const parsed = z.object({ username: z.string().trim().min(1).max(80), password: z.string().min(1).max(256), turnstileToken: z.string().optional() }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, error: 'اطلاعات ورود نامعتبر است.' });
    const { username, password, turnstileToken } = parsed.data;
    const result = await loginAdmin(username, password, turnstileToken, req.ip, res);
    if (result.success) resetRateLimit(key);
    res.status(result.success ? 200 : 401).json(result);
  });
  app.get('/api/auth/csrf', (req, res) => res.json({ token: createCsrfToken(res) }));
  app.post('/api/auth/password', requireAdmin, requireRole('superadmin'), (req, res) => {
    const parsed = z.object({ oldPassword: z.string().min(1).max(256), newPassword: z.string().min(16).max(256) }).safeParse(req.body);
    if (!parsed.success || !changePassword(req as any, parsed.data.oldPassword, parsed.data.newPassword)) return res.status(400).json({ success: false, error: 'تغییر رمز ناموفق بود.' });
    audit(req as any, 'password_changed'); res.status(204).end();
  });
  app.get('/api/auth/sessions', requireAdmin, (req, res) => res.json({ sessions: listSessions(req as any) }));
  app.delete('/api/auth/sessions', requireAdmin, (req, res) => { revokeAllSessions(req as any); res.status(204).end(); });
  app.post('/api/auth/logout', requireAdmin, (req, res) => { logoutAdmin(req, res); res.status(204).end(); });
  app.get('/api/auth/me', requireAdmin, (req, res) => res.json({ authenticated: true, admin: (req as any).admin }));
  app.post('/api/auth/mfa/verify', requireMfaPending, async (req, res) => {
    const ok = await verifyMfaSession(req as any, String(req.body?.token || ''));
    res.status(ok ? 200 : 400).json({ success: ok, error: ok ? undefined : 'کد MFA نامعتبر است.' });
  });
  app.post('/api/auth/mfa/setup', requireAdmin, (req, res) => res.json(startMfaSetup((req as any).admin.id)));
  app.post('/api/auth/mfa/confirm', requireAdmin, async (req, res) => {
    const ok = await confirmMfa((req as any).admin.id, String(req.body?.token || ''));
    res.status(ok ? 200 : 400).json({ success: ok, error: ok ? undefined : 'کد MFA نامعتبر است.' });
  });
  app.get('/api/admin/state/:key', requireAdmin, requireRole('superadmin', 'content_manager', 'sales_manager', 'media_manager', 'viewer'), (req, res) => {
    const key = String(req.params.key);
    const value = getAdminState(key);
    res.json({ value });
  });
  app.put('/api/admin/state/:key', requireAdmin, requireRole('superadmin', 'content_manager', 'sales_manager', 'media_manager'), (req, res) => {
    const key = String(req.params.key);
    if (!['products', 'projects', 'services', 'articles', 'categories', 'companyInfo', 'heroCms', 'aiConfig', 'quotes', 'consultations', 'customers', 'media'].includes(key)) return res.status(400).json({ error: 'کلید state نامعتبر است.' });
    if (JSON.stringify(req.body?.value ?? null).length > 2_000_000) return res.status(413).json({ error: 'داده بیش از حد بزرگ است.' });
    setAdminState(req as any, key, req.body?.value);
    res.status(204).end();
  });

  // API Route: Send form submission / consultation to Bale Bot
  app.post("/api/consultation", async (req, res) => {
    try {
      const {
        fullName,
        phoneNumber,
        companyName,
        subject,
        productName,
        capacity,
        location,
        message,
        source,
        timestamp
      } = req.body;

      const baleToken = process.env.BALE_BOT_TOKEN === 'AI_STUDIO_PREVIEW_DISABLED' ? '' : process.env.BALE_BOT_TOKEN;
      const baleChatId = process.env.BALE_CHAT_ID === 'AI_STUDIO_PREVIEW_DISABLED' ? '' : process.env.BALE_CHAT_ID;

      // Construct formatted Persian message for Bale Messenger
      const formattedLines = [
        `🔔 *درخواست جدید از وب‌سایت طیوران صنعت پویا*`,
        `━━━━━━━━━━━━━━━━━━`,
        `👤 *نام متقاضی:* ${fullName || 'ثبت نشده'}`,
        `📞 *شماره تماس:* ${phoneNumber || 'ثبت نشده'}`,
        companyName ? `🏢 *نام واحد / مرغداری:* ${companyName}` : null,
        subject ? `📋 *موضوع:* ${subject}` : null,
        productName ? `📦 *محصول انتخابی:* ${productName}` : null,
        location ? `📍 *شهر / استان:* ${location}` : null,
        capacity ? `📐 *ظرفیت سالن:* ${capacity}` : null,
        message ? `📝 *توضیحات:* ${message}` : null,
        source ? `🏷 *بخش ارسال‌کننده:* ${source}` : null,
        `━━━━━━━━━━━━━━━━━━`,
        `⏰ *زمان ثبت:* ${timestamp || new Date().toLocaleString('fa-IR')}`,
        `🌐 *سامانه آنلاین طیوران صنعت پویا*`
      ].filter(Boolean);

      const formattedMessage = formattedLines.join('\n');

      let baleResult: any = null;
      let sent = false;

      if (baleToken && baleChatId) {
        try {
          const response = await fetch(`https://tapi.bale.ai/bot${baleToken}/sendMessage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              chat_id: baleChatId,
              text: formattedMessage,
            })
          });
          baleResult = await response.json();
          sent = response.ok;
          if (!response.ok) {
            console.error("Bale API responded with error:", baleResult);
          }
        } catch (fetchError) {
          console.error("Error connecting to Bale API:", fetchError);
        }
      } else {
        console.log("ℹ️ Bale Bot Token or Chat ID not configured in .env. Message formatted:\n", formattedMessage);
      }

      res.status(200).json({
        success: true,
        sentToBale: sent,
        baleResult,
        message: sent 
          ? 'درخواست با موفقیت ثبت و پیام به ربات بله ارسال گردید.' 
          : 'درخواست در سیستم ثبت شد.'
      });
    } catch (error: any) {
      console.error("Consultation API error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Bale bot configuration status
  app.get("/api/bale/status", (_req, res) => {
    const hasToken = !!process.env.BALE_BOT_TOKEN && process.env.BALE_BOT_TOKEN !== 'AI_STUDIO_PREVIEW_DISABLED';
    const hasChatId = !!process.env.BALE_CHAT_ID && process.env.BALE_CHAT_ID !== 'AI_STUDIO_PREVIEW_DISABLED';
    res.json({
      configured: hasToken && hasChatId,
      hasToken,
      hasChatId
    });
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // SEO: robots.txt
  app.get("/robots.txt", (req, res) => {
    const baseUrl = process.env.APP_URL || `https://${req.get('host')}`;
    res.type('text/plain');
    res.send(`User-agent: *
Disallow: /admin
Disallow: /login
Disallow: /dashboard
Disallow: /api/
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`);
  });

  // SEO: sitemap.xml
  app.get("/sitemap.xml", (req, res) => {
    const baseUrl = process.env.APP_URL || `https://${req.get('host')}`;
    const date = new Date().toISOString().split('T')[0];
    
    // Static Routes
    const staticRoutes = ['/', '/products', '/services', '/projects', '/magazine', '/about', '/contact'];
    
    const staticUrls = staticRoutes.map(route => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.9'}</priority>
  </url>`).join('');

    // Add dynamic articles to sitemap
    const articleUrls = ARTICLES.map(article => `
  <url>
    <loc>${baseUrl}/magazine/${article.id}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls}${articleUrls}
</urlset>`;
    
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom", // Changed from spa to custom to handle HTML manually
    });
    app.use(vite.middlewares);
    
    // Serve index.html for all other routes
    app.use(/.*/, async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const baseUrl = process.env.APP_URL || `https://${req.get('host')}`;
        
        let template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        
        // Inject SEO metadata
        const finalHtml = injectSeoTags(template, url, baseUrl);
        
        // 404 Status for unknown routes
        const knownRoutes = ['/', '/products', '/services', '/projects', '/magazine', '/about', '/contact', '/admin', '/crm'];
        const isKnownRoute = knownRoutes.some(r => url === r || url.startsWith(`${r}/`));
        if (!isKnownRoute && url !== '/') {
           res.status(404).set({ 'Content-Type': 'text/html' }).end(finalHtml);
           return;
        }

        res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false })); // Disable automatic index.html serving
    
    app.get(/.*/, (req, res) => {
      const url = req.originalUrl;
      const baseUrl = process.env.APP_URL || `https://${req.get('host')}`;
      
      let template = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
      
      // Inject SEO metadata
      const finalHtml = injectSeoTags(template, url, baseUrl);
      
      const knownRoutes = ['/', '/products', '/services', '/projects', '/magazine', '/about', '/contact', '/admin', '/crm'];
      const isKnownRoute = knownRoutes.some(r => url === r || url.startsWith(`${r}/`));
      if (!isKnownRoute && url !== '/') {
         res.status(404).set({ 'Content-Type': 'text/html' }).send(finalHtml);
         return;
      }

      res.status(200).set({ 'Content-Type': 'text/html' }).send(finalHtml);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
