import React from "react";
import { AlertCircle } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <aside
      aria-label="Legal Disclaimer"
      className="sticky top-0 z-50 w-full border-b border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-center text-xs sm:text-sm font-medium text-amber-900 dark:text-amber-200 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
        <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          AI-generated draft for review by a qualified professional. Not legal advice.
        </span>
      </div>
    </aside>
  );
}
