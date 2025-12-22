import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Play } from 'lucide-react';
import { Project } from '../types';
import clsx from 'clsx';

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

  const getEmbedUrl = (url?: string) => {
    const defaultUrl = "https://www.youtube.com/embed/VLjt-VX8CQI";
    const targetUrl = url || defaultUrl;
    // Strip existing params to ensure clean slate and correct configuration
    const baseUrl = targetUrl.split('?')[0];
    // Added modestbranding, rel=0, controls=1, playsinline=1, fs=1
    return `${baseUrl}?autoplay=1&rel=0&modestbranding=1&playsinline=1&controls=1&showinfo=0&fs=1`;
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
           LEFT COLUMN: Media
           - Flex center
           - Overflow hidden
           - Fixed height on mobile, full height on desktop
        */}
        <div className="w-full h-[35vh] lg:h-full bg-black relative flex items-center justify-center overflow-hidden order-1 lg:order-none">
             
             {/* VIDEO WRAPPER (MANDATORY 16:9 CONTAINMENT) */}
             <div 
                className="relative bg-black shadow-2xl flex items-center justify-center overflow-hidden"
                style={{
                   width: 'auto',
                   height: 'auto',
                   maxWidth: '100%',
                   maxHeight: '100%',
                   aspectRatio: '16 / 9'
                }}
             >
               {!isPlaying ? (
                 <>
                   <img 
                     src={project.thumbnail} 
                     alt={project.title} 
                     className="absolute inset-0 w-full h-full object-cover opacity-80"
                   />
                   <div className="absolute inset-0 flex items-center justify-center">
                       <button 
                          onClick={() => setIsPlaying(true)}
                          className="w-20 h-20 bg-accent/90 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform group z-10"
                       >
                           <Play size={32} fill="white" className="text-white ml-1" />
                       </button>
                   </div>
                 </>
               ) : (
                  <iframe 
                    src={getEmbedUrl(project.videoUrl)} 
                    title={project.title}
                    className="w-full h-full block border-none overflow-hidden"
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen" 
                    allowFullScreen
                  ></iframe>
               )}
             </div>
        </div>

        {/* 
           RIGHT COLUMN: Text Content
           - Scrolled vertically
           - No horizontal scroll
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