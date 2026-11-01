import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin } from "lucide-react"; // npm install lucide-react (if e no dey)

type Studio = {
  _id: string;
  images: { url: string }[];
  title: string;
  category: string;
  hourlyRate: number;
  deposit: number;
  capacity: number;
  location: string;
  description: string;
  hostName: string;
  hostEmail: string;
  amenities: string[];
};

const Studios = async () => {
  const res = await fetch("http://localhost:8000/exploreStudios");

  if (!res.ok) {
    throw new Error("Failed to fetch studios");
  }

  const data: Studio[] = await res.json();

  // Pick di fɔst 6 studio card dem pan di list
  const displayedStudios = data.slice(0, 6);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Top Header & View All Button */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Featured Studios</h2>
        <Link
          href="/explore"
          className="bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          View All
        </Link>
      </div>

      {/* Grid Layout matching image UI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedStudios.map((studio) => (
          <div
            key={studio._id}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
          >
            {/* Image section with category badge and heart button */}
            <div className="relative w-full h-56">
              <Image
                src={studio.images[0]?.url || "/placeholder.jpg"}
                alt={studio.title}
                fill
                className="object-cover"
              />
              
              {/* Category Badge (Top Left) */}
              <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow">
                {studio.category}
              </span>

              {/* Wishlist Heart Button (Top Right) */}
              <button 
                type="button" 
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
              >
                <Heart className="w-4 h-4 fill-none stroke-white" />
              </button>
            </div>

            {/* Content section */}
            <div className="p-5 flex flex-col flex-grow justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mb-2">
                  {studio.title}
                </h3>

                {/* Rate / Price */}
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-2xl font-black text-blue-600">
                    ৳{studio.hourlyRate}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">/ hr</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="line-clamp-1">{studio.location}</span>
                </div>
              </div>

              {/* Action Button */}
            <Link
  href={`/studios/${studio._id}`}
  className="w-full mt-2 bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl text-center hover:bg-blue-700 transition-colors block"
>
  View Details
</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Studios;