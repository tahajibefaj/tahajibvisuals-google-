import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from './Reveal';
import ProjectModal from './ProjectModal';
import { Project } from '../types';
import { ArrowUpRight } from 'lucide-react';

const projects: Project[] = [
  {
    id: 1,
    title: "Neon Cyberpunk Ad",
    category: "Motion Graphics",
    thumbnail: "https://picsum.photos/800/600?random=1",
    description: "A high-energy futuristic advertisement featuring neon aesthetics and glitch effects created in After Effects.",
    tools: ["After Effects", "Blender", "Premiere Pro"]
  },
  {
    id: 2,
    title: "Minimalist Brand Story",
    category: "Video Editing",
    thumbnail: "https://picsum.photos/800/600?random=2",
    description: "Clean, corporate storytelling for a tech startup launch. Focus on pacing and sound design.",
    tools: ["Premiere Pro", "DaVinci Resolve"]
  },
  {
    id: 3,
    title: "Urban Fashion Edit",
    category: "Social Media",
    thumbnail: "https://picsum.photos/800/600?random=3",
    description: "Fast-cut Instagram reel for a streetwear brand. Vertical format optimization and trendy transitions.",
    tools: ["Premiere Pro", "CapCut"]
  },
  {
    id: 4,
    title: "Kinetic Typography",
    category: "Motion Graphics",
    thumbnail: "https://picsum.photos/800/600?random=4",
    description: "Lyric video demonstrating advanced kinetic typography techniques and syncopated motion.",
    tools: ["After Effects"]
  },
];

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="work" className="py-24 bg-surface relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white">Selected Works</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-neutral-400 mt-4 md:mt-0 max-w-sm text-right">
              A curation of recent motion design and video editing projects.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Reveal key={project.id} width="100%" delay={index * 0.1}>
              <motion.div
                className="group relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer cursor-hover-trigger"
                onClick={() => setSelectedProject(project)}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
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
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            isOpen={!!selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;