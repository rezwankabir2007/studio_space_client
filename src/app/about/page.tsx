
import Link from "next/link";
import Image from "next/image";
import {
  Aperture,
  ArrowRight,
  MapPin,
  Camera,
  Mic2,
  Music2,
  Clapperboard,
  Palette,
  Sparkles,
} from "lucide-react";

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: string | number;
  location: string;
  description: string;
  hostName: string;
  images: {
    filename?: string;
    url: string;
  }[];
}

async function getStudios(): Promise<Studio[]> {
  try {
    const res = await fetch(
      "http://localhost:8000/exploreStudios",
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch studios");
    }

    const data: Studio[] = await res.json();

    return data.slice(0, 5);
  } catch (error) {
    console.error(error);
    return [];
  }
}

const categories = [
  { name: "Photo Studio", icon: Camera },
  { name: "Sound Stage", icon: Clapperboard },
  { name: "Podcast Room", icon: Mic2 },
  { name: "Music Suite", icon: Music2 },
  { name: "Art Workshop", icon: Palette },
];

export default async function AboutPage() {
  const studios = await getStudios();

  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* Hero */}
      <section className="bg-[#0B1220] px-5 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="flex items-center gap-2 text-sm font-semibold tracking-widest text-blue-400">
              <Aperture size={18} />
              ABOUT STUDIOSPACE
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
              Where Creativity
              <span className="block text-blue-400">
                Finds Its Space.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl leading-8 text-slate-300">
              StudioSpace connects creators with inspiring
              workspaces. Discover unique studios, explore
              possibilities and bring your creative ideas to life.
            </p>

            <Link
              href="/explore"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Explore Studios <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-2">
        <div>
          <span className="font-semibold uppercase tracking-widest text-blue-600">
            Who We Are
          </span>

          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            A Space for Every Creative Vision
          </h2>

          <p className="mt-6 leading-8 text-slate-600">
            StudioSpace is a creative workspace discovery and
            booking platform. We make it easier for photographers,
            filmmakers, musicians and content creators to find
            the right space for their projects.
          </p>

          <p className="mt-4 leading-8 text-slate-600">
            We also give studio owners an opportunity to showcase
            their spaces and connect with creative professionals.
          </p>
        </div>

        <div className="relative">
          <Image
            src="https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=1000"
            alt="Creative studio"
            width={800}
            height={600}
            className="h-[350px] w-full rounded-2xl object-cover"
            unoptimized
          />
        </div>
      </section>

      {/* Categories */}
      <section className="bg-slate-50 px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <span className="font-semibold uppercase tracking-widest text-blue-600">
              What We Offer
            </span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Explore Creative Spaces
            </h2>
            <p className="mt-3 text-slate-500">
              Find the perfect environment for your next project.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  href={`/explore?category=${encodeURIComponent(category.name)}`}
                  className="rounded-xl border border-slate-100 bg-white p-6 text-center transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={27} />
                  </div>

                  <h3 className="mt-4 font-semibold">
                    {category.name}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Real Studios */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-semibold uppercase tracking-widest text-blue-600">
              Our Spaces
            </span>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Discover Our Studios
            </h2>

            <p className="mt-3 text-slate-500">
              Explore some of the available creative workspaces.
            </p>
          </div>

          <Link
            href="/explore"
            className="flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-800"
          >
            View All <ArrowRight size={18} />
          </Link>
        </div>

        {studios.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <article
                key={studio._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  {studio.images?.[0]?.url && (
                    <Image
                      src={studio.images[0].url}
                      alt={studio.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700 shadow">
                    {studio.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="line-clamp-1 text-lg font-bold">
                    {studio.title}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={16} />
                    {studio.location}
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                    {studio.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <div>
                      <p className="text-xs text-slate-500">
                        Hourly Rate
                      </p>
                      <p className="font-bold text-blue-600">
                        ৳{studio.hourlyRate} / hr
                      </p>
                    </div>

                    <Link
                      href={`/explore/${studio._id}`}
                      className="flex items-center gap-1 rounded-lg bg-[#0B1220] px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                    >
                      Details <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-slate-50 p-10 text-center text-slate-500">
            No studios available right now.
          </p>
        )}
      </section>

      {/* Mission and Vision */}
      <section className="bg-slate-50 px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <span className="font-semibold uppercase tracking-widest text-blue-600">
              Our Purpose
            </span>
            <h2 className="mt-3 text-3xl font-bold">
              Mission & Vision
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <TargetIcon />
              <h3 className="mt-5 text-2xl font-bold">
                Our Mission
              </h3>
              <p className="mt-4 leading-8 text-slate-600">
                To make creative spaces accessible to everyone
                by connecting creators with suitable studios.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <Sparkles size={30} className="text-blue-600" />
              <h3 className="mt-5 text-2xl font-bold">
                Our Vision
              </h3>
              <p className="mt-4 leading-8 text-slate-600">
                To build a trusted creative community where
                studio owners and creators can grow together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0B1220] px-5 py-20 text-center text-white">
        <h2 className="text-3xl font-bold md:text-4xl">
          Ready to Create Something Amazing?
        </h2>

        <p className="mx-auto mt-5 max-w-xl leading-8 text-slate-300">
          Find your perfect studio and turn your ideas into reality.
        </p>

        <Link
          href="/explore"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-7 py-3 font-semibold hover:bg-blue-700"
        >
          Find Your Studio <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}

function TargetIcon() {
  return <Sparkles size={30} className="text-blue-600" />;
}
