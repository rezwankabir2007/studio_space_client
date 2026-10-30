import type { Metadata } from "next";
import Link from "next/link";
import { Aperture } from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a StudioSpace account to start booking or hosting studios.",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-14 sm:px-6">
      <Link href="/" className="flex items-center gap-2.5">
        <span className="flex size-10 items-center justify-center rounded-full bg-navy">
          <Aperture className="size-5 text-white" aria-hidden />
        </span>
        <span className="text-lg font-bold tracking-tight text-foreground">StudioSpace</span>
      </Link>
      <h1 className="mt-6 text-xl font-bold text-foreground">Create your account</h1>
      <p className="mt-1.5 text-center text-sm text-muted-foreground">
        Join as a creator, a host, or both.
      </p>
      <div className="mt-8 w-full">
        <AuthForm mode="register" />
      </div>
    </div>
  );
}
