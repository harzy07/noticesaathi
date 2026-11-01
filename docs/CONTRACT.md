# NoticeSaathi API Contract & UI Interface Specification

> **Freeze Date:** Phase 1B (2026-11-01)  
> **Status:** FROZEN — Additive-only changes permitted.

---

## 1. Overview & Purpose
This document defines the frozen API contract between the Next.js backend pipeline and the user interface. It ensures frontend UI components can be developed and tested in isolation against verified mock fixtures (`contracts/fixtures/*.json`) with guaranteed type safety.

All backend route payloads and model outputs are strictly validated using Zod schemas defined in `contracts/types.ts`.

---

## 2. Status Stepper Mapping

The pipeline updates `notices.status` at every stage. The UI polls `GET /api/notices/:id` every 1.5 seconds and maps `notices.status` to a 4-step live progress stepper:

| `notices.status` | Stepper Stage | UI Label | Progress State |
| :--- | :--- | :--- | :--- |
| `uploaded` | Stage 0 | Notice Uploaded | Initializing background worker |
| `extracting` | Step 1 | Reading the notice | Step 1 active (Flash model extraction) |
| `retrieving` | Step 2 | Finding the law | Step 2 active (Hybrid RAG retrieval) |
| `analyzing` | Step 3 | Analysing | Step 3 active (Plain-language synthesis) |
| `drafting` | Step 4 | Drafting | Step 4 active (Pro model legal drafting) |
| `done` | Complete | Analysis Complete | All 4 steps finished; render result tabs |
| `failed` | Error | Processing Paused | Show error alert, retain partial extraction |

---

## 3. Data Nullability & Partial Results

1. **In-Flight Processing (`extracting`, `retrieving`, `analyzing`, `drafting`):**
   - Fields that have not yet been produced are `null` (never omitted or arbitrary shapes).
   - Once extraction completes, `extraction` remains populated in all subsequent states.
   - Once analysis completes, `analysis` remains populated even while `drafting` is running.

2. **Terminal Success (`done`):**
   - `extraction`: Always populated.
   - `deadline`: Populated for standard notices (`ASMT-10`, `DRC-01`, `DRC-01A`, `REG-03`, `REG-17`, `GSTR-3A`). `null` for `notice_type: "OTHER"`.
   - `analysis`: Always populated (includes English & Devanagari Hindi summaries).
   - `draft`: Populated for standard notices. `null` for `notice_type: "OTHER"`.
   - `sources`: Dictionary mapping `chunk_id` string to `SourceChunk`. Contains every chunk cited by the analysis and draft.

3. **Terminal Failure (`failed`):**
   - `notice.error`: Non-empty user-readable error message (e.g. timeout, unreadable scan, upstream API error).
   - `extraction`: Preserved if the failure occurred after extraction, enabling the user to still view extracted metadata without a hanging spinner.
   - `draft` and `analysis`: `null` if the pipeline aborted before completing them.

---

## 4. Citation & Grounding Contract

1. **Tag Format:** Citations in `draft.body_md` and `analysis.checklist[].item` use bracketed syntax:
   ```text
   [[cgst-act-s73#p1]]
   ```
2. **Sources Dictionary:** Every `[[chunk_id]]` present in the text must have a corresponding entry in `sources[chunk_id]`.
3. **UI Rendering:**
   - Render tags as numbered chips (e.g., `[1]`, `[2]`).
   - Clicking a chip opens a popover displaying the section reference, excerpt, CBIC `source_url`, and `retrieved_on` date.
   - Display a verified sources count badge (e.g., `Verified sources: 4 of 4`).

---

## 5. Factual Placeholders Contract

1. **Format:** Missing facts in reply letters are generated as visible uppercase placeholders:
   ```text
   [ADD: Detailed reconciliation statement of input tax credit for FY 2023-24]
   ```
2. **UI Enforcement:**
   - The UI draft editor must highlight all `[ADD: ...]` tokens and count remaining placeholders (e.g., `"4 placeholders left"`).
   - The DOCX download action is disabled until the user confirms all placeholders have been reviewed, with an explicit override link for downloading as a template.

---

## 6. API Error Format

All error responses from `/api/*` follow this structure:
```json
{
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Only PDF, PNG, and JPG files under 10MB are accepted."
  }
}
```

Standard error codes:
- `INVALID_FILE_TYPE`: Uploaded document is not PDF, PNG, or JPG.
- `FILE_TOO_LARGE`: Uploaded file exceeds 10MB limit.
- `NOTICE_NOT_FOUND`: Notice ID does not exist or does not match `session_id`.
- `PIPELINE_ERROR`: Background processing failure.
- `RATE_LIMIT_EXCEEDED`: More than 10 analyses in a 1-hour window.
- `UNAUTHORIZED`: Invalid or missing session cookie.

---

## 7. Change Governance (Additive-Only)

After this Phase 1B freeze:
1. **No Breaking Modifications:** Existing fields, types, and enum values cannot be renamed or removed.
2. **Additive-Only:** New fields must be marked optional (`.optional()`) with sensible defaults so existing UI components continue operating without modification.
3. **Fixture Validation:** Any change to types must pass `npm run validate-fixtures`.
