import React, { useEffect, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const ParticlesBackground: React.FC = () => {
  const [init, setInit] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // 1. Device & Accessibility Guards
    // We check this on mount to ensure we are client-side
    const mediaTouch = window.matchMedia('(pointer: coarse)');
    const mediaReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Only render if it is a desktop device (fine pointer) AND user hasn't requested reduced motion
    if (!mediaTouch.matches && !mediaReduced.matches) {
        setShouldRender(true);
        
        // Initialize the tsparticles engine (using slim bundle for performance)
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }
  }, []);

  // 2. Configuration for "Cinematic/Premium" Feel
  const options = useMemo(
    () => ({
      fpsLimit: 120, // Support high refresh rate monitors
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "attract", // Creates the magnetic "antigravity" pull
            parallax: {
                enable: true,
                force: 40,
                smooth: 10
            }
          },
        },
        modes: {
          attract: {
            distance: 250, // Interaction radius
            duration: 0.4,
            factor: 3, // Strength of the pull
            speed: 1,
            easing: "ease-out-quad"
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        number: {
          density: {
            enable: false,
          },
          value: 30, // Strict limit: 30 particles
        },
        opacity: {
          value: { min: 0.1, max: 0.3 }, // Subtle premium transparency
          animation: {
            enable: true,
            speed: 0.5,
            sync: false,
          },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 2, max: 4 }, // Small, refined size
        },
        move: {
          enable: true,
          direction: "none", // Free-floating
          random: false,
          speed: 0.6, // Slow, restrained movement
          straight: false,
          outModes: "out", // Particles flow out and reappear
        },
      },
      detectRetina: true,
      fullScreen: { enable: false }, // Contain within parent div
      style: { position: "absolute" }
    }),
    [],
  );

  // Don't render anything if disabled (mobile) or not initialized
  if (!shouldRender || !init) return null;

  return (
    <div className="absolute inset-0 z-[1] pointer-events-none">
      <Particles
        id="tsparticles"
        // @ts-ignore - options type allows generic objects
        options={options}
        className="w-full h-full"
      />
    </div>
  );
};

export default ParticlesBackground;