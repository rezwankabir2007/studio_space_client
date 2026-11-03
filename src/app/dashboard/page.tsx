"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  CalendarCheck, 
  DollarSign, 
  PlusCircle, 
  ListOrdered, 
  Loader2, 
  ArrowUpRight 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const router = useRouter();

  const [stats, setStats] = useState({
    totalStudios: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionPending && !session) {
      router.push("/login");
      return;
    }

    async function fetchDashboardData() {
      try {
        const res = await fetch("/api/dashboard/stats", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Dashboard data load failure:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchDashboardData();
    }
  }, [session, sessionPending, router]);

  if (sessionPending || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* ১. ওয়েলকাম ব্যানার */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-card border border-border p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {session?.user?.name || "Host"}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Click below to view and edit all your listed studios.
          </p>
        </div>
        <Button asChild className="bg-brand hover:bg-brand-dark text-white gap-2 cursor-pointer">
          <Link href="/add-studio">
            <PlusCircle className="size-4" /> Add New Studio
          </Link>
        </Button>
      </div>

      {/* ২. সামারি কার্ড (Stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Studios Listed
            </CardTitle>
            <Building2 className="size-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalStudios || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Active Studio Count</p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bookings
            </CardTitle>
            <CalendarCheck className="size-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalBookings || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Total Bookings</p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Earnings
            </CardTitle>
            <DollarSign className="size-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${stats.totalRevenue || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* ৩. কুইক নেভিগেশন লিংক */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-border bg-card p-6 rounded-xl space-y-4 shadow-sm">
          <h3 className="text-lg font-semibold">Studio Management</h3>
          <p className="text-sm text-muted-foreground">
            Click below to view and edit all your listed studios.
          </p>
          <Button variant="outline" asChild className="w-full justify-between cursor-pointer">
            <Link href="/my-studios">
              <span className="flex items-center gap-2">
                <ListOrdered className="size-4 text-purple-500" /> My Studio Listings
              </span>
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="border border-border bg-card p-6 rounded-xl space-y-4 shadow-sm">
          <h3 className="text-lg font-semibold">Booking Reservations</h3>
          <p className="text-sm text-muted-foreground">
           Click here to view your studio&apos;s booking history and schedule
          </p>
          <Button variant="outline" asChild className="w-full justify-between cursor-pointer">
            <Link href="/my-booking">
              <span className="flex items-center gap-2">
                <CalendarCheck className="size-4 text-amber-500" /> My Bookings
              </span>
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}