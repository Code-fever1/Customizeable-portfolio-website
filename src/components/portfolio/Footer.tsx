import { ArrowUp, Github, Info, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PortfolioLinks } from "@/types/profile";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type FooterProps = {
  name: string;
  links: PortfolioLinks;
};

const DEVELOPER_NAME = "Syed Alijah";
const DEVELOPER_GITHUB_URL = "https://github.com/Code-fever1";

const Footer = ({ name, links }: FooterProps) => {
  const socials = [
    links.github
      ? { icon: Github, href: links.github, label: "GitHub", external: true }
      : null,
    links.linkedin
      ? { icon: Linkedin, href: links.linkedin, label: "LinkedIn", external: true }
      : null,
    links.email
      ? { icon: Mail, href: `mailto:${links.email}`, label: "Email", external: false }
      : null,
  ].filter(Boolean) as Array<{
    icon: typeof Github;
    href: string;
    label: string;
    external: boolean;
  }>;

  return (
    <footer className="relative py-12 border-t border-border/50">
      <div className="container mx-auto px-4 flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {socials.map(({ icon: Icon, href, label, external }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:glow-primary hover:scale-125 transition-all duration-300"
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}

          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="h-10 px-4 rounded-full bg-muted/60 backdrop-blur-sm border border-border/40 text-muted-foreground hover:text-foreground hover:border-border/70 transition-colors inline-flex items-center gap-2"
              >
                <Info className="h-4 w-4" />
                About Developer
              </button>
            </DialogTrigger>
            <DialogContent className="p-0 overflow-hidden border-border/30 bg-card/80 backdrop-blur-2xl">
              <div className="relative">
                <div
                  className="absolute inset-0 opacity-70 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(900px circle at 20% 10%, hsl(var(--primary) / 0.22), transparent 55%), radial-gradient(700px circle at 80% 20%, hsl(var(--accent) / 0.18), transparent 55%)",
                  }}
                />
                <div className="relative p-6 space-y-5">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl">
                      About the Developer
                    </DialogTitle>
                    <DialogDescription>
                      This portfolio template was developed by{" "}
                      <span className="text-foreground font-medium">
                        {DEVELOPER_NAME}
                      </span>
                      .
                    </DialogDescription>
                  </DialogHeader>

                  <div className="rounded-2xl border border-border/40 bg-muted/20 p-5 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Developer
                        </p>
                        <p className="text-lg font-display font-semibold">
                          {DEVELOPER_NAME}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          React, TypeScript, UI Engineering
                        </p>
                      </div>
                      <a
                        href={DEVELOPER_GITHUB_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 border border-border/40 bg-background/40 hover:bg-background/60 hover:border-border/70 transition-colors text-sm"
                        aria-label="Open developer GitHub profile"
                      >
                        <Github className="h-4 w-4" />
                        GitHub
                      </a>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      If you use this template, feel free to check out my GitHub
                      for more projects and updates.
                    </p>
                  </div>

                  <div className="flex items-center justify-end">
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
                    </DialogClose>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-sm text-muted-foreground">
          Copyright {new Date().getFullYear()} {name}. All rights reserved.
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
