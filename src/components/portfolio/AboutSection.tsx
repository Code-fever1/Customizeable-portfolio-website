import { Code2, Lightbulb, Rocket, Users } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";

const traits = [
  { icon: Code2, label: "Clean Code" },
  { icon: Lightbulb, label: "Creative Thinker" },
  { icon: Rocket, label: "Fast Learner" },
  { icon: Users, label: "Team Player" },
];

const stats = [
  { value: 10, label: "Projects", suffix: "+" },
  { value: 1, label: "Years Exp.", suffix: "+" },
  { value: 5, label: "Happy Clients", suffix: "+" },
  { value: 1, label: "Commits", suffix: "k+" },
];

const AboutSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="container mx-auto px-4" ref={ref}>
        <h2
          className={`text-3xl md:text-4xl font-display font-bold text-center mb-4 ${isVisible ? "animate-slide-up" : "opacity-0"}`}
        >
          About <span className="gradient-text">Me</span>
        </h2>
        <p className={`text-center text-muted-foreground mb-16 max-w-lg mx-auto ${isVisible ? "animate-slide-up" : "opacity-0"}`} style={{ animationDelay: "0.1s" }}>
          A passionate developer crafting digital experiences
        </p>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Bio */}
          <div className={`glass rounded-2xl p-8 space-y-4 ${isVisible ? "animate-slide-left" : "opacity-0"}`} style={{ animationDelay: "0.2s" }}>
            <p className="text-muted-foreground leading-relaxed">
              I'm a full-stack developer with a passion for building beautiful, performant web applications. 
              With expertise in modern frameworks and a keen eye for design, I transform ideas into 
              pixel-perfect digital experiences.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              When I'm not coding, you'll find me exploring new technologies, contributing to open-source 
              projects, or sharing knowledge with the developer community.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {traits.map(({ icon: Icon, label }, i) => (
                <div key={label} className="flex items-center gap-3 group" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:glow-primary transition-all">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-2 gap-4 ${isVisible ? "animate-slide-right-custom" : "opacity-0"}`} style={{ animationDelay: "0.3s" }}>
            {stats.map(({ value, label, suffix }) => (
              <StatCard key={label} value={value} label={label} suffix={suffix} animate={isVisible} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ value, label, suffix, animate }: { value: number; label: string; suffix: string; animate: boolean }) => {
  const count = useCountUp(value, 2000, animate);
  return (
    <div className="glass rounded-2xl p-6 text-center hover:glow-primary transition-all duration-300 group">
      <div className="text-3xl md:text-4xl font-display font-bold gradient-text">
        {count}{suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
};

export default AboutSection;
