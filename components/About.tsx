import React, { useEffect, useRef } from 'react';
import Reveal from './Reveal';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

const AnimatedCounter = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 50, stiffness: 75 });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toFixed(0) + suffix;
      }
    });
    return () => unsubscribe();
  }, [springValue, suffix]);

  return <span ref={ref}>0{suffix}</span>;
};

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-black overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Content */}
          <div className="w-full lg:w-1/2">
             <Reveal>
              <h2 className="text-sm text-accent uppercase tracking-[0.2em] mb-4">About Me</h2>
            </Reveal>
            <Reveal>
              <h3 className="text-3xl md:text-5xl font-display font-bold leading-tight mb-8">
                I tell stories through <br /> <span className="text-neutral-500">motion and rhythm.</span>
              </h3>
            </Reveal>
            
            <Reveal delay={0.2}>
              <div className="space-y-6 text-neutral-400 text-lg font-light leading-relaxed">
                <p>
                  I'm <strong className="text-white font-semibold">Tahajib Efaj</strong>, a dedicated video editor and motion graphics designer obsessed with the details. 
                  My philosophy is simple: visuals should not just look good—they should feel right.
                </p>
                <p>
                  Specializing in Premiere Pro and After Effects, I create clean, high-retention content that cuts through the noise. 
                  Whether it's a fast-paced social ad or a cinematic brand documentary, I focus on pacing, sound design, 
                  and visual hierarchy to ensure your message lands.
                </p>
              </div>
            </Reveal>
            
            <Reveal delay={0.4}>
                <div className="mt-10 grid grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-white text-4xl font-bold mb-2">
                          <AnimatedCounter value={4} suffix="+" />
                        </h4>
                        <span className="text-neutral-500 text-sm uppercase tracking-wider">Years Experience</span>
                    </div>
                    <div>
                        <h4 className="text-white text-4xl font-bold mb-2">
                          <AnimatedCounter value={100} suffix="+" />
                        </h4>
                        <span className="text-neutral-500 text-sm uppercase tracking-wider">Projects Completed</span>
                    </div>
                </div>
            </Reveal>
          </div>

          {/* Image/Visual */}
          <div className="w-full lg:w-1/2 relative">
             <Reveal width="100%" delay={0.3}>
                <div className="relative aspect-[3/4] w-full max-w-md mx-auto grayscale hover:grayscale-0 transition-all duration-700 rounded-lg overflow-hidden group">
                    <img 
                        src="https://picsum.photos/600/800?random=5" 
                        alt="Tahajib Efaj" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent/20 rounded-full blur-2xl"></div>
                    <div className="absolute top-10 -left-10 w-32 h-32 border border-white/10 rounded-full opacity-50"></div>
                </div>
             </Reveal>
          </div>
        </div>

        {/* Interstitial CTA */}
        <Reveal width="100%" delay={0.6}>
          <div className="mt-24 flex justify-center">
             <a
              href="https://cal.com/tahajib-efaj-seugbc/calltoexplore"
              target="_blank"
              rel="noopener noreferrer"
              className="px-12 py-5 bg-black border-2 border-white/20 text-white rounded-full text-lg font-bold uppercase tracking-widest hover:bg-white hover:text-black hover:scale-105 hover:border-white transition-all duration-300 shadow-2xl shadow-accent/10"
            >
              Ready?
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default About;