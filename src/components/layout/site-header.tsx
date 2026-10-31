"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Aperture, Menu, Search, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button"; // variant ব্যবহারের জন্য
import { cn } from "cn";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/explore" },
  { label: "Add New Studio", href: "/add_studio" },
  { label: "How It Works", href: "/how-it-works" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy text-white shadow-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex size-9 items-center justify-center rounded-full bg-white">
            <Aperture className="size-5 text-navy" aria-hidden />
          </span>
          <span className="text-lg font-bold tracking-tight">StudioSpace</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "border-b-2 pt-1 text-sm transition-colors",
                  active
                    ? "border-brand font-medium text-blue-400"
                    : "border-transparent text-white/80 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/explore"
            aria-label="Search studios"
            className="flex size-9 items-center justify-center rounded-full border border-white/25 text-white/90 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Search className="size-4" aria-hidden />
          </Link>

          {/* Login Link using buttonVariants to avoid Base UI warning */}
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-9 border-white/30 bg-transparent px-4 text-white hover:bg-white/10 hover:text-white"
            )}
          >
            Login
          </Link>

          {/* Register Link using buttonVariants */}
          <Link
            href="/register"
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-9 bg-brand px-4 hover:bg-brand-dark text-white"
            )}
          >
            Register
          </Link>
        </div>

        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-md border border-white/25 md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-white/10 px-4 pb-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1 py-2">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm",
                      active ? "bg-white/10 font-medium text-blue-400" : "text-white/85 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex gap-3 px-3 pt-1">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-9 flex-1 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              )}
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-9 flex-1 bg-brand hover:bg-brand-dark text-white"
              )}
            >
              Register
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}