import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, Play, ChevronDown, ChevronLeft, ChevronRight, Hand } from 'lucide-react';
import { Project } from '../types';
import clsx from 'clsx';

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black border border-white/20 text-white text-[10px] rounded whitespace-nowrap z-50 pointer-events-none"
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const getToolDescription = (tool: string) => {
    const map: Record<string, string> = {
        "After Effects": "Visual effects & Motion Graphics",
        "Premiere Pro": "Professional Video Editing",
        "DaVinci Resolve": "Color Grading & Editing",
        "Blender": "3D Modeling & Animation",
        "CapCut": "Short-form Social Editing",
        "Photoshop": "Image Composition",
        "Illustrator": "Vector Graphics"
    };
    return map[tool] || "Creative Software";
};

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose, onNext, onPrev }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  
  // Touch Swipe Logic State
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);
  const [touchEnd, setTouchEnd] = useState<{x: number, y: number} | null>(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    if (isOpen) {
        setIsPlaying(false);
        setIsBreakdownOpen(false);
        // Reset hint visibility on open, but set a timer to auto-hide it
        setShowSwipeHint(true);
        const timer = setTimeout(() => setShowSwipeHint(false), 4000);
        return () => clearTimeout(timer);
    }
  }, [project.id, isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNext = () => {
    setDirection(1);
    if (showSwipeHint) setShowSwipeHint(false);
    onNext?.();
  };

  const handlePrev = () => {
    setDirection(-1);
    if (showSwipeHint) setShowSwipeHint(false);
    onPrev?.();
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isOpen) return;
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowRight' && onNext) handleNext();
        if (e.key === 'ArrowLeft' && onPrev) handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  // Touch Event Handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    
    // Ignore swipe if vertical scroll is dominant (user is reading description)
    if (Math.abs(distanceY) > Math.abs(distanceX)) return;
    
    if (distanceX > minSwipeDistance) handleNext(); // Swipe Left -> Next
    if (distanceX < -minSwipeDistance) handlePrev(); // Swipe Right -> Prev
  };

  if (!isOpen) return null;

  const getEmbedUrl = (url?: string) => {
    if (!url) return "https://www.youtube.com/embed/VLjt-VX8CQI";
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=)|(shorts\/))([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[8].length === 11) ? match[8] : null;

    if (videoId) {
         return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&showinfo=0&fs=1`;
    }
    return url; 
  };

  const breakdown = project.breakdown || {
    goal: "Create a compelling visual narrative.",
    focus: "Retention and pacing.",
    result: "High engagement and clarity."
  };

  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 200 : -200,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
      />
      
      {/* Swipe Hint (Mobile Only) */}
      <AnimatePresence>
        {showSwipeHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="lg:hidden absolute bottom-8 left-1/2 -translate-x-1/2 z-[110] pointer-events-none"
          >
            <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl">
                <Hand size={14} className="text-accent animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-white/80">Swipe to navigate</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
            key={project.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="relative bg-surface rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col lg:grid lg:grid-cols-[1fr_420px]"
            style={{
                height: 'min(90vh, 900px)',
                width: 'min(90vw, 1400px)',
                maxHeight: '90vh',
                maxWidth: '1400px',
                touchAction: 'pan-y' // Allows vertical scroll but captures horizontal swipes in JS
            }}
            onClick={(e) => e.stopPropagation()} 
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full hover:bg-accent hover:text-black transition-colors"
            >
            <X size={24} />
            </button>

            {/* Navigation Arrows (Desktop) */}
            <button 
                onClick={handlePrev}
                className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-black/50 rounded-full hover:bg-white hover:text-black transition-all"
            >
                <ChevronLeft size={24} />
            </button>
            <button 
                onClick={handleNext}
                className="hidden lg:flex absolute right-[440px] top-1/2 -translate-y-1/2 z-50 p-3 bg-black/50 rounded-full hover:bg-white hover:text-black transition-all"
            >
                <ChevronRight size={24} />
            </button>

            {/* LEFT COLUMN: Video Area */}
            <div className="w-full h-[40vh] lg:h-full bg-black relative flex items-center justify-center overflow-hidden order-1 lg:order-none">
                <div className="relative w-full aspect-video bg-black shadow-2xl flex items-center justify-center">
                {!isPlaying ? (
                    <>
                    <img 
                        src={project.thumbnail} 
                        alt={project.title} 
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <button 
                            onClick={() => setIsPlaying(true)}
                            className="w-20 h-20 bg-accent/90 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform group shadow-[0_0_30px_rgba(139,92,246,0.4)]"
                        >
                            <Play size={32} fill="white" className="text-white ml-1" />
                        </button>
                    </div>
                    </>
                ) : (
                    <iframe 
                        src={getEmbedUrl(project.videoUrl)} 
                        title={project.title}
                        className="absolute inset-0 w-full h-full border-none"
                        allow="autoplay; encrypted-media; picture-in-picture; fullscreen" 
                        allowFullScreen
                    ></iframe>
                )}
                </div>
            </div>

            {/* RIGHT COLUMN: Text Content */}
            <div className="w-full h-full bg-surface flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar border-t lg:border-t-0 lg:border-l lg:border-white/5 relative z-10 order-2 lg:order-none">
                <div className="p-8 lg:p-10 lg:pt-16">
                    <span className="text-accent text-sm tracking-widest uppercase mb-2 block">{project.category}</span>
                    <h3 className="text-3xl font-display font-bold text-white mb-6 leading-tight">{project.title}</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                    {project.tools.map((tool) => (
                        <Tooltip key={tool} text={getToolDescription(tool)}>
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-neutral-300 hover:border-white/40 transition-colors cursor-help">
                            {tool}
                            </span>
                        </Tooltip>
                    ))}
                    </div>

                    <div className="space-y-6 text-neutral-400 leading-relaxed">
                        <p>{project.description}</p>
                        {/* Micro Project Breakdown Toggle */}
                        <div className="border border-white/5 rounded-lg overflow-hidden bg-black/20 mt-6">
                            <button 
                                onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
                                className="w-full flex items-center justify-between p-4 text-xs uppercase tracking-widest font-semibold text-neutral-300 hover:text-white transition-colors"
                            >
                                <span>Project Breakdown</span>
                                <ChevronDown size={16} className={clsx("transition-transform duration-300", isBreakdownOpen && "rotate-180")} />
                            </button>
                            <AnimatePresence>
                                {isBreakdownOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="px-4 pb-4"
                                    >
                                        <ul className="space-y-3 pt-2 border-t border-white/5">
                                            <li className="flex flex-col gap-1">
                                                <span className="text-accent text-[10px] uppercase tracking-wider">Goal</span>
                                                <span className="text-sm text-white">{breakdown.goal}</span>
                                            </li>
                                            <li className="flex flex-col gap-1">
                                                <span className="text-accent text-[10px] uppercase tracking-wider">Editing Focus</span>
                                                <span className="text-sm text-white">{breakdown.focus}</span>
                                            </li>
                                            <li className="flex flex-col gap-1">
                                                <span className="text-accent text-[10px] uppercase tracking-wider">Result</span>
                                                <span className="text-sm text-white">{breakdown.result}</span>
                                            </li>
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
            
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body
  );
};

export default ProjectModal;