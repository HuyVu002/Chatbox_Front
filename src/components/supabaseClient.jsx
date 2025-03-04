import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://sxiuabjpppsbohqknlgh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4aXVhYmpwcHBzYm9ocWtubGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNzgzMDIsImV4cCI6MjA1NjY1NDMwMn0.jekQ4dMBrs4gMGthfcKzBpFAxVU1YEuTqAeUvnTLQr0";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
