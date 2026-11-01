import { z } from "zod";

// ============================================================================
// 1. Core Enums and Statuses
// ============================================================================

export const NoticeStatusSchema = z.enum([
  "uploaded",
  "extracting",
  "retrieving",
  "analyzing",
  "drafting",
  "done",
  "failed",
]);
export type NoticeStatus = z.infer<typeof NoticeStatusSchema>;

export const NoticeTypeSchema = z.enum([
  "ASMT-10",
  "DRC-01",
  "DRC-01A",
  "REG-03",
  "REG-17",
  "GSTR-3A",
  "OTHER",
]);
export type NoticeType = z.infer<typeof NoticeTypeSchema>;

export const LanguageDetectSchema = z.enum(["en", "hi", "mixed"]);
export type LanguageDetect = z.infer<typeof LanguageDetectSchema>;

export const LegibilitySchema = z.enum(["good", "fair", "poor"]);
export type Legibility = z.infer<typeof LegibilitySchema>;

export const SeverityLevelSchema = z.enum(["low", "medium", "high", "critical"]);
export type SeverityLevel = z.infer<typeof SeverityLevelSchema>;

// ============================================================================
// 2. Database Models & Core Entities
// ============================================================================

// Notice Entity (Database representation)
export const NoticeSchema = z.object({
  id: z.string().uuid(),
  session_id: z.string(),
  client_name: z.string().nullable().optional(),
  file_path: z.string(),
  file_mime: z.string(),
  status: NoticeStatusSchema,
  error: z.string().nullable().optional(),
  created_at: z.string(),
});
export type Notice = z.infer<typeof NoticeSchema>;

// Extraction Data (Section 4 Extraction JSON spec)
export const AmountDemandedSchema = z.object({
  tax: z.number(),
  interest: z.number(),
  penalty: z.number(),
  total: z.number(),
  currency: z.literal("INR").default("INR"),
});
export type AmountDemanded = z.infer<typeof AmountDemandedSchema>;

export const AllegedIssueSchema = z.object({
  issue: z.string(),
  evidence_quote: z.string(),
  page: z.number().int().min(1),
});
export type AllegedIssue = z.infer<typeof AllegedIssueSchema>;

export const FieldConfidenceSchema = z
  .object({
    notice_date: z.number().min(0).max(1),
    reply_due_date: z.number().min(0).max(1),
    amount_demanded: z.number().min(0).max(1),
  })
  .passthrough();
export type FieldConfidence = z.infer<typeof FieldConfidenceSchema>;

export const ExtractionDataSchema = z.object({
  notice_type: NoticeTypeSchema,
  type_confidence: z.number().min(0).max(1),
  gstin: z.string().nullable(),
  taxpayer_name: z.string().nullable(),
  issuing_office: z.string().nullable(),
  reference_number: z.string().nullable(),
  notice_date: z.string().nullable(), // YYYY-MM-DD or null
  reply_due_date: z.string().nullable(), // YYYY-MM-DD printed on notice or null
  financial_period: z.string().nullable(),
  sections_cited: z.array(z.string()),
  amount_demanded: AmountDemandedSchema,
  alleged_issues: z.array(AllegedIssueSchema),
  documents_requested: z.array(z.string()),
  language_detected: LanguageDetectSchema,
  legibility: LegibilitySchema,
  field_confidence: FieldConfidenceSchema,
});
export type ExtractionData = z.infer<typeof ExtractionDataSchema>;

export const ExtractionSchema = z.object({
  notice_id: z.string().uuid(),
  data: ExtractionDataSchema,
  model: z.string().nullable().optional(),
  latency_ms: z.number().int().nullable().optional(),
});
export type Extraction = z.infer<typeof ExtractionSchema>;

// Deterministic Deadline (Computed in code from notice_rules.json, never by LLM)
export const DeadlineSchema = z.object({
  computed_due_date: z.string().nullable(), // YYYY-MM-DD
  printed_due_date: z.string().nullable(), // YYYY-MM-DD from notice
  reply_form: z.string().nullable(), // e.g. "ASMT-11", "DRC-06"
  days_remaining: z.number().nullable(),
  is_estimate: z.boolean(),
  window_basis: z.string().nullable(), // e.g. "from date of service of notice", "working days"
  mismatch_flag: z.boolean(),
  warning: z.string().nullable().optional(),
});
export type Deadline = z.infer<typeof DeadlineSchema>;

// Analysis Entity (Bilingual summary, severity, checklist, action plan, validation)
export const ChecklistItemSchema = z.object({
  item: z.string(),
  why: z.string(),
  source_ids: z.array(z.string()),
});
export type ChecklistItem = z.infer<typeof ChecklistItemSchema>;

export const ActionPlanStepSchema = z.object({
  step: z.string(),
  due_date: z.string(),
  owner: z.string(), // "taxpayer" | "CA" | "accountant"
});
export type ActionPlanStep = z.infer<typeof ActionPlanStepSchema>;

export const CitationSchema = z.object({
  chunk_id: z.string(),
  label: z.string(),
  quote_snippet: z.string(),
});
export type Citation = z.infer<typeof CitationSchema>;

export const ValidationReportSchema = z.object({
  total: z.number().int().min(0),
  verified: z.number().int().min(0),
  dropped: z.array(z.string()),
});
export type ValidationReport = z.infer<typeof ValidationReportSchema>;

export const AnalysisSchema = z.object({
  notice_id: z.string().uuid(),
  summary_en: z.string(),
  summary_hi: z.string(),
  severity: SeverityLevelSchema,
  severity_reason: z.string(),
  what_they_want: z.array(z.string()).optional(),
  checklist: z.array(ChecklistItemSchema),
  action_plan: z.array(ActionPlanStepSchema),
  citations: z.array(CitationSchema),
  validation: ValidationReportSchema,
});
export type Analysis = z.infer<typeof AnalysisSchema>;

