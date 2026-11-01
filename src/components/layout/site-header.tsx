
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

import {
  Aperture,
  Menu,
  X,
  User,
  Moon,
  Sun,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Separator } from "@/components/ui/separator";
import ThemeToggle from "@/components/theme-toggle";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/explore" },
  { label: "My Bookings", href: "/my-booking" },
  { label: "Add Studio", href: "/add-studio" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
] as const;

export function SiteHeader() {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleSignOut = async () => {
    await authClient.signOut();
    setOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 text-white shadow-md transition-colors duration-300",
        isDark ? "bg-[#111827]" : "bg-navy"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-white">
            <Aperture className="size-5 text-navy" aria-hidden />
          </span>

          <span className="text-lg font-bold tracking-tight">
            StudioSpace
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-7 md:flex"
          aria-label="Main"
        >
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
                    : "border-transparent text-white/80 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">

          {/* Theme Toggle */}
          <ThemeToggle />

          {!isPending &&
            (user ? (
              <Popover>
                <PopoverTrigger className="rounded-full focus:outline-none focus:ring-2 focus:ring-white/50">
                  <Avatar>
                    <AvatarImage
                      referrerPolicy="no-referrer"
                      src={user.image || undefined}
                    />

                    <AvatarFallback>
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>

                <PopoverContent className="w-56 text-foreground">
                  <PopoverHeader className="text-left">
                    <PopoverTitle>{user.name}</PopoverTitle>

                    <PopoverDescription className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </PopoverDescription>
                  </PopoverHeader>

                  <div className="mt-3 flex flex-col gap-1">
                    <Link
                      href="/myprofile"
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <User className="size-4" />
                      Profile
                    </Link>

                    <Separator className="my-1" />

                    <Button
                      onClick={handleSignOut}
                      variant="destructive"
                      className="h-8 w-full justify-start text-xs"
                    >
                      Signout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-9 border-white/30 bg-transparent px-4 text-white hover:bg-white/10 hover:text-white"
                  )}
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "h-9 bg-brand px-4 text-white hover:bg-brand-dark"
                  )}
                >
                  Register
                </Link>
              </>
            ))}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">

          <ThemeToggle />

          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-md border border-white/25"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
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
                      "block rounded-md px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-white/10 font-medium text-blue-400"
                        : "text-white/85 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile User Actions */}
          <div className="flex gap-3 px-3 pt-1">
            {!isPending &&
              (user ? (
                <div className="flex w-full flex-col gap-2">
                  <div className="flex items-center gap-3 py-2">
                    <Avatar>
                      <AvatarImage
                        referrerPolicy="no-referrer"
                        src={user.image || undefined}
                      />

                      <AvatarFallback>
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="text-sm font-medium text-white">
                        {user.name}
                      </p>

                      <p className="text-xs text-white/70">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/myprofile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20"
                  >
                    <User className="size-4" />
                    Profile
                  </Link>

                  <Button
                    onClick={handleSignOut}
                    variant="destructive"
                    className="w-full"
                  >
                    Signout
                  </Button>
                </div>
              ) : (
                <div className="flex w-full gap-3">
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
                      "h-9 flex-1 bg-brand text-white hover:bg-brand-dark"
                    )}
                  >
                    Register
                  </Link>
                </div>
              ))}
          </div>
        </nav>
      )}
    </header>
  );
}
