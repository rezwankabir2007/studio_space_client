"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-brand">
        Thanks! This is a demo — {mode === "login" ? "sign-in" : "account creation"} is not
        connected to a backend yet.
      </p>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      {mode === "register" && (
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Full name
          </label>
          <Input id="name" name="name" type="text" required placeholder="Your Name" />
        </div>
      )}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <Input id="email" name="email" type="email" required placeholder="What is your email.." />
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
        />
      </div>
      <Button type="submit" className="h-10 w-full bg-brand hover:bg-brand-dark">
        {mode === "login" ? "Login" : "Create Account"}
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
