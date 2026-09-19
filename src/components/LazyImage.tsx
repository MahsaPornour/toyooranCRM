import React, { useState, useEffect, useRef } from 'react';

export const LazyImage = ({ src, alt, className, imgClassName, fallbackSrc = '/images/product-placeholder.svg' }: { src: string, alt?: string, className?: string, imgClassName?: string, fallbackSrc?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setCurrentSrc(src);
    setIsLoaded(false);
  }, [src]);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [currentSrc]);

  return (
    <div className={`relative overflow-hidden ${className || ''}`}>
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt || ''}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc);
          } else { 
             // even fallback failed, let's just stop showing error loop
             setIsLoaded(true);
          }
        }}
        className={`relative z-10 transition-all duration-700 ease-in-out ${imgClassName || 'w-full h-full object-cover'} ${isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-100 blur-xl scale-110'}`}
      />
    </div>
  );
};
