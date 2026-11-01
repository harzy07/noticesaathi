import fs from "fs";
import path from "path";
import { NoticeResponse } from "../contracts/types";

const FIXTURES_DIR = path.resolve(__dirname, "../contracts/fixtures");

const REQUIRED_FIXTURES = [
  "processing-extracting.json",
  "processing-drafting.json",
  "done-asmt10.json",
  "done-drc01.json",
  "done-low-confidence.json",
  "done-deadline-mismatch.json",
  "done-other-type.json",
  "failed.json",
];

function validateFixtureFile(filename: string): void {
  const filePath = path.join(FIXTURES_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required fixture file: ${filename}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Invalid JSON in fixture ${filename}: ${(err as Error).message}`);
  }

  // 1. Zod schema validation
  const parsed = NoticeResponse.parse(data);

  // 2. Realistic content & business rule validations
  if (parsed.draft) {
    // Check exactly 4 [ADD: ...] placeholders
    const placeholderMatches = parsed.draft.body_md.match(/\[ADD:[^\]]+\]/g) || [];
    if (placeholderMatches.length !== 4) {
      throw new Error(
        `Fixture ${filename}: Draft must contain exactly 4 [ADD: ...] placeholders, found ${placeholderMatches.length}`
      );
    }

    // Extract all [[chunk_id]] tags from body_md and verify they exist in sources
    const chunkTagMatches = parsed.draft.body_md.match(/\[\[([a-zA-Z0-9_\-#]+)\]\]/g) || [];
    for (const tag of chunkTagMatches) {
      const chunkId = tag.slice(2, -2);
      if (!parsed.sources[chunkId]) {
        throw new Error(
          `Fixture ${filename}: Draft references chunk [[${chunkId}]] which is missing in sources map`
        );
      }
    }
  }

  if (parsed.analysis) {
    // Check checklist [[chunk_id]] tags
    for (const item of parsed.analysis.checklist) {
      for (const sourceId of item.source_ids) {
        if (!parsed.sources[sourceId]) {
          throw new Error(
            `Fixture ${filename}: Checklist references source_id "${sourceId}" which is missing in sources map`
          );
        }
      }
    }

    // Check Devanagari characters in Hindi summary
    const hasDevanagari = /[\u0900-\u097F]/.test(parsed.analysis.summary_hi);
    if (!hasDevanagari) {
      throw new Error(
        `Fixture ${filename}: analysis.summary_hi must contain Devanagari script`
      );
    }
  }

  // Fixture-specific checks
  if (filename === "done-low-confidence.json") {
    if (!parsed.extraction) {
      throw new Error(`done-low-confidence.json must include extraction`);
    }
    const conf = parsed.extraction.data.field_confidence;
    const lowCount = Object.values(conf).filter((val) => typeof val === "number" && val < 0.7).length;
    if (lowCount < 2) {
      throw new Error(`done-low-confidence.json must have multiple field_confidence values < 0.7`);
    }
  }

  if (filename === "done-deadline-mismatch.json") {
    if (!parsed.deadline || !parsed.deadline.mismatch_flag) {
      throw new Error(`done-deadline-mismatch.json must have deadline.mismatch_flag set to true`);
    }
    if (parsed.deadline.computed_due_date === parsed.deadline.printed_due_date) {
      throw new Error(`done-deadline-mismatch.json must have differing computed and printed due dates`);
    }
  }

  if (filename === "done-other-type.json") {
    if (parsed.extraction?.data.notice_type !== "OTHER") {
      throw new Error(`done-other-type.json must have notice_type = 'OTHER'`);
    }
    if (parsed.draft !== null && parsed.draft !== undefined) {
      throw new Error(`done-other-type.json must not include a draft`);
    }
  }

  if (filename === "failed.json") {
    if (parsed.notice.status !== "failed" || !parsed.notice.error) {
      throw new Error(`failed.json must have notice.status = 'failed' and non-empty error`);
    }
    if (!parsed.extraction) {
      throw new Error(`failed.json must preserve partial extraction`);
    }
  }

  console.log(`✓ ${filename} validated successfully`);
}

function main(): void {
  console.log(`Validating ${REQUIRED_FIXTURES.length} fixtures against contracts/types.ts schemas...`);
  let errors = 0;

  for (const fixture of REQUIRED_FIXTURES) {
    try {
      validateFixtureFile(fixture);
    } catch (err) {
      console.error(`✗ Error validating ${fixture}:`, (err as Error).message);
      errors++;
    }
  }

  if (errors > 0) {
    console.error(`\nValidation failed with ${errors} error(s).`);
    process.exit(1);
  }

  console.log(`\nAll ${REQUIRED_FIXTURES.length} fixtures passed schema and contract rules!`);
}

main();
