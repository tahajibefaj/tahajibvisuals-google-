import React from 'react';
import { useContent } from '../context/ContentContext';

const Footer: React.FC = () => {
  const { content } = useContent();

  return (
    <footer className="bg-black pt-12 pb-24 lg:pb-12 border-t border-white/5">
      <div className="container mx-auto px-6 flex flex-col items-center text-center gap-4">
        
        <div className="flex flex-col items-center">
            <span className="font-logo font-bold text-xl md:text-2xl tracking-widest text-white">
              {content.hero.titleLine1} <span className="text-neutral-600">VISUALS</span>
            </span>
            <p className="text-neutral-600 text-xs mt-2">© {new Date().getFullYear()} All Rights Reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;