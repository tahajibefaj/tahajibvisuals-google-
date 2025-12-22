import React from 'react';

export interface Project {
  id: number;
  title: string;
  category: string;
  thumbnail: string;
  videoUrl?: string; // For embed
  description: string;
  tools: string[];
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
}

export interface NavItem {
  label: string;
  href: string;
}