import { Code2, Lightbulb, Rocket, Users } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";
import type { PortfolioProfile } from "@/types/profile";

type AboutSectionProps = {
  profile: PortfolioProfile;
};

const traitIcons = [Code2, Lightbulb, Rocket, Users];

const AboutSection = ({ profile }: AboutSectionProps) => {
  const { ref, isVisible } = useScrollReveal();

  const traits = (profile.tools.length > 0 ? profile.tools : ["Web", "Product", "Code", "Team"])
    .slice(0, 4)
    .map((label, index) => ({
      label,
      icon: traitIcons[index % traitIcons.length],
    }));

  const stats = [
    { value: profile.projects.length, label: "Projects", suffix: "+" },
    { value: profile.yearsOfExperience, label: "Years Exp.", suffix: "+" },
    { value: profile.skills.length, label: "Core Skills", suffix: "+" },
    { value: profile.tools.length, label: "Tools", suffix: "+" },
  ];

  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="container mx-auto px-4" ref={ref}>
        <h2
          className={`text-3xl md:text-4xl font-display font-bold text-center mb-4 ${isVisible ? "animate-slide-up" : "opacity-0"}`}
        >
          About <span className="gradient-text">Me</span>
        </h2>
        <p
          className={`text-center text-muted-foreground mb-16 max-w-lg mx-auto ${isVisible ? "animate-slide-up" : "opacity-0"}`}
          style={{ animationDelay: "0.1s" }}
        >
          Based in {profile.location}
        </p>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div
            className={`glass rounded-2xl p-8 space-y-4 ${isVisible ? "animate-slide-left" : "opacity-0"}`}
            style={{ animationDelay: "0.2s" }}
          >
            {profile.bio
              .split("\n")
              .filter(Boolean)
              .map((paragraph, index) => (
                <p key={`bio-${index}`} className="text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}

            <div className="grid grid-cols-2 gap-4 pt-4">
              {traits.map(({ icon: Icon, label }, i) => (
                <div
                  key={label}
                  className="flex items-center gap-3 group"
                  style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:glow-primary transition-all">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`grid grid-cols-2 gap-4 ${isVisible ? "animate-slide-right-custom" : "opacity-0"}`}
            style={{ animationDelay: "0.3s" }}
          >
            {stats.map(({ value, label, suffix }) => (
              <StatCard key={label} value={value} label={label} suffix={suffix} animate={isVisible} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({
  value,
  label,
  suffix,
  animate,
}: {
  value: number;
  label: string;
  suffix: string;
  animate: boolean;
}) => {
  const count = useCountUp(value, 2000, animate);
  return (
    <div className="glass rounded-2xl p-6 text-center hover:glow-primary transition-all duration-300 group">
      <div className="text-3xl md:text-4xl font-display font-bold gradient-text">
        {count}
        {suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
};

export default AboutSection;
