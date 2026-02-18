import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ColorPicker from "@/components/ui/ColorPicker";
import { defaultProfile } from "@/data/defaultProfile";
import { createSlug, listProfiles, saveProfile, deleteProfile } from "@/lib/profileStorage";
import { downloadWebsiteZip } from "@/lib/webExport";
import type {
  PortfolioBackground,
  PortfolioProfile,
  PortfolioProject,
  PortfolioSkill,
  PortfolioTemplate,
  PortfolioTheme,
} from "@/types/profile";

const parseCommaSeparated = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const getPreviewBackground = (background: PortfolioBackground, fallbackColor: string) => {
  if (background.type === "solid") {
    return {
      style: { background: background.color || fallbackColor },
      overlayOpacity: 0,
    };
  }

  if (background.type === "gradient") {
    return {
      style: {
        backgroundImage: `linear-gradient(${background.angle ?? 135}deg, ${background.from}, ${background.to})`,
      },
      overlayOpacity: 0,
    };
  }

  return {
    style: {
      backgroundImage: `url(${background.imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    overlayOpacity: background.overlayOpacity ?? 0.55,
  };
};

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
  const [template, setTemplate] = useState<PortfolioTemplate>(defaultProfile.template ?? "neo");
  const [avatarStatus, setAvatarStatus] = useState("");
  const [cvStatus, setCvStatus] = useState("");
  const [backgroundStatus, setBackgroundStatus] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const [savedSlugs, setSavedSlugs] = useState<string[]>(() => listProfiles());
  const [mainBgColor, setMainBgColor] = useState(defaultProfile.mainBgColor);
  const [cv, setCv] = useState<PortfolioProfile["cv"]>(defaultProfile.cv);
  const [backgroundType, setBackgroundType] = useState<PortfolioBackground["type"]>(
    defaultProfile.background?.type ?? "solid",
  );
  const [gradientFrom, setGradientFrom] = useState(
    defaultProfile.background?.type === "gradient"
      ? defaultProfile.background.from
      : "#0f172a",
  );
  const [gradientTo, setGradientTo] = useState(
    defaultProfile.background?.type === "gradient"
      ? defaultProfile.background.to
      : "#1e1b4b",
  );
  const [gradientAngle, setGradientAngle] = useState(() =>
    defaultProfile.background?.type === "gradient"
      ? String(defaultProfile.background.angle ?? 135)
      : "135",
  );
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(
    defaultProfile.background?.type === "image" ? defaultProfile.background.imageUrl : "",
  );
  const [backgroundOverlayOpacity, setBackgroundOverlayOpacity] = useState(() =>
    defaultProfile.background?.type === "image"
      ? String(defaultProfile.background.overlayOpacity ?? 0.55)
      : "0.55",
  );

  const suggestedSlug = useMemo(() => createSlug(name), [name]);

  useEffect(() => {
    document.title = name.trim() ? `${name.trim()} | Builder` : "Portfolio Builder";
  }, [name]);

  const buildBackgroundFromForm = (): PortfolioBackground => {
    if (backgroundType === "gradient") {
      return {
        type: "gradient",
        from: gradientFrom,
        to: gradientTo,
        angle: Number.parseFloat(gradientAngle) || 135,
      };
    }

    if (backgroundType === "image") {
      if (!backgroundImageUrl.trim()) {
        return { type: "solid", color: mainBgColor };
      }
      return {
        type: "image",
        imageUrl: backgroundImageUrl.trim(),
        overlayOpacity: Math.max(
          0,
          Math.min(1, Number.parseFloat(backgroundOverlayOpacity) || 0.55),
        ),
      };
    }

    return {
      type: "solid",
      color: mainBgColor,
    };
  };

  const buildProfileFromForm = (): PortfolioProfile => {
    const background = buildBackgroundFromForm();

    return {
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
    template,
    mainBgColor:
      background.type === "solid"
        ? background.color
        : background.type === "gradient"
          ? background.from
          : mainBgColor,
    background,
    cv: cv?.dataUrl || cv?.url ? cv : undefined,
    };
  };

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

  const handleDownloadWebZip = async () => {
    const profile = buildProfileFromForm();

    try {
      const result = await downloadWebsiteZip(profile);
      setImportStatus(
        result.mode === "server"
          ? "Downloaded website ZIP."
          : "Downloaded website ZIP using deployed site files.",
      );
    } catch {
      setImportStatus("Could not create website ZIP on this server.");
    }
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
    setTemplate(profile.template ?? "neo");
    setMainBgColor(profile.mainBgColor ?? defaultProfile.mainBgColor);
    setBackgroundType(profile.background?.type ?? "solid");
    if (profile.background?.type === "gradient") {
      setGradientFrom(profile.background.from);
      setGradientTo(profile.background.to);
      setGradientAngle(String(profile.background.angle ?? 135));
    } else {
      setGradientFrom("#0f172a");
      setGradientTo(profile.mainBgColor ?? defaultProfile.mainBgColor);
      setGradientAngle("135");
    }
    if (profile.background?.type === "image") {
      setBackgroundImageUrl(profile.background.imageUrl);
      setBackgroundOverlayOpacity(String(profile.background.overlayOpacity ?? 0.55));
    } else {
      setBackgroundImageUrl("");
      setBackgroundOverlayOpacity("0.55");
    }
    setCv(profile.cv);
    setAvatarStatus("");
    setCvStatus("");
    setBackgroundStatus("");
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

  const handleCvUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCv({
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          dataUrl: reader.result,
        });
        setCvStatus(`CV selected: ${file.name}`);
      } else {
        setCvStatus("Could not read the selected file.");
      }
    };
    reader.onerror = () => {
      setCvStatus("Could not read the selected file.");
    };
    reader.readAsDataURL(file);
    e.currentTarget.value = "";
  };

  const handleBackgroundImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setBackgroundStatus("Please select an image file.");
      e.currentTarget.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setBackgroundImageUrl(reader.result);
        setBackgroundStatus(`Background image selected: ${file.name}`);
      } else {
        setBackgroundStatus("Could not read the selected image.");
      }
    };
    reader.onerror = () => {
      setBackgroundStatus("Could not read the selected image.");
    };
    reader.readAsDataURL(file);
    e.currentTarget.value = "";
  };

  const previewProfile = useMemo(
    () => buildProfileFromForm(),
    [
      suggestedSlug,
      name,
      tagline,
      rolesInput,
      bio,
      location,
      yearsOfExperience,
      avatarUrl,
      toolsInput,
      skills,
      projects,
      github,
      linkedin,
      email,
      theme,
      template,
      mainBgColor,
      cv,
      backgroundType,
      gradientFrom,
      gradientTo,
      gradientAngle,
      backgroundImageUrl,
      backgroundOverlayOpacity,
    ],
  );

  const previewBackground = getPreviewBackground(
    previewProfile.background ?? { type: "solid", color: previewProfile.mainBgColor },
    previewProfile.mainBgColor,
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-10 max-w-7xl space-y-8">
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
            <Button type="button" variant="outline" onClick={handleDownloadWebZip}>
              <Download className="h-4 w-4 mr-2" />
              Download Website ZIP
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

        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-8">
            <form onSubmit={handleSaveAndOpen} className="space-y-8">
          <section className="glass rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-xl">Basic Profile</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
              />
              <label className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground">Template</span>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value as PortfolioTemplate)}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="neo">Neo (default)</option>
                  <option value="minimal">Minimal</option>
                </select>
              </label>
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
              <label className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground">Background</span>
                <select
                  value={backgroundType}
                  onChange={(e) =>
                    setBackgroundType(e.target.value as PortfolioBackground["type"])
                  }
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="solid">Solid</option>
                  <option value="gradient">Gradient</option>
                  <option value="image">Image</option>
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

            {backgroundType === "solid" ? (
              <div className="rounded-xl border border-border/40 p-4">
                <p className="text-sm text-muted-foreground mb-3">Solid background color</p>
                <ColorPicker value={mainBgColor} onChange={setMainBgColor} />
              </div>
            ) : null}

            {backgroundType === "gradient" ? (
              <div className="rounded-xl border border-border/40 p-4 space-y-3">
                <p className="text-sm text-muted-foreground">Gradient background</p>
                <div className="grid md:grid-cols-3 gap-4 items-start">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">From</p>
                    <ColorPicker value={gradientFrom} onChange={setGradientFrom} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">To</p>
                    <ColorPicker value={gradientTo} onChange={setGradientTo} />
                  </div>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs text-muted-foreground">Angle (deg)</span>
                    <Input
                      type="number"
                      min={0}
                      max={360}
                      value={gradientAngle}
                      onChange={(e) => setGradientAngle(e.target.value)}
                    />
                  </label>
                </div>
                <div
                  className="h-12 rounded-lg border border-border/40"
                  style={{
                    backgroundImage: `linear-gradient(${
                      Number.parseFloat(gradientAngle) || 135
                    }deg, ${gradientFrom}, ${gradientTo})`,
                  }}
                />
              </div>
            ) : null}

            {backgroundType === "image" ? (
              <div className="rounded-xl border border-border/40 p-4 space-y-3">
                <p className="text-sm text-muted-foreground">Background image</p>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBackgroundImageUpload}
                    />
                    <span className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Background
                    </span>
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={!backgroundImageUrl}
                    onClick={() => {
                      setBackgroundImageUrl("");
                      setBackgroundStatus("Background removed.");
                    }}
                  >
                    Remove
                  </Button>
                </div>
                <Input
                  value={backgroundImageUrl}
                  onChange={(e) => setBackgroundImageUrl(e.target.value)}
                  placeholder="Image URL (or data URL)"
                />
                <label className="flex flex-col gap-2">
                  <span className="text-xs text-muted-foreground">Overlay opacity (0-1)</span>
                  <Input
                    type="number"
                    min={0}
                    max={1}
                    step={0.05}
                    value={backgroundOverlayOpacity}
                    onChange={(e) => setBackgroundOverlayOpacity(e.target.value)}
                  />
                </label>
                {backgroundImageUrl ? (
                  <div className="h-24 rounded-lg border border-border/40 overflow-hidden relative">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url(${backgroundImageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div
                      className="absolute inset-0 bg-background"
                      style={{
                        opacity:
                          Math.max(
                            0,
                            Math.min(1, Number.parseFloat(backgroundOverlayOpacity) || 0.55),
                          ),
                      }}
                    />
                  </div>
                ) : null}
                {backgroundStatus ? (
                  <p className="text-xs text-muted-foreground">{backgroundStatus}</p>
                ) : null}
              </div>
            ) : null}
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
            <div className="rounded-xl border border-border/40 p-4">
              <p className="text-sm text-muted-foreground mb-3">CV / Resume</p>
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={handleCvUpload}
                  />
                  <span className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground">
                    <Upload className="h-4 w-4 mr-2" />
                    Attach CV
                  </span>
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={!cv}
                  onClick={() => {
                    setCv(undefined);
                    setCvStatus("CV removed.");
                  }}
                >
                  Remove
                </Button>
              </div>
              {cvStatus ? (
                <p className="text-xs text-muted-foreground mt-2">{cvStatus}</p>
              ) : cv?.fileName ? (
                <p className="text-xs text-muted-foreground mt-2">
                  Attached: {cv.fileName}
                </p>
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
          <aside className="xl:sticky xl:top-6 space-y-4">
            <section className="glass rounded-2xl p-5 space-y-4">
              <div>
                <h2 className="font-display text-xl">Live Preview</h2>
                <p className="text-sm text-muted-foreground">
                  Changes appear instantly while you edit profile info and colors.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden border border-border/40 bg-black">
                <div className="relative min-h-[420px] p-5">
                  <div className="absolute inset-0" style={previewBackground.style} />
                  {previewProfile.background?.type === "image" ? (
                    <div
                      className="absolute inset-0 bg-black"
                      style={{ opacity: previewBackground.overlayOpacity }}
                    />
                  ) : null}
                  <div className="relative z-10 text-white space-y-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={previewProfile.avatarUrl || "/placeholder.svg"}
                        alt={previewProfile.name || "Preview avatar"}
                        className="h-14 w-14 rounded-full object-cover border border-white/40"
                      />
                      <div>
                        <p className="text-lg font-semibold leading-tight">
                          {previewProfile.name || "Your Name"}
                        </p>
                        <p className="text-xs text-white/80">
                          {previewProfile.location || "Location"}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-white/90">
                      {previewProfile.tagline || "Add a short tagline for your portfolio."}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(previewProfile.roles.length ? previewProfile.roles : ["Role"])
                        .slice(0, 3)
                        .map((role) => (
                          <span
                            key={role}
                            className="rounded-full border border-white/35 bg-white/15 px-3 py-1 text-xs"
                          >
                            {role}
                          </span>
                        ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div className="rounded-md bg-white/15 px-3 py-2 text-center text-xs">
                        Projects
                      </div>
                      {previewProfile.cv ? (
                        <div className="rounded-md bg-white/15 px-3 py-2 text-center text-xs">
                          CV
                        </div>
                      ) : (
                        <div className="rounded-md bg-white/10 px-3 py-2 text-center text-xs text-white/60">
                          CV
                        </div>
                      )}
                      <div className="rounded-md bg-white/15 px-3 py-2 text-center text-xs">
                        Contact
                      </div>
                    </div>
                    <div className="space-y-2 pt-2">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                        Featured Projects
                      </p>
                      {(previewProfile.projects.length
                        ? previewProfile.projects
                        : [{ title: "Project title", category: "Category" }]
                      )
                        .slice(0, 3)
                        .map((project, index) => (
                          <div
                            key={`${project.title}-${index}`}
                            className="rounded-lg bg-white/10 px-3 py-2"
                          >
                            <p className="text-sm font-medium">
                              {project.title || "Untitled project"}
                            </p>
                            <p className="text-xs text-white/80">
                              {project.category || "General"}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md border border-border/40 p-2">
                  <span className="text-muted-foreground">Template:</span>{" "}
                  {previewProfile.template ?? "neo"}
                </div>
                <div className="rounded-md border border-border/40 p-2">
                  <span className="text-muted-foreground">Theme:</span>{" "}
                  {previewProfile.theme ?? "dark"}
                </div>
                <div className="rounded-md border border-border/40 p-2">
                  <span className="text-muted-foreground">Slug:</span>{" "}
                  {previewProfile.slug}
                </div>
                <div className="rounded-md border border-border/40 p-2">
                  <span className="text-muted-foreground">Projects:</span>{" "}
                  {previewProfile.projects.length}
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;
