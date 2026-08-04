"use client";

import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { createClient } from "~/lib/supabase/client";
import { cn } from "~/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const isAdmin = user?.app_metadata?.is_admin === true;
  const links = [
    { href: "/", label: "Home" },
    { href: "/navigator", label: "Navigator" },
    { href: "/notes", label: "Notes" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
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

  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-3xl items-center gap-6 px-4">
        <Link href="/" className="font-semibold tracking-tight">
          ScreeningNavigator
        </Link>
        <div className="flex flex-1 gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors hover:text-foreground",
                pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
        {user ? (
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Sign out
          </Button>
        ) : (
          <Button size="sm" asChild>
            <Link href="/login">Sign up / Sign in</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
