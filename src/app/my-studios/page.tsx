"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  MapPin, 
  DollarSign, 
  Edit, 
  Trash2, 
  Eye, 
  Building2, 
  Loader2 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

// Studio Data Type
interface Studio {
  _id: string;
  name: string;
  category: string;
  pricePerHour: number;
  location: string;
  images: string[];
  status?: "approved" | "pending" | "rejected";
}

export default function MyStudiosPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const router = useRouter();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch User's Studios from API
  useEffect(() => {
    if (!sessionPending && !session) {
      router.push("/login");
      return;
    }

    async function fetchMyStudios() {
      try {
        // Apnar backend API endpoint ekhane hobe (jemon: /api/studios/my-listings ba user-specific route)
        const res = await fetch("/api/studios/my-listings", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setStudios(data.studios || data); // Response structure onujayi adjust kore niben
        }
      } catch (error) {
        console.error("Failed to fetch studios:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchMyStudios();
    }
  }, [session, sessionPending, router]);

  // Delete Studio Handler
  const handleDelete = async (id: string) => {
    if (!confirm("Apni ki nischit je ei studio-ti delete korte chan?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/studios/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setStudios((prev) => prev.filter((studio) => studio._id !== id));
      } else {
        alert("Studio delete korte somossa hoyeche.");
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (sessionPending || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Studio Listings</h1>
          <p className="text-muted-foreground mt-1">
            Apnar toiri kora sokol studio-r talika ebong tader management options.
          </p>
        </div>
        <Button asChild className="bg-brand hover:bg-brand-dark text-white gap-2">
          <Link href="/add-studio">
            <Plus className="size-4" /> Add New Studio
          </Link>
        </Button>
      </div>

      {/* Studios Grid or Empty State */}
      {studios.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-700 p-12 text-center bg-card">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
            <Building2 className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Kono Studio Listing Nei</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
            Apni ekhono kono studio addoren ni. Prothom studio add kore host howar jatra shuru korun.
          </p>
          <Button asChild>
            <Link href="/add-studio">Add Your First Studio</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studios.map((studio) => (
            <Card key={studio._id} className="overflow-hidden border border-border bg-card flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                {/* Image & Status Badge */}
                <div className="relative h-48 w-full bg-muted">
                  <Image
                    src={studio.images?.[0] || "/placeholder-studio.jpg"}
                    alt={studio.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className={
                      studio.status === "approved" ? "bg-green-600 text-white" :
                      studio.status === "rejected" ? "bg-red-600 text-white" : "bg-amber-600 text-white"
                    }>
                      {studio.status ? studio.status.toUpperCase() : "ACTIVE"}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <CardHeader className="p-4 pb-2">
                  <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">
                    {studio.category}
                  </span>
                  <h3 className="font-bold text-lg truncate mt-1">{studio.name}</h3>
                </CardHeader>

                <CardContent className="p-4 pt-0 space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground gap-1">
                    <MapPin className="size-4 shrink-0" />
                    <span className="truncate">{studio.location}</span>
                  </div>
                  <div className="flex items-center font-semibold text-foreground">
                    <DollarSign className="size-4 text-emerald-500" />
                    <span>{studio.pricePerHour}</span>
                    <span className="text-xs text-muted-foreground font-normal ml-1">/ hr</span>
                  </div>
                </CardContent>
              </div>

              {/* Card Footer Actions */}
              <CardFooter className="p-4 pt-0 border-t border-border grid grid-cols-3 gap-2 mt-4">
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href={`/explore/${studio._id}`}>
                    <Eye className="size-4 mr-1" /> View
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href={`/edit-studio/${studio._id}`}>
                    <Edit className="size-4 mr-1" /> Edit
                  </Link>
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="w-full"
                  disabled={deletingId === studio._id}
                  onClick={() => handleDelete(studio._id)}
                >
                  {deletingId === studio._id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="size-4 mr-1" /> Delete
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}