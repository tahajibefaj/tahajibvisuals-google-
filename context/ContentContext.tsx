import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent } from '../types';
import { defaultContent } from '../utils/defaultContent';

interface ContentContextType {
  content: SiteContent;
  updateContent: (newContent: SiteContent) => void;
  resetContent: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    // Load content from localStorage on mount to persist changes
    const savedContent = localStorage.getItem('siteContent');
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent);
        // Basic check to ensure structure matches default (merge to avoid breaking if new fields added)
        setContent((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to load content", e);
      }
    }
  }, []);

  const updateContent = (newContent: SiteContent) => {
    setContent(newContent);
    localStorage.setItem('siteContent', JSON.stringify(newContent));
  };

  const resetContent = () => {
    if (window.confirm("Are you sure you want to reset all content to default?")) {
      setContent(defaultContent);
      localStorage.removeItem('siteContent');
    }
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, resetContent }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};