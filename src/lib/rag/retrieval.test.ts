import { describe, it, expect } from "vitest";
import {
  normalizeSectionRef,
  isSectionMatch,
  retrieveChunks,
} from "./retrieval";

describe("Hybrid Legal Retrieval & Statutory Grounding Engine", () => {
  describe("Reference Normalisation", () => {
    it("normalises various forms of Section 61", () => {
      expect(normalizeSectionRef("Section 61")).toBe("section 61");
      expect(normalizeSectionRef("Sec 61")).toBe("section 61");
      expect(normalizeSectionRef("s. 61")).toBe("section 61");
      expect(normalizeSectionRef("61")).toBe("section 61");
      expect(normalizeSectionRef("Sec. 61(1)")).toBe("section 61(1)");
      expect(normalizeSectionRef("Section 61 ( 2 )")).toBe("section 61(2)");
    });

    it("normalises Rules and Forms", () => {
      expect(normalizeSectionRef("Rule 99")).toBe("rule 99");
      expect(normalizeSectionRef("r. 99(2)")).toBe("rule 99(2)");
      expect(normalizeSectionRef("Form GST ASMT-10")).toBe("form asmt-10");
      expect(normalizeSectionRef("ASMT-10")).toBe("asmt-10");
    });

    it("correctly matches section query against chunk section_ref", () => {
      expect(isSectionMatch("Section 61", "Section 61(1)")).toBe(true);
      expect(isSectionMatch("61", "Section 61(2)")).toBe(true);
      expect(isSectionMatch("s. 61", "Section 61")).toBe(true);
      expect(isSectionMatch("Rule 99", "Rule 99(1)")).toBe(true);
      expect(isSectionMatch("ASMT-10", "Form GST ASMT-10")).toBe(true);
      expect(isSectionMatch("Section 73", "Section 74")).toBe(false);
    });
  });

  describe("Notice Type Retrieval Matching", () => {
    it("ASMT-10 notice retrieves chunks matching legal_basis (Section 61, Rule 99)", async () => {
      const { chunks, sources } = await retrieveChunks({
        noticeType: "ASMT-10",
      });

      expect(chunks.length).toBeGreaterThan(0);
      expect(chunks.length).toBeLessThanOrEqual(12);

      const sectionRefs = chunks.map((c) => c.section_ref);
      const hasSec61 = sectionRefs.some((r) => r.includes("61"));
      const hasRule99 = sectionRefs.some((r) => r.includes("99"));

      expect(hasSec61).toBe(true);
      expect(hasRule99).toBe(true);

      // Verify sources dictionary has matching keys
      for (const chunk of chunks) {
        expect(sources[chunk.id]).toBeDefined();
        expect(sources[chunk.id].section_ref).toBe(chunk.section_ref);
      }
    });

    it("DRC-01 notice retrieves chunks matching Section 73/74/74A or Rule 142", async () => {
      const { chunks } = await retrieveChunks({
        noticeType: "DRC-01",
      });

      const sectionRefs = chunks.map((c) => c.section_ref);
      const hasTaxDet = sectionRefs.some(
        (r) => r.includes("73") || r.includes("74") || r.includes("142")
      );
      expect(hasTaxDet).toBe(true);
    });

    it("REG-03 notice retrieves Rule 9 chunks", async () => {
      const { chunks } = await retrieveChunks({
        noticeType: "REG-03",
      });

      const sectionRefs = chunks.map((c) => c.section_ref);
      const hasRule9 = sectionRefs.some((r) => r.includes("9"));
      expect(hasRule9).toBe(true);
    });

    it("REG-17 notice retrieves Section 29 or Rule 22 chunks", async () => {
      const { chunks } = await retrieveChunks({
        noticeType: "REG-17",
      });

      const sectionRefs = chunks.map((c) => c.section_ref);
      const hasCancellation = sectionRefs.some(
        (r) => r.includes("29") || r.includes("22")
      );
      expect(hasCancellation).toBe(true);
    });

    it("GSTR-3A notice retrieves return non-filer chunks (Section 39, Section 62)", async () => {
      const { chunks } = await retrieveChunks({
        noticeType: "GSTR-3A",
      });

      const sectionRefs = chunks.map((c) => c.section_ref);
      const hasReturnDef = sectionRefs.some(
        (r) => r.includes("39") || r.includes("62")
      );
      expect(hasReturnDef).toBe(true);
    });
  });

  describe("Factual Query Matching (Semantic / TSV Search)", () => {
    it("query about 'ITC mismatch GSTR-2A' surfaces Section 16 or scrutiny chunks", async () => {
      const { chunks } = await retrieveChunks({
        noticeType: "ASMT-10",
        allegedIssues: [
          {
            issue: "Excess input tax credit claimed in GSTR-3B compared to GSTR-2A",
            evidence_quote: "ITC mismatch between GSTR-3B and GSTR-2A",
          },
        ],
        queryText: "ITC mismatch GSTR-2A input tax credit",
      });

      expect(chunks.length).toBeGreaterThan(0);
      const docIds = chunks.map((c) => c.doc_id);
      const hasItcOrScrutiny = docIds.some(
        (id) => id === "cgst-act-s16" || id === "cgst-act-s61" || id === "cgst-rule-r99"
      );
      expect(hasItcOrScrutiny).toBe(true);
    });

    it("caps retrieved chunks at 12 and deduplicates chunk ids", async () => {
      const { chunks } = await retrieveChunks({
        noticeType: "DRC-01",
        sectionsCited: ["Section 16", "Section 73", "Section 74", "Section 50", "Section 122"],
        allegedIssues: [
          { issue: "Interest on delayed tax payment under section 50" },
          { issue: "Wrongful ITC under section 16" },
          { issue: "Penalty under section 122" },
        ],
      });

      expect(chunks.length).toBeLessThanOrEqual(12);

      const idSet = new Set(chunks.map((c) => c.id));
      expect(idSet.size).toBe(chunks.length);
    });
  });
});
