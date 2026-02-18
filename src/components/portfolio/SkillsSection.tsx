import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Globe,
  Server,
  Brain,
  Code2,
  Database,
  GitBranch,
  Figma,
  Container,
  Workflow,
} from "lucide-react";
import type { PortfolioSkill } from "@/types/profile";

type SkillsSectionProps = {
  skills: PortfolioSkill[];
};

const icons = [
  Code2,
  Server,
  Globe,
  Database,
  GitBranch,
  Brain,
  Figma,
  Container,
  Workflow,
];

const sizePattern = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
];

const SkillsSection = ({ skills }: SkillsSectionProps) => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="skills" className="relative py-24 md:py-32">
      <div className="container mx-auto px-4" ref={ref}>
        <h2 className={`text-3xl md:text-4xl font-display font-bold text-center mb-4 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
          My <span className="gradient-text">Skills</span>
        </h2>
        <p className={`text-center text-muted-foreground mb-16 max-w-lg mx-auto ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
          Technologies and capabilities for this profile
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[120px] md:auto-rows-[140px]">
          {skills.map((item, i) => {
            const Icon = icons[i % icons.length];
            const sizeClass = sizePattern[i % sizePattern.length];

            return (
              <div
                key={`${item.name}-${i}`}
                className={`${sizeClass} glass rounded-2xl p-5 relative overflow-hidden group hover:glow-primary transition-all duration-500 ${isVisible ? "animate-scale-up" : "opacity-0"}`}
                style={{ animationDelay: `${0.1 + i * 0.05}s` }}
              >
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                  <div
                    className="h-full transition-all duration-1000 ease-out"
                    style={{
                      width: isVisible ? `${item.level}%` : "0%",
                      background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))",
                      transitionDelay: `${0.3 + i * 0.05}s`,
                    }}
                  />
                </div>

                <div className="flex flex-col h-full justify-between relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-muted-foreground font-mono">{item.level}%</span>
                    </div>
                    <h3 className="font-display font-semibold text-foreground text-sm md:text-base">{item.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
