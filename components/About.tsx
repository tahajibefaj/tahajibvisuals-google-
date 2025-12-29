import React, { useEffect, useRef } from 'react';
import Reveal from './Reveal';
import { useMotionValue, useSpring } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import Skeleton from 'react-loading-skeleton';

const AnimatedCounter = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  
  // Faster, stiffer spring for immediate, intentional animation
  const springValue = useSpring(motionValue, { damping: 20, stiffness: 100 });

  useEffect(() => {
    // Trigger animation immediately on mount, ignoring scroll position
    motionValue.set(value);
  }, [value, motionValue]);

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
  const { content, isLoading } = useContent();
  const { about } = content;

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
                {isLoading ? <Skeleton count={2} /> : about.heading}
              </h3>
            </Reveal>
            
            <Reveal delay={0.2}>
              <div className="space-y-6 text-neutral-400 text-lg font-light leading-relaxed">
                <p>
                  {isLoading ? <Skeleton count={3} /> : about.bio1}
                </p>
                <p>
                  {isLoading ? <Skeleton count={3} /> : about.bio2}
                </p>
              </div>
            </Reveal>
            
            <Reveal delay={0.4}>
                <div className="mt-10 grid grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-white text-4xl font-bold mb-2">
                           {isLoading ? <Skeleton width={50} /> : <AnimatedCounter value={about.satisfiedClients} suffix="+" />}
                        </h4>
                        <span className="text-neutral-500 text-sm uppercase tracking-wider">Satisfied Clients</span>
                    </div>
                    <div>
                        <h4 className="text-white text-4xl font-bold mb-2">
                           {isLoading ? <Skeleton width={50} /> : <AnimatedCounter value={about.projectsCompleted} suffix="+" />}
                        </h4>
                        <span className="text-neutral-500 text-sm uppercase tracking-wider">Projects Completed</span>
                    </div>
                </div>
            </Reveal>
            
            {/* Trust Line */}
            <Reveal delay={0.5}>
                <div className="mt-8 pt-8 border-t border-white/10">
                    <p className="text-neutral-500 text-sm font-medium tracking-wide">
                        Trusted by creators, brands, and agencies worldwide.
                    </p>
                </div>
            </Reveal>
          </div>

          {/* Image/Visual */}
          <div className="w-full lg:w-1/2 relative">
             <Reveal width="100%" delay={0.3}>
                {isLoading ? (
                  <div className="w-full max-w-md mx-auto">
                    <Skeleton className="aspect-[3/4] rounded-lg" height="100%" />
                  </div>
                ) : (
                  <div className="relative aspect-[3/4] w-full max-w-md mx-auto grayscale hover:grayscale-0 transition-all duration-700 rounded-lg overflow-hidden group">
                      <img 
                          src={about.image} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                      
                      {/* Decorative Elements */}
                      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent/20 rounded-full blur-2xl"></div>
                      <div className="absolute top-10 -left-10 w-32 h-32 border border-white/10 rounded-full opacity-50"></div>
                  </div>
                )}
             </Reveal>
          </div>
        </div>

        {/* Interstitial CTA */}
        <Reveal width="100%" delay={0.6}>
          <div className="mt-24 flex justify-center">
             <a
              href={about.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-12 py-5 bg-black border-2 border-white/20 text-white rounded-full text-lg font-bold uppercase tracking-widest hover:bg-white hover:text-black hover:scale-105 hover:border-white transition-all duration-300 shadow-2xl shadow-accent/10"
            >
              {about.ctaText}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default About;