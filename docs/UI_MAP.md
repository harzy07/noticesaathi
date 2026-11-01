# NoticeSaathi — UI Map

This document maps every screen from the Google Stitch UI export (`stitch_export/`) to its corresponding Next.js App Router route, the interactive UI elements and data fields it displays, and the specific API contract fields supplying each one.

## 1. Global Navigation & Layout

### Persistent Shell
- **Component**: `src/components/top-navigation.tsx` & `src/components/disclaimer-banner.tsx`
- **Present on**: All routes (`/`, `/notices/[id]`, `/review/[token]`, `/pricing`, `/how-it-works`, `/privacy`)
- **UI Elements**:
  - Disclaimer Banner: *"AI-generated draft for review by a qualified professional. Not legal advice."*
  - Brand Logo & App Title: "NoticeSaathi" (GST Notice Copilot)
  - Navigation Links:
    - Intake / New Notice (`/`)
    - Recent Docket / My Notices (`/`)
    - Pricing (`/pricing`)
    - How it Works (`/how-it-works`)
    - Privacy Policy (`/privacy`)
  - Active Notice Count Badge: count of active unfiled notices in the current session.

---

## 2. Screen 1: Notice Intake (Home)
- **Stitch Component Source**: `stitch_export/src/components/NoticeIntakeScreen.tsx`
- **Next.js Route**: `/` (`src/app/page.tsx`)
- **Description**: Drag-and-drop notice intake interface, client name assignment, recent notices list, and statutory consent.

| UI Element / Field | Screen Location | Source / API Field | Notes |
| :--- | :--- | :--- | :--- |
| File Dropzone | Intake Card Center | Local File Browser / Drag-and-Drop | Supports PDF, PNG, JPG (<= 4MB, client compression) |
| Client Name Input | Intake Form (Optional) | `client_name` in `POST /api/notices` | CA firm multi-client categorization |
| Statutory Consent Notice | Below Upload Button | Static Legal Copy | *"Your notice is processed to generate a draft and can be deleted any time"* |
| Quick Presets / Specimen Loader | Intake Card Top | Synthetic Samples / Fixtures | Allows 1-click loading of ASMT-10, DRC-01, REG-03 |
| Recent Notices Docket | Below / Beside Intake Card | `GET /api/notices` -> `Notice[]` | Displays session notice history |
| Notice Reference Number | Recent Notices Table | `notice.extraction?.reference_number` or `notice.id` | Truncated mono ID |
| Notice Type Badge | Recent Notices Table | `notice.extraction?.notice_type` | Color-coded badge (e.g. ASMT-10, DRC-01) |
| Taxpayer / Client | Recent Notices Table | `notice.client_name` or `taxpayer_name` | Identifies client matter |
| Upload Timestamp | Recent Notices Table | `notice.created_at` | Relative or formatted date |
| Status Indicator | Recent Notices Table | `notice.status` | Stepper status pill (Uploaded, Processing, Done, Failed) |

---

## 3. Screen 2: Notice Dossier & Results
- **Stitch Component Source**: `stitch_export/src/components/NoticeDossierScreen.tsx`
- **Next.js Route**: `/notices/[id]` (`src/app/notices/[id]/page.tsx`)
- **Description**: Central intelligence dossier displaying the extraction, deterministic deadline, severity, legal grounding, plain-language summaries, and draft reply.

### 3.1 Live Stepper (Processing State)
- **Polling Frequency**: Every 1.5 seconds (`GET /api/notices/:id`)
- **Step 1: Reading the notice**: Maps to `uploaded` and `extracting`
- **Step 2: Finding the law**: Maps to `retrieving`
- **Step 3: Analysing**: Maps to `analyzing`
- **Step 4: Drafting**: Maps to `drafting`
- **Completed**: Maps to `done`
- **Error State**: Maps to `failed` (`notice.error`)

### 3.2 Header & Statutory Countdown Banner
| UI Element / Field | Screen Location | Source / API Field | Notes |
| :--- | :--- | :--- | :--- |
| Matter Title | Header | `notice.extraction?.notice_type` + Reference Number | E.g., *"ASMT-10: Scrutiny Notice - Ref #... "* |
| GSTIN Badge | Header | `notice.extraction?.gstin` | Full GSTIN displayed |
| Taxpayer Name | Header Subtitle | `notice.extraction?.taxpayer_name` | Legal entity name |
| Statutory Deadline Date | Countdown Banner | `deadline.due_date` | Computed deterministic deadline |
| Response Countdown | Countdown Banner | `deadline.days_remaining` | E.g. *"14 Days Remaining"* (Amber/Red when urgent) |
| Tolling Rule & Form | Countdown Banner | `deadline.reply_form` & `deadline.basis` | E.g., *"Form ASMT-11 (30 calendar days from service)"* |
| Deadline Mismatch Warning | Countdown Banner Alert | `deadline.mismatch`, `printed_due_date`, `due_date` | Prominent alert if officer printed date differs from legal window |
| Severity Badge | Dossier Top Right | `analysis.severity` & `analysis.severity_reason` | Badges: Low (slate), Medium (amber), High (orange), Critical (rose) |

### 3.3 Tab 1: Overview
| UI Element / Field | Screen Location | Source / API Field | Notes |
| :--- | :--- | :--- | :--- |
| English Summary | Overview Left | `analysis.summary_en` | 4-6 plain sentences for shopkeepers / MSMEs |
| Hindi Summary | Overview Left (Toggle) | `analysis.summary_hi` | Simple Hindi in Devanagari script |
| What They Want | Overview Right | `analysis.what_they_want` | Bulleted list of officer's exact demands |
| Financial Exposure Card | Overview Bottom | `extraction.amount_demanded` | Breakdown: Tax, Interest, Penalty, Total (INR) |

