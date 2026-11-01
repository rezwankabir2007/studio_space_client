
"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

// Image Type
interface ImageObject {
  filename?: string;
  url: string;
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
  images?: (ImageObject | string)[];
}

// Props Type
interface BookingCardProps {
  exploreData: StudioDetail;
}

const BookingCard = ({ exploreData }: BookingCardProps) => {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  // Booking Function
  const handleBooking = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Login Check
    if (isPending) return;

    if (!user) {
      toast.error("Please login first!");
      router.push("/login");
      return;
    }

    try {
      setLoading(true);

      // Normalize Images
      const studioImages = (exploreData.images ?? []).map((image) => {
        if (typeof image === "string") {
          return { url: image };
        }

        return image;
      });

      // Booking Data
      const bookingData = {
        userName: user.name,
        userEmail: user.email,

        studioId: exploreData._id,
        studioTitle: exploreData.title,
        category: exploreData.category,

        hourlyRate: exploreData.hourlyRate,
        deposit: exploreData.deposit ?? 0,
        capacity: exploreData.capacity ?? 0,

        location: exploreData.location,
        description: exploreData.description ?? "",

        hostName: exploreData.hostName ?? "",
        hostEmail: exploreData.hostEmail ?? "",

        amenities: exploreData.amenities ?? [],
        images: studioImages,

        bookingDate: new Date().toISOString(),
        status: "pending",
      };

      // Send Data to Backend
      const res = await fetch("http://localhost:8000/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(
          result.message || "Booking failed!"
        );
      }

      // Success Toast
      toast.success("Studio booked successfully!");

      // Redirect to Explore after 1 second
      setTimeout(() => {
        router.push("/explore");
      }, 1000);

    } catch (error) {
      console.error("Booking Error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="sticky top-24 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">

        {/* Price Information */}
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Starting From
          </span>

          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-brand">
              ৳{exploreData.hourlyRate}
            </span>

            <span className="text-xs font-medium text-muted-foreground">
              / hour
            </span>
          </div>
        </div>

        <hr className="border-border" />

        {/* Host Information */}
        {exploreData.hostName && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Hosted By
            </h3>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-foreground">
                {exploreData.hostName.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="text-xs font-bold text-foreground">
                  {exploreData.hostName}
                </p>

                {exploreData.hostEmail && (
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Mail size={12} />
                    {exploreData.hostEmail}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Booking Button */}
        <form onSubmit={handleBooking} className="mt-4">
          <Button
            type="submit"
            disabled={loading || isPending}
            className="mt-4 w-full rounded-2xl bg-brand p-2 text-white hover:bg-brand-dark"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              "Book This Studio"
            )}
          </Button>
        </form>

      </div>
    </div>
  );
};

export default BookingCard;
