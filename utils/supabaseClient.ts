import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// TODO: REPLACE THESE VALUES WITH YOUR SUPABASE PROJECT DETAILS
// Go to Supabase Dashboard -> Project Settings -> API
// ------------------------------------------------------------------

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL_HERE"; 
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY_HERE";

// ------------------------------------------------------------------

// We use a factory function or check if keys are present to prevent crashes if not set up yet
const isConfigured = SUPABASE_URL.includes("supabase.co") && !SUPABASE_URL.includes("YOUR_SUPABASE");

export const supabase = isConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;
