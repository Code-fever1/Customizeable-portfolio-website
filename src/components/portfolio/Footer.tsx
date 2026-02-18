import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const socials = [
  { icon: Github, href: "https://github.com/Code-fever1", label: "GitHub", external: true },
  { icon: Linkedin, href: "https://www.linkedin.com/in/syed-ali-jah-520770334", label: "LinkedIn", external: true },
  { icon: Mail, href: "mailto:alijahinnovates@gmail.com", label: "Email", external: false },
];

const Footer = () => {
  return (
    <footer className="relative py-12 border-t border-border/50">
      <div className="container mx-auto px-4 flex flex-col items-center gap-6">
        <div className="flex gap-4">
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
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Syed. All rights reserved.
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
