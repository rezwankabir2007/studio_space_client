import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, MapPin, Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "Host Your Space",
  description: "List your studio on StudioSpace and earn income from your creative space.",
};

const benefits = [
  {
    icon: Wallet,
    title: "Earn on your schedule",
    description: "Set your rates and availability. You get paid for every confirmed booking.",
  },
  {
    icon: CalendarClock,
    title: "Full control",
    description: "Approve requests, block dates, and manage your calendar in one place.",
  },
  {
    icon: MapPin,
    title: "Reach new creators",
    description: "Get discovered by photographers, filmmakers, musicians, and podcasters nearby.",
  },
] as const;

export default function HostPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <h1 className="flex items-center gap-2.5 text-2xl font-bold text-foreground">
        <span className="h-1 w-8 rounded-full bg-brand" aria-hidden />
        Host Your Space
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
        Turn your studio, sound stage, or workshop into income. List your space
        on StudioSpace and start welcoming creators who need the perfect place to work.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {benefits.map((benefit) => (
          <div key={benefit.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-brand">
              <benefit.icon className="size-5" aria-hidden />
            </span>
            <h2 className="mt-4 text-base font-bold text-foreground">{benefit.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl bg-navy p-8 text-center text-white sm:p-10">
        <h2 className="text-xl font-bold">Ready to list your space?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/70">
          Create a free account and publish your first listing in minutes.
        </p>
        <Link
          href="/register"
          className="mt-6 inline-flex h-10 items-center rounded-lg bg-brand px-6 text-sm font-medium transition-colors hover:bg-brand-dark"
        >
          Become a Host
        </Link>
      </div>
    </div>
  );
}
