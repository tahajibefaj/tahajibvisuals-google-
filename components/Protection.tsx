import React, { useEffect } from 'react';

const Protection: React.FC = () => {
  useEffect(() => {
    // 1. Disable Specific Key Combinations (DevTools, Source, Save)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Block Ctrl+Shift+I (DevTools), Ctrl+Shift+J (Console), Ctrl+Shift+C (Inspect Element)
      if (
        (e.ctrlKey || e.metaKey) && 
        e.shiftKey && 
        (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'i' || e.key === 'j' || e.key === 'c')
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Block Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Block Ctrl+S (Save Page)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // 2. Disable Image Dragging globally (Prevents saving images by dragging)
    const handleDragStart = (e: DragEvent) => {
      if (e.target instanceof HTMLImageElement) {
        e.preventDefault();
      }
    };

    // Add Listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    // 3. Console Warning for curious developers
    const showConsoleWarning = () => {
      console.clear();
      console.log(
        '%cSTOP!',
        'color: #8b5cf6; font-size: 50px; font-weight: bold; text-shadow: 2px 2px black;'
      );
      console.log(
        '%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a feature or "hack" someone\'s account, it is a scam.',
        'font-size: 16px; color: #ffffff;'
      );
      console.log(
        '%c© Tahajib Visuals. All Rights Reserved.',
        'font-size: 14px; color: #888888;'
      );
    };
    
    showConsoleWarning();

    // Re-show warning if console is cleared
    window.addEventListener('focus', showConsoleWarning);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('focus', showConsoleWarning);
    };
  }, []);

  return null; // This component renders nothing visually
};

export default Protection;