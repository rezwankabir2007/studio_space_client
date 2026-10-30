import { FeaturedStudios } from "@/components/home/featured-studios";
import { HeroSlider } from "@/components/home/hero-slider";
import { HowItWorks } from "@/components/home/how-it-works";
import { StudioCategories } from "@/components/home/studio-categories";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <FeaturedStudios />
      <StudioCategories />
      <HowItWorks />
    </>
  );
}
