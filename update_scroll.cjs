const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "const ScrollToTop = () => {\n  const { pathname } = useLocation();\n\n  useEffect(() => {\n    window.scrollTo({ top: 0, behavior: 'instant' });\n  }, [pathname]);\n\n  return null;\n};",
  "const ScrollToTop = () => {\n  const { pathname } = useLocation();\n\n  useEffect(() => {\n    if ((window as any).lenis) {\n      (window as any).lenis.scrollTo(0, { immediate: true });\n    } else {\n      window.scrollTo({ top: 0, behavior: 'instant' });\n    }\n  }, [pathname]);\n\n  return null;\n};"
);

code = code.replace(
  "  // Initialize Smooth Scrolling (Lenis)\n  useEffect(() => {\n    const lenis = new Lenis({\n      duration: 1.2,\n      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),\n      touchMultiplier: 2,\n      infinite: false,\n    });\n\n    function raf(time) {\n      lenis.raf(time);\n      requestAnimationFrame(raf);\n    }\n    requestAnimationFrame(raf);\n\n    return () => {\n      lenis.destroy();\n    };\n  }, []);",
  "  // Initialize Smooth Scrolling (Lenis)\n  useEffect(() => {\n    const lenis = new Lenis({\n      duration: 1.2,\n      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),\n      touchMultiplier: 2,\n      infinite: false,\n    });\n\n    (window as any).lenis = lenis;\n\n    function raf(time: number) {\n      lenis.raf(time);\n      requestAnimationFrame(raf);\n    }\n    requestAnimationFrame(raf);\n\n    return () => {\n      lenis.destroy();\n      delete (window as any).lenis;\n    };\n  }, []);"
);

fs.writeFileSync('src/App.tsx', code);
