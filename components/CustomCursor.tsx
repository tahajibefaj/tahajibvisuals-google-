import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const updateTouchPosition = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setMousePosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over clickable elements
      const isClickable = 
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-hover-trigger');
        
      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('touchmove', updateTouchPosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('touchmove', updateTouchPosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Main dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-accent rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isHovering ? 2 : 1, // Enlarge on hover instead of disappear
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
      />
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-white/50 rounded-full pointer-events-none z-[9999]"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
          borderColor: isHovering ? 'rgba(147, 51, 234, 0.5)' : 'rgba(255, 255, 255, 0.3)',
          backgroundColor: isHovering ? 'rgba(147, 51, 234, 0.05)' : 'transparent',
          borderWidth: isHovering ? '0px' : '1px',
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      />
    </>
  );
};

export default CustomCursor;