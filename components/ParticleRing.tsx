import React, { useEffect, useRef } from 'react';

const ParticleRing: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 1. PERFORMANCE & ACCESSIBILITY SAFEGUARDS
    // Immediately exit if touch device (save battery) or reduced motion requested
    const mediaQueryTouch = window.matchMedia('(pointer: coarse)');
    const mediaQueryMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (mediaQueryTouch.matches || mediaQueryMotion.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 2. CONFIGURATION
    const config = {
      particleCount: 30,
      lerpSpeed: 0.05, // Smoothness of the "follow" movement (lower is smoother)
      baseRadius: 2,   // Min radius of particles
      varRadius: 2,    // Variance in radius (2-4px total size)
      orbitMin: 60,    // Min orbit distance from cursor
      orbitMax: 140,   // Max orbit distance from cursor
    };
    
    // 3. STATE
    const particles: {
      angle: number;
      orbitRadius: number;
      speed: number;
      size: number;
      opacity: number;
    }[] = [];

    let width = 0;
    let height = 0;
    // Start center of screen
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let animFrameId: number;
    let isRunning = true;

    // 4. INITIALIZATION
    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < config.particleCount; i++) {
        particles.push({
          angle: Math.random() * Math.PI * 2,
          orbitRadius: config.orbitMin + Math.random() * (config.orbitMax - config.orbitMin),
          // Random direction and speed
          speed: (Math.random() < 0.5 ? -1 : 1) * (0.002 + Math.random() * 0.006),
          size: config.baseRadius + Math.random() * config.varRadius,
          opacity: 0.1 + Math.random() * 0.2 // Subtle opacity 0.1 - 0.3
        });
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      
      // Handle High DPI screens for crisp rendering
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      // Calculate mouse position relative to the canvas
      const rect = canvas.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    };

    const handleVisibility = () => {
      isRunning = !document.hidden;
      if (isRunning) loop();
    };

    // 5. ANIMATION LOOP
    const loop = () => {
      if (!isRunning) return;
      
      ctx.clearRect(0, 0, width, height);

      // Smoothly interpolate system center towards mouse target
      currentX += (targetX - currentX) * config.lerpSpeed;
      currentY += (targetY - currentY) * config.lerpSpeed;

      ctx.fillStyle = "#ffffff";

      particles.forEach(p => {
        // Update orbit angle
        p.angle += p.speed;
        
        // Calculate absolute position
        const x = currentX + Math.cos(p.angle) * p.orbitRadius;
        const y = currentY + Math.sin(p.angle) * p.orbitRadius;

        // Draw particle
        ctx.beginPath();
        ctx.globalAlpha = p.opacity;
        ctx.arc(x, y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animFrameId = requestAnimationFrame(loop);
    };

    // Setup
    handleResize();
    initParticles();
    
    // Add Listeners (Passive for performance)
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    
    // Start Loop
    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]" 
      style={{ opacity: 0.8 }}
    />
  );
};

export default ParticleRing;