import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "@/pages/Index";
import { defaultProfile } from "@/data/defaultProfile";
import { loadProfile } from "@/lib/profileStorage";
import type { PortfolioProfile } from "@/types/profile";

const PortfolioPage = ({ exported = false }: { exported?: boolean }) => {
  const { slug } = useParams();
  const [exportedProfile, setExportedProfile] = useState<PortfolioProfile | null>(null);
  const [exportedError, setExportedError] = useState<string | null>(null);

  useEffect(() => {
    if (!exported) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/profile.json?ts=${Date.now()}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as PortfolioProfile;
        if (!data || typeof data !== "object" || !data.name) {
          throw new Error("Invalid profile.json");
        }
        if (!cancelled) setExportedProfile(data);
      } catch {
        if (!cancelled) setExportedError("Could not load exported profile.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [exported]);

  const profile = exported ? exportedProfile : slug ? loadProfile(slug) ?? null : null;
  const activeProfile =
    profile ?? (slug === defaultProfile.slug ? defaultProfile : null);

  if (!activeProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background text-foreground">
        <div className="max-w-xl text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold">
            {exported ? "Export not found" : "Profile not found"}
          </h1>
          <p className="text-muted-foreground">
            {exported
              ? exportedError ?? "Missing profile.json in this build."
              : "This portfolio slug does not exist in local storage. Create one from the builder and open it again."}
          </p>
          <Link to={exported ? "/builder" : "/"} className="text-primary underline">
            Go to Builder
          </Link>
        </div>
      </div>
    );
  }

  return <Index profile={activeProfile} isExportedBuild={exported} />;
};

export default PortfolioPage;
