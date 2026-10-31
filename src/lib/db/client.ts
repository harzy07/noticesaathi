import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

let cachedAdminClient: SupabaseClient | null = null;

/**
 * Returns a server-side Supabase client initialized with the SERVICE_ROLE_KEY.
 * The service role key bypasses RLS and allows administrative operations.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (cachedAdminClient) {
    return cachedAdminClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase server configuration: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set."
    );
  }

  cachedAdminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedAdminClient;
}

/**
 * Reads or creates an anonymous session_id cookie (httpOnly, sameSite lax, 30 days).
 * Scopes user data without requiring login in v1.
 */
export async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existingSession = cookieStore.get("session_id")?.value;

  if (existingSession && existingSession.trim().length > 0) {
    return existingSession;
  }

  const newSessionId = crypto.randomUUID();

  cookieStore.set("session_id", newSessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
  });

  return newSessionId;
}

/**
 * Reads the current session_id cookie without creating a new one if absent.
 */
export async function getSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("session_id")?.value ?? null;
}
