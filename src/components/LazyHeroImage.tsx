import React, { useState } from 'react';
import { motion } from 'motion/react';

export const LazyHeroImage: React.FC<{ src: string, alt?: string, className?: string, isActive: boolean }> = ({ src, alt, className, isActive }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div 
      className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'} ${className || ''}`}
    >
      <motion.img
        src={src}
        alt={alt || ''}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        initial={{ scale: 1.05 }}
        animate={{ 
          scale: isActive ? 1 : 1.05,
          filter: isLoaded ? 'blur(0px)' : 'blur(10px)'
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
    </div>
  );
};
