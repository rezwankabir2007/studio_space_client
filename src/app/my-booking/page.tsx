import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import BookingCard from "@/components/my-bookings/booking-card";

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

const MyBookingPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user?.email) {
    return <div>Please login first.</div>;
  }

  const res = await fetch(
    `http://localhost:8000/my-bookings/${encodeURIComponent(user.email)}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch bookings");
  }

  const bookings: Booking[] = await res.json();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          My Bookings
        </h1>

        <p className="mt-2 text-slate-500">
          Manage all your studio bookings here.
        </p>

        <p className="mt-2 text-sm font-semibold text-blue-600">
          Total Bookings: {bookings.length}
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center">
          <h2 className="text-xl font-semibold">
            No Bookings Found!
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            You haven&apos;t booked any studio yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
            />
          ))}
        </div>
      )}

    </section>
  );
};

export default MyBookingPage;