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

export interface SiteContent {
  hero: {
    subtitle: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    ctaText: string;
  };
  navbar: {
    ctaText: string;
    ctaLink: string;
  };
  projects: {
      heading: string;
      subheading: string;
  };
  about: {
    heading: string;
    bio1: string;
    bio2: string;
    yearsExp: number;
    projectsCompleted: number;
    ctaText: string;
    ctaLink: string;
  };
  services: {
    id: number;
    title: string;
    description: string;
  }[];
  contact: {
    heading: string;
    subheading: string;
    email: string;
  };
  socials: {
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin: string;
  };
  faq: {
    question: string;
    answer: string;
  }[];
}