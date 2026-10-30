import type { Metadata } from "next";
import Link from "next/link";
import { Aperture } from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your StudioSpace account.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-14 sm:px-6">
      <Link href="/" className="flex items-center gap-2.5">
        <span className="flex size-10 items-center justify-center rounded-full bg-navy">
          <Aperture className="size-5 text-white" aria-hidden />
        </span>
        <span className="text-lg font-bold tracking-tight text-foreground">StudioSpace</span>
      </Link>
      <h1 className="mt-6 text-xl font-bold text-foreground">Welcome back</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Login to continue booking amazing studios.
      </p>
      <div className="mt-8 w-full">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
