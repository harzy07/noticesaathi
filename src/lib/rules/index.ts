import fs from "fs";
import path from "path";
import { NoticeType } from "@contracts/types";

export interface NoticeRule {
  notice_type: NoticeType;
  title: string;
  legal_basis: string[];
  reply_form: string | null;
  window_days: number | null;
  day_type: "calendar" | "working";
  window_basis: string;
  base_severity: "low" | "medium" | "high" | "critical";
  verified_on: string | null;
  kb_queries: string[];
}

export interface ComputedDeadline {
  due_date: string | null;
  basis: string;
  is_estimate: boolean;
}

let cachedRules: Record<string, NoticeRule> | null = null;

/**
 * Loads the notice rules table from data/notice_rules.json
 */
export function loadRules(): Record<string, NoticeRule> {
  if (cachedRules) {
    return cachedRules;
  }

  const rulesPath = path.resolve(process.cwd(), "data/notice_rules.json");
  const rawData = fs.readFileSync(rulesPath, "utf-8");
  cachedRules = JSON.parse(rawData) as Record<string, NoticeRule>;
  return cachedRules;
}

/**
 * Retrieves a single rule by notice type, falling back to OTHER
 */
export function getRule(noticeType: string): NoticeRule {
  const rules = loadRules();
  return (
    rules[noticeType] ||
    rules["OTHER"] || {
      notice_type: "OTHER" as NoticeType,
      title: "General GST Notice",
      legal_basis: ["Section 125", "Section 75"],
      reply_form: null,
      window_days: null,
      day_type: "calendar",
      window_basis: "Check the notice for the deadline",
      base_severity: "medium",
      verified_on: null,
      kb_queries: ["Section 75", "Section 125"],
    }
  );
}

/**
 * Extensible hook for gazetted statutory holidays in India.
 * Can be populated from state/national calendar.
 */
export function isPublicHoliday(_date: Date): boolean {
  void _date;
  // Hook for statutory holiday calendar integration
  return false;
}

/**
 * Formats a Date object to YYYY-MM-DD in UTC / local calendar
 */
function formatDateToYYYYMMDD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Computes deterministic statutory deadline from noticeType and noticeDate (YYYY-MM-DD).
 * Working days skip Saturdays (6) and Sundays (0).
 */
export function computeReplyDeadline(
  noticeType: string,
  noticeDateStr: string | null
): ComputedDeadline {
  const rule = getRule(noticeType);

  if (!noticeDateStr || !rule.window_days) {
    return {
      due_date: null,
      basis: rule.window_basis || "Check the notice for the deadline",
      is_estimate: true,
    };
  }

  // Parse YYYY-MM-DD
  const parts = noticeDateStr.split("-").map((p) => parseInt(p, 10));
  if (parts.length !== 3 || parts.some((p) => isNaN(p))) {
    return {
      due_date: null,
      basis: rule.window_basis,
      is_estimate: true,
    };
  }

  const [year, month, day] = parts;
  const cursor = new Date(year, month - 1, day);

  if (isNaN(cursor.getTime())) {
    return {
      due_date: null,
      basis: rule.window_basis,
      is_estimate: true,
    };
  }

  if (rule.day_type === "working") {
    let daysAdded = 0;
    while (daysAdded < rule.window_days) {
      cursor.setDate(cursor.getDate() + 1);
      const dayOfWeek = cursor.getDay();
      // Skip Saturday (6) and Sunday (0)
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isPublicHoliday(cursor)) {
        daysAdded++;
      }
    }
  } else {
    // Calendar days
    cursor.setDate(cursor.getDate() + rule.window_days);
  }

  return {
    due_date: formatDateToYYYYMMDD(cursor),
    basis: rule.window_basis,
    is_estimate: false,
  };
}

/**
 * Calculates remaining days from today (UTC/local) until target date.
 */
export function calculateDaysRemaining(targetDateStr: string | null): number | null {
  if (!targetDateStr) return null;
  const parts = targetDateStr.split("-").map((p) => parseInt(p, 10));
  if (parts.length !== 3 || parts.some((p) => isNaN(p))) return null;

  const target = new Date(parts[0], parts[1] - 1, parts[2]);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffMs = target.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Compares computed deadline against printed deadline to detect officer discrepancies.
 */
export function compareDueDates(
  computedDueDate: string | null,
  printedDueDate: string | null
): {
  mismatch: boolean;
  warning?: string;
} {
  if (!computedDueDate || !printedDueDate) {
    return { mismatch: false };
  }

  const mismatch = computedDueDate !== printedDueDate;
  let warning: string | undefined;

  if (mismatch) {
    warning = `Statutory deadline discrepancy: Law stipulates reply by ${computedDueDate}, but notice states ${printedDueDate}. We recommend adhering to the earlier date (${
      computedDueDate < printedDueDate ? computedDueDate : printedDueDate
    }) to prevent adverse ex-parte proceedings.`;
  }

  return { mismatch, warning };
}

/**
 * Determines whether Section 74A or Section 73/74 applies based on financial period.
 * Section 74A applies to periods from FY 2024-25 onward; Sections 73/74 to earlier periods.
 */
export function getApplicableTaxDeterminationSection(
  financialPeriod: string | null,
  isFraudAlleged: boolean = false
): {
  primarySection: "Section 74A" | "Section 73" | "Section 74";
  rationale: string;
} {
  if (!financialPeriod) {
    return {
      primarySection: isFraudAlleged ? "Section 74" : "Section 73",
      rationale: "Defaulting to pre-2024 statutory regime in absence of explicit period.",
    };
  }

  // Detect FY 2024-25, FY 24-25, 2024-2025, 2025-26, etc.
  const match = financialPeriod.match(/(?:20)?(2[4-9])[-–/](?:20)?(2[5-9])/);
  if (match) {
    return {
      primarySection: "Section 74A",
      rationale:
        "Financial period is FY 2024-25 or later. Section 74A governs common tax determination irrespective of fraud or non-fraud.",
    };
  }

  if (isFraudAlleged) {
    return {
      primarySection: "Section 74",
      rationale:
        "Financial period is prior to FY 2024-25 with fraud/willful misstatement alleged.",
    };
  }

  return {
    primarySection: "Section 73",
    rationale:
      "Financial period is prior to FY 2024-25 without fraud/willful misstatement allegations.",
  };
}
