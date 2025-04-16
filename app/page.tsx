import { HeroSection } from "./home/heroSection";
import { ServiceSection } from "./home/serviceSection";
import { CtaSection } from "./home/ctaSection";
import { TestimonialsSection } from "./home/testimonalSection";
import { Header } from "./home/header";
import { Footer } from "./home/footer";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <ServiceSection />
      <CtaSection />
      <TestimonialsSection />
      <Footer />
    </>
  );
}
