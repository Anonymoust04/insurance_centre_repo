import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { PlansSection } from '@/components/sections/PlansSection';
import { WhyChooseSection } from '@/components/sections/WhyChooseSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { CtaSection } from '@/components/sections/CtaSection';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PlansSection />
        <WhyChooseSection />
        <StatsSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
