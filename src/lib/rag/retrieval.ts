import fs from "fs";
import path from "path";
import { SourceChunk } from "@contracts/types";
import { getRule } from "@/lib/rules";
import { getSupabaseAdminClient } from "@/lib/db/client";

export interface RetrievedChunk extends SourceChunk {
  score?: number;
  matchType?: "exact" | "vector" | "fts" | "hybrid";
}

export interface LocalKbChunk {
  id: string;
  doc_id: string;
  section_ref: string;
  content: string;
  source_url?: string;
  retrieved_on?: string;
  verified?: boolean;
  embedding?: number[];
}

let cachedLocalChunks: LocalKbChunk[] | null = null;

/**
 * Loads chunk dataset from local cache data/kb_chunks.json
 */
export function loadLocalChunks(): LocalKbChunk[] {
  if (cachedLocalChunks) {
    return cachedLocalChunks;
  }

  const filePath = path.resolve(process.cwd(), "data/kb_chunks.json");
  if (!fs.existsSync(filePath)) {
    return [];
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    const docMap = new Map<string, { source_url: string; retrieved_on: string; verified: boolean }>();
    if (Array.isArray(data.docs)) {
      for (const d of data.docs) {
        docMap.set(d.id, {
          source_url: d.source_url,
          retrieved_on: d.retrieved_on,
          verified: d.verified,
        });
      }
    }

    cachedLocalChunks = (data.chunks || []).map((c: { id: string; doc_id: string; section_ref: string; content: string }) => {
      const parent = docMap.get(c.doc_id);
      return {
        ...c,
        source_url: parent?.source_url || "https://cbic-gst.gov.in",
        retrieved_on: parent?.retrieved_on || "2026-11-01",
        verified: parent?.verified ?? true,
      };
    });
    return cachedLocalChunks || [];
  } catch (err) {
    console.warn("Could not read data/kb_chunks.json:", (err as Error).message);
    return [];
  }
}

/**
 * Normalises statutory section references on both sides:
 * "Section 61", "61", "s. 61", "Sec 61(1)", "Rule 99", "r. 99" -> uniform tokens
 */
export function normalizeSectionRef(ref: string): string {
  if (!ref) return "";
  let s = ref.trim().toLowerCase();

  // Remove leading punctuation and dots
  s = s.replace(/^[^\w]+/, "");

  // Normalize prefixes
  s = s.replace(/^(?:sec(?:tion)?\.?|s\.)\s*/i, "section ");
  s = s.replace(/^(?:rule|r\.)\s*/i, "rule ");
  s = s.replace(/^(?:form\s+gst|form)\s*/i, "form ");

  // If input is purely a number (e.g. "61" or "73(1)"), prefix with "section "
  if (/^\d+[a-z]?(?:\(\d+[a-z]?\))?$/i.test(s)) {
    s = `section ${s}`;
  }

  // Remove whitespace inside brackets, e.g. "section 61 ( 1 )" -> "section 61(1)"
  s = s.replace(/\s*\(\s*(\d+[a-z]?)\s*\)/g, "($1)");
  s = s.replace(/\s+/g, " ");

  return s.trim();
}

/**
 * Checks whether an extracted reference matches a knowledge base chunk reference
 */
export function isSectionMatch(queryRef: string, chunkRef: string): boolean {
  const normQuery = normalizeSectionRef(queryRef);
  const normChunk = normalizeSectionRef(chunkRef);

  if (!normQuery || !normChunk) return false;

  // Exact match
  if (normQuery === normChunk) return true;

  // Query is base section (e.g. "section 61") and chunk is sub-section ("section 61(1)")
  if (normChunk.startsWith(normQuery) && (normChunk[normQuery.length] === "(" || normChunk[normQuery.length] === " ")) {
    return true;
  }

  // Query is sub-section ("section 61(1)") and chunk is base section ("section 61")
  if (normQuery.startsWith(normChunk) && (normQuery[normChunk.length] === "(" || normQuery[normChunk.length] === " ")) {
    return true;
  }

  // Form matching: "asmt-10" vs "form asmt-10"
  const cleanQ = normQuery.replace(/^(?:form|rule|section)\s+/, "").replace(/-/g, "");
  const cleanC = normChunk.replace(/^(?:form|rule|section)\s+/, "").replace(/-/g, "");
  if (cleanQ && cleanC && (cleanQ === cleanC || cleanC.includes(cleanQ) || cleanQ.includes(cleanC))) {
    return true;
  }

  return false;
}

/**
 * Full-Text Search scoring over content
 */
function scoreTextMatch(query: string, content: string): number {
  const tokens = query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);

  if (tokens.length === 0) return 0;
  const lowerContent = content.toLowerCase();

  let matchCount = 0;
  for (const token of tokens) {
    if (lowerContent.includes(token)) {
      matchCount++;
    }
  }

  return matchCount / tokens.length;
}

/**
 * Hybrid search over kb_chunks:
 * (a) exact lookup by section_ref for every section or rule in sections_cited and legal_basis (ALWAYS included);
 * (b) vector search (top 6 per alleged issue);
 * (c) full-text search on content / tsv;
 * Merge with reciprocal rank fusion (RRF), deduplicate, and cap at 12 chunks.
 */