// Draft Entity (Reply letter in markdown, versioning, instructions)
export const DraftSchema = z.object({
  id: z.string().uuid().optional(),
  notice_id: z.string().uuid(),
  version: z.number().int().min(1).default(1),
  body_md: z.string(),
  instructions: z.string().nullable().optional(),
  created_at: z.string().optional(),
});
export type Draft = z.infer<typeof DraftSchema>;

// Source Chunk (Curated legal text chunk from knowledge base)
export const SourceChunkSchema = z.object({
  id: z.string(), // stable identifier e.g. "cgst-act-s73#p2"
  doc_id: z.string().optional(),
  section_ref: z.string(), // e.g. "Section 73(1)"
  content: z.string(),
  source_url: z.string().nullable().optional(),
  retrieved_on: z.string().nullable().optional(),
  score: z.number().optional(),
});
export type SourceChunk = z.infer<typeof SourceChunkSchema>;

// ============================================================================
// 3. GET /api/notices/:id Response Shape
// ============================================================================

export const NoticeResponseSchema = z.object({
  notice: NoticeSchema,
  extraction: ExtractionSchema.nullable().optional(),
  deadline: DeadlineSchema.nullable().optional(),
  analysis: AnalysisSchema.nullable().optional(),
  draft: DraftSchema.nullable().optional(),
  sources: z.record(z.string(), SourceChunkSchema).default({}),
});
export type NoticeResponse = z.infer<typeof NoticeResponseSchema>;

// Companion object supporting NoticeResponse.parse() helper
export const NoticeResponse = {
  schema: NoticeResponseSchema,
  parse: (data: unknown): NoticeResponse => NoticeResponseSchema.parse(data),
  safeParse: (data: unknown) => NoticeResponseSchema.safeParse(data),
};

// ============================================================================
// 4. API Error Structure
// ============================================================================

export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

// ============================================================================
// 5. Route Request and Response Payloads for every route in API Table
// ============================================================================

// POST /api/notices (Upload notice)
export const UploadNoticeRequestSchema = z.object({
  client_name: z.string().optional(),
});
export type UploadNoticeRequest = z.infer<typeof UploadNoticeRequestSchema>;

export const UploadNoticeResponseSchema = z.object({
  id: z.string().uuid(),
  status: NoticeStatusSchema,
});
export type UploadNoticeResponse = z.infer<typeof UploadNoticeResponseSchema>;

// POST /api/notices/:id/analyze (Run pipeline)
export const AnalyzeNoticeResponseSchema = z.object({
  id: z.string().uuid(),
  status: NoticeStatusSchema,
});
export type AnalyzeNoticeResponse = z.infer<typeof AnalyzeNoticeResponseSchema>;

// POST /api/notices/:id/draft (Regenerate draft)
export const RegenerateDraftRequestSchema = z.object({
  instructions: z.string().optional(),
});
export type RegenerateDraftRequest = z.infer<typeof RegenerateDraftRequestSchema>;

export const RegenerateDraftResponseSchema = z.object({
  draft: z.object({
    version: z.number().int(),
    body_md: z.string(),
  }),
});
export type RegenerateDraftResponse = z.infer<typeof RegenerateDraftResponseSchema>;

// GET /api/notices/:id/export?format=docx|md
export const ExportFormatQuerySchema = z.object({
  format: z.enum(["docx", "md"]).default("docx"),
});
export type ExportFormatQuery = z.infer<typeof ExportFormatQuerySchema>;

// POST /api/notices/:id/review-link
export const CreateReviewLinkRequestSchema = z.object({
  expires_in_hours: z.number().positive().default(72).optional(),
});
export type CreateReviewLinkRequest = z.infer<typeof CreateReviewLinkRequestSchema>;

export const CreateReviewLinkResponseSchema = z.object({
  url: z.string().url(),
  expires_at: z.string(),
  token: z.string().min(24),
});
export type CreateReviewLinkResponse = z.infer<typeof CreateReviewLinkResponseSchema>;

// GET /api/review/:token & POST /api/review/:token/comment
export const ReviewCommentSchema = z.object({
  author: z.string().min(1),
  text: z.string().min(1),
  at: z.string(),
});
export type ReviewComment = z.infer<typeof ReviewCommentSchema>;

export const ReviewViewNoticeSummarySchema = z.object({
  gstin: z.string(), // masked: first 4 and last 2 characters
  taxpayer_name: z.string().nullable(),
  notice_type: NoticeTypeSchema,
  notice_date: z.string().nullable(),
  reply_due_date: z.string().nullable(),
  summary_en: z.string(),
  severity: SeverityLevelSchema,
});
export type ReviewViewNoticeSummary = z.infer<typeof ReviewViewNoticeSummarySchema>;

export const ReviewViewResponseSchema = z.object({
  notice_summary: ReviewViewNoticeSummarySchema,
  draft: DraftSchema.nullable(),
  comments: z.array(ReviewCommentSchema),
});
export type ReviewViewResponse = z.infer<typeof ReviewViewResponseSchema>;

export const AddReviewCommentRequestSchema = z.object({
  author: z.string().min(1, "Author name is required"),
  text: z.string().min(1, "Comment text is required"),
});
export type AddReviewCommentRequest = z.infer<typeof AddReviewCommentRequestSchema>;

export const AddReviewCommentResponseSchema = z.object({
  success: z.boolean(),
  comments: z.array(ReviewCommentSchema),
});
export type AddReviewCommentResponse = z.infer<typeof AddReviewCommentResponseSchema>;

// GET /api/health
export const HealthCheckResponseSchema = z.object({
  ok: z.boolean(),
  db: z.boolean(),
});
export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;
