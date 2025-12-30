import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, animate, PanInfo } from 'framer-motion';
import Reveal from './Reveal';
import ProjectModal from './ProjectModal';
import { Project } from '../types';
import { ArrowUpRight, RotateCw, ChevronRight, ChevronLeft, ImageOff } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import Skeleton from 'react-loading-skeleton';
import clsx from 'clsx';

// Strict Configuration for Sections
const SECTION_CONFIG = [
  { 
    id: 'motion', 
    title: 'Motion Graphics', 
    keyword: 'motion' 
  },
  { 
    id: 'youtube_vsl', 
    title: 'YouTube Videos / VSL’s', 
    keyword: 'youtube_vsl' 
  },
  { 
    id: 'short_form', 
    title: 'Short Form Videos', 
    keyword: 'short_form' 
  },
];

const LABEL_MAP: Record<string, string> = {
  'motion': 'Motion Graphics',
  'youtube_vsl': 'YouTube / VSL',
  'short_form': 'Short Form',
};

// --- Reusable Card Component ---
const ProjectCard: React.FC<{ 
  project: Project; 
  onClick: () => void;
  priority?: boolean;
}> = ({ project, onClick, priority = false }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={clsx(
        "group relative aspect-video overflow-hidden rounded-lg cursor-pointer cursor-hover-trigger",
        "border border-white/10 hover:border-accent/50",
        "hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all duration-500",
        "w-full h-full bg-surfaceHighlight"
      )}
      onClick={onClick}
      data-context="project"
    >
      {imgError || !project.thumbnail ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/5 text-neutral-500 gap-2">
            <ImageOff size={32} strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-widest">No Preview</span>
        </div>
      ) : (
        <img
          src={project.thumbnail}
          alt={project.title || "Project Thumbnail"}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
        />
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 select-none">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <span className="text-accent text-[10px] md:text-xs font-bold tracking-widest uppercase mb-2 block">
            {LABEL_MAP[project.category] || project.category || "Project"}
          </span>
          <div className="flex justify-between items-end">
            <h3 className="text-lg md:text-xl font-bold text-white leading-tight line-clamp-2">
              {project.title || "Untitled Project"}
            </h3>
            <div className="p-2 bg-white text-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 scale-75 md:scale-100 shrink-0 ml-3">
               <ArrowUpRight size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Transform-Based Infinite Carousel ---
const ProjectCarousel: React.FC<{
  items: Project[];
  onItemClick: (originalId: number) => void;
  isLoading: boolean;
}> = ({ items, onItemClick, isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Responsive Columns State
  const [cols, setCols] = useState(3);
  // Touch Detection State
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) setCols(1);
      else if (w < 1024) setCols(2);
      else setCols(3);

      // Check for touch capability strictly
      setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    };
    handleResize(); // Initial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Triple Buffer Data for Infinite Loop
  const displayItems = useMemo(() => {
    if (!items.length) return [];
    let padded = [...items];
    // Ensure we have enough items to fill the view comfortably before tripling
    while (padded.length < 6) {
      padded = [...padded, ...items];
    }
    // Create triple buffer: [Buffer_Pre] [Main] [Buffer_Post]
    return [...padded, ...padded, ...padded];
  }, [items]);

  const originalLength = displayItems.length / 3;
  
  // Start at the middle set
  const [index, setIndex] = useState(originalLength);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Motion Value for sliding
  const x = useMotionValue(0);

  // Sync x with index using spring physics for snappy, premium feel
  useEffect(() => {
    if (originalLength === 0) return;
    
    // Calculate percentage shift based on columns
    // 1 col = 100% shift per item, 3 cols = 33.333% shift per item
    const percentPerItem = 100 / cols;
    const targetX = -index * percentPerItem;

    const controls = animate(x, targetX, {
      type: "spring",
      stiffness: 300,
      damping: 30, // Minimal bounce, quick settle
      mass: 1,
      onComplete: () => {
        // Silent Loop Reset
        // If we are in the last buffer set, jump back to middle
        if (index >= originalLength * 2) {
          const resetIndex = index - originalLength;
          setIndex(resetIndex);
          x.set(-resetIndex * percentPerItem);
        } 
        // If we are in the first buffer set, jump forward to middle
        else if (index < originalLength) {
          const resetIndex = index + originalLength;
          setIndex(resetIndex);
          x.set(-resetIndex * percentPerItem);
        }
      }
    });

    return controls.stop;
  }, [index, cols, originalLength, x]);

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 50; // px to trigger swipe
    if (info.offset.x < -threshold) {
      setIndex(i => i + 1);
    } else if (info.offset.x > threshold) {
      setIndex(i => i - 1);
    } else {
      // Snap back if drag wasn't enough (index stays same, effect re-runs to snap x)
      setIndex(i => i); 
    }
  };

  if (isLoading) {
    return (
        <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="min-w-full md:min-w-[50%] lg:min-w-[33.333%] pr-6">
                    <Skeleton className="aspect-video w-full rounded-lg" height="100%" />
                    <div className="mt-4">
                        <Skeleton width="40%" height={16} />
                        <Skeleton width="80%" height={24} className="mt-2" />
                    </div>
                </div>
            ))}
        </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div 
        ref={containerRef}
        className="relative group/carousel w-full overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
    >
        {/* Navigation Arrows (Desktop Only) */}
        {/* Removed gradient backgrounds for a cleaner, modern look */}
        <div className={clsx(
            "hidden md:flex absolute top-0 bottom-8 left-0 items-center justify-start z-20 transition-opacity duration-300 pointer-events-none pl-2",
            isHovering ? "opacity-100" : "opacity-0"
        )}>
            <button 
                onClick={() => setIndex(i => i - 1)}
                className="pointer-events-auto p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-accent hover:border-accent hover:text-white transition-all shadow-xl group/btn"
                aria-label="Previous Project"
            >
                <ChevronLeft size={24} className="group-active/btn:scale-90 transition-transform" />
            </button>
        </div>

        <div className={clsx(
            "hidden md:flex absolute top-0 bottom-8 right-0 items-center justify-end z-20 transition-opacity duration-300 pointer-events-none pr-2",
            isHovering ? "opacity-100" : "opacity-0"
        )}>
             <button 
                onClick={() => setIndex(i => i + 1)}
                className="pointer-events-auto p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-accent hover:border-accent hover:text-white transition-all shadow-xl group/btn"
                aria-label="Next Project"
            >
                <ChevronRight size={24} className="group-active/btn:scale-90 transition-transform" />
            </button>
        </div>

        {/* Track */}
        <motion.div 
            className={clsx(
              "flex w-full pb-8 pt-4",
              isTouch ? "cursor-grab active:cursor-grabbing" : ""
            )}
            style={{ x }} // Bind motion value
            drag={isTouch ? "x" : false} // Strict: Drag enabled ONLY on touch devices
            dragElastic={0.05} // Minimal elasticity
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
        >
            {displayItems.map((project, i) => (
                <div 
                    key={`${project.id}-${i}`}
                    // Width Logic:
                    // Mobile: 100%
                    // Tablet: 50%
                    // Desktop: 33.333%
                    className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 pr-6 select-none"
                    style={{ boxSizing: 'border-box' }}
                >
                    <div className="pointer-events-auto" onClick={() => {
                      if (!isDragging) onItemClick(project.id);
                    }}>
                       <ProjectCard project={project} onClick={() => {}} />
                    </div>
                </div>
            ))}
        </motion.div>
    </div>
  );
};

