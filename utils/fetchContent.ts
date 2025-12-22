import { supabase } from './supabaseClient';
import { defaultContent } from './defaultContent';
import { SiteContent } from '../types';

export const fetchContent = async (): Promise<SiteContent> => {
  // If Supabase isn't configured, fallback gracefully
  if (!supabase) {
    console.warn("Supabase client not configured. Using default content.");
    return defaultContent;
  }

  try {
    const [textRes, servicesRes, faqsRes] = await Promise.all([
      supabase.from('content_text').select('*'),
      supabase.from('content_services').select('*').order('display_order'),
      supabase.from('content_faqs').select('*').order('display_order'),
    ]);

    if (textRes.error) throw textRes.error;
    if (servicesRes.error) throw servicesRes.error;
    if (faqsRes.error) throw faqsRes.error;

    // Start with a deep copy of default content to ensure structure exists
    const newContent: SiteContent = JSON.parse(JSON.stringify(defaultContent));

    // 1. Map Text Key-Values
    textRes.data.forEach((row: any) => {
      const { section, key, value } = row;
      
      // Check if section exists in our type
      if (newContent[section as keyof SiteContent]) {
        const sectionObj = newContent[section as keyof SiteContent] as any;
        
        // Handle Numeric conversions for About section
        if (section === 'about' && (key === 'yearsExp' || key === 'projectsCompleted')) {
           sectionObj[key] = Number(value);
        } 
        // Handle standard strings
        else if (key in sectionObj) {
           sectionObj[key] = value;
        }
      }
    });

    // 2. Map Services
    // We map the DB ID to the internal ID (1-4) based on index to ensure Icons line up correctly
    if (servicesRes.data.length > 0) {
      newContent.services = servicesRes.data.map((s: any, index: number) => ({
        id: index + 1, // Force ID 1-4 for icon mapping
        title: s.title,
        description: s.description
      }));
    }

    // 3. Map FAQs
    if (faqsRes.data.length > 0) {
      newContent.faq = faqsRes.data.map((f: any) => ({
        question: f.question,
        answer: f.answer
      }));
    }

    return newContent;
  } catch (error) {
    console.error('Error fetching Supabase content:', error);
    return defaultContent;
  }
};