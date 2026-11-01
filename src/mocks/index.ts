import processingExtracting from "../../contracts/fixtures/processing-extracting.json";
import processingDrafting from "../../contracts/fixtures/processing-drafting.json";
import doneAsmt10 from "../../contracts/fixtures/done-asmt10.json";
import doneDrc01 from "../../contracts/fixtures/done-drc01.json";
import doneLowConfidence from "../../contracts/fixtures/done-low-confidence.json";
import doneDeadlineMismatch from "../../contracts/fixtures/done-deadline-mismatch.json";
import doneOtherType from "../../contracts/fixtures/done-other-type.json";
import failed from "../../contracts/fixtures/failed.json";
import { NoticeResponse } from "@contracts/types";

export const MOCK_FIXTURES: Record<string, NoticeResponse> = {
  "processing-extracting": processingExtracting as unknown as NoticeResponse,
  "processing-drafting": processingDrafting as unknown as NoticeResponse,
  "done-asmt10": doneAsmt10 as unknown as NoticeResponse,
  "done-drc01": doneDrc01 as unknown as NoticeResponse,
  "done-low-confidence": doneLowConfidence as unknown as NoticeResponse,
  "done-deadline-mismatch": doneDeadlineMismatch as unknown as NoticeResponse,
  "done-other-type": doneOtherType as unknown as NoticeResponse,
  failed: failed as unknown as NoticeResponse,
};

export {
  processingExtracting,
  processingDrafting,
  doneAsmt10,
  doneDrc01,
  doneLowConfidence,
  doneDeadlineMismatch,
  doneOtherType,
  failed,
};
