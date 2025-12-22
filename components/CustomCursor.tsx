import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor: React.FC = () => {
  // Use MotionValues for high-performance updates without re-renders
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 20, stiffness: 450, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent | TouchEvent) => {
      let clientX, clientY;
      
      if (window.matchMedia("(pointer: coarse)").matches && 'touches' in e) {
          // For touch devices, we might want to track touch, but often custom cursors are hidden.
          // Requirement: "Cursor stays visible... Size slightly reduced" on mobile.
          if (e.touches && e.touches.length > 0) {
              clientX = e.touches[0].clientX;
              clientY = e.touches[0].clientY;
          }
      } else if ('clientX' in e) {
          clientX = (e as MouseEvent).clientX;
          clientY = (e as MouseEvent).clientY;
      }

      if (clientX !== undefined && clientY !== undefined) {
        cursorX.set(clientX);
        cursorY.set(clientY);
        if (!isVisible) setIsVisible(true);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-hover-trigger') ||
        window.getComputedStyle(target).cursor === 'pointer';
        
      setIsHovering(!!isClickable);
    };

    // Use passive listeners for better scroll performance
    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('touchmove', moveCursor, { passive: true });
    window.addEventListener('touchstart', moveCursor, { passive: true });
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('touchmove', moveCursor);
      window.removeEventListener('touchstart', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Main Dot - Always top z-index */}
      <motion.div
        className="fixed top-0 left-0 bg-accent rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 28 : 12,
          height: isHovering ? 28 : 12,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.2 }}
      />
      
      {/* Outer Ring - Disappears into dot on hover */}
      <motion.div
        className="fixed top-0 left-0 border border-white/50 rounded-full pointer-events-none z-[9998]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 0 : 40,
          height: isHovering ? 0 : 40,
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.2 }}
      />
    </>
  );
};

export default CustomCursor;