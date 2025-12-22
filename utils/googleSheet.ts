import { SiteContent } from '../types';
import { defaultContent } from './defaultContent';

// PASTE YOUR PUBLISHED GOOGLE SHEET CSV LINK HERE
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR6x_J6x_J6x_J6x_J6x_J6x/pub?output=csv"; 

// Helper to handle CSV parsing (respecting quotes)
const parseCSV = (text: string) => {
  const rows = [];
  let currentRow = [];
  let currentVal = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentVal += '"';
        i++; // Skip next quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentVal += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentVal.trim());
        currentVal = '';
      } else if (char === '\n' || char === '\r') {
        currentRow.push(currentVal.trim());
        if (currentRow.length > 0) rows.push(currentRow);
        currentRow = [];
        currentVal = '';
        if (char === '\r' && nextChar === '\n') i++;
      } else {
        currentVal += char;
      }
    }
  }
  return rows;
};

export const fetchGoogleSheetData = async (): Promise<SiteContent> => {
  try {
    // If user hasn't replaced the URL yet, return default
    if (GOOGLE_SHEET_CSV_URL.includes("docs.google.com") === false) {
      console.warn("Google Sheet URL not set.");
      return defaultContent;
    }

    const response = await fetch(GOOGLE_SHEET_CSV_URL);
    const text = await response.text();
    const rows = parseCSV(text); // Use robust parser

    // Deep copy default content to serve as a base
    const newContent = JSON.parse(JSON.stringify(defaultContent));

    // Skip header row (index 0)
    for (let i = 1; i < rows.length; i++) {
      const [section, key, value] = rows[i];
      if (!section || !key) continue;

      // Handle simple sections (hero, about, contact, etc.)
      if (['hero', 'navbar', 'projects', 'contact', 'socials'].includes(section)) {
         if (newContent[section] && newContent[section].hasOwnProperty(key)) {
            newContent[section][key] = value;
         }
      } 
      // Handle About Section (mix of strings and numbers)
      else if (section === 'about') {
          if (key === 'yearsExp' || key === 'projectsCompleted') {
              newContent.about[key] = parseInt(value) || 0;
          } else {
              newContent.about[key] = value;
          }
      }
      // Handle Array Lists (Services)
      else if (section === 'services') {
          const [indexStr, field] = key.split('_');
          const index = parseInt(indexStr);
          if (!isNaN(index) && field) {
              // Ensure array element exists
              if (!newContent.services[index]) {
                  newContent.services[index] = { id: index + 1, title: "", description: "" };
              }
              newContent.services[index][field] = value;
          }
      }
      // Handle Array Lists (FAQ)
      else if (section === 'faq') {
          const [indexStr, field] = key.split('_');
          const index = parseInt(indexStr);
          if (!isNaN(index) && field) {
               if (!newContent.faq[index]) {
                  newContent.faq[index] = { question: "", answer: "" };
              }
              newContent.faq[index][field] = value;
          }
      }
    }

    return newContent;
  } catch (error) {
    console.error("Error fetching Google Sheet data:", error);
    return defaultContent;
  }
};