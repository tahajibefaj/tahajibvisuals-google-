import React, { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import AdminPanel from './components/AdminPanel';
import { ContentProvider } from './context/ContentContext';
import Scrollbar from 'smooth-scrollbar';

function App() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for admin route hash
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current && !isAdmin) {
      const scrollbar = Scrollbar.init(scrollContainerRef.current, {
        damping: 0.07,
        thumbMinSize: 20,
        renderByPixels: true,
        alwaysShowTracks: false,
        delegateTo: document,
      });

      scrollbar.addListener(({ offset }) => {
        setIsScrolled(offset.y > 50);
      });

      return () => {
        if (scrollbar) scrollbar.destroy();
      };
    }
  }, [isAdmin]);

  if (isAdmin) {
    return (
      <ContentProvider>
        <CustomCursor />
        <AdminPanel />
      </ContentProvider>
    );
  }

  return (
    <ContentProvider>
      <div className="bg-background min-h-screen text-white selection:bg-accent selection:text-black">
        <CustomCursor />
        <Navbar isScrolled={isScrolled} />
        
        {/* Scroll Wrapper */}
        <div 
          ref={scrollContainerRef} 
          id="scroll-container" 
          style={{ height: '100vh', width: '100%', overflow: 'hidden' }}
        >
          <div className="scroll-content">
            <Hero />
            <Projects />
            <About />
            <Services />
            <Contact />
            <FAQ />
            <Footer />
          </div>
        </div>
      </div>
    </ContentProvider>
  );
}

export default App;