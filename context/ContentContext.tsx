import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteContent } from '../types';
import { defaultContent } from '../utils/defaultContent';
import { fetchGoogleSheetData } from '../utils/googleSheet';

interface ContentContextType {
  content: SiteContent;
  isLoading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const sheetData = await fetchGoogleSheetData();
        setContent(sheetData);
      } catch (e) {
        console.error("Failed to load content source", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <ContentContext.Provider value={{ content, isLoading }}>
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