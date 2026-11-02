import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  MapPin,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface Studio {
  _id: string;
  images: {
    filename?: string;
    url: string;
  }[];
  title: string;
  category: string;
  hourlyRate: number | string;
  deposit: number | string;
  capacity: number | string;
  location: string;
  description: string;
  hostName: string;
  hostEmail: string;
  amenities: string[];
}

// Fetch Single Studio (Updated to /studios/:id)
async function getStudio(id: string): Promise<Studio | null> {
  const res = await fetch(
    `http://localhost:8000/exploreStudios/${id}`,
    {
      cache: "no-store",
    }
  );

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error("Failed to fetch studio");
  }

  return res.json();
}

// Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const studio = await getStudio(id);

  return {
    title: studio
      ? `${studio.title} — StudioSpace`
      : "Studio Not Found",
    description: studio?.description,
  };
}

// Details Page
export default async function StudioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Get Studio
  const studio = await getStudio(id);

  if (!studio) notFound();

  // Check Login Session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  // Image URL
  const imageUrl = studio.images?.[0]?.url
    ? studio.images[0].url.startsWith("http")
      ? studio.images[0].url
      : `http://localhost:8000${studio.images[0].url}`
    : "/placeholder.jpg";

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">

      <Link
        href="/explore"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Explore
      </Link>

      <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-5">

        {/* Studio Image & Information */}
        <div className="lg:col-span-3">

          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src={imageUrl}
              alt={studio.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-foreground sm:text-3xl">
            {studio.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">

            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" />
              {studio.location}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />
              Minimum 2 hours
            </span>

          </div>

          <p className="mt-5 leading-relaxed text-muted-foreground">
            {studio.description}
          </p>

          {/* Amenities */}
          <h2 className="mt-8 text-base font-bold text-foreground">
            Amenities
          </h2>

          <ul className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {studio.amenities?.map((amenity, index) => (
              <li
                key={index}
                className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
              >
                {amenity}
              </li>
            ))}
          </ul>

        </div>

        {/* Booking Sidebar */}
        <aside className="lg:col-span-2">

          <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-sm">

            <p className="text-2xl">
              <span className="font-bold text-brand">
                ৳{studio.hourlyRate}
              </span>

              <span className="text-sm text-muted-foreground">
                {" "}/ hr
              </span>
            </p>

            <dl className="mt-5 space-y-3 border-t border-border pt-5 text-sm">

              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  Category
                </dt>

                <dd className="font-medium text-foreground">
                  {studio.category}
                </dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  Location
                </dt>

                <dd className="font-medium text-foreground">
                  {studio.location}
                </dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  Deposit
                </dt>

                <dd className="font-medium text-foreground">
                  ৳{studio.deposit}
                </dd>
              </div>

              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  Capacity
                </dt>

                <dd className="font-medium text-foreground">
                  {studio.capacity} People
                </dd>
              </div>

            </dl>

            {/* Book Now */}
            <Link
              href={
                user
                  ? `/explore/${studio._id}`
                  : "/login"
              }
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
    </div>
  );
}