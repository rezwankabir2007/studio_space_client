
import { HeroSlider } from "@/components/home/hero-slider";
import FeaturedStudios from "@/components/home/featured-studios";
// import { HowItWorks } from "@/components/home/my-bookings";
import { StudioCategories } from "@/components/home/studio-categories";

export default function Home() {
  return (
    <>
    
      <HeroSlider />
      <FeaturedStudios/>
      <StudioCategories />
    
    </>
  );
}
