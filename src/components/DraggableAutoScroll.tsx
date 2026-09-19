import React, { useRef, useEffect, useState } from 'react';

export const DraggableAutoScroll: React.FC<{ children: React.ReactNode, speed?: number }> = ({ children, speed = 1 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const animationRef = useRef<number>();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scroll = () => {
      if (!isDragging.current && !isHovered) {
        // Since RTL, we subtract to move items to the left (or add, depending on browser RTL implementation)
        // Browsers handle RTL scrollLeft differently (Chrome/Firefox/Safari).
        // A safer way is to manipulate scrollBy.
        container.scrollBy({ left: -speed }); 
        
        // Loop logic: if we reach the end, reset.
        // In RTL, scrollLeft goes from 0 to negative in some browsers, or positive in others.
        // The easiest way to loop in a React component is to duplicate children if needed, 
        // but for now, we'll just bounce or loop when max scroll is reached.
        // Actually, for a simple implementation, if scrollLeft reaches 0 or max, we can loop.
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (Math.abs(container.scrollLeft) >= maxScroll - 1) {
          container.scrollLeft = 0; // jump back
        }
      }
      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isHovered, speed]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (containerRef.current?.offsetLeft || 0);
    scrollLeft.current = containerRef.current?.scrollLeft || 0;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    setIsHovered(false);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 2; // scroll-fast
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex overflow-x-auto hide-scroll-bar cursor-grab active:cursor-grabbing gap-4 w-full"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      dir="rtl"
    >
      {children}
      {/* Duplicate children for infinite effect */}
      {children}
    </div>
  );
};
