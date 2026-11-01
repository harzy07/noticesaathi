# Architectural Decision Records (ADR) — NoticeSaathi

## ADR 001: Project Foundation & Layout
- **Date**: 2026-11-01
- **Status**: Accepted
- **Context**: Phase 1 initialization required scaffolding a Next.js App Router project with TypeScript strict mode, Tailwind CSS, shadcn/ui components, and Supabase integration.
- **Decisions**:
  1. Initialized repository in dedicated `D:\noticesaathi` workspace directory to keep root `D:\` drive clean.
  2. Selected `sonner` for accessible toast notifications compatible with shadcn/ui.
  3. Used `@supabase/supabase-js` with server-side service role client caching for administrative tasks while keeping client bundle free of service role credentials.
  4. Implemented 30-day anonymous `session_id` cookie via Next.js `cookies()` helper to isolate user data without authentication barriers in v1.
  5. Implemented `GET /api/health` with safe error catching so missing live Supabase credentials in local dev or CI report `{ ok: true, db: false }` rather than crashing the endpoint.

## ADR 002: Supabase Schema & Storage
- **Date**: 2026-11-01
- **Status**: Accepted
- **Context**: Need exact schema for notices, extractions, analyses, drafts, kb_docs, kb_chunks, review_links, pgvector, and private upload storage bucket.
- **Decisions**:
  1. Stored schema in `supabase/migrations/001_init.sql` following Section 4 of the Build Pack specification.
  2. Configured 768-dimension vectors for `kb_chunks.embedding` with HNSW cosine distance index (`vector_cosine_ops`).
  3. Added generated `tsv` tsvector column with GIN indexing for hybrid keyword retrieval.
  4. Configured private storage bucket `notice-uploads` via `storage.buckets` insert with `on conflict do nothing`.

## ADR 003: API Contract & UI Isolation
- **Date**: 2026-11-01
- **Status**: Accepted
- **Context**: Need to freeze the backend-frontend contract to allow parallel frontend development against realistic fixtures without waiting for AI models or live database ingestion.
- **Decisions**:
  1. Centralized all contracts and schemas in `contracts/types.ts` with companion runtime parse helper `NoticeResponse.parse()`.
  2. Created 8 screen-state fixtures in `contracts/fixtures/` capturing all pipeline states (processing, done variants, low confidence, deadline mismatch, out-of-scope, failed).
  3. Enforced strict RFC 4122 v4 UUID compliance and complete source chunk mapping in `scripts/validate-fixtures.ts`.
  4. Contract changes after freeze are strictly additive-only.
