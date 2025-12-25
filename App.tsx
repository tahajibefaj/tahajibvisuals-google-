import React, { useEffect, useState } from 'react';
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
import { ContentProvider } from './context/ContentContext';
import { SkeletonTheme } from 'react-loading-skeleton';
import Lenis from 'lenis';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Initialize Lenis for premium smooth scrolling + native features
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // RAF Loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Expose lenis globally for navigation in other components
    (window as any).lenis = lenis;

    // Native scroll listener works now
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      lenis.destroy();
      window.removeEventListener('scroll', handleScroll);
      (window as any).lenis = undefined;
    };
  }, []);

  return (
    <ContentProvider>
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <div className="bg-background w-full min-h-screen flex flex-col text-white selection:bg-accent selection:text-black">
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
      </SkeletonTheme>
    </ContentProvider>
  );
}

export default App;