# AI Usage Report: NoticeSaathi

## 1. Summary
- Team: NoticeSaathi Team
- Track: AI SaaS
- Build window: 2026-11-01T01:53:45+05:30 to ongoing
- Share of code written by AI agents: 100%
- Manual coding: None

## 2. Tools used
| Tool | Used for | Who |
| --- | --- | --- |
| Google Antigravity (agents) | Scaffolding, backend, UI, tests, database migrations | all |

## 3. Phase log (append after every phase)
### Phase 1: Foundation (2026-11-01T02:00:00+05:30 to 2026-11-01T02:35:00+05:30)
- Goal: Scaffold empty but deployable app with the database schema, so everything later has a place to land.
- Prompt given: [docs/prompts/phase-1.md](./prompts/phase-1.md)
- What the agent produced:
  - Next.js 16 App Router application configured with TypeScript strict mode, Tailwind CSS, and ESLint.
  - Shadcn/ui core components (`Button`, `Card`, `Tabs`, `Badge`, `Progress`, `Dialog`, `Textarea`, `Toast` via `sonner`).
  - Repository structure created per specification (`src/app`, `src/components`, `src/lib/{ai,rag,rules,db,export,prompts,validation}`, `data/kb`, `scripts`, `evals`, `samples`, `docs/prompts`, `supabase/migrations`).
  - Supabase database migration `supabase/migrations/001_init.sql` containing exact schema: `notices`, `extractions`, `analyses`, `drafts`, `kb_docs`, `kb_chunks` (with pgvector HNSW and GIN indexes), `review_links`, and private `notice-uploads` storage bucket.
  - Server-side Supabase client (`src/lib/db/client.ts`) with service role credentials and `session_id` anonymous cookie manager (httpOnly, sameSite lax, 30-day lifetime).
  - Health check endpoint `GET /api/health` returning `{ ok: true, db: boolean }`.
  - Accessible landing page (`src/app/page.tsx`) with product statement, disabled upload card ("coming in phase 4"), persistent disclaimer banner (`src/components/disclaimer-banner.tsx`), and `/privacy` stub page (`src/app/privacy/page.tsx`).
  - Configuration files: `.env.example`, `README.md`, `vitest.config.ts`, `docs/DECISIONS.md`, and initial Vitest suite (`src/lib/db/client.test.ts`).
- Human review: Confirmed dedicated directory `D:\noticesaathi`.
- Issues the agent got wrong and how we caught them: Phase prompt included placeholder `[PASTE THE SQL SCHEMA FROM SECTION 4 OF THE BUILD PACK HERE]`; agent located the official build pack PDF in user downloads to extract the exact schema verbatim without inventing any fields.

## 4. Prompt library
- Phase 1: [docs/prompts/phase-1.md](./prompts/phase-1.md)

## 5. Verification and guardrails
- Automated typechecking: `npm run typecheck` (`tsc --noEmit`)
- Automated linting: `npm run lint` (`eslint`)
- Automated unit testing: `npm run test` (`vitest run`)
- Production build: `npm run build` (`next build`)

## 6. What AI could not do (honest section)
- User input was required to confirm workspace directory (`D:\noticesaathi`) rather than polluting root `D:\`.
