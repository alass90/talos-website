import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yiphqkyuqfvygkbrrxic.supabase.co";
const supabaseAnonKey = "sb_publishable_4LZhWlDXAxtrT3CTjZ2quw_R7nTr3kX";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
