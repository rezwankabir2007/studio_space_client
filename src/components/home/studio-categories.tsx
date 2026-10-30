import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Clapperboard,
  Guitar,
  Mic,
  Palette,
  type LucideIcon,
} from "lucide-react";
import { categories } from "@/lib/data";
import { cn } from "cn";

const icons: Record<(typeof categories)[number]["icon"], LucideIcon> = {
  camera: Camera,
  clapperboard: Clapperboard,
  mic: Mic,
  music: Guitar,
  palette: Palette,
};

export function StudioCategories() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-10 sm:px-6" aria-labelledby="categories-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="categories-heading" className="flex items-center gap-2.5 text-lg font-bold text-foreground">
          <span className="h-1 w-6 rounded-full bg-brand" aria-hidden />
          Browse by Studio Categories
        </h2>
        <Link
          href="/explore"
          className="flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-dark"
        >
          View All
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {categories.map((category) => {
          const Icon = icons[category.icon];
          return (
            <Link
              key={category.slug}
              href={`/explore?category=${category.slug}`}
              className={cn(
                "group flex items-center gap-3.5 rounded-xl bg-gradient-to-r p-4 text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-lg",
                category.gradient,
              )}
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white/20">
                <Icon className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-bold">{category.name}</span>
                <span className="mt-0.5 block text-xs text-white/85">{category.tagline}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
