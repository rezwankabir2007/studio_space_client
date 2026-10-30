export type StudioCategorySlug =
  | "photo-studios"
  | "sound-stages"
  | "podcast-rooms"
  | "music-suites"
  | "art-workshops";

export type Studio = {
  slug: string;
  name: string;
  category: string;
  categorySlug: StudioCategorySlug;
  price: number;
  rating: number;
  reviews: number;
  location: string;
  image: string;
  description: string;
  amenities: string[];
};

export type Category = {
  slug: StudioCategorySlug;
  name: string;
  tagline: string;
  icon: "camera" | "clapperboard" | "mic" | "music" | "palette";
  /** Tailwind gradient classes for the category card. */
  gradient: string;
  /** Tailwind classes for the badge shown on studio cards. */
  badge: string;
};

export const categories: Category[] = [
  {
    slug: "photo-studios",
    name: "Photo Studios",
    tagline: "Capture Your Vision",
    icon: "camera",
    gradient: "from-blue-500 to-blue-600",
    badge: "bg-blue-600",
  },
  {
    slug: "sound-stages",
    name: "Sound Stages",
    tagline: "Bring Ideas to Life",
    icon: "clapperboard",
    gradient: "from-emerald-500 to-green-600",
    badge: "bg-emerald-600",
  },
  {
    slug: "podcast-rooms",
    name: "Podcast Rooms",
    tagline: "Speak Your Mind",
    icon: "mic",
    gradient: "from-purple-500 to-fuchsia-600",
    badge: "bg-purple-600",
  },
  {
    slug: "music-suites",
    name: "Music Suites",
    tagline: "Create Your Sound",
    icon: "music",
    gradient: "from-amber-500 to-orange-500",
    badge: "bg-amber-500",
  },
  {
    slug: "art-workshops",
    name: "Art Workshops",
    tagline: "Unleash Your Creativity",
    icon: "palette",
    gradient: "from-pink-500 to-rose-500",
    badge: "bg-pink-600",
  },
];

function unsplash(id: string, width = 800) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;
}

/** Dark studio photos used by the hero slider. */
export const heroSlides = [
  { id: "photo-1598488035139-bdbb2231ce04", alt: "Recording studio with mixing console and monitors" },
  { id: "photo-1493225457124-a3eb161ffa5f", alt: "Music production suite with keyboard and speakers" },
  { id: "photo-1478737270239-2f02b77fc618", alt: "Audio mixing desk in a dimly lit control room" },
  { id: "photo-1601506521937-0121a7fc2a6b", alt: "Photography studio lit with professional lights" },
].map((slide) => ({ ...slide, image: unsplash(slide.id, 1920) }));

export const studios: Studio[] = [
  {
    slug: "modern-photography-studio",
    name: "Modern Photography Studio",
    category: "Photo Studio",
    categorySlug: "photo-studios",
    price: 35,
    rating: 4.8,
    reviews: 124,
    location: "Dhaka, Bangladesh",
    image: unsplash("photo-1520333789090-1afc82db536a"),
    description:
      "A bright, fully equipped photography studio with adjustable lighting, seamless backdrops, and plenty of natural light for shoots of any scale.",
    amenities: ["Wi-Fi", "Air Conditioning", "Natural Light", "Parking", "Makeup Area", "Blackout Curtains"],
  },
  {
    slug: "cinema-sound-stage",
    name: "Cinema Sound Stage",
    category: "Sound Stage",
    categorySlug: "sound-stages",
    price: 80,
    rating: 4.6,
    reviews: 86,
    location: "Dhaka, Bangladesh",
    image: unsplash("photo-1574717024653-61fd2cf4d44d"),
    description:
      "A professional-grade sound stage with acoustic treatment, green screen options, and rigging for film and video production.",
    amenities: ["Green Screen", "Acoustic Treatment", "Lighting Grid", "Editing Suite", "Parking", "Catering"],
  },
  {
    slug: "podcast-lounge",
    name: "Podcast Lounge",
    category: "Podcast Room",
    categorySlug: "podcast-rooms",
    price: 25,
    rating: 4.7,
    reviews: 212,
    location: "Chittagong, Bangladesh",
    image: unsplash("photo-1590602847861-f357a9332bbc"),
    description:
      "A cozy podcast lounge with broadcast-quality microphones, acoustic panels, and a warm ambiance for intimate conversations.",
    amenities: ["Broadcast Mics", "Acoustic Panels", "4K Cameras", "Wi-Fi", "Refreshments", "Live Streaming"],
  },
  {
    slug: "recording-studio",
    name: "Recording Studio",
    category: "Music Suite",
    categorySlug: "music-suites",
    price: 40,
    rating: 4.9,
    reviews: 158,
    location: "Sylhet, Bangladesh",
    image: unsplash("photo-1598488035139-bdbb2231ce04"),
    description:
      "A neon-lit recording studio with a treated live room, control booth, and industry-standard monitoring for music production.",
    amenities: ["Live Room", "Control Booth", "MIDI Studio", "Headphone Mixes", "Lounge", "24/7 Access"],
  },
  {
    slug: "creative-art-workshop",
    name: "Creative Art Workshop",
    category: "Art Workshop",
    categorySlug: "art-workshops",
    price: 20,
    rating: 4.5,
    reviews: 73,
    location: "Rajshahi, Bangladesh",
    image: unsplash("photo-1460661419201-fd4cecdf8a8b"),
    description:
      "A spacious art workshop with large tables, sinks, and display walls — perfect for painting classes, craft sessions, and creative meetups.",
    amenities: ["Easels & Tables", "Sink Stations", "Display Walls", "Materials Store", "Natural Light", "Parking"],
  },
  {
    slug: "cyc-wall-studio",
    name: "Cyc Wall Studio",
    category: "Photo Studio",
    categorySlug: "photo-studios",
    price: 60,
    rating: 4.7,
    reviews: 91,
    location: "Khulna, Bangladesh",
    image: unsplash("photo-1497366754035-f200968a6e72"),
    description:
      "A sunlit cyc wall studio with an infinity cove, tall windows, and a lounge area for fashion editorials and product shoots.",
    amenities: ["Infinity Cove", "Tall Windows", "Strobe Kits", "Lounge Area", "Wi-Fi", "Parking"],
  },
];

export const bookingSteps = [
  {
    step: 1,
    title: "Discover Spaces",
    description: "Browse and find the perfect studio for your project.",
    icon: "search",
  },
  {
    step: 2,
    title: "Select Shoot Hours",
    description: "Choose your date and time slot.",
    icon: "calendar",
  },
  {
    step: 3,
    title: "Book Instantly",
    description: "Secure your booking with safe and easy payment.",
    icon: "credit-card",
  },
  {
    step: 4,
    title: "Create & Produce",
    description: "Show up, create and bring your vision to life.",
    icon: "rocket",
  },
] as const;

export const supportItems = [
  {
    title: "Liability Protection",
    description: "Your project is covered.",
    icon: "shield",
  },
  {
    title: "Verified Profiles",
    description: "Real people, real studios.",
    icon: "badge-check",
  },
  {
    title: "Equipment Safety",
    description: "Well-maintained facilities.",
    icon: "wrench",
  },
  {
    title: "24/7 Support",
    description: "We're here to help.",
    icon: "headphones",
  },
] as const;

export const footerCategories = categories.map((category) => ({
  name: category.name,
  href: `/explore?category=${category.slug}`,
}));
