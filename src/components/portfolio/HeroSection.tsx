import { useEffect, useState, useCallback } from "react";
import { ArrowDown, Download, Mail, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import MagneticButton from "./MagneticButton";
import FloatingHero3D from "./FloatingHero3D";

const roles = ["Web Developer", "Problem Solver", "Tech Enthusiast"];

const HeroSection = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

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
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), 40);
      } else {
        setDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, roleIndex]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Dark base */}
      <div className="absolute inset-0 bg-background z-0" />

      {/* Spotlight gradient following cursor */}
      <div
        className="absolute inset-0 z-[1] transition-opacity duration-300 opacity-60 pointer-events-none"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, hsl(var(--primary) / 0.15), transparent 40%)`,
        }}
      />
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, hsl(var(--accent) / 0.1), transparent 50%)`,
        }}
      />

 <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 animate-gradient-shift"
          // style={{
          //   background: "linear-gradient(135deg, hsl(250 80% 15%), hsl(280 70% 12%), hsl(200 90% 12%), hsl(250 80% 15%))",
          //   backgroundSize: "400% 400%",
          // }}
        />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 animate-float-slow" style={{ background: "radial-gradient(circle, hsl(250 80% 50%), transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 animate-float" style={{ background: "radial-gradient(circle, hsl(200 90% 50%), transparent)" }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full opacity-10 animate-pulse-glow" style={{ background: "radial-gradient(circle, hsl(280 70% 50%), transparent)" }} />
      </div>


      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 z-[2] opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center gap-6 max-w-3xl">
        {/* Badge */}
        <div className="glass rounded-full px-4 py-1.5 text-xs font-mono text-muted-foreground tracking-wider border border-border/30">
          AVAILABLE FOR WORK
        </div>

        {/* Avatar */}
        <div className="relative group">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-75 blur-md group-hover:opacity-100 transition-opacity animate-pulse-glow" />
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-primary/50 bg-muted flex items-center justify-center">
            <img
              src="/images/IMG.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        {/* Name */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[0.95]">
          <span className="text-foreground">Syed</span>{" "}
          <span className="gradient-text">Ali Jah</span>
        </h1>

        {/* Typing subtitle */}
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
          Crafting performant, beautiful interfaces and scalable systems. Let's
          build something extraordinary.
        </p>

        {/* CTAs */}
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
          <MagneticButton data-magnetic>
            <Button
              variant="outline"
              className="rounded-full px-6 border-border/50 backdrop-blur-sm"
            >
              <Download className="h-4 w-4 mr-2" /> Download CV
            </Button>
          </MagneticButton>
          <MagneticButton data-magnetic>
            <Button
              variant="ghost"
              asChild
              className="rounded-full px-6 text-muted-foreground hover:text-foreground"
            >
              <a href="#contact">
                <Mail className="h-4 w-4 mr-2" /> Contact Me
              </a>
            </Button>
          </MagneticButton>
        </div>

        {/* Ctrl+K hint */}
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground/50">
          <kbd className="px-2 py-0.5 rounded border border-border/30 bg-muted/30 font-mono text-[10px]">
            ⌘K
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
      <FloatingHero3D />
    </section>
  );
};

export default HeroSection;
