import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Reveal from './Reveal';
import { useContent } from '../context/ContentContext';

const Hero: React.FC = () => {
  const { content } = useContent();
  const { hero } = content;

  // Mouse Follower Logic for Hero Background
  // Initialize to center screen
  const mouseX = useMotionValue(typeof window !== 'undefined' ? (window.innerWidth / 2) - 400 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? (window.innerHeight / 2) - 400 : 0);

  const springConfig = { damping: 50, stiffness: 400, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.pageX - 400);
      mouseY.set(e.pageY - 400);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const handleScrollToWork = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('work');
    const sb = (window as any).scrollbar;

    if (element && sb) {
        sb.scrollIntoView(element, { damping: 0.07, offsetTop: 0 });
    } else if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      data-context="hero"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        {/* Dynamic Mouse Follower Glow */}
        <motion.div 
            style={{ x, y }}
            className="absolute top-0 left-0 w-[800px] h-[800px] bg-accent/25 rounded-full blur-[120px] animate-pulse will-change-transform"
        />

        {/* Static Anchor Glow */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[130px]"></div>
        
        {/* Noise overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        {/* Availability Indicator */}
        <Reveal width="fit-content">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-8 backdrop-blur-sm"
          >
            <div className="relative flex items-center justify-center w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
            </div>
            <span className="text-accent text-[10px] md:text-xs font-semibold tracking-widest uppercase">Currently Available</span>
          </motion.div>
        </Reveal>

        <Reveal width="100%">
          <h2 className="text-sm md:text-base text-accent tracking-[0.3em] uppercase mb-6 font-medium text-glow">
            {hero.subtitle}
          </h2>
        </Reveal>

        <div className="mb-8 relative w-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-accent/10 blur-[80px] -z-10 rounded-full"></div>
            
            <Reveal width="100%">
            <h1 className="font-display font-bold text-5xl md:text-8xl lg:text-9xl leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-400 drop-shadow-2xl">
              {hero.titleLine1} <br /> {hero.titleLine2}
            </h1>
          </Reveal>
        </div>

        <Reveal width="100%" delay={0.4}>
          <p className="text-neutral-300 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed font-light mb-12">
            {hero.description}
          </p>
        </Reveal>

        <Reveal width="100%" delay={0.6}>
           <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <a 
              href="#work"
              onClick={handleScrollToWork}
              className="group relative px-8 py-4 bg-white text-black rounded-full overflow-hidden flex items-center gap-3 font-semibold tracking-wide hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]"
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">{hero.ctaText}</span>
              <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0"></div>
            </a>
          </div>
        </Reveal>
      </div>

      <motion.div 
        className="absolute bottom-10 w-full flex flex-col items-center justify-center gap-2 opacity-50 pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-center text-accent">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-accent to-transparent"></div>
      </motion.div>
    </section>
  );
};

export default Hero;