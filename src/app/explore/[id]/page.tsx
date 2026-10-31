"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, MapPin, Users, DollarSign, ShieldCheck, 
  Mail, CheckCircle2, Edit3, Trash2, Loader2 
} from "lucide-react";

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

const ExploreDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [exploreData, setExploreData] = useState<StudioDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    params.then((unwrappedParams) => {
      setId(unwrappedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchStudio = async () => {
      try {
        const res = await fetch(`http://localhost:8000/exploreStudios/${id}`);
        if (!res.ok) throw new Error("Failed to fetch studio");
        const data = await res.json();
        setExploreData(data);
      } catch (error) {
        console.error("Error fetching studio details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudio();
  }, [id]);

  // Delete Handler Function
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Apni ki shothikbhabe ei studio-ti delete korte chan?");
    if (!confirmDelete || !id) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`http://localhost:8000/exploreStudios/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("Studio successfully delete hoye geche!");
        router.push("/explore");
      } else {
        alert(result.message || "Studio delete korte samasya hoyeche!");
      }
    } catch (error) {
      console.error("Error deleting studio:", error);
      alert("Server error! Studio delete kora jayni.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!exploreData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 text-center">
        <h2 className="text-lg font-bold text-slate-800">Studio Found Hoyni!</h2>
        <Link href="/explore" className="mt-4 text-xs font-semibold text-blue-600 hover:underline">
          Explore Page-e phire jan
        </Link>
      </div>
    );
  }

  const mainImage = (
    typeof exploreData.images?.[0] === "object"
      ? (exploreData.images[0] as ImageObject)?.url
      : (exploreData.images?.[0] as string)
  ) || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16 font-sans">
      {/* Top Navigation */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowLeft size={16} /> Back to Explore
          </Link>
          
          <div className="flex items-center gap-3">
            {/* Edit Button */}
            <Link
              href={`/explore/${id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-blue-600 transition"
            >
              <Edit3 size={14} /> Edit
            </Link>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700 transition disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              Delete
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 pt-8">
        {/* Title & Category */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {exploreData.title}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500 font-medium">
              <MapPin size={16} className="text-blue-600 shrink-0" />
              <span>{exploreData.location}</span>
            </p>
          </div>
          <span className="text-xs font-medium rounded-full bg-blue-50 text-blue-600 px-3 py-1 border border-blue-100 h-fit">
            {exploreData.category}
          </span>
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
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-3">About This Studio</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {exploreData.description || "No description provided for this studio space."}
              </p>
            </div>

            {/* Quick Info */}
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

            {/* Amenities */}
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

          {/* Right Card */}
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