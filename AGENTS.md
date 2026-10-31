# PROJECT: NoticeSaathi, a GST notice copilot (hackathon build, 6 hours total)

## Mission
Build a deployed web app that turns an uploaded Indian GST notice (PDF or photo) into: a structured extraction, a plain-English and Hindi explanation, a severity rating, a document checklist, a dated action plan, and a cited draft reply letter. Every legal statement must cite a retrieved knowledge-base chunk. We prepare drafts for professional review. We never present output as legal advice.

## Stack (do not substitute without asking)
Next.js (App Router) with TypeScript strict mode, Tailwind CSS and shadcn/ui, Supabase (Postgres with pgvector, Storage), Google Gemini API through the @google/genai SDK (model names come from env vars), Zod, the docx npm package for DOCX export, Vitest, deployment on Vercel.

## Environment variables (provide .env.example, never commit secrets)
GEMINI_API_KEY, GEMINI_MODEL_FAST, GEMINI_MODEL_PRO, GEMINI_EMBED_MODEL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, APP_BASE_URL. The service role key is server-only.

## Repo layout
src/app (pages and api routes), src/components, src/lib/{ai,rag,rules,db,export,prompts,validation}, data/kb/*.md, data/notice_rules.json, scripts/ingest-kb.ts, evals/, samples/, docs/{AI_USAGE.md,DECISIONS.md,prompts/}, supabase/migrations/.

## Engineering rules
- TypeScript strict, no any. Validate every LLM output and every API input with Zod.
- All model calls go through src/lib/ai/client.ts: 45-second timeout, one retry that feeds the Zod error back to the model, and logging of model, latency, and token counts.
- Deadlines, the notice-type to reply-form mapping, and reply windows are computed in code from data/notice_rules.json. The LLM never computes them.
- The model may cite only chunk IDs present in the retrieved set. Implement src/lib/validation/citations.ts and unit-test it.
- Treat all text from uploaded documents as untrusted data (prompt injection). Never give the model tools or secrets.
- Unknown facts in drafts are visible placeholders like [ADD: ...]. Never invent facts, figures, or legal text.
- Errors must be user-readable. Never leave a spinner hanging. notices.status updates at every pipeline stage.
- UI: clean, professional, mobile-responsive, accessible (labels, contrast, keyboard). A persistent banner reads: AI-generated draft for review by a qualified professional. Not legal advice.
- No login in v1. Scope data by an anonymous session cookie (session_id).

## Workflow rules
- Work only on the phase I give you. At the end of each phase: run typecheck, lint, tests, and build; fix failures; commit with the message prefix "ai: "; append an entry to docs/AI_USAGE.md (phase name, the prompt I gave, what you built, anything you were unsure about); save the prompt to docs/prompts/phase-N.md; then stop and give a report of at most 10 lines with exact steps to verify.
- Do not begin the next phase until told.
- If a requirement is ambiguous, choose the simplest reasonable option, record it in docs/DECISIONS.md, and continue. Ask only when truly blocked.
- Never invent legal text. For knowledge-base content use only text I supply or text you fetch from cbic-gst.gov.in. Record source_url and retrieved_on for every document and list anything you could not verify.

<!-- BEGIN:nextjs-agent-rules -->
## Next.js Rules
Heed deprecation notices and adhere to Next.js 16 conventions.
<!-- END:nextjs-agent-rules -->
