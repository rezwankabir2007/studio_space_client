import type { Metadata } from "next";
import Link from "next/link";
import { StudioCard } from "@/components/home/studio-card";
import { categories, studios, type StudioCategorySlug } from "@/lib/data";
import { cn } from "cn";

export const metadata: Metadata = {
  title: "Explore Studios",
  description: "Browse and filter professional studios available for booking.",
};

function isCategorySlug(value: string): value is StudioCategorySlug {
  return categories.some((category) => category.slug === value);
}

export default async function ExplorePage({
  searchParams,
}: PageProps<"/explore">) {
  const params = await searchParams;
  const rawCategory = typeof params.category === "string" ? params.category : undefined;
  const activeCategory = rawCategory && isCategorySlug(rawCategory) ? rawCategory : null;

  const filtered = activeCategory
    ? studios.filter((studio) => studio.categorySlug === activeCategory)
    : studios;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <h1 className="flex items-center gap-2.5 text-2xl font-bold text-foreground">
        <span className="h-1 w-8 rounded-full bg-brand" aria-hidden />
        Explore Studios
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "studio" : "studios"} available for your next project.
      </p>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <Link
          href="/explore"
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm transition-colors",
            activeCategory
              ? "border-border text-muted-foreground hover:bg-muted"
              : "border-brand bg-brand text-white",
          )}
        >
          All Studios
        </Link>
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/explore?category=${category.slug}`}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              activeCategory === category.slug
                ? "border-brand bg-brand text-white"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((studio) => (
            <StudioCard key={studio.slug} studio={studio} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          No studios in this category yet.{" "}
          <Link href="/explore" className="font-medium text-brand hover:underline">
            View all studios
          </Link>
        </p>
      )}
    </div>
  );
}
