import type { CSSProperties } from "react";
import type { PortfolioBackground } from "@/types/profile";

type PageBackgroundProps = {
  background?: PortfolioBackground;
  fallbackColor?: string;
};

const getBackgroundStyle = (
  background: PortfolioBackground | undefined,
  fallbackColor: string,
): { style: CSSProperties; overlayOpacity?: number } => {
  const resolved = background ?? { type: "solid" as const, color: fallbackColor };

  if (resolved.type === "solid") {
    return { style: { backgroundColor: resolved.color } };
  }

  if (resolved.type === "gradient") {
    const angle = typeof resolved.angle === "number" ? resolved.angle : 135;
    return {
      style: {
        backgroundImage: `linear-gradient(${angle}deg, ${resolved.from}, ${resolved.to})`,
        backgroundSize: "200% 200%",
      },
    };
  }

  return {
    style: {
      backgroundImage: `url(${resolved.imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    overlayOpacity:
      typeof resolved.overlayOpacity === "number" ? resolved.overlayOpacity : 0.55,
  };
};

const PageBackground = ({ background, fallbackColor = "#0b1020" }: PageBackgroundProps) => {
  const { style, overlayOpacity } = getBackgroundStyle(background, fallbackColor);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      <div
        className={`absolute inset-0 ${
          background?.type === "gradient" ? "animate-gradient-shift" : ""
        }`}
        style={style}
      />
      {background?.type === "image" ? (
        <div className="absolute inset-0 bg-background" style={{ opacity: overlayOpacity }} />
      ) : null}
    </div>
  );
};

export default PageBackground;

