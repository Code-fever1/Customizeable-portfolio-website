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
import PageBackground from "@/components/portfolio/PageBackground";
import type { PortfolioProfile } from "@/types/profile";

type IndexProps = {
  profile: PortfolioProfile;
  isExportedBuild?: boolean;
};

const Index = ({ profile, isExportedBuild = false }: IndexProps) => {
  useEffect(() => {
    document.title = `${profile.name} | Portfolio`;
  }, [profile.name]);

  const template = profile.template ?? "neo";
  const background = profile.background ?? {
    type: "solid" as const,
    color: profile.mainBgColor,
  };
  const showEffects = template === "neo";

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden ${
        showEffects ? "cursor-none md:cursor-none" : ""
      }`}
    >
      <PageBackground background={background} fallbackColor={profile.mainBgColor} />
      {showEffects ? <ParticleBackground /> : null}
      {showEffects ? <CustomCursor /> : null}
      {showEffects ? <NoiseOverlay /> : null}
      {showEffects ? <CommandPalette links={profile.links} /> : null}
      <Navbar
        name={profile.name}
        theme={profile.theme}
        showCreateYours={!isExportedBuild}
      />
      <main>
        <HeroSection profile={profile} isExportedBuild={isExportedBuild} />
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
