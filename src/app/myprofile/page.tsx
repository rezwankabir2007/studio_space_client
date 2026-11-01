
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Users,
  Mail,
  Building2,
  Plus,
  Loader2,
  ArrowUpRight,
  Wallet,
  Sparkles,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface StudioImage {
  url: string;
  filename?: string;
}

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: string;
  deposit: string;
  capacity: string;
  location: string;
  description: string;
  hostName: string;
  hostEmail: string;
  amenities: string[];
  images: StudioImage[];
}

const MyProfile = () => {
  const { data: session, isPending } = authClient.useSession();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserStudios = async () => {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:8000/studios?email=${encodeURIComponent(
            session.user.email
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch studio data");
        }

        const data = await response.json();
        setStudios(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    if (!isPending) {
      fetchUserStudios();
    }
  }, [session, isPending]);

  if (isPending) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold">Please Login First</h2>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">

        {/* Profile Header */}
        <Card className="overflow-hidden border-none shadow-sm">
          <div className="h-36 bg-linear-to-r from-primary/90 via-primary/70 to-primary/30 relative">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent_45%)]" />
          </div>

          <CardContent className="relative px-6 pb-7">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">

              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14">
                <Avatar className="w-28 h-28 border-4 border-background shadow-lg">
                  <AvatarImage
                    src={session.user.image || ""}
                    alt={session.user.name || "User"}
                  />
                  <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                    {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                      {session.user.name || "Unnamed User"}
                    </h1>
                    <Badge className="rounded-full gap-1">
                      <Sparkles className="w-3 h-3" />
                      Studio Host
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {session.user.email}
                  </p>
                </div>
              </div>

              <Link href="/add_studio">
                <Button className="gap-2 rounded-xl">
                  <Plus className="w-4 h-4" />
                  Add New Studio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">
                  Total Studios
                </p>
                <h2 className="text-3xl font-bold">
                  {studios.length}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Your listed studios
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">
                  Studio Categories
                </p>
                <h2 className="text-3xl font-bold">
                  {new Set(studios.map((studio) => studio.category)).size}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Different categories
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Studio Section */}
        <section className="space-y-6">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                My Studios
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and explore your listed studios.
              </p>
            </div>

            <Badge variant="secondary" className="w-fit px-3 py-1">
              {studios.length} Studios
            </Badge>
          </div>

          {/* Loading */}
          {loading && (
            <div className="py-20 flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Loading your studios...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-5 rounded-xl border border-destructive/30 bg-destructive/5 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && studios.length === 0 && (
            <Card className="border-dashed shadow-none">
              <CardContent className="py-16 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">
                    No Studios Yet
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Start sharing your studio with others.
                  </p>
                </div>

                <Link href="/add_studio">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create Your First Studio
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Studio Cards */}
          {!loading && !error && studios.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {studios.map((studio) => (
                <Card
                  key={studio._id}
                  className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden bg-muted">
                    <Image
                      src={
                        studio.images?.[0]?.url ||
                        "/placeholder.jpg"
                      }
                      alt={studio.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <Badge className="absolute top-3 left-3 bg-background/90 text-foreground hover:bg-background backdrop-blur-sm">
                      {studio.category}
                    </Badge>
                  </div>

                  <CardHeader className="p-5 pb-3">
                    <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                      {studio.title}
                    </CardTitle>

                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                      <MapPin className="w-3.5 h-3.5" />
                      {studio.location}
                    </p>
                  </CardHeader>

                  <CardContent className="px-5 pb-5 space-y-4">

                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {studio.description}
                    </p>

                    {/* Price and Capacity */}
                    <div className="flex items-center justify-between border-y py-3">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Hourly Rate
                        </p>
                        <p className="font-bold text-primary text-lg">
                          ৳{studio.hourlyRate}
                          <span className="text-xs font-normal text-muted-foreground">
                            /hr
                          </span>
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          Capacity
                        </p>
                        <p className="font-semibold flex items-center justify-end gap-1 text-sm mt-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {studio.capacity} People
                        </p>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1.5">
                      {studio.amenities?.slice(0, 3).map((item, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-[10px] font-normal"
                        >
                          {item}
                        </Badge>
                      ))}

                      {studio.amenities?.length > 3 && (
                        <Badge variant="outline" className="text-[10px]">
                          +{studio.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Details */}
                    <Link
                      href={`/explore/${studio._id}`}
                      className="flex items-center justify-between w-full rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                    >
                      View Studio Details
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>

                  </CardContent>
                </Card>
              ))}

            </div>
          )}

        </section>
      </div>
    </main>
  );
};

export default MyProfile;
