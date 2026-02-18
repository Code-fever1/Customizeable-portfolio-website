import type { PortfolioProfile } from "@/types/profile";

const STORAGE_PREFIX = "portfolio_profile_";
const STORAGE_INDEX_KEY = "portfolio_profile_index";

const safeParse = <T>(value: string | null): T | null => {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const getProfileKey = (slug: string) => `${STORAGE_PREFIX}${slug}`;

const readIndex = (): string[] => {
  if (typeof window === "undefined") return [];
  const parsed = safeParse<unknown>(window.localStorage.getItem(STORAGE_INDEX_KEY));
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((item): item is string => typeof item === "string");
};

const writeIndex = (slugs: string[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify([...new Set(slugs)]));
};

export const createSlug = (name: string) => {
  const normalized = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return normalized || `portfolio-${Date.now()}`;
};

const getUniqueSlug = (requestedSlug: string) => {
  if (typeof window === "undefined") return requestedSlug;

  const base = createSlug(requestedSlug);
  const allSlugs = new Set(readIndex());
  if (!allSlugs.has(base)) return base;

  let counter = 2;
  while (allSlugs.has(`${base}-${counter}`)) counter += 1;
  return `${base}-${counter}`;
};

export const saveProfile = (profile: PortfolioProfile) => {
  if (typeof window === "undefined") return profile;

  const slug = getUniqueSlug(profile.slug || profile.name);
  const normalizedProfile: PortfolioProfile = {
    ...profile,
    slug,
  };

  window.localStorage.setItem(getProfileKey(slug), JSON.stringify(normalizedProfile));
  const nextIndex = readIndex();
  nextIndex.push(slug);
  writeIndex(nextIndex);

  return normalizedProfile;
};

export const loadProfile = (slug: string) => {
  if (typeof window === "undefined") return null;
  return safeParse<PortfolioProfile>(window.localStorage.getItem(getProfileKey(slug)));
};


export const deleteProfile = (slug: string) => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(getProfileKey(slug));
  const nextIndex = readIndex().filter((s) => s !== slug);
  writeIndex(nextIndex);
};

export const listProfiles = () => readIndex();

