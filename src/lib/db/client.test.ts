import { describe, it, expect } from "vitest";
import { getSupabaseAdminClient } from "./client";

describe("db client", () => {
  it("throws a clear error when configuration environment variables are missing", () => {
    const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    expect(() => getSupabaseAdminClient()).toThrow(
      /Missing Supabase server configuration/
    );

    // Restore
    if (originalUrl) process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
    if (originalKey) process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
  });
});
