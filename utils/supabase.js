import { createClient } from "@supabase/supabase-js";
import { env } from "./secrets";

// Create a single supabase client for interacting with your database
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_PUBLIC_ANON_KEY);

export { supabase };
