import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ColorPicker from "@/components/ui/ColorPicker";
import { defaultProfile } from "@/data/defaultProfile";
import { createSlug, listProfiles, saveProfile, deleteProfile } from "@/lib/profileStorage";
import type {
  PortfolioProfile,
  PortfolioProject,
  PortfolioSkill,
  PortfolioTheme,
} from "@/types/profile";

const parseCommaSeparated = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const BuilderPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState(defaultProfile.name);
  const [tagline, setTagline] = useState(defaultProfile.tagline);
  const [rolesInput, setRolesInput] = useState(defaultProfile.roles.join(", "));
  const [bio, setBio] = useState(defaultProfile.bio);
  const [location, setLocation] = useState(defaultProfile.location);
  const [yearsOfExperience, setYearsOfExperience] = useState(
    String(defaultProfile.yearsOfExperience),
  );
  const [avatarUrl, setAvatarUrl] = useState(defaultProfile.avatarUrl);
  const [toolsInput, setToolsInput] = useState(defaultProfile.tools.join(", "));
  const [skills, setSkills] = useState<PortfolioSkill[]>(defaultProfile.skills);
  const [projects, setProjects] = useState<PortfolioProject[]>(
    defaultProfile.projects,
  );
  const [github, setGithub] = useState(defaultProfile.links.github ?? "");
  const [linkedin, setLinkedin] = useState(defaultProfile.links.linkedin ?? "");
  const [email, setEmail] = useState(defaultProfile.links.email ?? "");
  const [theme, setTheme] = useState<PortfolioTheme>(defaultProfile.theme ?? "dark");
  const [avatarStatus, setAvatarStatus] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const [savedSlugs, setSavedSlugs] = useState<string[]>(() => listProfiles());
  const [mainBgColor, setMainBgColor] = useState("#1e1b4b");

  const suggestedSlug = useMemo(() => createSlug(name), [name]);

  useEffect(() => {
    document.title = name.trim() ? `${name.trim()} | Builder` : "Portfolio Builder";
  }, [name]);

  const buildProfileFromForm = (): PortfolioProfile & { mainBgColor?: string } => ({
    slug: suggestedSlug,
    name: name.trim(),
    tagline: tagline.trim(),
    roles: parseCommaSeparated(rolesInput),
    bio: bio.trim(),
    location: location.trim(),
    yearsOfExperience: Number.parseInt(yearsOfExperience, 10) || 0,
    avatarUrl: avatarUrl.trim() || "/placeholder.svg",
    tools: parseCommaSeparated(toolsInput),
    skills: skills.map((skill) => ({
      ...skill,
      name: skill.name.trim(),
      description: skill.description.trim(),
      level: Math.max(0, Math.min(100, Number(skill.level) || 0)),
    })),
    projects: projects.map((project) => ({
      ...project,
      title: project.title.trim(),
      description: project.description.trim(),
      category: project.category.trim() || "General",
      imageLabel: project.imageLabel?.trim(),
      tech: project.tech.map((item) => item.trim()).filter(Boolean),
      demoUrl: project.demoUrl?.trim() || undefined,
      repoUrl: project.repoUrl?.trim() || undefined,
    })),
    links: {
      github: github.trim() || undefined,
      linkedin: linkedin.trim() || undefined,
      email: email.trim() || undefined,
    },
    theme,
    mainBgColor,
  });

  const handleSkillChange = (
    index: number,
    field: keyof PortfolioSkill,
    value: string,
  ) => {
    setSkills((prev) =>
      prev.map((skill, skillIndex) =>
        skillIndex === index
          ? {
              ...skill,
              [field]: field === "level" ? Number(value) : value,
            }
          : skill,
      ),
    );
  };

  const handleProjectChange = (
    index: number,
    field: keyof PortfolioProject,
    value: string | boolean,
  ) => {
    setProjects((prev) =>
      prev.map((project, projectIndex) =>
        projectIndex === index
          ? {
              ...project,
              [field]:
                field === "tech" && typeof value === "string"
                  ? parseCommaSeparated(value)
                  : value,
            }
          : project,
      ),
    );
  };

  const handleSaveAndOpen = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const profile = buildProfileFromForm();
    const saved = saveProfile(profile);
    setSavedSlugs(listProfiles());
    navigate(`/u/${saved.slug}`);
  };

  const handleDownloadJson = () => {
    const profile = buildProfileFromForm();
    const blob = new Blob([JSON.stringify(profile, null, 2)], {
      type: "application/json",
    });
    const fileName = `${profile.slug}.json`;
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(objectUrl);
  };

  const applyImportedProfile = (profile: PortfolioProfile) => {
    setName(profile.name);
    setTagline(profile.tagline);
    setRolesInput(profile.roles.join(", "));
    setBio(profile.bio);
    setLocation(profile.location);
    setYearsOfExperience(String(profile.yearsOfExperience));
    setAvatarUrl(profile.avatarUrl);
    setToolsInput(profile.tools.join(", "));
    setSkills(profile.skills);
    setProjects(profile.projects);
    setGithub(profile.links.github ?? "");
    setLinkedin(profile.links.linkedin ?? "");
    setEmail(profile.links.email ?? "");
    setTheme(profile.theme ?? "dark");
    setAvatarStatus("");
  };

  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAvatarStatus("Please select an image file.");
      e.currentTarget.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarUrl(reader.result);
        setAvatarStatus(`Photo selected: ${file.name}`);
      } else {
        setAvatarStatus("Could not read the selected image.");
      }
    };
    reader.onerror = () => {
      setAvatarStatus("Could not read the selected image.");
    };
    reader.readAsDataURL(file);
    e.currentTarget.value = "";
  };

  const handleImportJson = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as PortfolioProfile;
      if (!parsed || typeof parsed !== "object" || !parsed.name) {
        throw new Error("Invalid profile format");
      }
      applyImportedProfile(parsed);
      setImportStatus(`Loaded: ${file.name}`);
    } catch {
      setImportStatus("Could not load JSON file.");
    } finally {
      e.currentTarget.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-10 max-w-5xl space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Portfolio Builder
          </p>
          <h1 className="text-3xl md:text-5xl font-display font-bold">
            Create a personalized portfolio website
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Enter user details, skills, projects, tools, and links. Each profile
            is stored separately and can be opened by slug at `u/slug`.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="px-3 py-1 rounded-full border border-border/40 bg-card/40">
              Suggested slug: {suggestedSlug}
            </span>
            <Button type="button" variant="outline" onClick={handleDownloadJson}>
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <label className="inline-flex">
              <Input
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleImportJson}
              />
              <span className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground">
                <Upload className="h-4 w-4 mr-2" />
                Import JSON
              </span>
            </label>
            {importStatus ? (
              <span className="text-muted-foreground">{importStatus}</span>
            ) : null}
          </div>
        </header>

        <form onSubmit={handleSaveAndOpen} className="space-y-8">
          <section className="glass rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-xl">Basic Profile</h2>
            <div className="mb-4">
              <label className="block text-sm text-muted-foreground mb-1">Main Background Color</label>
              <ColorPicker value={mainBgColor} onChange={setMainBgColor} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
              />
              <label className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground">Theme</span>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as PortfolioTheme)}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="system">System</option>
                </select>
              </label>
              <Input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Tagline"
              />
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
              />
              <Input
                value={rolesInput}
                onChange={(e) => setRolesInput(e.target.value)}
                placeholder="Roles (comma separated)"
              />
              <Input
                type="number"
                min={0}
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
                placeholder="Years of experience"
              />
            </div>
            <div className="rounded-xl border border-border/40 p-4">
              <p className="text-sm text-muted-foreground mb-3">Profile Photo</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <img
                  src={avatarUrl || "/placeholder.svg"}
                  alt={name || "Profile preview"}
                  className="h-20 w-20 rounded-full object-cover border border-border/50 bg-muted"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                    <span className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </span>
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setAvatarUrl("/placeholder.svg");
                      setAvatarStatus("Using placeholder image.");
                    }}
                  >
                    Use Placeholder
                  </Button>
                </div>
              </div>
              {avatarStatus ? (
                <p className="text-xs text-muted-foreground mt-2">{avatarStatus}</p>
              ) : null}
            </div>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Bio"
            />
            <Input
              value={toolsInput}
              onChange={(e) => setToolsInput(e.target.value)}
              placeholder="Tools (comma separated)"
            />
          </section>

          <section className="glass rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl">Skills</h2>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setSkills((prev) => [
                    ...prev,
                    { name: "", level: 70, description: "" },
                  ])
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>
            <div className="space-y-3">
              {skills.map((skill, index) => (
                <div
                  key={`skill-${index}`}
                  className="grid md:grid-cols-[1fr_120px_1.5fr_auto] gap-3 items-center"
                >
                  <Input
                    value={skill.name}
                    onChange={(e) =>
                      handleSkillChange(index, "name", e.target.value)
                    }
                    placeholder="Skill name"
                  />
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={skill.level}
                    onChange={(e) =>
                      handleSkillChange(index, "level", e.target.value)
                    }
                    placeholder="Level"
                  />
                  <Input
                    value={skill.description}
                    onChange={(e) =>
                      handleSkillChange(index, "description", e.target.value)
                    }
                    placeholder="Skill description"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setSkills((prev) => prev.filter((_, i) => i !== index))
                    }
                    aria-label="Remove skill"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <section className="glass rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl">Projects</h2>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setProjects((prev) => [
                    ...prev,
                    {
                      title: "",
                      description: "",
                      tech: [],
                      category: "Web",
                      featured: false,
                      imageLabel: "APP",
                    },
                  ])
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>

            <div className="space-y-6">
              {projects.map((project, index) => (
                <div
                  key={`project-${index}`}
                  className="rounded-xl border border-border/40 p-4 space-y-3"
                >
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input
                      value={project.title}
                      onChange={(e) =>
                        handleProjectChange(index, "title", e.target.value)
                      }
                      placeholder="Project title"
                    />
                    <Input
                      value={project.category}
                      onChange={(e) =>
                        handleProjectChange(index, "category", e.target.value)
                      }
                      placeholder="Category"
                    />
                    <Input
                      value={project.imageLabel ?? ""}
                      onChange={(e) =>
                        handleProjectChange(index, "imageLabel", e.target.value)
                      }
                      placeholder="Preview label"
                    />
                    <Input
                      value={project.tech.join(", ")}
                      onChange={(e) =>
                        handleProjectChange(index, "tech", e.target.value)
                      }
                      placeholder="Tech stack (comma separated)"
                    />
                    <Input
                      value={project.demoUrl ?? ""}
                      onChange={(e) =>
                        handleProjectChange(index, "demoUrl", e.target.value)
                      }
                      placeholder="Demo URL"
                    />
                    <Input
                      value={project.repoUrl ?? ""}
                      onChange={(e) =>
                        handleProjectChange(index, "repoUrl", e.target.value)
                      }
                      placeholder="Repository URL"
                    />
                  </div>
                  <Textarea
                    rows={3}
                    value={project.description}
                    onChange={(e) =>
                      handleProjectChange(index, "description", e.target.value)
                    }
                    placeholder="Project description"
                  />
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-muted-foreground inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={project.featured}
                        onChange={(e) =>
                          handleProjectChange(
                            index,
                            "featured",
                            e.currentTarget.checked,
                          )
                        }
                      />
                      Featured project
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setProjects((prev) =>
                          prev.filter((_, projectIndex) => projectIndex !== index),
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-xl">Links</h2>
            <div className="grid md:grid-cols-3 gap-3">
              <Input
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="GitHub URL"
              />
              <Input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="LinkedIn URL"
              />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" className="rounded-full px-8">
              Save Profile and Open Website
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/u/${defaultProfile.slug}`)}
            >
              Open Default Template
            </Button>
          </div>
        </form>

        {savedSlugs.length > 0 ? (
          <section className="glass rounded-2xl p-6 space-y-3">
            <h2 className="font-display text-xl">Saved Profiles</h2>
            <div className="flex flex-wrap gap-2">
              {savedSlugs.map((slug) => (
                <div key={slug} className="relative flex items-center group">
                  <Button
                    type="button"
                    variant="secondary"
                    className="pr-7"
                    onClick={() => navigate(`/u/${slug}`)}
                  >
                    {slug}
                  </Button>
                  <button
                    type="button"
                    aria-label="Delete profile"
                    className="absolute right-1 top-1/2 -translate-y-1/2 opacity-60 group-hover:opacity-100 hover:text-destructive transition-colors"
                    style={{ fontSize: 14, lineHeight: 1 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProfile(slug);
                      setSavedSlugs(listProfiles());
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default BuilderPage;
