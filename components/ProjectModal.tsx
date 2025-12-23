import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Play } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isOpen) setIsPlaying(false);
  }, [isOpen]);

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

  if (!isOpen) return null;

  /**
   * ROBUST YOUTUBE URL PARSER
   * Converts Watch, Shorts, and Short-links to Embed format.
   */
  const getEmbedUrl = (url?: string) => {
    if (!url) return "https://www.youtube.com/embed/VLjt-VX8CQI";
    
    // Regex to capture the video ID from:
    // 1. youtube.com/watch?v=ID
    // 2. youtube.com/embed/ID
    // 3. youtube.com/shorts/ID
    // 4. youtu.be/ID
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=)|(shorts\/))([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[8].length === 11) ? match[8] : null;

    if (videoId) {
         return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&controls=1&showinfo=0&fs=1`;
    }
    
    // Fallback: Return original if it looks like an embed, or default
    return url.includes('embed') ? url : "https://www.youtube.com/embed/VLjt-VX8CQI"; 
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
      
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.98 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative bg-surface rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col lg:grid lg:grid-cols-[1fr_420px]"
        style={{
            height: 'min(90vh, 900px)',
            width: 'min(90vw, 1400px)',
            maxHeight: '90vh',
            maxWidth: '1400px'
        }}
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full hover:bg-accent hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        {/* 
           LEFT COLUMN: Video Area
           - Flexbox centers content.
           - Overflow hidden prevents sliders.
        */}
        <div className="w-full h-[40vh] lg:h-full bg-black relative flex items-center justify-center overflow-hidden order-1 lg:order-none">
             
             {/* 
                VIDEO WRAPPER (16:9 ENFORCED)
                - 'w-full aspect-video' enforces ratio based on width.
                - 'max-h-full' ensures it fits vertically if container is short.
                - 'relative' allows absolute positioning of iframe.
             */}
             <div className="relative w-full aspect-video max-h-full mx-auto bg-black shadow-2xl">
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
                          className="w-20 h-20 bg-accent/90 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform group"
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
                    style={{ cursor: 'none' }} /* Force hide cursor */
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen" 
                    allowFullScreen
                  ></iframe>
               )}
             </div>
        </div>

        {/* 
           RIGHT COLUMN: Text Content
           - Only THIS column scrolls vertically.
           - No horizontal scroll.
        */}
        <div className="w-full h-full bg-surface flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar border-t lg:border-t-0 lg:border-l lg:border-white/5 relative z-10 order-2 lg:order-none">
            <div className="p-8 lg:p-10 lg:pt-16">
                <span className="text-accent text-sm tracking-widest uppercase mb-2 block">{project.category}</span>
                <h3 className="text-3xl font-display font-bold text-white mb-6 leading-tight">{project.title}</h3>
                
                <div className="flex flex-wrap gap-2 mb-8">
                {project.tools.map((tool) => (
                    <span key={tool} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-neutral-300">
                    {tool}
                    </span>
                ))}
                </div>

                <div className="space-y-6 text-neutral-400 leading-relaxed">
                <p>{project.description}</p>
                {/* Static description for layout retention */}
                <p>
                    This project focuses on visual retention, using fast-paced editing techniques combined with smooth motion graphics to keep viewer engagement high throughout the entire duration.
                </p>
                </div>
            </div>
        </div>
          
      </motion.div>
    </div>,
    document.body
  );
};

export default ProjectModal;