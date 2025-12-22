import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Reveal from './Reveal';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-900/20 rounded-full blur-[100px] opacity-20"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <Reveal width="100%">
          <h2 className="text-sm md:text-base text-accent tracking-[0.3em] uppercase mb-6 font-medium">
            Cinematic Motion & Visuals
          </h2>
        </Reveal>

        <div className="mb-8">
            <Reveal width="100%">
            <h1 className="font-display font-bold text-5xl md:text-8xl lg:text-9xl leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">
              TAHAJIB <br /> EFAJ
            </h1>
          </Reveal>
        </div>

        <Reveal width="100%" delay={0.4}>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed font-light mb-12">
            A Video Editor & Motion Graphics Designer crafting <span className="text-white font-medium">high-retention</span> visual experiences. 
            Merging technical precision with cinematic storytelling.
          </p>
        </Reveal>

        <Reveal width="100%" delay={0.6}>
           <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <a 
              href="#work"
              className="group relative px-8 py-4 bg-white text-black rounded-full overflow-hidden flex items-center gap-3 font-semibold tracking-wide hover:scale-105 transition-transform duration-300"
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">View Projects</span>
              <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0"></div>
            </a>
            
            <a 
              href="#contact"
              className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-accent group-hover:text-accent transition-colors">
                 <Play size={14} fill="currentColor" />
              </div>
              <span className="text-sm uppercase tracking-widest">Showreel</span>
            </a>
          </div>
        </Reveal>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
      </motion.div>
    </section>
  );
};

export default Hero;