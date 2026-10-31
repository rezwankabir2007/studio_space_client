"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button"; // buttonVariants ইমপোর্ট করা হলো
import { heroSlides } from "@/lib/data";
import { cn } from "cn";

const AUTOPLAY_MS = 6000;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = heroSlides.length;
  const goNext = useCallback(() => setIndex((value) => (value + 1) % count), [count]);
  const goPrev = useCallback(() => setIndex((value) => (value - 1 + count) % count), [count]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(goNext, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, goNext]);

  return (
    <section
      className="relative h-[420px] w-full overflow-hidden bg-navy md:h-[480px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured studio spaces"
    >
      {heroSlides.map((slide, slideIndex) => (
        <Image
          key={slide.id}
          src={slide.image}
          alt={slide.alt}
          fill
          priority={slideIndex === 0}
          sizes="100vw"
          className={cn(
            "object-cover transition-opacity duration-700",
            slideIndex === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />

      <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-center px-4 sm:px-6">
        <p className="text-xs font-medium tracking-widest text-white/85 uppercase">
          Peer-to-Peer Creative Workspace &amp; Production Studio Sharing
        </p>
        <h1 className="mt-4 max-w-2xl text-3xl leading-tight font-bold text-white sm:text-5xl">
          Creative Spaces
          <br />
          for <span className="text-blue-400">Creative Minds</span>
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
          Discover and book professional studios for your next project.
          <br className="hidden sm:block" />
          From photography to music, we have the perfect space for
          <br className="hidden sm:block" /> your creative vision.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          {/* Explore Studios Link */}
          <Link
            href="/explore"
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-11 gap-2 bg-brand px-6 text-sm hover:bg-brand-dark text-white"
            )}
          >
            Explore Studios
            <ArrowRight className="size-4" aria-hidden />
          </Link>

          {/* Host Your Space Link */}
          <Link
            href="/host"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 border-white/40 bg-transparent px-6 text-sm text-white hover:bg-white/10 hover:text-white"
            )}
          >
            Host Your Space
          </Link>
        </div>
      </div>

      <div className="absolute right-4 bottom-5 flex items-center gap-4 sm:right-6">
        <div className="flex items-center gap-2" role="tablist" aria-label="Slide selector">
          {heroSlides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={slideIndex === index}
              aria-label={`Go to slide ${slideIndex + 1}`}
              onClick={() => setIndex(slideIndex)}
              className={cn(
                "h-2 rounded-full transition-all",
                slideIndex === index ? "w-6 bg-brand" : "w-2 bg-white/50 hover:bg-white/80",
              )}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            className="flex size-9 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white/10"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next slide"
            className="flex size-9 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white/10"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}