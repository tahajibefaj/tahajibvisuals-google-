import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
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

// Helper to normalize category strings for comparison
const normalizeCategory = (cat?: string) => {
    if (!cat) return '';
    return cat.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
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
        "group relative aspect-video overflow-hidden rounded-lg cursor-pointer",
        "border border-white/10 transition-colors duration-300",
        "w-full h-full bg-surfaceHighlight",
        // Minimal edge treatment on hover instead of heavy shadow
        "hover:border-accent/50"
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
      
      {/* Clean Flat Overlay - No heavy gradients */}
      <div className="absolute inset-0 bg-black/40 opacity-0 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 select-none">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <span className="text-accent text-[10px] md:text-xs font-bold tracking-widest uppercase mb-2 block">
            {LABEL_MAP[project.category] || project.category || "Project"}
          </span>
          <div className="flex justify-between items-end">
            <h3 className="text-lg md:text-xl font-bold text-white leading-tight line-clamp-2">
              {project.title || "Untitled Project"}
            </h3>
            <div className="p-2 bg-white text-black rounded-full scale-90 md:scale-100 shrink-0 ml-3">
               <ArrowUpRight size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Controlled Infinite Carousel ---
const ProjectCarousel: React.FC<{
  items: Project[];
  onItemClick: (originalId: number) => void;
  isLoading: boolean;
}> = ({ items, onItemClick, isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Layout Logic
  // Desktop: 40% width cards (2 visible = 80%, 10% margins)
  // Mobile: 80% width cards (1 visible = 80%, 10% margins)
  const [layout, setLayout] = useState({ cardWidth: 40, offset: 10 });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setLayout({ cardWidth: 80, offset: 10 }); // 1 card focus
      } else {
        setLayout({ cardWidth: 40, offset: 10 }); // 2 cards focus
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Triple Buffer for Infinite Loop
  const displayItems = useMemo(() => {
    if (!items.length) return [];
    // Ensure minimum items to fill buffer correctly
    let source = [...items];
    if (source.length < 4) source = [...source, ...source]; // Duplicate if too few
    return [...source, ...source, ...source];
  }, [items]);

  const originalLength = items.length < 4 && items.length > 0 ? items.length * 2 : items.length;
  
  // Start in the middle set
  const [index, setIndex] = useState(originalLength);
  const [isAnimating, setIsAnimating] = useState(false);
  const controls = useAnimation();

  // Handle Movement
  const move = (dir: 1 | -1) => {
    if (isAnimating || !items.length) return;
    setIsAnimating(true);
    setIndex(prev => prev + dir);
  };

  // Animation Effect
  useEffect(() => {
    if (items.length === 0) return;

    // The target position is negative (moving left) plus the positive offset (centering)
    // Formula: - (index * width) + offset
    const targetX = -index * layout.cardWidth + layout.offset;

    controls.start({
        x: `${targetX}%`,
        transition: { duration: 0.4, ease: "easeInOut" }
    }).then(() => {
        setIsAnimating(false);
        // Silent Loop Reset
        if (index >= originalLength * 2) {
            const resetIndex = index - originalLength;
            setIndex(resetIndex);
            controls.set({ x: `${-resetIndex * layout.cardWidth + layout.offset}%` });
        } else if (index < originalLength) {
            const resetIndex = index + originalLength;
            setIndex(resetIndex);
            controls.set({ x: `${-resetIndex * layout.cardWidth + layout.offset}%` });
        }
    });
  }, [index, layout, controls, originalLength, items.length]);

  if (isLoading) {
    return (
        <div className="flex gap-4 overflow-hidden px-[10%]">
            <div className="min-w-[80%] md:min-w-[40%] pr-4">
                <Skeleton className="aspect-video w-full rounded-lg" height="100%" />
            </div>
            <div className="min-w-[80%] md:min-w-[40%] pr-4">
                <Skeleton className="aspect-video w-full rounded-lg" height="100%" />
            </div>
             <div className="min-w-[80%] md:min-w-[40%] pr-4">
                <Skeleton className="aspect-video w-full rounded-lg" height="100%" />
            </div>
        </div>
    );
  }

  if (items.length === 0) {
      return (
          <div className="w-full flex items-center justify-center py-12 border border-white/5 bg-white/5 rounded-lg">
              <span className="text-neutral-500 text-sm uppercase tracking-widest">No Projects Found</span>
          </div>
      );
  }

  return (
    <div 
        ref={containerRef}
        className="relative group/carousel w-full overflow-hidden"
    >
        {/* Navigation Arrows - Always Visible, No Hover Hiding */}
        <div className="absolute inset-y-0 left-0 z-30 flex items-center justify-center w-[10%] bg-gradient-to-r from-background to-transparent pointer-events-none">
            <button 
                onClick={() => move(-1)}
                className="pointer-events-auto p-3 rounded-full bg-surface border border-white/10 text-white shadow-xl hover:bg-accent hover:border-accent transition-all active:scale-95"
                aria-label="Previous Project"
            >
                <ChevronLeft size={24} />
            </button>
        </div>

        <div className="absolute inset-y-0 right-0 z-30 flex items-center justify-center w-[10%] bg-gradient-to-l from-background to-transparent pointer-events-none">
             <button 
                onClick={() => move(1)}
                className="pointer-events-auto p-3 rounded-full bg-surface border border-white/10 text-white shadow-xl hover:bg-accent hover:border-accent transition-all active:scale-95"
                aria-label="Next Project"
            >
                <ChevronRight size={24} />
            </button>
        </div>

        {/* Track */}
        <motion.div 
            className="flex w-full py-4"
            animate={controls}
            initial={{ x: `${-index * layout.cardWidth + layout.offset}%` }}
        >
            {displayItems.map((project, i) => (
                <div 
                    key={`${project.id}-${i}`}
                    className="flex-shrink-0 px-3 md:px-4"
                    style={{ 
                        width: `${layout.cardWidth}%`,
                        boxSizing: 'border-box'
                    }}
                >
                    <div onClick={() => !isAnimating && onItemClick(project.id)}>
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

    const currentProject = projects.find(p => p.id === selectedProjectId);
    if (!currentProject) return;

    // Strict category matching for navigation within modal
    const currentCatNorm = normalizeCategory(currentProject.category);
    
    const contextProjects = projects.filter(p => 
      normalizeCategory(p.category) === currentCatNorm
    );

    if (contextProjects.length === 0) return;

    const currentIndex = contextProjects.findIndex(p => p.id === selectedProjectId);
    if (currentIndex === -1) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % contextProjects.length;
    } else {
      newIndex = (currentIndex - 1 + contextProjects.length) % contextProjects.length;
    }

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
            // Robust Filtering: Check both ID (keyword) and Title against Category
            const sectionProjects = isLoading 
                ? [] 
                : projects.filter(p => {
                    const pCat = normalizeCategory(p.category);
                    const sKey = normalizeCategory(section.keyword);
                    const sTitle = normalizeCategory(section.title);
                    
                    // Match against keyword or full title (e.g. "motion" or "motiongraphics")
                    return pCat.includes(sKey) || pCat === sTitle; 
                });

            // Even if empty, we might want to show the section if loading, handled above. 
            // If strictly empty and not loading, we skip.
            if (!isLoading && sectionProjects.length === 0) return null;

            return (
              <div key={section.id} className="relative">
                {/* Section Title */}
                <Reveal width="100%" delay={0.1}>
                  <div className="flex items-center gap-4 mb-8">
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">{section.title}</h3>
                    <div className="h-[1px] flex-1 bg-white/5"></div>
                    <div className="hidden md:flex items-center gap-1 text-xs font-medium text-neutral-500 uppercase tracking-widest">
                       Featured Selection
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