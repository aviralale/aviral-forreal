"use client";

import { cn } from "@/lib/utils";
import { ExternalLink, FileText, Hash, LogOut, Tag } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/admin";

const nav = [
  { href: "/dashboard", label: "Posts", Icon: FileText, exact: true },
  { href: "/dashboard/categories", label: "Categories", Icon: Hash },
  { href: "/dashboard/tags", label: "Tags", Icon: Tag },
];

function active(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href || pathname.startsWith("/dashboard/posts");
  return pathname.startsWith(href);
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await logout();
    router.replace("/dashboard/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="flex flex-col border-b border-border md:w-60 md:border-b-0 md:border-r">
        <div className="px-6 py-5">
          <Link href="/dashboard" className="font-display text-lg italic text-text">
            Aviral, for real
          </Link>
          <p className="mt-0.5 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-muted">
            Dashboard
          </p>
        </div>

        <nav className="flex gap-1 px-3 pb-3 md:flex-1 md:flex-col md:gap-0.5">
          {nav.map(({ href, label, Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 font-body text-sm transition-colors",
                active(pathname, href, exact)
                  ? "bg-surface text-text"
                  : "text-muted hover:bg-surface hover:text-text",
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-between gap-2 px-3 py-3 md:border-t md:border-border">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-md px-3 py-2 font-body text-sm text-muted transition-colors hover:text-accent"
          >
            <ExternalLink size={15} />
            View site
          </a>
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 rounded-md px-3 py-2 font-body text-sm text-muted transition-colors hover:text-text"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
