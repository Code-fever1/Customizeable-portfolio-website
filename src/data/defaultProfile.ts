import type { PortfolioProfile } from "@/types/profile";

export const defaultProfile: PortfolioProfile = {
  slug: "alex-rivera",
  name: "Alex Rivera",
  tagline: "I design and ship practical web products that solve real problems.",
  roles: ["Frontend Developer", "UI Engineer", "Product Builder"],
  bio: "Product-focused developer with experience building polished interfaces, clean APIs, and maintainable application architecture for small teams and startups.",
  location: "Austin, Texas",
  yearsOfExperience: 4,
  avatarUrl: "/public/placeholder.svg",
  mainBgColor: "#1e1b4b",
  template: "neo",
  background: {
    type: "solid",
    color: "#1e1b4b",
  },
  tools: [
    "React",
    "TypeScript",
    "Node.js",
    "Next.js",
    "PostgreSQL",
    "Tailwind CSS",
    "Figma",
    "GitHub Actions",
    "Docker",
    "REST APIs",
    "Vercel",
  ],
  skills: [
    {
      name: "React",
      level: 90,
      description: "Accessible, component-driven UI development for production apps.",
    },
    {
      name: "TypeScript",
      level: 87,
      description: "Type-safe front-end and back-end codebases.",
    },
    {
      name: "Node.js",
      level: 82,
      description: "API design, validation, and service integration.",
    },
    {
      name: "PostgreSQL",
      level: 78,
      description: "Schema design and query tuning for product analytics.",
    },
    {
      name: "Tailwind CSS",
      level: 89,
      description: "Fast UI implementation with scalable design tokens.",
    },
    {
      name: "CI/CD",
      level: 80,
      description: "Automated test, build, and deployment workflows.",
    },
  ],
  projects: [
    {
      title: "TeamFlow Dashboard",
      description:
        "Project operations dashboard with task tracking, sprint views, and reporting for distributed teams.",
      tech: ["React", "TypeScript", "Node.js", "PostgreSQL", "Chart.js"],
      category: "Web",
      featured: true,
      imageLabel: "FLOW",
      demoUrl: "https://example.com/teamflow",
      repoUrl: "https://github.com/example/teamflow-dashboard",
    },
    {
      title: "Creator Landing Kit",
      description:
        "Reusable landing page template for creators with CMS-friendly sections and analytics hooks.",
      tech: ["Next.js", "TypeScript", "Tailwind CSS"],
      category: "Web",
      featured: false,
      imageLabel: "KIT",
      demoUrl: "https://example.com/landing-kit",
      repoUrl: "https://github.com/example/creator-landing-kit",
    },
    {
      title: "Support Ticket Portal",
      description:
        "Internal tool for triaging support tickets with status automation and searchable conversation history.",
      tech: ["React", "Node.js", "PostgreSQL", "Tailwind CSS"],
      category: "Web",
      featured: false,
      imageLabel: "HELP",
      demoUrl: "https://example.com/support-portal",
      repoUrl: "https://github.com/example/support-ticket-portal",
    },
  ],
  links: {
    github: "https://github.com/example",
    linkedin: "https://www.linkedin.com/in/example-profile",
    email: "alex.rivera@example.com",
  },
  theme: "dark",
};
