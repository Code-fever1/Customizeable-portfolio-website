import { useEffect, useState } from "react";
import { ArrowDown, Download, Mail, FolderOpen, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import MagneticButton from "./MagneticButton";
import type { PortfolioProfile } from "@/types/profile";
import { createSlug } from "@/lib/profileStorage";
import { toast } from "@/components/ui/sonner";
import { downloadWebsiteZip } from "@/lib/webExport";

type HeroSectionProps = {
  profile: PortfolioProfile;
  isExportedBuild?: boolean;
};

const splitName = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) {
    return { first: name, rest: "" };
  }

  return {
    first: parts[0],
    rest: parts.slice(1).join(" "),
  };
};

const HeroSection = ({ profile, isExportedBuild = false }: HeroSectionProps) => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const roles = profile.roles.length > 0 ? profile.roles : ["Developer"];
  const { first, rest } = splitName(profile.name);

  const handleDownloadProfile = () => {
    const blob = new Blob([JSON.stringify(profile, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${createSlug(profile.name)}.json`;
    link.click();
    window.URL.revokeObjectURL(link.href);
  };

  const handleDownloadCv = () => {
    if (!profile.cv) return;

    const link = document.createElement("a");
    const href = profile.cv.dataUrl ?? profile.cv.url;
    if (!href) return;

    link.href = href;
    link.download = profile.cv.fileName || "cv";
    link.rel = "noreferrer";
    link.click();
  };

  const handleDownloadWebsiteZip = async () => {
    try {
      const result = await downloadWebsiteZip(profile);
      if (result.mode === "client") {
        toast.success("Downloaded ZIP using deployed site files.");
      }
    } catch {
      toast.error("Could not create website ZIP on this server.");
    }
  };

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting) {
      if (text.length < currentRole.length) {
        timeout = setTimeout(
          () => setText(currentRole.slice(0, text.length + 1)),
          80,
        );
      } else {
        timeout = setTimeout(() => setDeleting(true), 2000);
      }
    } else if (text.length > 0) {
      timeout = setTimeout(() => setText(text.slice(0, -1)), 40);
    } else {
      setDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, roleIndex, roles]);


  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center gap-6 max-w-3xl">
        <div className="glass rounded-full px-4 py-1.5 text-xs font-mono text-muted-foreground tracking-wider border border-border/30">
          AVAILABLE FOR WORK
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-75 blur-md group-hover:opacity-100 transition-opacity animate-pulse-glow" />
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-primary/50 bg-muted flex items-center justify-center">
            <img
              src={profile.avatarUrl || "/placeholder.svg"}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[0.95]">
          <span className="text-foreground">{first}</span>{" "}
          <span className="gradient-text">{rest || first}</span>
        </h1>

        <div className="h-8 md:h-10 flex items-center justify-center">
          <span className="text-lg md:text-xl text-muted-foreground font-light font-mono">
            {text}
            <span
              className="inline-block w-0.5 h-5 ml-1 bg-primary"
              style={{ animation: "typing-cursor 1s infinite" }}
            />
          </span>
        </div>

        <p className="text-muted-foreground max-w-md text-sm md:text-base leading-relaxed">
          {profile.tagline}
        </p>

        <div className="flex flex-wrap gap-3 justify-center mt-2">
          <MagneticButton data-magnetic>
            <Button
              asChild
              className="rounded-full px-6 bg-foreground text-background hover:bg-foreground/90"
            >
              <a href="#projects">
                <FolderOpen className="h-4 w-4 mr-2" /> View Projects
              </a>
            </Button>
          </MagneticButton>
          {profile.cv ? (
            <MagneticButton data-magnetic>
              <Button
                variant="outline"
                className="rounded-full px-6 border-border/50 backdrop-blur-sm"
                onClick={handleDownloadCv}
              >
                <Download className="h-4 w-4 mr-2" /> Download CV
              </Button>
            </MagneticButton>
          ) : null}
          {!isExportedBuild ? (
            <MagneticButton data-magnetic>
              <Button
                variant="outline"
                className="rounded-full px-6 border-border/50 backdrop-blur-sm"
                onClick={handleDownloadWebsiteZip}
              >
                <Package className="h-4 w-4 mr-2" /> Download Website ZIP
              </Button>
            </MagneticButton>
          ) : null}
          {!isExportedBuild ? (
            <MagneticButton data-magnetic>
              <Button
                variant="outline"
                className="rounded-full px-6 border-border/50 backdrop-blur-sm"
                onClick={handleDownloadProfile}
              >
                <Download className="h-4 w-4 mr-2" /> Download Profile JSON
              </Button>
            </MagneticButton>
          ) : null}
          <MagneticButton data-magnetic>
            <Button
              variant="ghost"
              asChild
              className="rounded-full px-6 text-muted-foreground hover:text-foreground"
            >
              <a href="#contact">
                <Mail className="h-4 w-4 mr-2" /> Contact {first}
              </a>
            </Button>
          </MagneticButton>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground/50">
          <kbd className="px-2 py-0.5 rounded border border-border/30 bg-muted/30 font-mono text-[10px]">
            Ctrl + K
          </kbd>
          <span>to navigate</span>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 z-10 animate-float"
        aria-label="Scroll down"
      >
        <ArrowDown className="h-5 w-5 text-muted-foreground/50" />
      </a>
      
    </section>
  );
};

export default HeroSection;
