import React from 'react';
import { Film, MonitorPlay, Zap, Layers } from 'lucide-react';
import Reveal from './Reveal';
import { useContent } from '../context/ContentContext';
import clsx from 'clsx';
import Skeleton from 'react-loading-skeleton';

const iconMap: Record<number, React.ElementType> = {
  1: Film,
  2: Layers,
  3: Zap,
  4: MonitorPlay
};

const Services: React.FC = () => {
  const { content, isLoading } = useContent();

  return (
    <section id="services" className="py-24 bg-surfaceHighlight/30">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-sm text-accent uppercase tracking-[0.2em] mb-4">What I Do</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-white">Creative Services</h3>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading 
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-8 h-[320px] bg-surface border border-white/5 rounded-xl">
                  <Skeleton height={48} width={48} className="mb-6 rounded-lg" />
                  <Skeleton height={24} width="70%" className="mb-4" />
                  <Skeleton count={3} />
                </div>
              ))
            : content.services.map((service, index) => {
            const Icon = iconMap[service.id] || Film;
            return (
              <Reveal key={service.id} delay={index * 0.1} width="100%">
                <div className={clsx(
                  "group p-8 min-h-[320px] bg-surface border border-white/5 rounded-xl",
                  "hover:border-accent/50 transition-all duration-300 relative overflow-hidden",
                  "hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(124,58,237,0.15)]",
                  "cursor-hover-trigger flex flex-col"
                )}>
                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10 flex-1">
                    <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 text-white group-hover:text-accent group-hover:scale-110 transition-all duration-300">
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                    
                    <h4 className="text-xl font-bold text-white mb-4">{service.title}</h4>
                    <p className="text-neutral-400 text-sm leading-relaxed group-hover:text-neutral-300 transition-colors">
                      {service.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;