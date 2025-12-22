import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative bg-surface w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl border border-white/10 shadow-2xl custom-scrollbar"
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full hover:bg-accent hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Media Section */}
          <div className="w-full lg:w-2/3 bg-black aspect-video lg:aspect-auto min-h-[300px] lg:min-h-[500px] flex items-center justify-center relative overflow-hidden">
             {/* Simulating a video player or high res image */}
             <img 
               src={project.thumbnail} 
               alt={project.title} 
               className="w-full h-full object-cover opacity-80"
             />
             <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-20 h-20 bg-accent/90 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                     <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-black border-b-[10px] border-b-transparent ml-1"></div>
                 </div>
             </div>
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-1/3 p-8 lg:p-10 flex flex-col h-full bg-surface">
            <span className="text-accent text-sm tracking-widest uppercase mb-2">{project.category}</span>
            <h3 className="text-3xl font-display font-bold text-white mb-6 leading-tight">{project.title}</h3>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tools.map((tool) => (
                <span key={tool} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-neutral-300">
                  {tool}
                </span>
              ))}
            </div>

            <div className="space-y-6 text-neutral-400 leading-relaxed mb-auto">
              <p>{project.description}</p>
              <p>
                This project focuses on visual retention, using fast-paced editing techniques combined with smooth motion graphics to keep viewer engagement high throughout the entire duration.
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-white/10">
                <a href="#" className="flex items-center gap-2 text-white hover:text-accent transition-colors font-medium">
                    View Live Project <ExternalLink size={16} />
                </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}