### 3.4 Tab 2: Extracted Details
| UI Element / Field | Screen Location | Source / API Field | Notes |
| :--- | :--- | :--- | :--- |
| Issuing Office / Authority | Details Grid | `extraction.issuing_office` | Department and jurisdiction |
| Notice Date & Confidence | Details Grid | `extraction.notice_date`, `field_confidence.notice_date` | Amber warning + inline edit if confidence < 0.7 |
| Printed Due Date & Conf. | Details Grid | `extraction.reply_due_date`, `field_confidence.reply_due_date` | Amber warning + inline edit if confidence < 0.7 |
| Tax Demand & Conf. | Details Grid | `extraction.amount_demanded.total`, `field_confidence.amount_demanded` | Amber warning + inline edit if confidence < 0.7 |
| Sections Cited | Details Grid | `extraction.sections_cited` | List of statutory sections identified |
| Alleged Issues & Evidence | Details Table | `extraction.alleged_issues` | Table: Allegation, Verbatim Quote (<20 words), Page Number |
| Documents Requested | Details List | `extraction.documents_requested` | Statutory annexures and documents demanded |

### 3.5 Tab 3: Checklist & Action Plan
| UI Element / Field | Screen Location | Source / API Field | Notes |
| :--- | :--- | :--- | :--- |
| Document Checklist | Left Column | `analysis.checklist` | Items with explanation of why needed & source IDs |
| Interactive Checkboxes | Checklist Items | Local State / Persistence | Check off documents as gathered |
| Action Plan Timeline | Right Column | `analysis.action_plan` | Ordered steps with `day_offset` from today |
| Action Owner Badge | Action Plan Items | `action_plan[i].owner` | `taxpayer`, `CA`, or `accountant` |

### 3.6 Tab 4: Draft Reply Letter (Response Filing)
- **Stitch Component Source**: `stitch_export/src/components/ResponseFilingScreen.tsx`
- **Description**: Grounded response drafting workspace with citation chips and placeholder tracking.

| UI Element / Field | Screen Location | Source / API Field | Notes |
| :--- | :--- | :--- | :--- |
| Version Switcher | Draft Header | `draft.version` | History selector of generated drafts |
| Placeholder Badge | Draft Header | `draft.placeholder_count` | Count of unresolved `[ADD: ...]` items |
| Markdown Editor / Preview | Draft Center | `draft.body_md` | Live rendered preview + editable textarea |
| Citation Chips | Inside Draft Text | `[[chunk_id]]` in text | Numbered pill opening legal popover |
| Placeholder Highlighting | Inside Draft Text | Regex `\[ADD:\s*([^\]]+)\]` | Yellow badge rendering in preview |
| Regenerate with Instructions | Below Editor | `POST /api/notices/:id/draft` `{ instructions }` | Refines tone, length, or factual emphasis |
| Placeholder Review Checkbox | Export Bar | User Confirmation | *"I have reviewed and filled all placeholders"* |
| Export DOCX / MD Button | Export Bar | `GET /api/notices/:id/export?format=docx` | Disabled until placeholders resolved or overridden |
| "Send to my CA" Modal | Actions Bar | `POST /api/notices/:id/review-link` | Generates 32-char token link + mailto + WhatsApp |
| Delete Notice Dialog | Actions Bar | `DELETE /api/notices/:id` | Confirm modal to purge storage and database rows |

### 3.7 Tab 5: Sources & Legal Authority
| UI Element / Field | Screen Location | Source / API Field | Notes |
| :--- | :--- | :--- | :--- |
| Verified Sources Badge | Sources Header | `analysis.validation.verified` / `total` | E.g. *"Verified sources: 5 of 5"* |
| Sources Grid / List | Sources Content | `sources` map | Maps `chunk_id` to section_ref, content, source_url, verified |
| Unverified Marker | Chunk Card | `sources[chunk_id].verified === false` | Amber warning pill with disclaimer |
| Citation Popover | On Chip Click | Chunk Content & CBIC Link | Popover showing chunk text, legal reference, and retrieval date |

---

## 4. Screen 3: Shared Review Screen
- **Next.js Route**: `/review/[token]` (`src/app/review/[token]/page.tsx`)
- **Description**: Read-only, client-safe shared review page for chartered accountants and clients.

| UI Element / Field | Screen Location | Source / API Field | Notes |
| :--- | :--- | :--- | :--- |
| Masked GSTIN | Review Header | `extraction.gstin` masked | E.g. `27AA*****1Z5` for confidentiality |
| Matter Summary & Draft | Main Body | `analysis.summary_en`, `draft.body_md` | Read-only rendered letter with citation chips |
| Expiration Notice | Review Header | `review_link.expires_at` | Countdown or expiry warning (default 72 hours) |
| Comment Feed | Sidebar / Bottom | `review_links.comments` | List of reviewer comments with author & timestamp |
| Add Comment Form | Comment Section | `POST /api/review/:token/comment` | Allows CA or client to leave feedback |

---

## 5. Screen 4: Static & Supporting Pages
- **/pricing (`src/app/pricing/page.tsx`)**:
  - Pricing Tiers: Pay per notice (499 INR), SME Monthly (999 INR), CA Starter (149 INR / client / month), CA Firm (9,999 INR / month).
  - Call to Action: "Join the pilot" (opens waitlist modal).
- **/how-it-works (`src/app/how-it-works/page.tsx`)**:
  - 4-step workflow explainer: Intake -> Deterministic Tolling -> Grounded Hybrid RAG -> Professional Draft.
- **/privacy (`src/app/privacy/page.tsx`)**:
  - Auto-deletion policy (30 days), encrypted storage, no portal filing assurance, confidential processing.
