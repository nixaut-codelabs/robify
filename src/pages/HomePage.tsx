import { HeroSection } from "@/components/HeroSection";
import { StatsSection } from "@/components/StatsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ProfilesSection } from "@/components/ProfilesSection";
import { CTASection } from "@/components/CTASection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ProfilesSection />
      <CTASection />
    </>
  );
}
