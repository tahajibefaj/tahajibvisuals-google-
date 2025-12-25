import { SiteContent } from '../types';

export const defaultContent: SiteContent = {
  favicon: "/favicon.ico", // Looks for a favicon.ico file in your root folder
  hero: {
    subtitle: "Cinematic Motion & Visuals",
    titleLine1: "TAHAJIB",
    titleLine2: "EFAJ",
    description: "A Video Editor & Motion Graphics Designer crafting high-retention visual experiences. Merging technical precision with cinematic storytelling.",
    ctaText: "View Projects"
  },
  navbar: {
    ctaText: "Book a Call",
    ctaLink: "https://cal.com/tahajib-efaj-seugbc/calltoexplore"
  },
  projects: {
    heading: "Selected Works",
    subheading: "A curation of recent motion design and video editing projects.",
    items: [
      {
        id: 1,
        title: "Neon Cyberpunk Ad",
        category: "Motion Graphics",
        thumbnail: "https://images.unsplash.com/photo-1535242208474-9a2793260ca8?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://www.youtube.com/embed/VLjt-VX8CQI?autoplay=1&rel=0&modestbranding=1",
        description: "A high-energy futuristic advertisement featuring neon aesthetics and glitch effects created in After Effects.",
        tools: ["After Effects", "Blender", "Premiere Pro"],
        breakdown: {
          goal: "Showcase futuristic product features",
          focus: "High-energy glitch transitions",
          result: "Increased click-through rate by 25%"
        }
      },
      {
        id: 2,
        title: "Minimalist Brand Story",
        category: "Video Editing",
        thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&rel=0&modestbranding=1", 
        description: "Clean, corporate storytelling for a tech startup launch. Focus on pacing and sound design.",
        tools: ["Premiere Pro", "DaVinci Resolve"],
        breakdown: {
          goal: "Establish brand trust",
          focus: "Audio mixing & pacing",
          result: "Professional brand image"
        }
      },
      {
        id: 3,
        title: "Urban Fashion Edit",
        category: "Social Media",
        thumbnail: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://www.youtube.com/embed/tVdmQ34_w0c?autoplay=1&rel=0&modestbranding=1",
        description: "Fast-cut Instagram reel for a streetwear brand. Vertical format optimization and trendy transitions.",
        tools: ["Premiere Pro", "CapCut"],
        breakdown: {
          goal: "Maximize viewer retention",
          focus: "Beat-sync editing",
          result: "Viral engagement metrics"
        }
      },
      {
        id: 4,
        title: "Kinetic Typography",
        category: "Motion Graphics",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://www.youtube.com/embed/z4sK6t3yA4I?autoplay=1&rel=0&modestbranding=1",
        description: "Lyric video demonstrating advanced kinetic typography techniques and syncopated motion.",
        tools: ["After Effects"],
        breakdown: {
          goal: "Visualise complex lyrics",
          focus: "Typography animation",
          result: "Immersive audio-visual sync"
        }
      },
    ]
  },
  about: {
    heading: "I tell stories through motion and rhythm.",
    bio1: "I'm Tahajib Efaj, a dedicated video editor and motion graphics designer obsessed with the details. My philosophy is simple: visuals should not just look good—they should feel right.",
    bio2: "Specializing in Premiere Pro and After Effects, I create clean, high-retention content that cuts through the noise. Whether it's a fast-paced social ad or a cinematic brand documentary, I focus on pacing, sound design, and visual hierarchy to ensure your message lands.",
    yearsExp: 4,
    projectsCompleted: 100,
    ctaText: "Ready?",
    ctaLink: "https://cal.com/tahajib-efaj-seugbc/calltoexplore",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
  },
  services: [
    {
      id: 1,
      title: "Video Editing",
      description: "Professional cutting, color grading, and sound design to turn raw footage into compelling narratives."
    },
    {
      id: 2,
      title: "Motion Graphics",
      description: "Custom animations, kinetic typography, and visual effects that add polish and engagement."
    },
    {
      id: 3,
      title: "Short-Form Content",
      description: "High-energy edits optimized for TikTok, Reels, and Shorts to maximize retention and reach."
    },
    {
      id: 4,
      title: "Brand & Social",
      description: "Cohesive video content strategies that align with your brand identity across all platforms."
    }
  ],
  contact: {
    heading: "Let's create something extraordinary.",
    subheading: "Ready to elevate your content? Fill out the form, and let's discuss how we can bring your vision to life.",
    email: "contact.tahajib@gmail.com"
  },
  socials: {
    instagram: "#",
    facebook: "#",
    twitter: "#",
    linkedin: "#"
  },
  faq: [
    {
      question: "Do you guarantee results?",
      answer: "In most cases, yes. I’ve worked with clients across different niches and consistently delivered strong results. While outcomes can depend on factors beyond editing, the quality, strategy, and effort on my end are always solid."
    },
    {
      question: "How fast will I get my videos?",
      answer: "It depends on the type and length of the video. Short-form content usually takes around 2–3 days. Longer videos, around 7–10 minutes, typically take 7–9 days. I’ll always confirm timelines before starting."
    },
    {
      question: "Can I request specific video themes or styles?",
      answer: "Absolutely. If you have a specific style, reference, or brand direction in mind, I’ll tailor the video to match it. Your vision always comes first."
    },
    {
      question: "Do you offer any free revisions?",
      answer: "Yes. I offer up to 3 revisions at no extra cost. If you need additional changes after that, there may be a small extra charge."
    }
  ]
};