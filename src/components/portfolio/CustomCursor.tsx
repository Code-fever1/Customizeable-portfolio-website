import { useEffect, useState } from "react";

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea, select, [data-magnetic]")) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };
    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.removeEventListener("mouseleave", leave);
    };
  }, [visible]);

  return (
    <>
      {/* Dot */}
      <div
        className="fixed pointer-events-none z-[9999] hidden md:block rounded-full"
        style={{
          left: pos.x - 4,
          top: pos.y - 4,
          width: 8,
          height: 8,
          background: "hsl(var(--primary))",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.15s",
          mixBlendMode: "difference",
        }}
      />
      {/* Ring */}
      <div
        className="fixed pointer-events-none z-[9998] hidden md:block rounded-full border"
        style={{
          left: pos.x - (hovering ? 28 : 18),
          top: pos.y - (hovering ? 28 : 18),
          width: hovering ? 56 : 36,
          height: hovering ? 56 : 36,
          borderColor: "hsl(var(--primary) / 0.5)",
          background: hovering ? "hsl(var(--primary) / 0.08)" : "transparent",
          opacity: visible ? 1 : 0,
          transition: "width 0.25s ease, height 0.25s ease, left 0.15s ease, top 0.15s ease, opacity 0.15s, background 0.25s",
        }}
      />
      {/* Glow aura */}
      <div
        className="fixed pointer-events-none z-[9997] hidden md:block"
        style={{
          left: pos.x - 150,
          top: pos.y - 150,
          width: 300,
          height: 300,
          background: "radial-gradient(circle, hsla(250, 80%, 65%, 0.06) 0%, transparent 70%)",
          borderRadius: "50%",
          opacity: visible ? 1 : 0,
        }}
      />
    </>
  );
};

export default CustomCursor;
