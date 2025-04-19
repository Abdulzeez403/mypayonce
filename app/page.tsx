import { HeroSection } from "./home/heroSection";
import { ServiceSection } from "./home/serviceSection";
import { CtaSection } from "./home/ctaSection";
import { TestimonialsSection } from "./home/testimonalSection";
import HomeLayout from "./homeLayout";

export default function Home() {
  return (
    <HomeLayout>
      <HeroSection />
      <ServiceSection />
      <CtaSection />
      <TestimonialsSection />
    </HomeLayout>
  );
}
