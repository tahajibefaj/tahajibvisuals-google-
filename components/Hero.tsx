import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Reveal from './Reveal';
import Scrollbar from 'smooth-scrollbar';
import { useContent } from '../context/ContentContext';

const Hero: React.FC = () => {
  const { content } = useContent();
  const { hero } = content;

  const handleScrollToWork = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('work');
    const container = document.getElementById('scroll-container');

    if (element && container) {
      const scrollbar = Scrollbar.get(container);
      if (scrollbar) {
        scrollbar.scrollIntoView(element, { offsetTop: 0 });
      }
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        {/* Top-Left: Large vibrant accent glow */}
        <div className="absolute -top-[20%] -left-[10%] w-[900px] h-[900px] bg-accent/30 rounded-full blur-[150px] animate-pulse"></div>
        
        {/* Bottom-Right: Deep emerald depth */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-emerald-900/40 rounded-full blur-[130px]"></div>
        
        {/* Center: Subtle wide fill to connect the sides */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] bg-accent/10 rounded-full blur-[120px]"></div>
        
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <Reveal width="100%">
          <h2 className="text-sm md:text-base text-accent tracking-[0.3em] uppercase mb-6 font-medium">
            {hero.subtitle}
          </h2>
        </Reveal>

        <div className="mb-8">
            <Reveal width="100%">
            <h1 className="font-display font-bold text-5xl md:text-8xl lg:text-9xl leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">
              {hero.titleLine1} <br /> {hero.titleLine2}
            </h1>
          </Reveal>
        </div>

        <Reveal width="100%" delay={0.4}>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed font-light mb-12">
            {hero.description}
          </p>
        </Reveal>

        <Reveal width="100%" delay={0.6}>
           <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <a 
              href="#work"
              onClick={handleScrollToWork}
              className="group relative px-8 py-4 bg-white text-black rounded-full overflow-hidden flex items-center gap-3 font-semibold tracking-wide hover:scale-105 transition-transform duration-300"
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">{hero.ctaText}</span>
              <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0"></div>
            </a>
          </div>
        </Reveal>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 w-full flex flex-col items-center justify-center gap-2 opacity-50 pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-center">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
      </motion.div>
    </section>
  );
};

export default Hero;