import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MapPin, Star } from "lucide-react";
import { StudioCard } from "@/components/home/studio-card";
import { studios } from "@/lib/data";

export function generateStaticParams() {
  return studios.map((studio) => ({ slug: studio.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/studios/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const studio = studios.find((entry) => entry.slug === slug);
  return {
    title: studio ? `${studio.name} — StudioSpace` : "Studio Not Found",
    description: studio?.description,
  };
}

export default async function StudioDetailPage({
  params,
}: PageProps<"/studios/[slug]">) {
  const { slug } = await params;
  const studio = studios.find((entry) => entry.slug === slug);
  if (!studio) notFound();

  const similar = studios
    .filter((entry) => entry.slug !== studio.slug && entry.categorySlug === studio.categorySlug)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <Link
        href="/explore"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to Explore
      </Link>

      <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src={studio.image}
              alt={studio.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-foreground sm:text-3xl">{studio.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden />
              <span className="font-medium text-foreground">{studio.rating.toFixed(1)}</span>
              ({studio.reviews} reviews)
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden />
              {studio.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden />
              Minimum 2 hours
            </span>
          </div>

          <p className="mt-5 leading-relaxed text-muted-foreground">{studio.description}</p>

          <h2 className="mt-8 text-base font-bold text-foreground">Amenities</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {studio.amenities.map((amenity) => (
              <li
                key={amenity}
                className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
              >
                {amenity}
              </li>
            ))}
          </ul>
        </div>

        <aside className="lg:col-span-2">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="text-2xl">
              <span className="font-bold text-brand">${studio.price}</span>{" "}
              <span className="text-sm text-muted-foreground">/ hr</span>
            </p>
            <dl className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Category</dt>
                <dd className="font-medium text-foreground">{studio.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Location</dt>
                <dd className="font-medium text-foreground">{studio.location}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Rating</dt>
                <dd className="font-medium text-foreground">
                  {studio.rating.toFixed(1)} / 5
                </dd>
              </div>
            </dl>
            <Link
              href="/register"
              className="mt-6 flex h-11 items-center justify-center rounded-lg bg-brand text-sm font-medium text-white transition-colors hover:bg-brand-dark"
            >
              Book This Studio
            </Link>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Free cancellation up to 24 hours before your session.
            </p>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-14" aria-labelledby="similar-heading">
          <h2 id="similar-heading" className="text-lg font-bold text-foreground">
            Similar Studios
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((entry) => (
              <StudioCard key={entry.slug} studio={entry} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
