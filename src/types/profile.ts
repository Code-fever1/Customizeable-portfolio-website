export type PortfolioSkill = {
  name: string;
  level: number;
  description: string;
};

export type PortfolioProject = {
  title: string;
  description: string;
  tech: string[];
  category: string;
  featured: boolean;
  imageLabel?: string;
  demoUrl?: string;
  repoUrl?: string;
};

export type PortfolioLinks = {
  github?: string;
  linkedin?: string;
  email?: string;
  website?: string;
};

export type PortfolioTheme = "light" | "dark" | "system";

export type PortfolioProfile = {
  mainBgColor: any;
  slug: string;
  name: string;
  tagline: string;
  roles: string[];
  bio: string;
  location: string;
  yearsOfExperience: number;
  avatarUrl: string;
  tools: string[];
  skills: PortfolioSkill[];
  projects: PortfolioProject[];
  links: PortfolioLinks;
  theme?: PortfolioTheme;
};
