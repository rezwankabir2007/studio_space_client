import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StudioCard } from "@/components/home/studio-card";
import { studios } from "@/lib/data";

export function FeaturedStudios() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6" aria-labelledby="featured-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="featured-heading" className="flex items-center gap-2.5 text-lg font-bold text-foreground">
            <span className="h-1 w-6 rounded-full bg-brand" aria-hidden />
            Featured Studios
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Top-rated and most popular studios, handpicked for you.
          </p>
        </div>
        <Link
          href="/explore"
          className="flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-dark"
        >
          View All
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {studios.map((studio) => (
          <StudioCard key={studio.slug} studio={studio} />
        ))}
      </div>
    </section>
  );
}
