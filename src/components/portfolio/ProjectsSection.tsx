import { useState, useEffect } from "react";
import { ExternalLink, Github, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const projects = [
  {
    title: "Construction ERP & Billing System",
    description:
      "🚀 Construction ERP & Billing System is a premium full-stack enterprise platform designed to digitize and centralize the core operations of construction businesses within a single secure dashboard. The system streamlines project management, contractor coordination, financial tracking, and invoicing, eliminating reliance on manual records and disconnected tools.📊 It enables organizations to manage multiple projects simultaneously while maintaining complete visibility over timelines, budgets, expenses, and revenue. Dedicated modules support project lifecycle tracking, contractor and vendor management, expense logging, income monitoring, and professional invoice generation — ensuring accurate financial control and operational efficiency.📈 Integrated analytics provide visual insights into project performance, profitability, and cash flow, empowering decision-makers with real-time data. Strong authentication and structured access controls safeguard sensitive business information, making the platform suitable for internal enterprise use.🛠️ Built using a modern, scalable technology stack — React, Node.js, Express, PostgreSQL, and Chart.js — the application delivers high performance, reliability, and extensibility for growing construction firms.✨ Overall, this solution transforms traditional construction management into a streamlined digital workflow, improving transparency, productivity, and scalability while supporting data-driven business growth.",
    tech: ["React", "Node.js", "PostgreSQL", "Express", "Chart.js"],
    category: "Web",
    image: "🏢",
    featured: true,
    demoUrl: "https://construction-cms-prototype.html-5.me",
    repoUrl: "https://github.com/Code-fever1/COnstruction-app",
  },
  {
    title: "Personal Portfolio Website",
    description:
      "A responsive personal portfolio website showcasing my skills, projects, and contact information with a clean and minimal design.",
    tech: ["HTML", "CSS", "JavaScript"],
    category: "Web",
    image: "💻",
    featured: false,
    demoUrl: "https://alijah.page.gd",
    repoUrl: "https://github.com/Code-fever1/my-portfolio-website",
  },
  {
    title: "Home Network Operations Center",
    description:
      "An advanced multi-router control system designed to streamline home network administration with real-time monitoring, secure access, and unified control of diverse router devices.",
    tech: ["HTML", "CSS", "JavaScript", "Electron", "Node.js"],
    category: "Web",
    image: "🛜",
    featured: false,
    demoUrl: "https://home-router-prototype.html-5.me",
    repoUrl: "https://github.com/Code-fever1/HOME-ROUTER",
  },
];

const filters = ["All", "Web", "Mobile", "AI"];

const ProjectSkeleton = ({ large = false }: { large?: boolean }) => (
  <div className={`glass rounded-2xl overflow-hidden animate-pulse ${large ? "md:col-span-2 md:row-span-2" : ""}`}>
    <div className={`${large ? "h-64" : "h-48"} bg-muted/20`} />
    <div className="p-6 space-y-3">
      <div className="h-5 w-3/4 bg-muted/20 rounded" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-muted/20 rounded" />
        <div className="h-3 w-5/6 bg-muted/20 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-14 bg-muted/20 rounded-full" />
        <div className="h-5 w-16 bg-muted/20 rounded-full" />
        <div className="h-5 w-12 bg-muted/20 rounded-full" />
      </div>
    </div>
  </div>
);

const ProjectsSection = () => {
  const [active, setActive] = useState("All");
  const [loading, setLoading] = useState(true);
  const { ref, isVisible } = useScrollReveal();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [active]);

  const filtered =
    active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div className="container mx-auto px-4" ref={ref}>
        <h2 className={`text-3xl md:text-4xl font-display font-bold text-center mb-4 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
          My <span className="gradient-text">Projects</span>
        </h2>
        <p className={`text-center text-muted-foreground mb-10 max-w-lg mx-auto ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
          A selection of my recent work
        </p>

        {/* Filters */}
        <div className={`flex justify-center gap-2 mb-12 ${isVisible ? "animate-slide-up" : "opacity-0"}`} style={{ animationDelay: "0.15s" }}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                active === f
                  ? "bg-foreground text-background"
                  : "bg-muted/30 text-muted-foreground hover:text-foreground border border-border/30"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {loading ? (
            <>
              <ProjectSkeleton large />
              <ProjectSkeleton />
              <ProjectSkeleton />
            </>
          ) : (
            filtered.map((project, i) => (
              <div
                key={project.title}
                className={`group relative rounded-2xl overflow-hidden border border-border/30 bg-card/40 backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_40px_hsl(var(--primary)/0.1)] ${
                  project.featured ? "md:col-span-2 md:row-span-2" : ""
                } ${isVisible ? "animate-scale-up" : "opacity-0"}`}
                style={{ animationDelay: `${0.2 + i * 0.1}s` }}
              >
                {/* Featured badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4 z-20">
                    <Badge className="bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm text-xs">
                      <Star className="h-3 w-3 mr-1" /> Featured
                    </Badge>
                  </div>
                )}

                {/* Preview */}
                <div className={`${project.featured ? "h-48 md:h-64" : "h-48"} bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center text-6xl relative overflow-hidden`}>
                  <span className={`group-hover:scale-110 transition-transform duration-500 ${project.featured ? "text-7xl md:text-8xl" : ""}`}>
                    {project.image}
                  </span>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                    {project.demoUrl ? (
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="rounded-full bg-foreground text-background hover:bg-foreground/90">
                          <ExternalLink className="h-4 w-4 mr-1" /> Demo
                        </Button>
                      </a>
                    ) : (
                      <Button size="sm" className="rounded-full" disabled>
                        <ExternalLink className="h-4 w-4 mr-1" /> Demo
                      </Button>
                    )}
                    {project.repoUrl ? (
                      <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="rounded-full border-border/50 backdrop-blur-sm">
                          <Github className="h-4 w-4 mr-1" /> Code
                        </Button>
                      </a>
                    ) : (
                      <Button size="sm" variant="outline" className="rounded-full" disabled>
                        <Github className="h-4 w-4 mr-1" /> Code
                      </Button>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className={`font-display font-semibold text-foreground ${project.featured ? "text-lg md:text-xl" : "text-lg"}`}>
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs bg-muted/30 border border-border/20">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
