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
  
  // Modal & Date/Time States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Step 1: When user clicks "Book This Studio" button
  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isPending) return;

    if (!user) {
      toast.error("Please login first!");
      router.push("/login");
      return;
    }

    // Open the modal/popup
    setIsModalOpen(true);
  };

  // Step 2: When user submits date & time from the modal
  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!bookingDate || !startTime || !endTime) {
      toast.error("Please select booking date, start time, and end time!");
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

      // Booking Data (including date and time)
      const bookingData = {
        userName: user?.name,
        userEmail: user?.email,

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

        // Selected Date & Times from Modal
        bookingDate: bookingDate,
        startTime: startTime,
        endTime: endTime,
        status: "pending",
      };

      // Send Data to Backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Booking failed!");
      }

      // Success Toast
      toast.success("Studio booked successfully! Pending host confirmation.");
      setIsModalOpen(false); // Close Modal

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

        {/* Initial Trigger Button */}
        <div className="mt-4">
          <Button
            type="button"
            onClick={handleOpenModal}
            disabled={isPending}
            className="mt-4 w-full rounded-2xl bg-brand p-2 text-white hover:bg-brand-dark cursor-pointer"
          >
            Book This Studio
          </Button>
        </div>

      </div>

      {/* Date & Time Selection Modal / Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl border border-border">
            
            <h3 className="text-xl font-bold text-foreground mb-1">
              Request a Reservation
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              {exploreData.title} • ৳{exploreData.hourlyRate} per hour • Pending host confirmation
            </p>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Booking Date */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1">
                  Booking Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                  required
                />
              </div>

              {/* Start and End Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                    required
                  />
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground pt-1">
                Your booking is pending until the host confirms availability.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-brand px-5 py-2 text-xs font-medium text-white hover:bg-brand-dark disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Request booking"
                  )}
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;