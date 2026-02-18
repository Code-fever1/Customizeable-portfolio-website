import { Code2, Server, Database, Globe, GitBranch, Figma, Brain, Container, Workflow, Wrench } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const techs = [
  { name: "React", icon: Code2, color: "61 90% 60%" },
  { name: "Node.js", icon: Server, color: "120 40% 50%" },
  { name: "TypeScript", icon: Code2, color: "210 80% 55%" },
  { name: "MongoDB", icon: Database, color: "140 50% 45%" },
  { name: "PostgreSQL", icon: Database, color: "210 60% 50%" },
  { name: "Tailwind CSS", icon: Globe, color: "190 80% 55%" },
  { name: "Git", icon: GitBranch, color: "15 80% 55%" },
  { name: "Figma", icon: Figma, color: "280 60% 55%" },
  { name: "Docker", icon: Container, color: "205 70% 55%" },
  { name: "AI / ML", icon: Brain, color: "250 70% 60%" },
  { name: "CI/CD", icon: Workflow, color: "340 60% 55%" },
  { name: "REST APIs", icon: Wrench, color: "45 80% 55%" },
];

const MarqueeRow = ({ reverse = false }: { reverse?: boolean }) => (
  <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,white_10%,white_90%,transparent)]">
    <div className={`flex gap-6 py-4 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
      {[...techs, ...techs].map((tech, i) => {
        const Icon = tech.icon;
        return (
          <div
            key={`${tech.name}-${i}`}
            className="group flex items-center gap-3 px-5 py-3 rounded-xl border border-border/20 bg-card/30 backdrop-blur-sm whitespace-nowrap transition-all duration-300 hover:border-primary/30 hover:bg-card/60"
          >
            <Icon className="h-5 w-5 text-muted-foreground/40 grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:text-foreground" style={{ "--hover-color": `hsl(${tech.color})` } as React.CSSProperties} />
            <span className="text-sm text-muted-foreground/50 group-hover:text-foreground transition-colors duration-300 font-mono">
              {tech.name}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

const TechMarquee = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative py-16 md:py-24 overflow-hidden" ref={ref}>
      <div className={`container mx-auto px-4 mb-8 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
        <p className="text-center text-xs font-mono text-muted-foreground/40 tracking-[0.2em] uppercase">
          Technologies I work with
        </p>
      </div>
      <div className={`space-y-4 ${isVisible ? "animate-slide-up" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
        <MarqueeRow />
        <MarqueeRow reverse />
      </div>
    </section>
  );
};

export default TechMarquee;
