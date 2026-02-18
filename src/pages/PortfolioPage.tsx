import { Link, useParams } from "react-router-dom";
import Index from "@/pages/Index";
import { defaultProfile } from "@/data/defaultProfile";
import { loadProfile } from "@/lib/profileStorage";

const PortfolioPage = () => {
  const { slug } = useParams();

  const profile = slug ? loadProfile(slug) ?? null : null;
  const activeProfile =
    profile ?? (slug === defaultProfile.slug ? defaultProfile : null);

  if (!activeProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background text-foreground">
        <div className="max-w-xl text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold">
            Profile not found
          </h1>
          <p className="text-muted-foreground">
            This portfolio slug does not exist in local storage. Create one from
            the builder and open it again.
          </p>
          <Link to="/" className="text-primary underline">
            Go to Builder
          </Link>
        </div>
      </div>
    );
  }

  return <Index profile={activeProfile} />;
};

export default PortfolioPage;
