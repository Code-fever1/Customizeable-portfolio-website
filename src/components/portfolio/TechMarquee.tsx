import {
  Code2,
  Server,
  Database,
  Globe,
  GitBranch,
  Figma,
  Brain,
  Container,
  Workflow,
  Wrench,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type TechMarqueeProps = {
  tools: string[];
};

const icons = [
  Code2,
  Server,
  Database,
  Globe,
  GitBranch,
  Figma,
  Brain,
  Container,
  Workflow,
  Wrench,
];

const MarqueeRow = ({ tools, reverse = false }: { tools: string[]; reverse?: boolean }) => (
  <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,white_10%,white_90%,transparent)]">
    <div className={`flex gap-6 py-4 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
      {[...tools, ...tools].map((tool, i) => {
        const Icon = icons[i % icons.length];
        return (
          <div
            key={`${tool}-${i}`}
            className="group flex items-center gap-3 px-5 py-3 rounded-xl border border-border/20 bg-card/30 backdrop-blur-sm whitespace-nowrap transition-all duration-300 hover:border-primary/30 hover:bg-card/60"
          >
            <Icon className="h-5 w-5 text-muted-foreground/40 grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:text-foreground" />
            <span className="text-sm text-muted-foreground/50 group-hover:text-foreground transition-colors duration-300 font-mono">
              {tool}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

const TechMarquee = ({ tools }: TechMarqueeProps) => {
  const { ref, isVisible } = useScrollReveal();
  const items = tools.length > 0 ? tools : ["React", "TypeScript", "Node.js", "Tailwind", "Git"];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden" ref={ref}>
      <div className={`container mx-auto px-4 mb-8 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
        <p className="text-center text-xs font-mono text-muted-foreground/40 tracking-[0.2em] uppercase">
          Tools used in this profile
        </p>
      </div>
      <div className={`space-y-4 ${isVisible ? "animate-slide-up" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
        <MarqueeRow tools={items} />
        <MarqueeRow tools={items} reverse />
      </div>
    </section>
  );
};

export default TechMarquee;
