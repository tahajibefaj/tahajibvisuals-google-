import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://joypqhwqyjrvszmhjacq.supabase.co".trim(); 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpveXBxaHdxeWpydnN6bWhqYWNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MzM0OTMsImV4cCI6MjA4MjAwOTQ5M30.fIcLffZn3H95wwkfPlKAFUFY1IBOkxFslWMaNJ4tNoc".trim();

// Check configuration to prevent crashes during initialization
const isConfigured = SUPABASE_URL.includes("supabase.co") && !SUPABASE_URL.includes("YOUR_SUPABASE");

export const supabase = isConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;