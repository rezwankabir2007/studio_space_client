import Link from "next/link";
import {
  BadgeCheck,
  Calendar,
  ChevronRight,
  CreditCard,
  Headphones,
  Rocket,
  Search,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { bookingSteps, supportItems } from "@/lib/data";

const stepIcons: Record<(typeof bookingSteps)[number]["icon"], LucideIcon> = {
  search: Search,
  calendar: Calendar,
  "credit-card": CreditCard,
  rocket: Rocket,
};

const supportIcons: Record<(typeof supportItems)[number]["icon"], LucideIcon> = {
  shield: ShieldCheck,
  "badge-check": BadgeCheck,
  wrench: Wrench,
  headphones: Headphones,
};

export function HowItWorks() {
  return (
    <section className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-4 pb-12 sm:px-6 lg:grid-cols-2">
      <div aria-labelledby="booking-steps-heading">
        <h2 id="booking-steps-heading" className="flex items-center gap-2.5 text-lg font-bold text-foreground">
          <span className="h-1 w-6 rounded-full bg-brand" aria-hidden />
          How Booking Works
        </h2>

        <ol className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-3">
          {bookingSteps.map((item, itemIndex) => {
            const Icon = stepIcons[item.icon];
            return (
              <li key={item.step} className="relative flex flex-1 flex-col items-start gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-brand">
                    {item.step}
                  </span>
                  <span className="flex size-9 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-brand">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  {itemIndex < bookingSteps.length - 1 && (
                    <ChevronRight className="hidden size-4 text-muted-foreground/50 sm:block" aria-hidden />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div aria-labelledby="support-heading">
        <h2 id="support-heading" className="flex items-center gap-2.5 text-lg font-bold text-foreground">
          <span className="h-1 w-6 rounded-full bg-brand" aria-hidden />
          Host Guarantee &amp; Creator Support
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {supportItems.map((item) => {
            const Icon = supportIcons[item.icon];
            return (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-brand">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-3 text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksPageSection() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
      <div className="rounded-xl border border-border bg-blue-50 p-8 text-center">
        <h2 className="text-xl font-bold text-foreground">Ready to start your next project?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Browse hundreds of verified studios and book the perfect space in minutes.
        </p>
        <Link
          href="/explore"
          className="mt-5 inline-flex h-10 items-center rounded-lg bg-brand px-6 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          Explore Studios
        </Link>
      </div>
    </div>
  );
}