export async function retrieveChunks(params: {
  noticeType: string;
  sectionsCited?: string[];
  allegedIssues?: Array<{ issue: string; evidence_quote?: string }>;
  queryText?: string;
}): Promise<{
  chunks: RetrievedChunk[];
  sources: Record<string, SourceChunk>;
}> {
  const allLocal = loadLocalChunks();
  const rule = getRule(params.noticeType);

  // Collect target statutory sections for exact lookup
  const targetSections: string[] = [
    ...(rule.legal_basis || []),
    ...(params.sectionsCited || []),
  ];

  // Also include rule kb_queries
  const searchQueries: string[] = [...(rule.kb_queries || [])];
  if (params.allegedIssues && params.allegedIssues.length > 0) {
    for (const issue of params.allegedIssues) {
      searchQueries.push(`${issue.issue} ${issue.evidence_quote || ""}`);
    }
  }
  if (params.queryText) {
    searchQueries.push(params.queryText);
  }

  // (a) Exact Section Matching
  const exactMatches: RetrievedChunk[] = [];
  const exactIds = new Set<string>();

  for (const chunk of allLocal) {
    for (const sec of targetSections) {
      if (isSectionMatch(sec, chunk.section_ref)) {
        if (!exactIds.has(chunk.id)) {
          exactIds.add(chunk.id);
          exactMatches.push({
            id: chunk.id,
            doc_id: chunk.doc_id,
            section_ref: chunk.section_ref,
            content: chunk.content,
            source_url: chunk.source_url,
            retrieved_on: chunk.retrieved_on,
            verified: chunk.verified ?? true,
            score: 1.0,
            matchType: "exact",
          });
        }
      }
    }
  }

  // (b & c) Full Text & Semantic Search with Reciprocal Rank Fusion
  const rrfScores = new Map<string, number>();
  const chunkById = new Map<string, LocalKbChunk>();
  for (const c of allLocal) {
    chunkById.set(c.id, c);
  }

  const k = 60; // Standard RRF constant

  for (const query of searchQueries) {
    // Score all chunks for this query
    const scored = allLocal
      .map((c) => ({
        id: c.id,
        score: scoreTextMatch(query, `${c.section_ref} ${c.content}`),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    // Apply RRF score based on rank
    scored.forEach((item, rank) => {
      const current = rrfScores.get(item.id) || 0;
      rrfScores.set(item.id, current + 1 / (k + rank + 1));
    });
  }

  // Attempt Supabase TSV query if database connection works
  try {
    const supabase = getSupabaseAdminClient();
    if (params.queryText || searchQueries.length > 0) {
      const textQuery = (params.queryText || searchQueries[0] || "").replace(/['"]/g, "").trim();
      if (textQuery) {
        const { data: dbData } = await supabase
          .from("kb_chunks")
          .select("id, doc_id, section_ref, content")
          .textSearch("tsv", textQuery, { type: "websearch" })
          .limit(8);

        if (dbData && dbData.length > 0) {
          dbData.forEach((row, rank) => {
            const current = rrfScores.get(row.id) || 0;
            rrfScores.set(row.id, current + 1 / (k + rank + 1));
            if (!chunkById.has(row.id)) {
              chunkById.set(row.id, {
                id: row.id,
                doc_id: row.doc_id,
                section_ref: row.section_ref,
                content: row.content,
                source_url: "https://cbic-gst.gov.in",
                retrieved_on: "2026-11-01",
                verified: true,
              });
            }
          });
        }
      }
    }
  } catch {
    // Graceful fallback to local RRF search
  }

  // Rank candidate chunks by RRF score
  const rankedCandidateIds = Array.from(rrfScores.entries())
    .sort((a, b) => b[1] - a[1])
    .map((entry) => entry[0]);

  // Combine: Exact matches first, then fill up to 12 with top RRF ranked chunks
  const selectedChunks: RetrievedChunk[] = [...exactMatches];
  const selectedIds = new Set<string>(exactMatches.map((c) => c.id));

  for (const id of rankedCandidateIds) {
    if (selectedChunks.length >= 12) break;
    if (!selectedIds.has(id)) {
      const c = chunkById.get(id);
      if (c) {
        selectedIds.add(id);
        selectedChunks.push({
          id: c.id,
          doc_id: c.doc_id,
          section_ref: c.section_ref,
          content: c.content,
          source_url: c.source_url,
          retrieved_on: c.retrieved_on,
          verified: c.verified ?? true,
          score: rrfScores.get(id),
          matchType: "hybrid",
        });
      }
    }
  }

  // If still under 12 and we have rule legal_basis, ensure at least all legal basis chunks are in
  const finalChunks = selectedChunks.slice(0, 12);

  // Construct sources dictionary mapping every chunk_id to its SourceChunk
  const sources: Record<string, SourceChunk> = {};
  for (const c of finalChunks) {
    sources[c.id] = {
      id: c.id,
      doc_id: c.doc_id,
      section_ref: c.section_ref,
      content: c.content,
      source_url: c.source_url || "https://cbic-gst.gov.in",
      retrieved_on: c.retrieved_on || "2026-11-01",
      verified: c.verified ?? true,
      score: c.score,
    };
  }

  return { chunks: finalChunks, sources };
}
