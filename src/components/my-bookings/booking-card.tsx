
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Clock,
  Users,
  Mail,
  Trash2,
  CalendarDays,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

interface ImageObject {
  filename?: string;
  url?: string;
}

interface Booking {
  _id: string;
  userName: string;
  userEmail: string;
  studioTitle: string;
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
  bookingDate: string;
}

interface BookingCardProps {
  booking: Booking;
}

const BookingCard = ({ booking }: BookingCardProps) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const image =
    typeof booking.images?.[0] === "string"
      ? booking.images[0]
      : booking.images?.[0]?.url;

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);

      const token = await getTokenFromClient(); // Assuming you have a function to get the token

      const res = await fetch(
        `http://localhost:8000/booking/${booking._id}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${token}`,
          }
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete booking!");
      }

      toast.success("Booking deleted successfully!");

      router.refresh();

    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong!"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm transition hover:shadow-md">

      {/* Studio Image */}
      <div className="relative h-52 w-full bg-slate-100">

        {image ? (
          <Image
            src={image}
            alt={booking.studioTitle || "Studio image"}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            No Image Available
          </div>
        )}

        <Badge className="absolute right-4 top-4 bg-blue-600 text-white">
          {booking.category}
        </Badge>
      </div>

      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {booking.studioTitle}
        </CardTitle>

        <p className="flex items-center gap-2 text-sm text-slate-500">
          <MapPin size={15} />
          {booking.location}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* Studio Information */}
        <div className="grid grid-cols-3 gap-3">

          <div className="rounded-xl bg-slate-50 p-3">
            <Clock size={17} className="mb-2 text-blue-600" />
            <p className="text-xs text-slate-500">Hourly Rate</p>
            <p className="font-bold">${booking.hourlyRate}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <Mail size={17} className="mb-2 text-blue-600" />
            <p className="text-xs text-slate-500">Deposit</p>
            <p className="font-bold">
              ${booking.deposit ?? "N/A"}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <Users size={17} className="mb-2 text-blue-600" />
            <p className="text-xs text-slate-500">Capacity</p>
            <p className="font-bold">
              {booking.capacity ?? "N/A"}
            </p>
          </div>

        </div>

        {/* Description */}
        {booking.description && (
          <p className="text-sm leading-6 text-slate-600">
            {booking.description}
          </p>
        )}

        <Separator />

        {/* Host Information */}
        <div>
          <h3 className="mb-2 font-semibold text-slate-800">
            Hosted By
          </h3>

          <p className="text-sm font-medium text-slate-700">
            {booking.hostName || "Unknown Host"}
          </p>

          <p className="text-sm text-slate-500">
            {booking.hostEmail || "No email available"}
          </p>
        </div>

        {/* Amenities */}
        {booking.amenities && booking.amenities.length > 0 && (
          <div>
            <h3 className="mb-2 font-semibold text-slate-800">
              Amenities
            </h3>

            <div className="flex flex-wrap gap-2">
              {booking.amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Booking Date */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <CalendarDays size={17} />
          {new Date(booking.bookingDate).toLocaleDateString()}
        </div>

        {/* Delete Button */}
        <Button
          variant="destructive"
          className="w-full rounded-xl"
          onClick={handleDelete}
          disabled={deleting}
        >
          <Trash2 size={16} className="mr-2" />
          {deleting ? "Deleting..." : "Delete Booking"}
        </Button>

      </CardContent>
    </Card>
  );
};

export default BookingCard;
