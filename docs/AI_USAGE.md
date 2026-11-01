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

### Phase 1B: API Contract & Realistic Fixtures (2026-11-01T02:46:00+05:30 to 2026-11-01T02:55:00+05:30)
- Goal: Freeze the interface between backend and UI with Zod schemas, TypeScript types, and realistic screen-state fixtures.
- Prompt given: [docs/prompts/phase-1b.md](./prompts/phase-1b.md)
- What the agent produced:
  - `contracts/types.ts`: Zod schemas and inferred types for `Notice`, `Extraction`, `Deadline`, `Analysis`, `Draft`, `SourceChunk`, `NoticeResponse`, `ApiError`, and request/response shapes for all seven API routes.
  - Companion `NoticeResponse.parse()` helper for runtime parsing.
  - 8 realistic screen-state fixtures in `contracts/fixtures/`: `processing-extracting.json`, `processing-drafting.json`, `done-asmt10.json`, `done-drc01.json`, `done-low-confidence.json`, `done-deadline-mismatch.json`, `done-other-type.json`, and `failed.json`.
  - Fixtures feature fictional taxpayers/GSTINs, Devanagari Hindi summaries, exactly 4 `[ADD: ...]` placeholders per draft, `[[chunk_id]]` citations, and complete referenced `sources` maps.
  - Validation test script `scripts/validate-fixtures.ts` executed via `npm run validate-fixtures`.
  - Documentation `docs/CONTRACT.md` detailing status-to-stepper mapping, nullability, citation rules, error format, and additive-only change policy.
- Human review: Verified all fixture UUIDs follow RFC 4122 v4 format and verified every citation chunk ID maps directly into the fixture sources map.
- Issues the agent got wrong and how we caught them: Initial fixture UUIDs had non-standard variant digits failing `z.string().uuid()`; caught by `validate-fixtures.ts` and corrected to compliant RFC 4122 v4 identifiers.

### Milestone 1: UI Inventory, Scaffolding, and Plan (2026-11-01T03:50:00+05:30 to 2026-11-01T06:26:00+05:30)
- Goal: Inventory the Google Stitch UI export, extract design system tokens, map all screens to API fields, configure project scripts, and set up directory structure.
- Prompt given: [docs/prompts/master.md](./prompts/master.md)
- What the agent produced:
  - Extracted `d:\noticevault---enterprise-notice-intake.zip` into `d:\noticesaathi\stitch_export` and preserved the original design tree.
  - Authored `docs/PLAN.md` covering the 8-milestone roadmap with Mermaid architecture diagram.
  - Authored `docs/UI_MAP.md` mapping every screen (`NoticeIntakeScreen`, `ActiveDocketScreen`, `NoticeDossierScreen`, `ResponseFilingScreen`, `StatutoryCalendarScreen`, `TopNavigation`) to Next.js routes and API fields.
  - Extracted fonts (`Plus Jakarta Sans`, `JetBrains Mono`, `Noto Sans Devanagari`) and color tokens into Next.js App Router layout (`src/app/layout.tsx`) and Tailwind theme (`src/app/globals.css`).
  - Added npm scripts to `package.json` (`ingest`, `eval`, `contract-check`, `try-notice`).
  - Installed `dotenv` for standalone scripts and initialized `src/mocks/index.ts` and `src/lib/pipeline`.
  - Updated `tsconfig.json` and `eslint.config.mjs` to properly scope Next.js app while archiving the Stitch export.
  - Verified `typecheck`, `test`, `lint`, and `build` all pass cleanly.
- Human review: Verified UI map covers all required routes and data fields.
- What you were unsure about: None; the Stitch export cleanly mapped to the required Next.js pages.
- What a human must verify: Browser rendering of Plus Jakarta Sans and Noto Sans Devanagari fonts on local dev.

### Milestone 2: Migration SQL, DB Client, /api/health, Contracts & Fixtures (2026-11-01T06:27:00+05:30 to 2026-11-01T06:39:00+05:30)
- Goal: Supabase migration with vector extension, RLS, and storage bucket; server DB client with session cookie manager; health check; Zod schemas; and mock mode fixtures.
- What the agent produced:
  - `supabase/migrations/001_init.sql` updated to include `what_they_want jsonb` in `analyses`, `verified boolean default false` in `kb_docs`, RLS enabled on all 7 tables with private storage bucket `notice-uploads`.
  - `src/lib/db/client.ts` with server-side service role client and 30-day anonymous session cookie helper.
  - `GET /api/health` returning `{ ok: true, db: boolean }`.
  - `contracts/types.ts` enhanced to support nullable amounts demanded, deterministic deadline aliases, placeholder counts, and verified chunk markers.
  - Validated all 8 fixtures via `npm run validate-fixtures`.
  - Created `.env.example` with empty keys and `.env.local` with development fallback configuration.
  - Verified `typecheck`, `test`, `lint`, and `build` all pass cleanly.
- Human review: Confirmed DB schema and contract compatibility.
- What you were unsure about: None.
- What a human must verify: Execute `supabase/migrations/001_init.sql` in the Supabase SQL editor when provisioning live cloud project.

## 4. Prompt library
- Phase 1: [docs/prompts/phase-1.md](./prompts/phase-1.md)
- Phase 1B: [docs/prompts/phase-1b.md](./prompts/phase-1b.md)
- Master: [docs/prompts/master.md](./prompts/master.md)

## 5. Verification and guardrails
- Automated typechecking: `npm run typecheck` (`tsc --noEmit`)
- Automated linting: `npm run lint` (`eslint`)
- Automated unit testing: `npm run test` (`vitest run`)
- Production build: `npm run build` (`next build`)

## 6. What AI could not do (honest section)
- User input was required to confirm workspace directory (`D:\noticesaathi`) rather than polluting root `D:\`.
