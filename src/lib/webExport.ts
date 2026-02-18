import JSZip from "jszip";
import { createSlug } from "@/lib/profileStorage";
import type { PortfolioProfile } from "@/types/profile";

type ExportMode = "server" | "client";

type DownloadResult = {
  mode: ExportMode;
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(objectUrl);
};

const normalizeZipPath = (pathname: string, basePathname: string) => {
  let normalized = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  const basePrefix = basePathname.replace(/^\/|\/$/g, "");

  if (basePrefix && normalized.startsWith(`${basePrefix}/`)) {
    normalized = normalized.slice(basePrefix.length + 1);
  }

  return normalized || "index.html";
};

const collectAssetPaths = (indexHtml: string, baseHref: string, basePathname: string) => {
  const refs = new Set<string>(["index.html"]);
  const pattern = /\b(?:src|href)=["']([^"']+)["']/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(indexHtml))) {
    const ref = match[1];
    if (
      !ref ||
      ref.startsWith("data:") ||
      ref.startsWith("mailto:") ||
      ref.startsWith("tel:") ||
      ref.startsWith("javascript:") ||
      ref.startsWith("#")
    ) {
      continue;
    }

    const url = new URL(ref, baseHref);
    if (url.origin !== window.location.origin) continue;

    const zipPath = normalizeZipPath(url.pathname, basePathname);
    refs.add(zipPath);
  }

  return [...refs];
};

const buildClientZip = async (profile: PortfolioProfile) => {
  const baseHref = new URL(import.meta.env.BASE_URL || "/", window.location.origin).toString();
  const basePathname = new URL(baseHref).pathname;
  const indexUrl = new URL("index.html", baseHref).toString();

  const indexResponse = await fetch(indexUrl, { cache: "no-store" });
  if (!indexResponse.ok) {
    throw new Error("Could not load site index for export.");
  }

  const indexHtml = await indexResponse.text();
  const assetPaths = collectAssetPaths(indexHtml, baseHref, basePathname);
  const zip = new JSZip();
  const dist = zip.folder("dist");
  if (!dist) throw new Error("Could not create zip folder.");

  await Promise.all(
    assetPaths.map(async (assetPath) => {
      const assetUrl = new URL(assetPath, baseHref).toString();
      const res = await fetch(assetUrl, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Could not download ${assetPath} for export.`);
      }
      const blob = await res.blob();
      dist.file(assetPath, blob);
    }),
  );

  dist.file("profile.json", JSON.stringify(profile, null, 2));
  return zip.generateAsync({ type: "blob" });
};

export const downloadWebsiteZip = async (
  profile: PortfolioProfile,
): Promise<DownloadResult> => {
  const fileName = `${createSlug(profile.name)}-web.zip`;

  try {
    const res = await fetch("/__export/web", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    if (res.ok) {
      const blob = await res.blob();
      downloadBlob(blob, fileName);
      return { mode: "server" };
    }
  } catch {
    // Fallback to client-side export.
  }

  const blob = await buildClientZip(profile);
  downloadBlob(blob, fileName);
  return { mode: "client" };
};

