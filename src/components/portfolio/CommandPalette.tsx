import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Search,
  FolderOpen,
  Mail,
  Github,
  User,
  Wrench,
  Home,
  X,
  Linkedin,
} from "lucide-react";
import type { PortfolioLinks } from "@/types/profile";

type CommandPaletteProps = {
  links: PortfolioLinks;
};

const CommandPalette = ({ links }: CommandPaletteProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const commands = useMemo(
    () => [
      {
        label: "Home",
        icon: Home,
        action: () =>
          document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" }),
        group: "Navigation",
      },
      {
        label: "About",
        icon: User,
        action: () =>
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }),
        group: "Navigation",
      },
      {
        label: "Projects",
        icon: FolderOpen,
        action: () =>
          document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }),
        group: "Navigation",
      },
      {
        label: "Services",
        icon: Wrench,
        action: () =>
          document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }),
        group: "Navigation",
      },
      {
        label: "Contact",
        icon: Mail,
        action: () =>
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }),
        group: "Navigation",
      },
      links.github
        ? {
            label: "GitHub",
            icon: Github,
            action: () => window.open(links.github, "_blank"),
            group: "Links",
          }
        : null,
      links.linkedin
        ? {
            label: "LinkedIn",
            icon: Linkedin,
            action: () => window.open(links.linkedin, "_blank"),
            group: "Links",
          }
        : null,
      links.email
        ? {
            label: "Email",
            icon: Mail,
            action: () => window.open(`mailto:${links.email}`, "_self"),
            group: "Links",
          }
        : null,
    ].filter(Boolean),
    [links],
  ) as Array<{
    label: string;
    icon: typeof Home;
    action: () => void;
    group: string;
  }>;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen((prev) => !prev);
      setQuery("");
    }
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const filtered = commands.filter((command) =>
    command.label.toLowerCase().includes(query.toLowerCase()),
  );

  const groups = [...new Set(filtered.map((command) => command.group))];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

      <div className="relative w-full max-w-lg mx-4 rounded-xl border border-border/30 bg-card/80 backdrop-blur-2xl shadow-2xl overflow-hidden animate-scale-up">
        <div className="flex items-center gap-3 px-4 border-b border-border/20">
          <Search className="h-4 w-4 text-muted-foreground/50 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands..."
            className="flex-1 bg-transparent py-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none font-mono"
          />
          <button onClick={() => setOpen(false)} className="text-muted-foreground/40 hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[300px] overflow-y-auto p-2">
          {groups.map((group) => (
            <div key={group}>
              <p className="px-3 py-1.5 text-[10px] font-mono text-muted-foreground/30 uppercase tracking-widest">
                {group}
              </p>
              {filtered
                .filter((command) => command.group === group)
                .map((command) => {
                  const Icon = command.icon;
                  return (
                    <button
                      key={command.label}
                      onClick={() => {
                        command.action();
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all group"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                      <span>{command.label}</span>
                    </button>
                  );
                })}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground/40 py-8">
              No results found
            </p>
          )}
        </div>

        <div className="border-t border-border/20 px-4 py-2 flex items-center gap-4 text-[10px] text-muted-foreground/30 font-mono">
          <span>Use arrows to navigate</span>
          <span>Enter to select</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
