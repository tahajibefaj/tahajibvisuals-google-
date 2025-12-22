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
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-center py-4">
      <div 
        className="
          flex items-center justify-between 
          bg-neutral-900/80 backdrop-blur-xl border border-white/10 
          rounded-full px-6 py-3 shadow-2xl shadow-black/50
          w-[92%] md:w-auto gap-4 md:min-w-[600px]
        "
      >
        {/* Logo */}
        <a 
          href="#home" 
          onClick={(e) => handleNavClick(e, '#home')}
          className="z-50 group cursor-pointer flex-shrink-0"
        >
          <div className="flex flex-col leading-tight">
             <span className="font-display font-bold text-lg tracking-widest text-white group-hover:text-accent transition-colors duration-300">
              TAHAJIB
            </span>
            <span className="text-[0.6rem] tracking-[0.3em] text-neutral-400 uppercase group-hover:text-white transition-colors duration-300">
              Visuals
            </span>
          </div>
        </a>

        {/* Desktop Nav - Pill Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="px-5 py-2 rounded-full text-xs uppercase tracking-widest text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:block flex-shrink-0">
          <a
            href="https://cal.com/tahajib-efaj-seugbc/calltoexplore"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all duration-300 block"
          >
            Book a Call
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden z-50 text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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