const Projects: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const { content, isLoading, isError, retry } = useContent();
  const projects = content.projects.items;

  // --- Scoped Modal Navigation Logic ---
  const handleNav = (direction: 'next' | 'prev') => {
    if (!selectedProjectId) return;

    // 1. Find Current Project
    const currentProject = projects.find(p => p.id === selectedProjectId);
    if (!currentProject) return;

    // 2. Determine Context (Category)
    // We normalize to ensure we match strictly within the active section
    const currentCategory = currentProject.category.trim().toLowerCase();
    
    // 3. Filter Projects to ONLY this category
    const contextProjects = projects.filter(p => 
      p.category.trim().toLowerCase() === currentCategory
    );

    if (contextProjects.length === 0) return;

    // 4. Find index in filtered list
    const currentIndex = contextProjects.findIndex(p => p.id === selectedProjectId);
    if (currentIndex === -1) return;

    // 5. Calculate New Index (Looping)
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % contextProjects.length;
    } else {
      newIndex = (currentIndex - 1 + contextProjects.length) % contextProjects.length;
    }

    // 6. Set ID
    setSelectedProjectId(contextProjects[newIndex].id);
  };

  const handleCardClick = (globalId: number) => {
    setSelectedProjectId(globalId);
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <section id="work" className="py-24 bg-surface relative overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
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

        {/* Error State */}
        {isError && (
          <div className="py-16 flex flex-col items-center justify-center border border-white/5 rounded-xl bg-white/5 text-center mb-12">
            <p className="text-neutral-400 mb-4 text-sm">Unable to load projects at this time.</p>
            <button 
              onClick={retry}
              className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest text-accent hover:bg-accent/10 rounded-full transition-colors"
            >
              <RotateCw size={14} />
              <span>Retry Connection</span>
            </button>
          </div>
        )}

        {/* Project Subsections */}
        <div className="space-y-24">
          {SECTION_CONFIG.map((section) => {
            // Strict Filtering for Carousel
            const sectionProjects = isLoading 
                ? [] 
                : projects.filter(p => {
                    if (!p.category) return false;
                    return p.category.trim().toLowerCase() === section.keyword.toLowerCase();
                });

            if (!isLoading && sectionProjects.length === 0) return null;

            return (
              <div key={section.id} className="relative">
                {/* Section Title */}
                <Reveal width="100%" delay={0.1}>
                  <div className="flex items-center gap-4 mb-8">
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">{section.title}</h3>
                    <div className="h-[1px] flex-1 bg-white/5"></div>
                    <div className="hidden md:flex items-center gap-1 text-xs font-medium text-neutral-500 uppercase tracking-widest">
                       {sectionProjects.length > 0 ? `${sectionProjects.length} Projects` : 'Loading...'}
                    </div>
                  </div>
                </Reveal>

                {/* Independent Carousel */}
                <Reveal width="100%" delay={0.2}>
                    <ProjectCarousel 
                        items={sectionProjects}
                        onItemClick={handleCardClick}
                        isLoading={isLoading}
                    />
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            isOpen={!!selectedProject}
            onClose={() => setSelectedProjectId(null)}
            onNext={() => handleNav('next')}
            onPrev={() => handleNav('prev')}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;