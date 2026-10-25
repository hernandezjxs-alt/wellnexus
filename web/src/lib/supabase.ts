import { createClient } from "@supabase/supabase-js";

// Solo clave publicable: la seguridad real está en las reglas (RLS) de la base.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(url, key, { db: { schema: "wellnexus" } });
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
