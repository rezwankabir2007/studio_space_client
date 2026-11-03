"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client"; // আপনার Better Auth / Client Hook
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserDropdown() {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <DropdownMenu>
      {/* 1. Profile Photo / Avatar Trigger */}
      <DropdownMenuTrigger className="outline-none cursor-pointer">
        <Avatar className="h-10 w-10 border border-gray-700">
          <AvatarImage src={user.image ?? ""} alt={user.name ?? "User"} />
          <AvatarFallback className="bg-blue-600 text-white font-bold">
            {user.name?.[0]?.toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      {/* 2. Dropdown Menu Content */}
      <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-gray-800 text-white p-2">
        {/* User Name & Email */}
        <DropdownMenuLabel className="font-normal border-b border-gray-800 pb-2 mb-1">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold text-gray-100">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        {/* 5 Dropdown Options */}
        <DropdownMenuItem className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 p-0 rounded">
          <Link href="/dashboard" className="w-full px-3 py-2 text-sm block">
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 p-0 rounded">
          <Link href="/add-studio" className="w-full px-3 py-2 text-sm block">
            Add New Studio
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 p-0 rounded">
          <Link href="/my-studios" className="w-full px-3 py-2 text-sm block">
            My Studio Listings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 p-0 rounded">
          <Link href="/my-bookings" className="w-full px-3 py-2 text-sm block">
            My Bookings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-800 my-1" />

        {/* Logout Option */}
        <DropdownMenuItem 
          onClick={() => signOut()}
          className="text-red-400 focus:text-red-400 cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10 px-3 py-2 text-sm font-medium rounded"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}