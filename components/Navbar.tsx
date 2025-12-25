import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import clsx from 'clsx';

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
  const [ctaLabel, setCtaLabel] = useState("");
  const { content } = useContent();

  // Smart CTA Text Logic using Scrollbar listener
  useEffect(() => {
    // Set initial
    setCtaLabel(content.navbar.ctaText);

    // Function to calculate CTA based on offset
    const checkScroll = (y: number) => {
        const projects = document.getElementById('work');
        const about = document.getElementById('about');
        const contact = document.getElementById('contact');
        
        let newLabel = content.navbar.ctaText;

        // Use standard element offsets. 
        // Note: smooth-scrollbar translates the content, but offsetTop stays static relative to parent.
        if (contact && y >= contact.offsetTop - 500) {
            newLabel = "Book a Call";
        } else if (about && y >= about.offsetTop - 300) {
            newLabel = "Let's Talk";
        } else if (projects && y >= projects.offsetTop - 300) {
            newLabel = "Start Project";
        } else {
             newLabel = "Book a Call";
        }
        
        setCtaLabel(newLabel);
    };

    // If scrollbar exists, use its listener
    const sb = (window as any).scrollbar;
    let listener: any;

    if (sb) {
        listener = ({ offset }: { offset: { y: number } }) => {
            checkScroll(offset.y);
        };
        sb.addListener(listener);
        // Initial check
        checkScroll(sb.offset.y);
    } else {
        // Fallback for native scroll (if JS loads late)
        const handleNativeScroll = () => checkScroll(window.scrollY);
        window.addEventListener('scroll', handleNativeScroll);
        return () => window.removeEventListener('scroll', handleNativeScroll);
    }

    return () => {
        if (sb && listener) {
            sb.removeListener(listener);
        }
    };
  }, [content.navbar.ctaText]);


  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    // Use Smooth Scrollbar if available
    const sb = (window as any).scrollbar;
    
    if (element && sb) {
        sb.scrollIntoView(element, {
            damping: 0.07,
            offsetTop: 0,
        });
    } else if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-center py-4 pointer-events-none">
      <div 
        className={clsx(
          "pointer-events-auto flex items-center justify-between",
          "bg-neutral-900/80 backdrop-blur-xl border border-white/10",
          "rounded-full px-6 py-3 shadow-2xl shadow-black/50",
          "w-[92%] md:w-auto gap-4 md:min-w-[600px]"
        )}
      >
        {/* Logo */}
        <a 
          href="#home" 
          onClick={(e) => handleNavClick(e, '#home')}
          className="z-50 group cursor-pointer flex-shrink-0"
        >
          <div className="flex flex-col leading-tight">
             <span className="font-logo font-bold text-lg tracking-widest text-white group-hover:text-accent transition-colors duration-300">
              {content.hero.titleLine1}
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
            href={content.navbar.ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all duration-300 block w-[160px] text-center whitespace-nowrap"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={ctaLabel} // Triggers animation when text changes
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                {ctaLabel || content.navbar.ctaText}
              </motion.span>
            </AnimatePresence>
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
            className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center gap-8 md:hidden pointer-events-auto"
          >
            {/* Explicit Exit Button for Mobile Menu */}
            <button
              className="absolute top-8 right-8 text-neutral-400 hover:text-white p-2 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={32} />
            </button>

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
              href={content.navbar.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-8 px-8 py-3 border border-accent text-accent rounded-full text-sm uppercase tracking-widest hover:bg-accent hover:text-black transition-all"
            >
              {content.navbar.ctaText}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;