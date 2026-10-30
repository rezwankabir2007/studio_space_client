import type { Metadata } from "next";
import { HowItWorks, HowItWorksPageSection } from "@/components/home/how-it-works";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Learn how booking studios on StudioSpace works, step by step.",
};

export default function HowItWorksPage() {
  return (
    <div className="py-6">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <h1 className="flex items-center gap-2.5 text-2xl font-bold text-foreground">
          <span className="h-1 w-8 rounded-full bg-brand" aria-hidden />
          How It Works
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          From discovery to delivery, StudioSpace makes booking a professional
          studio simple, safe, and fast.
        </p>
      </div>
      <HowItWorks />
      <HowItWorksPageSection />
    </div>
  );
}
