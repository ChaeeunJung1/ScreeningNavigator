"use client";

import type { User } from "@supabase/supabase-js";
import {
  BookOpen,
  ClipboardCheck,
  FileText,
  Folder,
  Home,
  Info,
  Landmark,
  Settings as SettingsIcon,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

interface SidebarProps {
  user: User | null;
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ user, className, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = user?.app_metadata?.is_admin === true;

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/education", label: "Education", icon: BookOpen },
    { href: "/navigator", label: "Screening Check", icon: ClipboardCheck },
    { href: "/results", label: "Programs", icon: Landmark },
    { href: "/rights", label: "Rights & Billing", icon: ShieldCheck },
    { href: "/resources", label: "Resources", icon: Folder },
    { href: "/about", label: "About this tool", icon: Info },
  ];

  const accountLinks = [
    ...(isAdmin ? [{ href: "/admin", label: "Admin", icon: FileText }] : []),
    ...(user
      ? [{ href: "/settings", label: "Settings", icon: SettingsIcon }]
      : []),
  ];

  return (
    <aside
      className={cn(
        "flex h-full w-60 shrink-0 flex-col justify-between border-r border-border bg-background p-3",
        className,
      )}
    >
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <link.icon className="size-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}

        {accountLinks.length > 0 && (
          <>
            <div className="my-2 border-t border-border" />
            {accountLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <link.icon className="size-4 shrink-0" />
                  {link.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
        <p className="text-sm font-semibold">Need help?</p>
        <p className="text-sm text-muted-foreground">
          Find support and contact information in{" "}
          <Link
            href="/resources"
            onClick={onNavigate}
            className="text-primary underline hover:no-underline"
          >
            Resources
          </Link>
          .
        </p>
      </div>
    </aside>
  );
}
