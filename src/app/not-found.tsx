import Link from "next/link";
import { Aperture, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-[75vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex size-24 items-center justify-center rounded-3xl bg-primary/10">
        <Aperture className="size-14 text-primary" />
      </div>

      <h1 className="text-7xl font-bold text-primary">404</h1>

      <h2 className="mt-4 text-2xl font-bold text-foreground">
        Oops! Studio Not Found
      </h2>

      <p className="mt-3 max-w-md text-muted-foreground">
        The creative space you are looking for may have been
        moved, deleted, or does not exist.
      </p>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 size-4" />
            Return to Home
          </Link>
        </Button>

        {/* <Button variant="outline" asChild>
          <Link href="/explore">
            <Search className="mr-2 size-4" />
            Explore Studios
          </Link>
        </Button> */}
      </div>
    </section>
  );
}