
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Heart,
  Star,
  SearchX,
  ArrowRight,
  Building2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: string | number;
  deposit?: string | number;
  capacity?: string | number;
  location: string;
  description?: string;
  images?: (string | { url?: string })[];
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
}

interface ExploreStudiosClientProps {
  studios?: Studio[];
  fetchError?: boolean;
}

const categories = [
  "Photo Studio",
  "Sound Stage",
  "Podcast Room",
  "Music Suite",
  "Art Workshop",
  "Film & Production",
];

const ExploreStudiosClient = ({
  studios = [],
  fetchError = false,
}: ExploreStudiosClientProps) => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [rating, setRating] = useState("");
  const [sort, setSort] = useState("newest");
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const getImage = (studio: Studio) => {
    const firstImage = studio.images?.[0];

    if (typeof firstImage === "object" && firstImage?.url) {
      return firstImage.url;
    }

    if (typeof firstImage === "string") {
      return firstImage;
    }

    if (studio.imageUrl) {
      return studio.imageUrl;
    }

    return "";
  };

  const filteredStudios = useMemo(() => {
    const result = (studios || []).filter((studio) => {
      const price = Number(studio.hourlyRate) || 0;

      const matchesSearch =
        !search ||
        studio.title?.toLowerCase().includes(search.toLowerCase()) ||
        studio.location?.toLowerCase().includes(search.toLowerCase());

      const matchesLocation =
        !location ||
        studio.location?.toLowerCase().includes(location.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some((cat) =>
          studio.category?.toLowerCase().includes(cat.toLowerCase())
        );

      const matchesPrice = price >= minPrice && price <= maxPrice;

      const matchesRating =
        !rating ||
        (studio.rating !== undefined
          ? studio.rating >= Number(rating)
          : true);

      return (
        matchesSearch &&
        matchesLocation &&
        matchesCategory &&
        matchesPrice &&
        matchesRating
      );
    });

    if (sort === "low") {
      result.sort(
        (a, b) => Number(a.hourlyRate) - Number(b.hourlyRate)
      );
    } else if (sort === "high") {
      result.sort(
        (a, b) => Number(b.hourlyRate) - Number(a.hourlyRate)
      );
    } else if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    }

    return result;
  }, [
    studios,
    search,
    location,
    selectedCategories,
    minPrice,
    maxPrice,
    rating,
    sort,
  ]);

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setSelectedCategories([]);
    setMinPrice(0);
    setMaxPrice(10000);
    setRating("");
    setSort("newest");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-6 md:grid-cols-[260px_1fr]">

        {/* Sidebar Filters */}
        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            Categories
          </h3>

          <div className="space-y-2.5">
            {categories.map((category) => (
              <label
                key={category}
                className="flex cursor-pointer items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="h-4 w-4 accent-blue-600"
                />
                <span>{category}</span>
              </label>
            ))}
          </div>

          <hr className="my-5 border-slate-100" />

          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            Price Range
          </h3>

          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="10000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600"
            />

            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span>${minPrice}</span>
              <span>${maxPrice}</span>
            </div>
          </div>

          <hr className="my-5 border-slate-100" />

          <h3 className="mb-2.5 text-sm font-semibold text-slate-900">
            Location
          </h3>

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search location..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />

          <hr className="my-5 border-slate-100" />

          <h3 className="mb-2 text-sm font-semibold text-slate-900">
            Rating
          </h3>

          <div className="mb-3 flex gap-0.5 text-sm text-amber-400">
            ★ ★ ★ ★ <span className="text-slate-300">★</span>
          </div>

          <div className="space-y-2">
            {["4", "3"].map((val) => (
              <label
                key={val}
                className="flex cursor-pointer items-center gap-2.5 text-xs text-slate-600"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={rating === val}
                  onChange={() => setRating(val)}
                  className="h-3.5 w-3.5 accent-blue-600"
                />
                <span>{val}+ & up</span>
              </label>
            ))}
          </div>

          <hr className="my-5 border-slate-100" />

          <h3 className="mb-2 text-sm font-semibold text-slate-900">
            Sort By
          </h3>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>

          <button
            onClick={clearFilters}
            className="mt-6 w-full rounded-lg border border-slate-300 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Clear Filters
          </button>
        </aside>

        {/* Studios Content */}
        <section>
          <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
            <div className="flex flex-1 items-center gap-2">
              <Search className="text-slate-400" size={18} />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search studios, locations..."
                className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            {!fetchError && (
              <span className="whitespace-nowrap text-xs font-medium text-slate-400">
                {filteredStudios.length} studios found
              </span>
            )}
          </div>

          {/* API Error State */}
          {fetchError ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-white px-6 py-16 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                <AlertCircle size={38} className="text-red-500" />
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                Something Went Wrong
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                We couldn&apos;t load the studios right now. Please try again later.
              </p>

              <button
                onClick={() => window.location.reload()}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>

          ) : filteredStudios.length === 0 ? (

            /* Empty State */
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                {studios.length === 0 ? (
                  <Building2 size={38} className="text-blue-600" />
                ) : (
                  <SearchX size={38} className="text-blue-600" />
                )}
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                {studios.length === 0
                  ? "No Studios Available Yet"
                  : "No Studios Found"}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {studios.length === 0
                  ? "There are no studios listed at the moment. Please check back later."
                  : "We couldn't find any studios matching your search. Try changing your keywords or adjusting your filters."}
              </p>

              {studios.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Clear All Filters
                  <ArrowRight size={16} />
                </button>
              )}
            </div>

          ) : (

            /* Studio Cards */
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {filteredStudios.map((studio) => (
                <div
                  key={studio._id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    {getImage(studio) ? (
                      <Image
                        src={getImage(studio)}
                        alt={studio.title || "Studio Image"}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-slate-200 text-xs font-medium text-slate-500">
                        No Image Available
                      </div>
                    )}

                    <span className="absolute left-3 top-3 z-10 rounded bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                      {studio.category}
                    </span>

                    <button
                      onClick={() => toggleFavorite(studio._id)}
                      className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
                      aria-label="Add to favorites"
                    >
                      <Heart
                        size={15}
                        className={
                          favorites.includes(studio._id)
                            ? "fill-red-500 text-red-500"
                            : "text-white"
                        }
                      />
                    </button>
                  </div>

                  <div className="p-4">
                    <h2 className="truncate text-sm font-bold text-slate-900">
                      {studio.title}
                    </h2>

                    <div className="mt-1 flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-extrabold text-blue-600">
                          ${studio.hourlyRate}
                        </span>
                        <span className="text-xs font-normal text-slate-500">
                          / hr
                        </span>
                      </div>

                      {studio.rating !== undefined && (
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <Star
                            size={13}
                            className="fill-amber-400 text-amber-400"
                          />

                          <span className="font-semibold text-slate-800">
                            {studio.rating}
                          </span>

                          {studio.reviewCount !== undefined && (
                            <span className="text-slate-400">
                              ({studio.reviewCount})
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <p className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin size={14} className="shrink-0 text-slate-400" />
                      <span className="truncate">{studio.location}</span>
                    </p>

                    <Link
                      href={`/explore/${studio._id}`}
                      className="mt-4 block w-full rounded-lg bg-blue-600 py-2 text-center text-xs font-semibold text-white transition hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ExploreStudiosClient;
