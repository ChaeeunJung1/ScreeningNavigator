"use client";

import type { User } from "@supabase/supabase-js";
import { Bookmark, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "~/components/sidebar";
import { Button } from "~/components/ui/button";
import { createClient } from "~/lib/supabase/client";

const SHELL_EXCLUDED_PREFIXES = ["/login", "/auth"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setAuthChecked(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const isExcludedPrefix = SHELL_EXCLUDED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const isSignedOutLanding = pathname === "/" && (!authChecked || !user);
  const showShell = !isExcludedPrefix && !isSignedOutLanding;

  if (!showShell) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background px-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileNavOpen((open) => !open)}
          aria-label="Toggle navigation"
        >
          {mobileNavOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </Button>
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="ScreeningNavigator logo"
            width={44}
            height={44}
            className="size-11"
            priority
          />
          <span className="flex items-baseline gap-2">
            <span className="font-bold tracking-tight">
              ScreeningNavigator.com
            </span>
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Breast cancer screening access, made clearer
            </span>
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end gap-4">
          <Link
            href="/settings"
            className="hidden items-center gap-1.5 text-sm font-medium text-primary hover:underline sm:flex"
          >
            <Bookmark className="size-4" />
            Save progress
          </Link>
          {user ? (
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign out
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          )}
          <Button size="sm" asChild>
            <Link href="/navigator">Start screening check</Link>
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        <Sidebar user={user} className="hidden lg:flex" />

        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <Sidebar
              user={user}
              className="flex"
              onNavigate={() => setMobileNavOpen(false)}
            />
            <button
              type="button"
              aria-label="Close navigation"
              className="flex-1 bg-black/30"
              onClick={() => setMobileNavOpen(false)}
            />
          </div>
        )}

        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
