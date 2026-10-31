import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Users, DollarSign, ShieldCheck, Mail, CheckCircle2 } from "lucide-react";

interface ImageObject {
  filename?: string;
  url?: string;
}

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

const ExploreDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  let exploreData: StudioDetail | null = null;

  try {
    const res = await fetch(`http://localhost:8000/exploreStudios/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return notFound();
    exploreData = await res.json();
  } catch (error) {
    console.error("Error fetching studio details:", error);
    return notFound();
  }

  if (!exploreData) {
    return notFound();
  }

  // ছবি সেফলি বের করার জন্য হেল্পার লজিক
  const mainImage =
    (typeof exploreData.images?.[0] === "object"
      ? (exploreData.images[0] as ImageObject)?.url
      : (exploreData.images?.[0] as string)) ||
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16 font-sans">
      {/* Top Header Navigation */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowLeft size={16} /> Back to Explore
          </Link>
          <span className="text-xs font-medium rounded-full bg-blue-50 text-blue-600 px-3 py-1 border border-blue-100">
            {exploreData.category}
          </span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 pt-8">
        {/* Title & Location */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {exploreData.title}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500 font-medium">
            <MapPin size={16} className="text-blue-600 shrink-0" />
            <span>{exploreData.location}</span>
          </p>
        </div>

        {/* Banner Image */}
        <div className="relative h-[320px] sm:h-[450px] w-full overflow-hidden rounded-2xl bg-slate-200 shadow-sm">
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
          <div className="lg:col-span-2 space-y-8">
            {/* Overview / Description */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-3">About This Studio</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {exploreData.description || "No description provided for this professional studio space."}
              </p>
            </div>

            {/* Key Features / Quick Info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <DollarSign size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Hourly Rate</p>
                  <p className="text-sm font-bold text-slate-900">${exploreData.hourlyRate}</p>
                </div>
              </div>

              {exploreData.capacity && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Capacity</p>
                    <p className="text-sm font-bold text-slate-900">{exploreData.capacity} People</p>
                  </div>
                </div>
              )}

              {exploreData.deposit && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Security Deposit</p>
                    <p className="text-sm font-bold text-slate-900">${exploreData.deposit}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Amenities List */}
            {exploreData.amenities && exploreData.amenities.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-slate-900 mb-4">Amenities & Equipment</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {exploreData.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                      <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Booking / Host Card */}
          <div>
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <div>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Starting From</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-extrabold text-blue-600">${exploreData.hourlyRate}</span>
                  <span className="text-xs text-slate-500 font-medium">/ hour</span>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Host Information */}
              {exploreData.hostName && (
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Hosted By</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-700 text-sm">
                      {exploreData.hostName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{exploreData.hostName}</p>
                      {exploreData.hostEmail && (
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail size={12} /> {exploreData.hostEmail}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="w-full rounded-xl bg-blue-600 py-3 text-center text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
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