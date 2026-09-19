import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  ogType?: string;
}

export const SEO = ({ title, description, ogType = 'website' }: SEOProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = title;
    
    const updateOrCreateMeta = (selector: string, name: string, content: string, isProperty = false) => {
      let meta = document.querySelector(`meta[${isProperty ? 'property' : 'name'}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateOrCreateMeta('meta[name="description"]', 'description', description);
    updateOrCreateMeta('meta[property="og:title"]', 'og:title', title, true);
    updateOrCreateMeta('meta[property="og:description"]', 'og:description', description, true);
    updateOrCreateMeta('meta[property="og:type"]', 'og:type', ogType, true);
    
    const canonicalUrl = `${window.location.origin}${pathname}`;
    updateOrCreateMeta('meta[property="og:url"]', 'og:url', canonicalUrl, true);
    
    updateOrCreateMeta('meta[name="twitter:card"]', 'twitter:card', 'summary_large_image');
    updateOrCreateMeta('meta[name="twitter:title"]', 'twitter:title', title);
    updateOrCreateMeta('meta[name="twitter:description"]', 'twitter:description', description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [title, description, ogType, pathname]);

  return null;
};
