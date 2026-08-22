import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Types ─────────────────────────────────────────────────────────────────

export type Guest = {
  id: string;
  name: string;
  max_companions: number;
  token: string;
  created_at: string;
};

export type Rsvp = {
  id: string;
  guest_id: string;
  confirmed: boolean;
  companions_count: number;
  message: string | null;
  created_at: string;
};

export type GuestWithRsvp = Guest & {
  rsvps: Rsvp | null;
};
