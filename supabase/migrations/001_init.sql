-- NoticeSaathi Supabase Initial Migration
-- Migration: 001_init.sql

-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- 1. Table: notices
create table if not exists notices (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  client_name text, -- CA use: which client this notice belongs to
  file_path text not null, -- storage path of the upload
  file_mime text not null,
  status text not null default 'uploaded', -- uploaded|extracting|retrieving|analyzing|drafting|done|failed
  error text,
  created_at timestamptz default now()
);

create index if not exists notices_session_id_idx on notices (session_id);
create index if not exists notices_status_idx on notices (status);

-- 2. Table: extractions
create table if not exists extractions (
  notice_id uuid primary key references notices(id) on delete cascade,
  data jsonb not null, -- see Extraction JSON in specification
  model text,
  latency_ms int
);

-- 3. Table: analyses
create table if not exists analyses (
  notice_id uuid primary key references notices(id) on delete cascade,
  summary_en text,
  summary_hi text,
  severity text, -- low|medium|high|critical
  severity_reason text,
  what_they_want jsonb, -- bullets of exactly what the officer asks the taxpayer to do
  checklist jsonb, -- [{item, why, source_ids[]}]
  action_plan jsonb, -- [{step, day_offset, owner}]
  citations jsonb, -- [{chunk_id, label, quote_snippet}]
  validation jsonb -- {total, verified, dropped[]}
);

-- 4. Table: drafts
create table if not exists drafts (
  id uuid primary key default gen_random_uuid(),
  notice_id uuid references notices(id) on delete cascade,
  version int not null default 1,
  body_md text not null, -- reply letter in markdown, with [ADD: ...] placeholders
  instructions text, -- user's regenerate instructions
  created_at timestamptz default now()
);

create index if not exists drafts_notice_id_idx on drafts (notice_id);

-- 5. Table: kb_docs
create table if not exists kb_docs (
  id text primary key, -- e.g. 'cgst-act-s73'
  title text,
  source_url text,
  source_type text, -- act|rule|circular|form|explainer
  version_note text,
  retrieved_on date,
  verified boolean default false
);

-- 6. Table: kb_chunks
create table if not exists kb_chunks (
  id text primary key, -- stable, human-readable: 'cgst-act-s73#p2'
  doc_id text references kb_docs(id) on delete cascade,
  section_ref text, -- 'Section 73(1)', 'Rule 99(2)'
  content text not null,
  embedding vector(768),
  tsv tsvector generated always as (to_tsvector('english', content)) stored
);

create index if not exists kb_chunks_embedding_hnsw_idx on kb_chunks using hnsw (embedding vector_cosine_ops);
create index if not exists kb_chunks_tsv_gin_idx on kb_chunks using gin (tsv);
create index if not exists kb_chunks_section_ref_idx on kb_chunks (section_ref);

-- 7. Table: review_links
create table if not exists review_links (
  token text primary key, -- random 32 chars
  notice_id uuid references notices(id) on delete cascade,
  expires_at timestamptz not null,
  comments jsonb default '[]' -- [{author, text, created_at}]
);

create index if not exists review_links_token_idx on review_links (token);
create index if not exists review_links_notice_id_idx on review_links (notice_id);

-- Enable Row Level Security (RLS) on all tables
-- With no public policies, since all client access routes through the server using the service role key
alter table notices enable row level security;
alter table extractions enable row level security;
alter table analyses enable row level security;
alter table drafts enable row level security;
alter table kb_docs enable row level security;
alter table kb_chunks enable row level security;
alter table review_links enable row level security;

-- Storage bucket setup: notice-uploads (private bucket)
-- Manual UI click path if storage.buckets insertion is restricted:
-- Supabase Dashboard -> Storage -> New bucket -> Name: 'notice-uploads' -> Toggle Public bucket OFF -> Save.
insert into storage.buckets (id, name, public)
values ('notice-uploads', 'notice-uploads', false)
on conflict (id) do nothing;
