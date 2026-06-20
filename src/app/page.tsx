import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';

export default function Home() {
  return (
    <div className="bg-pastel-yellow min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
}
