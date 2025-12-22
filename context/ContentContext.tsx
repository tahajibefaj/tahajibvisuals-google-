import React, { createContext, useContext, useState } from 'react';
import { SiteContent } from '../types';
import { defaultContent } from '../utils/defaultContent';

interface ContentContextType {
  content: SiteContent;
  isLoading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use defaultContent directly without fetching
  const [content] = useState<SiteContent>(defaultContent);

  return (
    <ContentContext.Provider value={{ content, isLoading: false }}>
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