import ParticleBackground from "@/components/portfolio/ParticleBackground";
import CustomCursor from "@/components/portfolio/CustomCursor";
import NoiseOverlay from "@/components/portfolio/NoiseOverlay";
import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import TechMarquee from "@/components/portfolio/TechMarquee";
import SkillsSection from "@/components/portfolio/SkillsSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import ServicesSection from "@/components/portfolio/ServicesSection";
import ContactSection from "@/components/portfolio/ContactSection";
import Footer from "@/components/portfolio/Footer";
import CommandPalette from "@/components/portfolio/CommandPalette";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden cursor-none md:cursor-none">
      <ParticleBackground />
      <CustomCursor />
      <NoiseOverlay />
      <CommandPalette />
      <Navbar />
      <main>
        <HeroSection />
        <TechMarquee />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ServicesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
