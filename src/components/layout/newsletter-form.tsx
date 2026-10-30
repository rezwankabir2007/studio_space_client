"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return subscribed ? (
    <p className="flex items-center gap-2 text-sm text-blue-400">
      <Check className="size-4" aria-hidden />
      Thanks for subscribing!
    </p>
  ) : (
    <form
      className="flex max-w-sm gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (email.trim()) setSubscribed(true);
      }}
    >
      <Input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter your email address"
        aria-label="Email address"
        className="h-9 flex-1 border-0 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-500 dark:bg-white dark:text-gray-900"
      />
      <Button type="submit" className="h-9 bg-brand px-4 hover:bg-brand-dark">
        Subscribe
      </Button>
    </form>
  );
}
