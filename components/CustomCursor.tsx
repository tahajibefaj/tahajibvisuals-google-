import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  // Use MotionValues for high-performance updates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Smooth spring physics configuration
  // If reduced motion is on, we make it snappy to avoid motion sickness
  const springConfig = shouldReduceMotion 
    ? { damping: 50, stiffness: 1000, mass: 0.1 } 
    : { damping: 25, stiffness: 400, mass: 0.4 };
    
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If reduced motion, we can arguably disable the custom cursor entirey 
    // but the requirement says "Disable or soften". 
    // We will keep it but make it very rigid (softened animation).

    // Unified handler for Mouse and Touch events
    const moveCursor = (e: MouseEvent | TouchEvent) => {
      let clientX, clientY;
      
      // Check for touch points first
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
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
      
      // Check if the element or its parent is interactive
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

  // If user hasn't interacted, don't render to avoid (0,0) position artifact
  if (!isVisible) return null;

  return (
    <>
      {/* Global CSS to hide default cursor where appropriate */}
      <style>{`
        body, a, button, input, select, textarea { 
            cursor: none !important; 
        }
      `}</style>

      {/* Main Dot - Always stays on top - Z-Index 11001 */}
      <motion.div
        className="fixed top-0 left-0 bg-accent rounded-full pointer-events-none z-[11001] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 32 : 12, // Increased hover size for better feedback
          height: isHovering ? 32 : 12,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.2 }}
      />
      
      {/* Outer Ring - Disappears into the dot on hover - Z-Index 11000 */}
      {/* If reduced motion, hide the laggy ring entirely for simplicity and comfort */}
      {!shouldReduceMotion && (
        <motion.div
            className="fixed top-0 left-0 border border-white/50 rounded-full pointer-events-none z-[11000]"
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
      )}
    </>
  );
};

export default CustomCursor;