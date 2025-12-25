import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Mail, 
  User, 
  ArrowUpRight, 
  Play, 
  Calendar,
  Copy,
  Check
} from 'lucide-react';
import { useContent } from '../context/ContentContext';

type MenuType = 'global' | 'project' | 'hero' | 'contact';

interface MenuOption {
  label: string;
  icon: React.ElementType;
  action: () => void;
  variant?: 'default' | 'accent';
}

const ContextMenu: React.FC = () => {
  const { content } = useContent();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [menuType, setMenuType] = useState<MenuType>('global');
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);

  // Helper to handle smooth scrolling using Smooth Scrollbar
  const handleScrollTo = useCallback((id: string) => {
    const element = document.getElementById(id);
    const sb = (window as any).scrollbar;
    
    if (element && sb) {
      sb.scrollIntoView(element, { damping: 0.07, offsetTop: 0 });
    } else if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
    setVisible(false);
  }, []);

  const handleCopyEmail = useCallback(() => {
    navigator.clipboard.writeText(content.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    // Don't close immediately so user sees "Copied!"
    setTimeout(() => setVisible(false), 600); 
  }, [content.contact.email]);

  const menuConfig: Record<MenuType, MenuOption[]> = {
    global: [
      { label: 'View Projects', icon: Briefcase, action: () => handleScrollTo('work') },
      { label: 'About Me', icon: User, action: () => handleScrollTo('about') },
      { label: 'Book a Call', icon: Calendar, action: () => window.open(content.navbar.ctaLink, '_blank') },
      { label: copied ? 'Copied!' : 'Copy Email', icon: copied ? Check : Copy, action: handleCopyEmail },
    ],
    hero: [
      { label: 'View Projects', icon: Briefcase, action: () => handleScrollTo('work') },
      { label: 'Get in Touch', icon: Mail, action: () => handleScrollTo('contact'), variant: 'accent' },
      { label: 'Book a Call', icon: Calendar, action: () => window.open(content.navbar.ctaLink, '_blank') },
    ],
    project: [
      { 
        label: 'Open Project', 
        icon: Play, 
        action: () => {
          if (targetElement) targetElement.click();
          setVisible(false);
        },
        variant: 'accent'
      },
      { label: 'Book a Call', icon: Calendar, action: () => window.open(content.navbar.ctaLink, '_blank') },
      { label: 'View More Work', icon: ArrowUpRight, action: () => handleScrollTo('work') },
    ],
    contact: [
      { label: copied ? 'Copied!' : 'Copy Email', icon: copied ? Check : Copy, action: handleCopyEmail, variant: 'accent' },
      { label: 'Book a Call', icon: Calendar, action: () => window.open(content.navbar.ctaLink, '_blank') },
      { label: 'Back to Top', icon: ArrowUpRight, action: () => handleScrollTo('home') },
    ]
  };

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Allow native menu on inputs/textareas
      if (
        e.target instanceof HTMLElement &&
        (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)
      ) {
        return;
      }

      e.preventDefault();
      setCopied(false);

      const target = e.target as HTMLElement;
      const projectCard = target.closest('[data-context="project"]');
      const heroSection = target.closest('[data-context="hero"]');
      const contactSection = target.closest('[data-context="contact"]');

      if (projectCard) {
        setMenuType('project');
        setTargetElement(projectCard as HTMLElement);
      } else if (heroSection) {
        setMenuType('hero');
      } else if (contactSection) {
        setMenuType('contact');
      } else {
        setMenuType('global');
      }

      // Calculate safe position
      const menuWidth = 200;
      const menuHeight = 250; // Approximate
      let x = e.clientX;
      let y = e.clientY;

      if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 20;
      if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 20;

      setPosition({ x, y });
      setVisible(true);
    };

    const handleClick = () => setVisible(false);
    
    // For smooth-scrollbar, we can't easily rely on window 'scroll' event for closing, 
    // but the context menu is fixed so it doesn't move away. 
    // We can listen to the scrollbar instance instead.
    const sb = (window as any).scrollbar;
    let scrollListener: any;
    if (sb) {
        scrollListener = () => setVisible(false);
        sb.addListener(scrollListener);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVisible(false);
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
      if (sb && scrollListener) sb.removeListener(scrollListener);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          // CHANGED: z-index lowered from [10000] to [9000] to sit below Cursor (11000)
          className="fixed z-[9000] min-w-[180px] bg-surfaceHighlight/90 backdrop-blur-md border border-white/10 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] p-1.5 overflow-hidden"
          style={{ top: position.y, left: position.x }}
        >
          {menuConfig[menuType].map((item, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                item.action();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 group text-left
                ${item.variant === 'accent' 
                  ? 'text-accent hover:bg-accent/10' 
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
            >
              <item.icon size={16} className={item.variant === 'accent' ? 'text-accent' : 'text-neutral-500 group-hover:text-white transition-colors'} />
              <span>{item.label}</span>
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContextMenu;