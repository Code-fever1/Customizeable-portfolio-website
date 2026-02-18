import { Globe, Smartphone, Server, Palette } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const services = [
  { icon: Globe, title: "Web Development", description: "Modern, responsive websites built with cutting-edge technologies.", accent: "primary" },
  { icon: Smartphone, title: "Mobile Apps", description: "Cross-platform mobile applications with native-like performance.", accent: "accent" },
  { icon: Server, title: "Backend & APIs", description: "Scalable server-side solutions and RESTful API architectures.", accent: "primary" },
  { icon: Palette, title: "UI/UX Design", description: "Intuitive interfaces with beautiful, user-centered design principles.", accent: "accent" },
];

const ServicesSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="container mx-auto px-4" ref={ref}>
        <h2 className={`text-3xl md:text-4xl font-display font-bold text-center mb-4 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
          What I <span className="gradient-text">Do</span>
        </h2>
        <p className={`text-center text-muted-foreground mb-16 max-w-lg mx-auto ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
          Services I offer
        </p>

        {/* Bento-style services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {services.map(({ icon: Icon, title, description, accent }, i) => (
            <div
              key={title}
              className={`glass rounded-2xl p-8 group hover:${accent === "primary" ? "glow-primary" : "glow-accent"} transition-all duration-500 relative overflow-hidden ${isVisible ? "animate-scale-up" : "opacity-0"}`}
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <div className="relative z-10 flex items-start gap-5">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg mb-2 text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              </div>
              {/* Corner gradient accent */}
              <div
                className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle, hsl(var(--${accent})), transparent)` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
