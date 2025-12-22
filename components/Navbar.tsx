import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Scrollbar from 'smooth-scrollbar';

const navItems = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

interface NavbarProps {
  isScrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper to handle scrolling with smooth-scrollbar
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    const container = document.getElementById('scroll-container');

    if (element && container) {
      const scrollbar = Scrollbar.get(container);
      if (scrollbar) {
        scrollbar.scrollIntoView(element, {
          offsetTop: 100, // Offset for sticky navbar
          offsetLeft: 0,
        });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md py-4 border-b border-white/5' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <a 
          href="#home" 
          onClick={(e) => handleNavClick(e, '#home')}
          className="z-50 group cursor-pointer"
        >
          <div className="flex flex-col leading-tight">
             <span className="font-display font-bold text-xl tracking-widest text-white group-hover:text-accent transition-colors duration-300">
              TAHAJIB
            </span>
            <span className="text-[0.6rem] tracking-[0.3em] text-neutral-400 uppercase">
              Visuals
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-sm uppercase tracking-widest text-neutral-400 hover:text-white transition-colors duration-300 relative group cursor-pointer"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          <a
            href="https://cal.com/tahajib-efaj-seugbc/calltoexplore"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 border border-white/20 rounded-full text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
          >
            Book a Call
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden z-50 text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-3xl font-display font-bold text-neutral-300 hover:text-accent transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://cal.com/tahajib-efaj-seugbc/calltoexplore"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-8 px-8 py-3 border border-accent text-accent rounded-full text-sm uppercase tracking-widest hover:bg-accent hover:text-black transition-all"
            >
              Book a Call
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;