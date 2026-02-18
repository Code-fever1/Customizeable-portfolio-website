import { useEffect, useRef, useState } from "react";

const FloatingHero3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const x = (e.clientY - cy) / 20;
      const y = -(e.clientX - cx) / 20;
      setRotation({ x, y });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div ref={containerRef} className="absolute right-[5%] top-1/2 -translate-y-1/2 hidden lg:block" style={{ perspective: "800px" }}>
      <div
        className="relative w-64 h-64 animate-float-slow"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-3xl border border-primary/30"
          style={{
            transform: "translateZ(40px)",
            background: "linear-gradient(135deg, hsl(var(--primary) / 0.08), hsl(var(--accent) / 0.08))",
            backdropFilter: "blur(8px)",
            boxShadow: "0 0 40px hsl(var(--primary) / 0.15), inset 0 0 40px hsl(var(--primary) / 0.05)",
          }}
        />
        {/* Inner floating code block */}
        <div
          className="absolute inset-6 rounded-2xl border border-accent/20 flex items-center justify-center"
          style={{
            transform: "translateZ(80px)",
            background: "linear-gradient(135deg, hsl(var(--card) / 0.6), hsl(var(--card) / 0.3))",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 30px hsl(var(--accent) / 0.1)",
          }}
        >
          <pre className="text-xs text-slate-900 dark:text-primary/80 font-mono leading-relaxed select-none">
            <code>{`const dev = {\n  name: "Syed",\n  passion: "code",\n  fuel: "☕"\n};`}</code>
          </pre>
        </div>
        {/* Floating accent orb */}
        <div
          className="absolute -top-4 -right-4 w-12 h-12 rounded-full animate-pulse-glow"
          style={{
            transform: "translateZ(100px)",
            background: "radial-gradient(circle, hsl(var(--accent)), hsl(var(--primary)))",
            boxShadow: "0 0 20px hsl(var(--accent) / 0.5)",
          }}
        />
        {/* Small accent dot */}
        <div
          className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full animate-float"
          style={{
            transform: "translateZ(60px)",
            background: "hsl(var(--primary) / 0.6)",
            boxShadow: "0 0 15px hsl(var(--primary) / 0.4)",
          }}
        />
      </div>
    </div>
  );
};

export default FloatingHero3D;
