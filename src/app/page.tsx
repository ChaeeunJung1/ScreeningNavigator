import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-6 p-8 py-16 text-center">
      <div className="flex max-w-2xl flex-col items-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Find your path to breast cancer screening
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Answer a few questions about your state and insurance status, and
          we'll route you to the screening program, rights, or financial
          assistance that fits your situation — with real, source-verified
          information.
        </p>
      </div>

      <Button size="lg" asChild>
        <Link href="/navigator">Get started</Link>
      </Button>
    </main>
  );
}
