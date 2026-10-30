import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Sparkles, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "StudioSpace connects creators with the perfect spaces for their work.",
};

const values = [
  {
    icon: Users,
    title: "Community First",
    description:
      "We built StudioSpace for photographers, filmmakers, musicians, and artists who need reliable spaces to create.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Network",
    description:
      "Every host is verified and every booking is protected, so you can focus on your craft with confidence.",
  },
  {
    icon: Sparkles,
    title: "Creative Freedom",
    description:
      "From intimate podcast rooms to full cinema sound stages, the right space elevates every project.",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <h1 className="flex items-center gap-2.5 text-2xl font-bold text-foreground">
        <span className="h-1 w-8 rounded-full bg-brand" aria-hidden />
        About StudioSpace
      </h1>
      <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
        StudioSpace is a peer-to-peer marketplace for creative workspaces and
        production studios. We connect hosts who own professional spaces with
        creators who need them — making it simple to book photography studios,
        sound stages, podcast rooms, music suites, and art workshops by the hour.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {values.map((value) => (
          <div key={value.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-brand">
              <value.icon className="size-5" aria-hidden />
            </span>
            <h2 className="mt-4 text-base font-bold text-foreground">{value.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {value.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl bg-navy p-8 text-center text-white sm:p-10">
        <h2 className="text-xl font-bold">Join thousands of creators on StudioSpace</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/70">
          Whether you are hosting a space or booking one, you are part of a
          growing community that makes creativity possible.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/register"
            className="inline-flex h-10 items-center rounded-lg bg-brand px-6 text-sm font-medium transition-colors hover:bg-brand-dark"
          >
            Get Started
          </Link>
          <Link
            href="/explore"
            className="inline-flex h-10 items-center rounded-lg border border-white/30 px-6 text-sm font-medium transition-colors hover:bg-white/10"
          >
            Explore Studios
          </Link>
        </div>
      </div>
    </div>
  );
}
