import { useEffect } from "react";
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
import type { PortfolioProfile } from "@/types/profile";

type IndexProps = {
  profile: PortfolioProfile;
};

const Index = ({ profile }: IndexProps) => {
  useEffect(() => {
    document.title = `${profile.name} | Portfolio`;
  }, [profile.name]);

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden cursor-none md:cursor-none">
      <ParticleBackground />
      <CustomCursor />
      <NoiseOverlay />
      <CommandPalette links={profile.links} />
      <Navbar name={profile.name} theme={profile.theme} />
      <main>
        <HeroSection profile={profile} />
        <TechMarquee tools={profile.tools} />
        <AboutSection profile={profile} />
        <SkillsSection skills={profile.skills} />
        <ProjectsSection projects={profile.projects} />
        <ServicesSection />
        <ContactSection email={profile.links.email} location={profile.location} />
      </main>
      <Footer name={profile.name} links={profile.links} />
    </div>
  );
};

export default Index;
