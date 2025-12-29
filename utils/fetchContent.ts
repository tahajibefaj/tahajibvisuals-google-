import { supabase } from './supabaseClient';
import { defaultContent } from './defaultContent';
import { SiteContent, Project } from '../types';

export const fetchContent = async (): Promise<SiteContent> => {
  // If Supabase isn't configured, fallback gracefully
  if (!supabase) {
    return defaultContent;
  }

  // Fetch links, stats, AND projects
  // We allow errors to bubble up so ContentContext can handle the error state
  const [linksRes, statsRes, projectsRes] = await Promise.all([
    supabase.from('links').select('*'),
    supabase.from('stats').select('*'),
    supabase.from('projects').select('*').order('display_order', { ascending: true }),
  ]);

  if (linksRes.error) throw linksRes.error;
  if (statsRes.error) throw statsRes.error;
  if (projectsRes.error) throw projectsRes.error;

  // Start with default content
  const newContent: SiteContent = JSON.parse(JSON.stringify(defaultContent));

  // 1. Map Links (Booking, About Image, Socials, Favicon)
  if (linksRes.data) {
    linksRes.data.forEach((item: any) => {
      if (item.key === 'booking') {
        newContent.navbar.ctaLink = item.url;
        newContent.about.ctaLink = item.url;
      } else if (item.key === 'about_image') {
        newContent.about.image = item.url;
      } else if (item.key === 'favicon') {
        newContent.favicon = item.url;
      } else if (item.key in newContent.socials) {
        newContent.socials[item.key as keyof typeof newContent.socials] = item.url;
      }
    });
  }

  // 2. Map Stats
  if (statsRes.data) {
    statsRes.data.forEach((item: any) => {
      if (item.key === 'satisfied_clients') {
        newContent.about.satisfiedClients = item.value;
      } else if (item.key === 'projects_completed') {
        newContent.about.projectsCompleted = item.value;
      }
    });
  }

  // 3. Map Projects
  if (projectsRes.data && projectsRes.data.length > 0) {
    const dbProjects: Project[] = projectsRes.data.map((item: any) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      thumbnail: item.thumbnail,
      videoUrl: item.video_url, // Maps snake_case SQL to camelCase prop
      description: item.description,
      tools: item.tools,
    }));
    newContent.projects.items = dbProjects;
  }

  return newContent;
};