import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch/mobile devices based on pointer accuracy
  useEffect(() => {
    // 'pointer: coarse' matches devices where the primary input is touch (phones, tablets)
    // 'pointer: fine' matches devices with a mouse/trackpad (desktop, laptops with touchscreens)
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    
    const handleDeviceChange = (e: MediaQueryListEvent) => {
      setIsTouchDevice(e.matches);
    };

    setIsTouchDevice(mediaQuery.matches);
    
    mediaQuery.addEventListener('change', handleDeviceChange);
    return () => mediaQuery.removeEventListener('change', handleDeviceChange);
  }, []);

  // Use MotionValues for high-performance updates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Smooth spring physics configuration
  const springConfig = shouldReduceMotion 
    ? { damping: 50, stiffness: 1000, mass: 0.1 } 
    : { damping: 25, stiffness: 400, mass: 0.4 };
    
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Completely disable listeners on touch devices to save performance and prevent conflicts
    if (isTouchDevice) return;

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
    // We keep touch listeners here for Laptops that might have touchscreens but are not "coarse" primary
    window.addEventListener('touchmove', moveCursor, { passive: true });
    window.addEventListener('touchstart', moveCursor, { passive: true });
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('touchmove', moveCursor);
      window.removeEventListener('touchstart', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible, isTouchDevice]);

  // If it's a touch device (Mobile/Tablet), do not render the custom cursor.
  // Instead, inject styles to force the default system cursor to be visible,
  // overriding the global CSS in index.html.
  if (isTouchDevice) {
    return (
      <style>{`
        html body, html a, html button, html input, html select, html textarea, html [role="button"] { 
            cursor: auto !important; 
        }
      `}</style>
    );
  }

  // If user hasn't interacted, don't render to avoid (0,0) position artifact
  if (!isVisible) return null;

  return (
    <>
      {/* Global CSS to hide default cursor where appropriate (Desktop Only) */}
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