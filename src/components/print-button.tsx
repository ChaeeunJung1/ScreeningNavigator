"use client";

import { Button } from "~/components/ui/button";

/**
 * Triggers the browser's native print dialog. Kept as its own tiny client
 * component so the pages that use it (currently just the insured rights
 * summary) can stay server components — window.print() needs a client
 * boundary, nothing else on those pages does.
 */
export function PrintButton() {
  return (
    <Button
      type="button"
      variant="outline"
      className="print:hidden"
      onClick={() => window.print()}
    >
      Print this page
    </Button>
  );
}
