import { useEffect, useState } from "react";

const CursorGlow = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-50 hidden md:block"
      style={{
        left: pos.x - 150,
        top: pos.y - 150,
        width: 300,
        height: 300,
        background: "radial-gradient(circle, hsla(250, 80%, 65%, 0.08) 0%, transparent 70%)",
        borderRadius: "50%",
        transition: "none",
      }}
      aria-hidden="true"
    />
  );
};

export default CursorGlow;
