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

export type PortfolioTemplate = "neo" | "minimal";

export type PortfolioFileAsset = {
  fileName: string;
  mimeType: string;
  /**
   * Portable representation for JSON export/import (base64 data URL).
   * Omit when exporting as a website to keep payload small.
   */
  dataUrl?: string;
  /**
   * URL path used by exported websites (e.g. "/files/cv.pdf").
   */
  url?: string;
};

export type PortfolioBackground =
  | {
      type: "solid";
      color: string;
    }
  | {
      type: "gradient";
      from: string;
      to: string;
      angle?: number;
    }
  | {
      type: "image";
      imageUrl: string;
      overlayOpacity?: number;
    };

export type PortfolioProfile = {
  mainBgColor: string;
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
  template?: PortfolioTemplate;
  background?: PortfolioBackground;
  cv?: PortfolioFileAsset;
};
