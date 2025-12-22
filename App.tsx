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
import Scrollbar from 'smooth-scrollbar';

function App() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollbar = Scrollbar.init(scrollContainerRef.current, {
        damping: 0.07,
        thumbMinSize: 20,
        renderByPixels: true,
        alwaysShowTracks: false,
        delegateTo: document, // Improves event handling for auto-scroll and inputs
      });

      scrollbar.addListener(({ offset }) => {
        setIsScrolled(offset.y > 50);
      });

      return () => {
        if (scrollbar) scrollbar.destroy();
      };
    }
  }, []);

  return (
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
  );
}

export default App;