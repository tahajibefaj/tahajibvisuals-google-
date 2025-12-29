import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SiteContent } from '../types';
import { defaultContent } from '../utils/defaultContent';
import { fetchContent } from '../utils/fetchContent';

interface ContentContextType {
  content: SiteContent;
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with default content so the site renders immediately (SSR-friendly)
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const dbContent = await fetchContent();
      setContent(dbContent);
    } catch (e) {
      console.error("Failed to load content", e);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <ContentContext.Provider value={{ content, isLoading, isError, retry: loadData }}>
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