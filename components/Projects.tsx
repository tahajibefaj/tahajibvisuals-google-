import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from './Reveal';
import ProjectModal from './ProjectModal';
import { Project } from '../types';
import { ArrowUpRight, RotateCw } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import Skeleton from 'react-loading-skeleton';
import clsx from 'clsx';

const Projects: React.FC = () => {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
  const { content, isLoading, isError, retry } = useContent();
  const projects = content.projects.items;

  const handleNext = () => {
    if (selectedProjectIndex === null) return;
    const nextIndex = (selectedProjectIndex + 1) % projects.length;
    setSelectedProjectIndex(nextIndex);
  };

  const handlePrev = () => {
    if (selectedProjectIndex === null) return;
    const prevIndex = (selectedProjectIndex - 1 + projects.length) % projects.length;
    setSelectedProjectIndex(prevIndex);
  };

  return (
    <section id="work" className="py-24 bg-surface relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white">
              {isLoading ? <Skeleton width={300} /> : isError ? "Selected Works" : content.projects.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="text-neutral-400 mt-4 md:mt-0 max-w-sm text-right">
              {isLoading ? <Skeleton count={2} /> : isError ? "" : content.projects.subheading}
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isError ? (
            <div className="col-span-1 md:col-span-2 py-16 flex flex-col items-center justify-center border border-white/5 rounded-xl bg-white/5 text-center">
              <p className="text-neutral-400 mb-4 text-sm">Unable to load projects at this time.</p>
              <button 
                onClick={retry}
                className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest text-accent hover:bg-accent/10 rounded-full transition-colors"
              >
                <RotateCw size={14} />
                <span>Retry Connection</span>
              </button>
            </div>
          ) : isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="w-full">
                <Skeleton className="aspect-video w-full rounded-lg" height="100%" />
              </div>
            ))
          ) : (
            projects.map((project, index) => (
              <Reveal key={project.id} width="100%" delay={index * 0.1}>
                <motion.div
                  className={clsx(
                    "group relative aspect-video overflow-hidden rounded-lg cursor-pointer cursor-hover-trigger",
                    "border border-white/10 hover:border-accent/50",
                    "hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all duration-500"
                  )}
                  onClick={() => setSelectedProjectIndex(index)}
                  data-context="project"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-accent text-xs font-bold tracking-widest uppercase mb-2 block">
                        {project.category}
                      </span>
                      <div className="flex justify-between items-end">
                        <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                        <div className="p-2 bg-white text-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                           <ArrowUpRight size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedProjectIndex !== null && (
          <ProjectModal
            project={projects[selectedProjectIndex]}
            isOpen={selectedProjectIndex !== null}
            onClose={() => setSelectedProjectIndex(null)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;