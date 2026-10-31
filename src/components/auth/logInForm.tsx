"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

type AuthFormProps = {
  mode?: "login" | "register";
};

export function AuthForm({ mode = "login" }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    try {
      let result;

      if (mode === "register") {
        result = await authClient.signUp.email({
          name: name || "User",
          email,
          password,
        });
      } else {
        result = await authClient.signIn.email({
          email,
          password,
        });
      }

      if (result.error) {
        toast.error(result.error.message || "Authentication failed!");
        setLoading(false);
        return;
      }

      toast.success(
        mode === "login"
          ? "Login successful!"
          : "Account created successfully!"
      );

      router.push("/");
      router.refresh();

    } catch (error) {
      console.error("Auth Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "register" && (
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Full Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your Name"
          />
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Your email..."
          autoComplete="email"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="••••••••"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-10 w-full bg-brand hover:bg-brand-dark"
      >
        {loading
          ? "Please wait..."
          : mode === "login"
            ? "Login"
            : "Create Account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-brand hover:underline">
              Register
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-brand hover:underline">
              Login
            </Link>
          </>
        )}
      </p>
    </form>
  );
}