import { describe, it, expect } from "vitest";
import {
  computeReplyDeadline,
  compareDueDates,
  getApplicableTaxDeterminationSection,
  loadRules,
  getRule,
} from "./index";

describe("Notice Rules & Statutory Deadline Engine", () => {
  it("loads all configured notice rules from JSON", () => {
    const rules = loadRules();
    expect(rules["ASMT-10"]).toBeDefined();
    expect(rules["DRC-01"]).toBeDefined();
    expect(rules["DRC-01A"]).toBeDefined();
    expect(rules["REG-03"]).toBeDefined();
    expect(rules["REG-17"]).toBeDefined();
    expect(rules["GSTR-3A"]).toBeDefined();
    expect(rules["OTHER"]).toBeDefined();
  });

  it("retrieves a specific rule and handles unknown notice type fallback", () => {
    const asmt10 = getRule("ASMT-10");
    expect(asmt10.reply_form).toBe("ASMT-11");
    expect(asmt10.window_days).toBe(30);

    const unknown = getRule("UNKNOWN-999");
    expect(unknown.notice_type).toBe("OTHER");
  });

  // Case 1: ASMT-10 standard 30 calendar days
  it("Case 1: computes ASMT-10 standard 30 calendar days", () => {
    const res = computeReplyDeadline("ASMT-10", "2026-04-10");
    expect(res.due_date).toBe("2026-05-10");
    expect(res.is_estimate).toBe(false);
  });

  // Case 2: Month-end rollover across 31-day month
  it("Case 2: computes month-end rollover (Jan 31 + 30 days -> March 2)", () => {
    const res = computeReplyDeadline("ASMT-10", "2026-01-31");
    // 2026 is non-leap year (Feb has 28 days) -> Jan 31 + 28 days is Feb 28, + 2 days is March 2
    expect(res.due_date).toBe("2026-03-02");
    expect(res.is_estimate).toBe(false);
  });

  // Case 3: Leap year leap day transition (2024 has Feb 29)
  it("Case 3: computes leap year February transition (2024-02-15 + 30 days -> 2024-03-16)", () => {
    const res = computeReplyDeadline("ASMT-10", "2024-02-15");
    // 2024 Feb has 29 days (14 days remaining in Feb) + 16 days in March = March 16
    expect(res.due_date).toBe("2024-03-16");
    expect(res.is_estimate).toBe(false);
  });

  // Case 4: Non-leap year February transition (2025 has Feb 28)
  it("Case 4: computes non-leap year February transition (2025-02-15 + 30 days -> 2025-03-17)", () => {
    const res = computeReplyDeadline("ASMT-10", "2025-02-15");
    // 2025 Feb has 28 days (13 days remaining in Feb) + 17 days in March = March 17
    expect(res.due_date).toBe("2025-03-17");
    expect(res.is_estimate).toBe(false);
  });

  // Case 5: REG-03 working days (skips Saturday and Sunday)
  it("Case 5: computes REG-03 7 working days starting Monday", () => {
    // 2026-05-04 is Monday
    // Day 1: Tue 05-05
    // Day 2: Wed 05-06
    // Day 3: Thu 05-07
    // Day 4: Fri 05-08
    // Sat 05-09, Sun 05-10 (SKIPPED)
    // Day 5: Mon 05-11
    // Day 6: Tue 05-12
    // Day 7: Wed 05-13
    const res = computeReplyDeadline("REG-03", "2026-05-04");
    expect(res.due_date).toBe("2026-05-13");
    expect(res.is_estimate).toBe(false);
  });

  // Case 6: REG-17 working days starting Friday (spans 2 weekends)
  it("Case 6: computes REG-17 7 working days starting Friday spanning two weekends", () => {
    // 2026-05-08 is Friday
    // Sat 05-09, Sun 05-10 (SKIPPED)
    // Day 1: Mon 05-11
    // Day 2: Tue 05-12
    // Day 3: Wed 05-13
    // Day 4: Thu 05-14
    // Day 5: Fri 05-15
    // Sat 05-16, Sun 05-17 (SKIPPED)
    // Day 6: Mon 05-18
    // Day 7: Tue 05-19
    const res = computeReplyDeadline("REG-17", "2026-05-08");
    expect(res.due_date).toBe("2026-05-19");
    expect(res.is_estimate).toBe(false);
  });

  // Case 7: DRC-01A has null window_days
  it("Case 7: returns null due_date and is_estimate=true for DRC-01A with no statutory fixed window", () => {
    const res = computeReplyDeadline("DRC-01A", "2026-10-01");
    expect(res.due_date).toBeNull();
    expect(res.is_estimate).toBe(true);
  });

  // Case 8: Deadline mismatch detection
  it("Case 8: detects mismatch when officer printed date differs from legal window", () => {
    const match = compareDueDates("2026-05-10", "2026-05-10");
    expect(match.mismatch).toBe(false);

    const mismatch = compareDueDates("2026-05-10", "2026-04-25");
    expect(mismatch.mismatch).toBe(true);
    expect(mismatch.warning).toContain("Statutory deadline discrepancy");
  });

  // Case 9: Section 74A vs Section 73/74 selection based on Financial Period
  it("Case 9: selects Section 74A for FY 2024-25 and Section 73 for earlier FYs", () => {
    const post2024 = getApplicableTaxDeterminationSection("FY 2024-25");
    expect(post2024.primarySection).toBe("Section 74A");

    const pre2024NonFraud = getApplicableTaxDeterminationSection("2022-23", false);
    expect(pre2024NonFraud.primarySection).toBe("Section 73");

    const pre2024Fraud = getApplicableTaxDeterminationSection("2022-23", true);
    expect(pre2024Fraud.primarySection).toBe("Section 74");
  });
});
