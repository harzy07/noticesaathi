# Phase 1 Prompt

```markdown
PHASE 1: Foundation.

Goal: an empty but deployable app with the database schema, so everything later has a place to land.

Tasks:
1. Create a Next.js App Router project with TypeScript strict, Tailwind, shadcn/ui (button, card, tabs, badge, progress, dialog, textarea, toast), lucide-react, Zod, Vitest, and ESLint. Create the repo layout from the workspace rules, with placeholder README sections.
2. Write supabase/migrations/001_init.sql containing exactly the schema in the spec I will paste below (tables: notices, extractions, analyses, drafts, kb_docs, kb_chunks, review_links; pgvector extension; hnsw and gin indexes). Add a private storage bucket named notice-uploads in the same migration or in a documented setup step.
3. Implement src/lib/db/client.ts with a server-side Supabase client using the service role key, and a helper that reads or creates the anonymous session_id cookie (httpOnly, sameSite lax, 30 days).
4. Implement GET /api/health returning { ok: true, db: boolean } after a trivial query.
5. Build a landing page that states the product in one sentence, shows a disabled upload card labelled "coming in phase 4", and includes the persistent disclaimer banner and a footer link to /privacy (stub).
6. Add .env.example, a README with local setup steps, and a vercel.json only if needed.

Acceptance criteria:
- npm run typecheck, lint, test, and build all pass.
- /api/health returns ok true locally against the real Supabase project.
- The app is ready to deploy to Vercel with the env vars listed in the rules.

[PASTE THE SQL SCHEMA FROM SECTION 4 OF THE BUILD PACK HERE]
```
