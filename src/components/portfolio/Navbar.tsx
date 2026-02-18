import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 50);

      // Detect active section based on scroll position
      const sections = navLinks.map((l) => l.href.substring(1)); // Remove # from href
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          if (top <= 100 && bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const toggleTheme = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };
  const iconButtonClass = dark ? "text-gray-300 hover:text-gray-100" : "text-black hover:text-black";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-card/60 backdrop-blur-2xl border-b border-border/20 shadow-[0_1px_20px_hsl(var(--background)/0.5)]"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="#hero" className={`font-display text-xl font-bold ${
          dark ? "text-gray-300" : "text-gray-500"
        }`}>
          &lt;/&gt; Syed Ali Jah
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-primary after:transition-all ${
                activeSection === l.href.substring(1)
                  ? dark ? "text-gray-300 after:w-full" : "text-black after:w-full"
                  : dark ? "text-gray-500 hover:text-gray-300 after:w-0 hover:after:w-full" : "text-gray-700 hover:text-black after:w-0 hover:after:w-full"
              }`}
            >
              {l.label}
            </a>
          ))}
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className={iconButtonClass}>
            {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-black" />}
          </Button>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className={iconButtonClass}>
            {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-black" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" className={iconButtonClass}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-strong border-t border-border/50 animate-slide-up">
          <div className="flex flex-col p-4 gap-3">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={`text-sm py-2 transition-colors ${
                  activeSection === l.href.substring(1)
                    ? dark ? "text-gray-300 font-semibold" : "text-black font-semibold"
                    : dark ? "text-gray-500 hover:text-gray-300" : "text-gray-700 hover:text-black"
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

