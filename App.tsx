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
import { ContentProvider } from './context/ContentContext';
import { SkeletonTheme } from 'react-loading-skeleton';
import Scrollbar from 'smooth-scrollbar';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollbar, setScrollbar] = useState<any>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let sb: any;

    if (scrollContainerRef.current) {
      // Initialize smooth-scrollbar
      sb = Scrollbar.init(scrollContainerRef.current, {
        damping: 0.07, // Adjust momentum: lower is smoother/heavier
        renderByPixels: true,
        // Removed delegateTo: document to ensure modals can capture their own scroll events
      });
      
      setScrollbar(sb);

      // Sync Navbar state based on scroll offset
      sb.addListener(({ offset }: { offset: { y: number } }) => {
        setIsScrolled(offset.y > 50);
      });

      // Expose scrollbar instance globally for navigation logic
      (window as any).scrollbar = sb;
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
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <div className="bg-background h-screen w-full flex flex-col text-white selection:bg-accent selection:text-black">
          <CustomCursor />
          <ContextMenu />
          <Navbar isScrolled={isScrolled} scrollbar={scrollbar} />
          
          {/* Scroll Container */}
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