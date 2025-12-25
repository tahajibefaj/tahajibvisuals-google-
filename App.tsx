import React, { useEffect, useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import ContextMenu from './components/ContextMenu';
import Protection from './components/Protection'; 
import { ContentProvider, useContent } from './context/ContentContext';
import { SkeletonTheme } from 'react-loading-skeleton';
import Scrollbar from 'smooth-scrollbar';

// Helper component to update Favicon dynamically
const FaviconUpdater = () => {
  const { content } = useContent();

  useEffect(() => {
    if (content.favicon) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = content.favicon;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = content.favicon;
        document.head.appendChild(newLink);
      }
    }
  }, [content.favicon]);

  return null;
};

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollbar, setScrollbar] = useState<any>(null);

  useEffect(() => {
    let sb: any;

    if (scrollContainerRef.current) {
      // Initialize smooth-scrollbar
      sb = Scrollbar.init(scrollContainerRef.current, {
        damping: 0.07, // Adjust momentum: lower is smoother/heavier
        renderByPixels: true,
        continuousScrolling: false,
        alwaysShowTracks: false,
      });

      setScrollbar(sb);
      
      // Expose scrollbar globally for navigation
      (window as any).scrollbar = sb;

      // Sync Navbar state based on scroll offset
      sb.addListener(({ offset }: { offset: { y: number } }) => {
        setIsScrolled(offset.y > 50);
      });
    }

    return () => {
      if (sb) {
        sb.destroy();
        (window as any).scrollbar = undefined;
      }
    };
  }, []);

  return (
    <ContentProvider>
      <FaviconUpdater />
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <div className="bg-background h-screen w-full flex flex-col text-white selection:bg-accent selection:text-black">
          {/* Inject styling for the modal's native scrollbar to keep it subtle/hidden until needed */}
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 4px; /* Very thin */
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(139, 92, 246, 0.5); /* Accent on hover */
            }
            /* Firefox Scrollbar Support */
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
            }
          `}</style>

          <Protection />
          <CustomCursor />
          <ContextMenu />
          <Navbar isScrolled={isScrolled} />
          
          {/* Main Scroll Container Wrapper */}
          <div ref={scrollContainerRef} className="flex-1 w-full h-full overflow-hidden">
            <main className="w-full">
              <Hero />
              <Projects />
              <About />
              <Services />
              <Contact />
              <FAQ />
              <Footer />
            </main>
          </div>
        </div>
      </SkeletonTheme>
    </ContentProvider>
  );
}

export default App;