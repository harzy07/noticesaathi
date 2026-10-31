import Link from "next/link";
import { UploadCloud, Shield, BookOpen, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-41px)] justify-between">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-[41px] z-40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-sm">
              NS
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight">NoticeSaathi</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium text-muted-foreground border px-1.5 py-0.5 rounded">
                GST Copilot
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              CBIC Grounded RAG
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 flex flex-col items-center text-center">
        <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-medium">
          Professional GST Notice Assistant
        </Badge>
        
        {/* Single-sentence product proposition */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl text-balance">
          Turn scary Indian GST notices into structured extractions, plain-English &amp; Hindi explanations, and sourced draft replies in 60 seconds.
        </h1>

        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl text-balance">
          Engineered for tax consultants, CAs, and business owners. Every legal claim is verified and cited against official CBIC statutes before drafting.
        </p>

        {/* Disabled Upload Card (Coming in Phase 4) */}
        <div className="w-full max-w-xl mt-10">
          <Card className="border-2 border-dashed border-muted-foreground/25 bg-card/60 shadow-sm relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 font-medium text-xs">
                Coming in Phase 4
              </Badge>
            </div>
            <CardHeader className="text-center pt-8 pb-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted/60 text-muted-foreground mb-2">
                <UploadCloud className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl">Upload GST Notice</CardTitle>
              <CardDescription>
                PDF, PNG, or JPG (scanned document or phone photograph, up to 10MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8 flex flex-col items-center">
              <div className="w-full py-6 px-4 bg-muted/30 rounded-lg border border-dashed border-muted text-center mb-4">
                <p className="text-sm text-muted-foreground font-medium">
                  Notice ingestion pipeline is currently in development.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Full document analysis, deadline calculation, and draft reply generation will unlock in Phase 4.
                </p>
              </div>
              <Button disabled className="w-full sm:w-auto min-w-[200px]" size="lg">
                Select Notice File
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full mt-16 text-left">
          <div className="p-4 rounded-lg border bg-card/40">
            <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Clock className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm">Deterministic Deadlines</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Deadlines and reply forms calculated in code from CBIC notice rules, never hallucinated by an LLM.
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-card/40">
            <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-3">
              <BookOpen className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm">Grounded Legal Citations</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Every section, rule, and circular reference is verified against curated knowledge base chunks.
            </p>
          </div>
          <div className="p-4 rounded-lg border bg-card/40">
            <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Shield className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-sm">CA Review Ready</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Factual placeholders like [ADD: ...] safeguard against fabricated numbers. Ready for professional review.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/40 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>© 2026 NoticeSaathi. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <span>AI-generated drafts for review by a qualified professional. Not legal advice.</span>
            <Link
              href="/privacy"
              className="hover:text-foreground underline underline-offset-4 font-medium transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
