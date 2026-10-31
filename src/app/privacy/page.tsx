import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Trash2, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex-1">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy &amp; Data Protection</h1>
        <p className="text-muted-foreground">
          NoticeSaathi is designed strictly aligned with India&apos;s Digital Personal Data Protection (DPDP) Act 2023.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Lock className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">What We Store &amp; How It Is Secured</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Uploaded notice documents (PDFs and images) contain sensitive taxpayer details, GSTINs, and financial data.
              Files are stored in private Supabase Storage buckets accessible only through short-lived signed URLs.
            </p>
            <p>
              Uploaded notices are scoped strictly to your anonymous session cookie (<code className="bg-muted px-1 py-0.5 rounded text-foreground font-mono">session_id</code>).
              No login or email registration is required in v1.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <EyeOff className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">No AI Model Training On Your Data</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              We use commercial API tiers for Google Gemini that explicitly do not train AI models on customer inputs
              or notice documents. Your financial figures and confidential taxpayer communications remain private.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Trash2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Retention &amp; Immediate Deletion</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              All processed notices and extracted data are automatically scheduled for permanent deletion after 30 days.
            </p>
            <p>
              You have the right to delete your notice and all associated analysis, extractions, and draft files at any moment
              via the one-click &quot;Delete this notice now&quot; button on the notice dashboard.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Legal Status of Drafts</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              NoticeSaathi provides AI-assisted drafting tools for chartered accountants and tax professionals. It does not
              provide legal advice or file documents directly on the GST portal.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
