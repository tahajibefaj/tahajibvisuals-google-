import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// TODO: REPLACE THESE VALUES WITH YOUR SUPABASE PROJECT DETAILS
// Go to Supabase Dashboard -> Project Settings -> API
// ------------------------------------------------------------------

const SUPABASE_URL = "https://joypqhwqyjrvszmhjacq.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpveXBxaHdxeWpydnN6bWhqYWNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MzM0OTMsImV4cCI6MjA4MjAwOTQ5M30.fIcLffZn3H95wwkfPlKAFUFY1IBOkxFslWMaNJ4tNoc";

// ------------------------------------------------------------------

// We use a factory function or check if keys are present to prevent crashes if not set up yet
const isConfigured = SUPABASE_URL.includes("supabase.co") && !SUPABASE_URL.includes("YOUR_SUPABASE");

export const supabase = isConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;
