# NoticeSaathi — GST Notice Copilot

> AI-generated draft for review by a qualified professional. Not legal advice.

NoticeSaathi turns scary Indian GST notices (PDF scans or photos) into:
- Structured data extractions (notice type, section, demand amount, issuing office, dates)
- Plain-English and Hindi explanations with a severity rating
- Deterministic response deadlines & form requirements (computed in code via rules table)
- Checklists of required evidence and dated action plans
- Grounded, cited draft reply letters (every legal proposition cites a verified CBIC chunk)
- One-click CA review links and DOCX exports

---

## Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript strict mode
- **UI & Styling**: Tailwind CSS, shadcn/ui primitives, Lucide icons
- **Database & Storage**: Supabase Postgres with `pgvector` extension and private storage buckets
- **AI & Grounding**: Google Gemini API via `@google/genai` SDK
- **Validation**: Zod schema validation on all inputs and LLM outputs
- **Document Export**: `docx` package for DOCX output
- **Testing**: Vitest unit and integration test suite
- **Deployment**: Vercel

---

## Repository Layout

```text
├── src/
│   ├── app/                # App Router pages and /api routes
│   │   ├── api/health/     # Health check endpoint
│   │   ├── privacy/        # Privacy policy (DPDP Act 2023 aligned)
│   │   ├── layout.tsx      # Root layout with persistent disclaimer banner
│   │   └── page.tsx        # Landing page with upload trigger
│   ├── components/         # Reusable UI components (shadcn/ui, banners)
│   └── lib/
│       ├── ai/             # Gemini API client wrapper & retry logic
│       ├── rag/            # Vector, keyword, & hybrid retrieval logic
│       ├── rules/          # Deterministic notice rules & calendar logic
│       ├── db/             # Supabase admin client & session cookie manager
│       ├── export/         # DOCX & markdown exporters
│       ├── prompts/        # P1-P4 prompts with strict Zod schemas
│       └── validation/     # Citation tag validator & claim checks
├── data/
│   ├── kb/                 # Curated markdown legal chunks from CBIC
│   └── notice_rules.json   # Deterministic rules table for notice types
├── scripts/
│   └── ingest-kb.ts        # Idempotent knowledge-base ingestion script
├── evals/                  # Synthetic golden evaluation test cases
├── samples/                # Watermarked test notice specimens
├── docs/
│   ├── AI_USAGE.md         # AI usage ledger & development log
│   ├── DECISIONS.md        # Architectural decision records
│   └── prompts/            # Phase prompt archive
└── supabase/
    └── migrations/         # Supabase database migrations (pgvector, tables)
```

---

## Local Setup & Development

### 1. Prerequisites
- Node.js >= 20.0.0 (Node 24 recommended)
- A Supabase project with `vector` extension enabled
- Google Gemini API key

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local` and provide your credentials:
```bash
cp .env.example .env.local
```

Required environment variables:
| Variable | Description |
| --- | --- |
| `GEMINI_API_KEY` | Google AI Studio Gemini API Key |
| `GEMINI_MODEL_FAST` | Fast model for extraction & analysis (e.g. `gemini-2.5-flash`) |
| `GEMINI_MODEL_PRO` | Pro model for legal drafting (e.g. `gemini-2.5-pro`) |
| `GEMINI_EMBED_MODEL` | Embedding model (e.g. `text-embedding-004`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `APP_BASE_URL` | Base application URL (`http://localhost:3000` in dev) |

### 4. Database Setup
Apply the initial migration located in `supabase/migrations/001_init.sql` using the Supabase Dashboard SQL Editor or Supabase CLI:
```bash
# Using Supabase CLI:
supabase db push
# Or run the contents of supabase/migrations/001_init.sql in the Supabase SQL Editor
```

### 5. Running the Application
```bash
# Start local development server
npm run dev

# Run test suite
npm run test

# Run TypeScript typecheck
npm run typecheck

# Run linter
npm run lint

# Build for production
npm run build
```

---

## Verified Rules Engine Principles
1. **Deterministic Deadlines**: Reply windows and reply forms are strictly loaded from `data/notice_rules.json`. The LLM never invents or computes calendar deadlines.
2. **Citation Verification**: Every legal statement in drafts must cite a chunk ID present in the retrieved set. The citation validator in `src/lib/validation/citations.ts` removes any ungrounded assertions.
3. **Factual Placeholders**: Missing numbers, dates, or taxpayer transactions use explicit placeholders such as `[ADD: ...]`. The model is strictly prohibited from inventing facts.
4. **Session Scoping**: Anonymous `session_id` cookies isolate uploaded notices without requiring account login in v1.
