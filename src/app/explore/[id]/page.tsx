"use client";

import { use, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  MapPin,
  Users,
  DollarSign,
  ShieldCheck,
  Mail,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import EditStudioDialog from "@/components/EditStudioDialog";
import DeleteStudiosDialoge from "@/components/DeleteStudiosDialoge";

// Image Type
interface ImageObject {
  filename?: string;
  url?: string;
}

// Studio Type
interface StudioDetail {
  _id: string;
  title: string;
  category: string;
  hourlyRate: string | number;
  deposit?: string | number;
  capacity?: string | number;
  location: string;
  description?: string;
  hostName?: string;
  hostEmail?: string;
  amenities?: string[];
  images?: ImageObject[] | string[];
}

const ExploreDetailsPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  // URL theke ID ber kora
  const { id } = use(params);

  // States
  const [exploreData, setExploreData] =
    useState<StudioDetail | null>(null);

  const [loading, setLoading] = useState(true);

  // 1. API theke Studio data fetch
  const getStudio = useCallback(async () => {
    const res = await fetch(
      `http://localhost:8000/exploreStudios/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch studio");
    }

    const data = await res.json();

    return data as StudioDetail;
  }, [id]);

  // 2. Edit successful hole abar data fetch
  const fetchStudio = useCallback(async () => {
    try {
      const data = await getStudio();

      setExploreData(data);
    } catch (error) {
      console.error("Error fetching studio:", error);
    }
  }, [getStudio]);

  // 3. Page load hole initial data fetch
  useEffect(() => {
    let cancelled = false;

    getStudio()
      .then((data) => {
        if (!cancelled) {
          setExploreData(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching studio details:", error);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [getStudio]);

  // 4. Images ke same format-e convert kora
  const editStudioData = exploreData
    ? {
        ...exploreData,

        images: (exploreData.images ?? []).flatMap((image) => {
          if (typeof image === "string") {
            return [{ url: image }];
          }

          return image.url
            ? [
                {
                  url: image.url,
                  ...(image.filename
                    ? { filename: image.filename }
                    : {}),
                },
              ]
            : [];
        }),
      }
    : null;

  // 5. Main image
  const firstImage = exploreData?.images?.[0];

  const mainImage =
    (typeof firstImage === "object"
      ? firstImage?.url
      : firstImage) ||
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04";

  // Loading UI
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Data not found
  if (!exploreData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 text-center">
        <h2 className="text-lg font-bold text-slate-800">
          Studio Found Hoyni!
        </h2>

        <Link
          href="/explore"
          className="mt-4 text-xs font-semibold text-blue-600 hover:underline"
        >
          Explore Page-e phire jan
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16 font-sans text-slate-800">

      {/* Top Navigation */}
      <div className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to Explore
          </Link>

          <div className="flex items-center gap-3">

            {/* Edit Button */}
            {editStudioData && (
              <EditStudioDialog
                exploreData={editStudioData}
                onSuccess={fetchStudio}
              />
            )}

            {/* Delete Button */}
            <DeleteStudiosDialoge id={id} />

          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 pt-8">

        {/* Title & Category */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {exploreData.title}
            </h1>

            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-500">
              <MapPin size={16} className="shrink-0 text-blue-600" />
              <span>{exploreData.location}</span>
            </p>
          </div>

          <span className="h-fit rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            {exploreData.category}
          </span>

        </div>

        {/* Banner Image */}
        <div className="relative h-[320px] w-full overflow-hidden rounded-2xl bg-slate-200 shadow-sm sm:h-[450px]">

          <Image
            src={mainImage}
            alt={exploreData.title || "Studio Image"}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized
          />

        </div>

        {/* Content Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Left Details Section */}
          <div className="space-y-8 lg:col-span-2">

            {/* About Studio */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="mb-3 text-base font-bold text-slate-900">
                About This Studio
              </h2>

              <p className="text-sm leading-relaxed text-slate-600">
                {exploreData.description ||
                  "No description provided for this studio space."}
              </p>

            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">

              {/* Hourly Rate */}
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <DollarSign size={20} />
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Hourly Rate
                  </p>

                  <p className="text-sm font-bold text-slate-900">
                    ${exploreData.hourlyRate}
                  </p>
                </div>

              </div>

              {/* Capacity */}
              {exploreData.capacity && (
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Users size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Capacity
                    </p>

                    <p className="text-sm font-bold text-slate-900">
                      {exploreData.capacity} People
                    </p>
                  </div>

                </div>
              )}

              {/* Deposit */}
              {exploreData.deposit && (
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <ShieldCheck size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Security Deposit
                    </p>

                    <p className="text-sm font-bold text-slate-900">
                      ${exploreData.deposit}
                    </p>
                  </div>

                </div>
              )}

            </div>

            {/* Amenities */}
            {exploreData.amenities &&
              exploreData.amenities.length > 0 && (

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <h2 className="mb-4 text-base font-bold text-slate-900">
                    Amenities & Equipment
                  </h2>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    {exploreData.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2.5 text-xs font-medium text-slate-700"
                      >

                        <CheckCircle2
                          size={16}
                          className="shrink-0 text-blue-600"
                        />

                        <span>{amenity}</span>

                      </div>
                    ))}

                  </div>

                </div>
              )}

          </div>

          {/* Right Card */}
          <div>

            <div className="sticky top-24 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Starting From
                </span>

                <div className="mt-1 flex items-baseline gap-1">

                  <span className="text-3xl font-extrabold text-blue-600">
                    ${exploreData.hourlyRate}
                  </span>

                  <span className="text-xs font-medium text-slate-500">
                    / hour
                  </span>

                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Host Information */}
              {exploreData.hostName && (

                <div className="space-y-3">

                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                    Hosted By
                  </h3>

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">
                      {exploreData.hostName.charAt(0)}
                    </div>

                    <div>

                      <p className="text-xs font-bold text-slate-900">
                        {exploreData.hostName}
                      </p>

                      {exploreData.hostEmail && (
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                          <Mail size={12} />
                          {exploreData.hostEmail}
                        </p>
                      )}

                    </div>
                  </div>

                </div>
              )}

              <button
                type="button"
                className="w-full rounded-xl bg-blue-600 py-3 text-center text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Book This Studio
              </button>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default ExploreDetailsPage;