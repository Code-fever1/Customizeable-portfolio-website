import { useRef, useState, type ReactNode, type MouseEvent } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

const MagneticButton = ({ children, className = "", strength = 0.3 }: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("translate(0px, 0px)");

  const handleMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    setTransform(`translate(${dx}px, ${dy}px)`);
  };

  const handleLeave = () => setTransform("translate(0px, 0px)");

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{ transform, transition: "transform 0.2s cubic-bezier(0.33, 1, 0.68, 1)", display: "inline-block" }}
    >
      {children}
    </div>
  );
};

export default MagneticButton;
