import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { getSupabaseAdminClient } from "../src/lib/db/client";

// Load .env.local explicitly
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

export interface KbDoc {
  id: string;
  title: string;
  source_url: string;
  source_type: string;
  version_note?: string;
  retrieved_on: string;
  verified: boolean;
}

export interface KbChunk {
  id: string;
  doc_id: string;
  section_ref: string;
  content: string;
  embedding?: number[];
  verified?: boolean;
}

/**
 * Parses markdown front matter and body
 */
function parseFrontMatter(content: string): { meta: Record<string, string | boolean>; body: string } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { meta: {}, body: content };
  }

  const rawMeta = match[1];
  const body = match[2];
  const meta: Record<string, string | boolean> = {};

  for (const line of rawMeta.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;
    const key = trimmed.slice(0, colonIdx).trim();
    let val: string | boolean = trimmed.slice(colonIdx + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    } else if (val === "true") {
      val = true;
    } else if (val === "false") {
      val = false;
    }
    meta[key] = val;
  }

  return { meta, body };
}

/**
 * Extracts section reference from heading or falls back to doc title
 */
function extractSectionRef(heading: string, docTitle: string): string {
  const cleanHeading = heading.replace(/^#+\s*/, "").trim();
  const secMatch = cleanHeading.match(/(Section\s+\d+[A-Z]?(?:\(\d+[a-z]?\))?|Rule\s+\d+[A-Z]?(?:\(\d+[a-z]?\))?|Form\s+GST\s+[A-Z0-9-]+)/i);
  if (secMatch) {
    return secMatch[1];
  }

  const titleMatch = docTitle.match(/(Section\s+\d+[A-Z]?|Rule\s+\d+[A-Z]?|Form\s+GST\s+[A-Z0-9-]+)/i);
  return titleMatch ? titleMatch[1] : cleanHeading.slice(0, 40);
}

/**
 * Splits document content into cohesive chunks by sub-heading or paragraph blocks (~250-350 tokens)
 */
export function chunkDocument(docId: string, docTitle: string, body: string): KbChunk[] {
  const chunks: KbChunk[] = [];
  // Split by markdown headings (### or ##)
  const sections = body.split(/(?=^#{2,3}\s+)/m).filter((s) => s.trim().length > 0);

  let partIndex = 1;
  for (const section of sections) {
    const lines = section.trim().split("\n");
    let currentRef = docTitle;
    let textContent = section.trim();

    if (lines[0].startsWith("#")) {
      currentRef = extractSectionRef(lines[0], docTitle);
      textContent = lines.slice(1).join("\n").trim();
    }

    if (!textContent) continue;

    // If section is long, further split into paragraphs of ~300 words without cutting mid-clause
    const paragraphs = textContent.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
    let currentChunkText = "";

    for (const para of paragraphs) {
      if ((currentChunkText + " " + para).split(/\s+/).length > 350 && currentChunkText.length > 0) {
        chunks.push({
          id: `${docId}#p${partIndex++}`,
          doc_id: docId,
          section_ref: currentRef,
          content: currentChunkText.trim(),
        });
        currentChunkText = para;
      } else {
        currentChunkText = currentChunkText ? `${currentChunkText}\n\n${para}` : para;
      }
    }

    if (currentChunkText.trim().length > 0) {
      chunks.push({
        id: `${docId}#p${partIndex++}`,
        doc_id: docId,
        section_ref: currentRef,
        content: currentChunkText.trim(),
      });
    }
  }

  return chunks;
}

async function generateEmbedding(ai: GoogleGenAI | null, text: string): Promise<number[] | undefined> {
  if (!ai || !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "mock-or-dev-key") {
    return undefined;
  }

  try {
    const embedModel = process.env.GEMINI_EMBED_MODEL || "text-embedding-004";
    const res = await ai.models.embedContent({
      model: embedModel,
      contents: text,
      config: {
        outputDimensionality: 768,
      },
    });

    const values = (res as { embedding?: { values?: number[] }; embeddings?: Array<{ values?: number[] }> }).embedding?.values ||
      (res as { embedding?: { values?: number[] }; embeddings?: Array<{ values?: number[] }> }).embeddings?.[0]?.values;

    return values;
  } catch (err) {
    console.warn("Embedding generation warning (will fallback to local TSV/exact search):", (err as Error).message);
    return undefined;
  }
}

export async function ingestKnowledgeBase(): Promise<{ docCount: number; chunkCount: number }> {
  const kbDir = path.resolve(process.cwd(), "data/kb");
  if (!fs.existsSync(kbDir)) {
    throw new Error(`KB directory not found: ${kbDir}`);
  }

  const files = fs.readdirSync(kbDir).filter((f) => f.endsWith(".md"));
  const allDocs: KbDoc[] = [];
  const allChunks: KbChunk[] = [];
  const reportRows: Array<{ docId: string; title: string; chunks: number; verified: boolean }> = [];

  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "mock-or-dev-key") {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  for (const file of files) {
    const filePath = path.join(kbDir, file);
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { meta, body } = parseFrontMatter(rawContent);

    const docId = (meta.id as string) || file.replace(/\.md$/, "");
    const title = (meta.title as string) || docId;
    const sourceUrl = (meta.source_url as string) || "https://cbic-gst.gov.in";
    const sourceType = (meta.source_type as string) || "act";
    const versionNote = (meta.version_note as string) || "";
    const retrievedOn = (meta.retrieved_on as string) || "2026-11-01";
    const verified = meta.verified === true;

    const docRecord: KbDoc = {
      id: docId,
      title,
      source_url: sourceUrl,
      source_type: sourceType,
      version_note: versionNote,
      retrieved_on: retrievedOn,
      verified,
    };
    allDocs.push(docRecord);

    const docChunks = chunkDocument(docId, title, body);
    for (const c of docChunks) {
      c.verified = verified;
      allChunks.push(c);
    }

    reportRows.push({
      docId,
      title: title.slice(0, 45),
      chunks: docChunks.length,
      verified,
    });
  }

  console.log("\n==========================================================================");
  console.log("NoticeSaathi Knowledge Base Ingestion Table");
  console.log("==========================================================================");
  console.table(reportRows);
  console.log(`Total Documents: ${allDocs.length} | Total Chunks: ${allChunks.length}`);

  // Persist local JSON backup for zero-latency offline / mock mode retrieval
  const localOutPath = path.resolve(process.cwd(), "data/kb_chunks.json");
  fs.writeFileSync(
    localOutPath,
    JSON.stringify(
      {
        docs: allDocs,
        chunks: allChunks,
        generated_at: new Date().toISOString(),
      },
      null,
      2
    )
  );
  console.log(`✓ Synchronized local chunk store: data/kb_chunks.json (${allChunks.length} chunks)`);

  // Attempt Supabase pgvector database upsert if configured
  try {
    const supabase = getSupabaseAdminClient();
    console.log("Attempting database sync with Supabase...");

    // Upsert kb_docs
    const { error: docError } = await supabase.from("kb_docs").upsert(
      allDocs.map((d) => ({
        id: d.id,
        title: d.title,
        source_url: d.source_url,
        source_type: d.source_type,
        version_note: d.version_note,
        retrieved_on: d.retrieved_on,
        verified: d.verified,
      }))
    );

    if (docError) {
      console.warn("Supabase kb_docs upsert skipped:", docError.message);
    } else {
      console.log(`✓ Upserted ${allDocs.length} documents into kb_docs table.`);
    }

    // Embed and upsert chunks in batches
    console.log("Processing embeddings for chunks...");
    const batchSize = 10;
    for (let i = 0; i < allChunks.length; i += batchSize) {
      const batch = allChunks.slice(i, i + batchSize);
      for (const chunk of batch) {
        chunk.embedding = await generateEmbedding(ai, chunk.content);
      }

      const { error: chunkError } = await supabase.from("kb_chunks").upsert(
        batch.map((c) => ({
          id: c.id,
          doc_id: c.doc_id,
          section_ref: c.section_ref,
          content: c.content,
          embedding: c.embedding || null,
        }))
      );

      if (chunkError) {
        console.warn(`Supabase kb_chunks batch ${i} error:`, chunkError.message);
      }
    }
    console.log("✓ Database upsert completed successfully.");
  } catch (err) {
    console.log("Database sync skipped (offline or placeholder credentials):", (err as Error).message);
  }

  return { docCount: allDocs.length, chunkCount: allChunks.length };
}

// Direct CLI invocation
if (require.main === module || process.argv[1]?.includes("ingest-kb.ts")) {
  ingestKnowledgeBase()
    .then(({ docCount, chunkCount }) => {
      console.log(`\nIngestion completed successfully: ${docCount} documents, ${chunkCount} chunks.`);
      process.exit(0);
    })
    .catch((err) => {
      console.error("Ingestion failed:", err);
      process.exit(1);
    });
}
