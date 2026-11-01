import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, MapPin, Star } from "lucide-react";
import { cn } from "cn";
import { categories, type Studio } from "@/lib/data";

function categoryBadge(slug: Studio["categorySlug"]) {
  return categories.find((category) => category.slug === slug)?.badge ?? "bg-blue-600";
}

export function StudioCard({ studio }: { studio: Studio }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-4/3 w-full">
        <Image
          src={studio.image}
          alt={studio.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 240px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={cn(
            "absolute top-2.5 left-2.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-white",
            categoryBadge(studio.categorySlug),
          )}
        >
          {studio.category}
        </span>
        <button
          type="button"
          aria-label={`Save ${studio.name} to favorites`}
          className="absolute top-2.5 right-2.5 flex size-7 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm transition-colors hover:bg-white hover:text-rose-500"
        >
          <Heart className="size-3.5" aria-hidden />
        </button>
        <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-medium text-white">
          <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden />
          {studio.rating.toFixed(1)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="text-sm font-semibold text-foreground">{studio.name}</h3>
        <p className="text-sm">
          <span className="font-bold text-brand">${studio.price}</span>{" "}
          <span className="text-xs text-muted-foreground">/ hr</span>
        </p>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3" aria-hidden />
          {studio.location}
        </p>
        <Link
          href={`/studios/${studio.slug}`}
          className="mt-auto inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md bg-brand text-xs font-medium text-white transition-colors hover:bg-brand-dark"
        >
          View Details
          <ArrowRight className="size-3" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
