# Phase 1B Prompt

```markdown
PHASE 1B: API contract.

Goal: freeze the interface between the backend and the separately built UI, and give the UI realistic data to build against.

Tasks:
1. Create contracts/types.ts with Zod schemas and inferred TypeScript types for: Notice, Extraction (spec in section 4), Deadline, Analysis, Draft, SourceChunk, NoticeResponse (the GET /api/notices/:id shape pasted below), ApiError ({ error: { code, message } }), and the request and response bodies for every route in the API table. Export a NoticeResponse.parse() helper for the backend to run on every response.
2. Create contracts/fixtures/ with one JSON file per screen state: processing-extracting, processing-drafting, done-asmt10, done-drc01, done-low-confidence (several field_confidence values under 0.7), done-deadline-mismatch (computed and printed due dates differ), done-other-type (notice_type OTHER, no draft), and failed (with a readable error and partial extraction).
3. Fixtures must be realistic: fictional taxpayers and fictional GSTINs, a Hindi summary in Devanagari, 4 [ADD: ...] placeholders in each draft, [[chunk_id]] tags in the draft and checklist, and a complete sources map containing every chunk ID that is referenced.
4. Write scripts/validate-fixtures.ts (npm run validate-fixtures) that parses every fixture with the schemas and fails loudly on any mismatch.
5. Write docs/CONTRACT.md summarising the contract rules (status to stepper mapping, nullability, error shape, additive-only changes after the freeze).

Acceptance criteria:
- npm run validate-fixtures passes.
- Typecheck passes.
- Commit to main with the prefix "ai: " and tell the UI builder to pull.

[PASTE THE RESPONSE SHAPE AND CONTRACT RULES FROM SECTION 5 HERE]
```
