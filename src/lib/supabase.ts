import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Types ─────────────────────────────────────────────────────────

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