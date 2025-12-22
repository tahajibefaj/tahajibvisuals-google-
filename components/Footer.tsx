import React from 'react';
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black py-12 border-t border-white/5">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex flex-col items-center md:items-start">
            <span className="font-display font-bold text-lg tracking-widest text-white">
              TAHAJIB <span className="text-neutral-600">VISUALS</span>
            </span>
            <p className="text-neutral-600 text-xs mt-2">© {new Date().getFullYear()} All Rights Reserved.</p>
        </div>

        <div className="flex gap-8">
          <a href="/" className="text-neutral-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
            <Instagram size={24} />
          </a>
          <a href="/" className="text-neutral-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
            <Facebook size={24} />
          </a>
          <a href="/" className="text-neutral-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
            <Twitter size={24} />
          </a>
          <a href="/" className="text-neutral-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
            <Linkedin size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;