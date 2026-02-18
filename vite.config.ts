import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { Plugin } from "vite";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";

// https://vitejs.dev/config/
const require = createRequire(import.meta.url);

const parseDataUrl = (dataUrl: string) => {
  const match = /^data:([^;,]+)?(;base64)?,(.*)$/s.exec(dataUrl);
  if (!match) return null;
  const mimeType = match[1] || "application/octet-stream";
  const isBase64 = Boolean(match[2]);
  const data = match[3] || "";
  return { mimeType, isBase64, data };
};

const sanitizeFileName = (fileName: string) =>
  (fileName || "file")
    .replace(/[/\\?%*:|"<>]/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 120);

const extFromMime = (mimeType: string) => {
  const normalized = (mimeType || "").toLowerCase();
  if (normalized.includes("pdf")) return "pdf";
  if (normalized.includes("msword")) return "doc";
  if (normalized.includes("wordprocessingml")) return "docx";
  if (normalized.includes("png")) return "png";
  if (normalized.includes("jpeg")) return "jpg";
  if (normalized.includes("jpg")) return "jpg";
  if (normalized.includes("webp")) return "webp";
  if (normalized.includes("gif")) return "gif";
  if (normalized.includes("svg")) return "svg";
  return "bin";
};

const writeAssetIfDataUrl = async ({
  distDir,
  urlOrDataUrl,
  fileNameHint,
}: {
  distDir: string;
  urlOrDataUrl: string;
  fileNameHint: string;
}) => {
  if (!urlOrDataUrl?.startsWith("data:")) return { url: urlOrDataUrl, wroteFile: false };

  const parsed = parseDataUrl(urlOrDataUrl);
  if (!parsed || !parsed.isBase64) return { url: urlOrDataUrl, wroteFile: false };

  const ext = extFromMime(parsed.mimeType);
  const safeName = sanitizeFileName(fileNameHint);
  const finalName = safeName.includes(".") ? safeName : `${safeName}.${ext}`;
  const outDir = path.join(distDir, "files");
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, finalName), Buffer.from(parsed.data, "base64"));
  return { url: `/files/${finalName}`, wroteFile: true, mimeType: parsed.mimeType, fileName: finalName };
};

const runViteBuild = async (args: string[], cwd: string) => {
  const viteBin = path.resolve(cwd, "node_modules", "vite", "bin", "vite.js");
  const cmd = process.execPath;
  const finalArgs = existsSync(viteBin) ? [viteBin, ...args] : ["./node_modules/vite/bin/vite.js", ...args];

  await new Promise<void>((resolve, reject) => {
    const child = spawn(cmd, finalArgs, { cwd, stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`vite build failed (exit ${code})`));
    });
  });
};

const exportWebPlugin = (): Plugin => {
  const handler = async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== "POST") {
      res.statusCode = 405;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    }

    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    await new Promise<void>((resolve) => req.on("end", resolve));

    let profile: unknown;
    try {
      profile = JSON.parse(Buffer.concat(chunks).toString("utf-8"));
    } catch {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Invalid JSON" }));
      return;
    }

    const isRecord = (value: unknown): value is Record<string, unknown> =>
      Boolean(value) && typeof value === "object" && !Array.isArray(value);

    const profileRecord = isRecord(profile) ? profile : null;
    const slug = sanitizeFileName(
      String(profileRecord?.slug || profileRecord?.name || "portfolio"),
    );
    const repoRoot = __dirname;
    const tmpRoot = path.resolve(repoRoot, ".export-tmp");
    const distDir = path.join(tmpRoot, "dist");

    try {
      await fs.rm(tmpRoot, { recursive: true, force: true });
      await fs.mkdir(tmpRoot, { recursive: true });

      await runViteBuild(["build", "--mode", "export", "--outDir", distDir], repoRoot);

      // Convert large embedded data URLs into real files in dist for the exported website.
      const exportProfile = structuredClone(profileRecord ?? {});

      const exportProfileRecord = isRecord(exportProfile) ? exportProfile : {};

      const cvAsset = isRecord(exportProfileRecord.cv) ? exportProfileRecord.cv : null;
      if (cvAsset && typeof cvAsset.dataUrl === "string") {
        const cvMimeType =
          typeof cvAsset.mimeType === "string" ? cvAsset.mimeType : "application/octet-stream";
        const cvFileName =
          typeof cvAsset.fileName === "string"
            ? cvAsset.fileName
            : `cv.${extFromMime(cvMimeType)}`;

        const result = await writeAssetIfDataUrl({
          distDir,
          urlOrDataUrl: cvAsset.dataUrl,
          fileNameHint: cvFileName,
        });
        if (result.wroteFile) {
          exportProfileRecord.cv = {
            fileName: cvFileName,
            mimeType: cvMimeType,
            url: result.url,
          };
        }
      }

      if (typeof exportProfileRecord.avatarUrl === "string" && exportProfileRecord.avatarUrl.startsWith("data:")) {
        const result = await writeAssetIfDataUrl({
          distDir,
          urlOrDataUrl: exportProfileRecord.avatarUrl,
          fileNameHint: "avatar",
        });
        if (result.wroteFile) {
          exportProfileRecord.avatarUrl = result.url;
        }
      }

      const background = isRecord(exportProfileRecord.background) ? exportProfileRecord.background : null;
      if (background?.type === "image" && typeof background.imageUrl === "string") {
        const result = await writeAssetIfDataUrl({
          distDir,
          urlOrDataUrl: background.imageUrl,
          fileNameHint: "background",
        });
        if (result.wroteFile) {
          background.imageUrl = result.url;
        }
      }

      await fs.writeFile(path.join(distDir, "profile.json"), JSON.stringify(exportProfileRecord, null, 2), "utf-8");

      // Zip dist folder and stream it back.
      const archiver = require("archiver") as typeof import("archiver");
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", `attachment; filename="${slug}-web.zip"`);

      const archive = archiver("zip", { zlib: { level: 9 } });
      archive.on("error", (err: unknown) => {
        res.statusCode = 500;
        res.end(err instanceof Error ? err.message : String(err));
      });
      archive.pipe(res);
      archive.directory(distDir, false);
      await archive.finalize();
    } catch (err: unknown) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: err instanceof Error ? err.message : "Export failed" }));
    } finally {
      res.on("close", () => {
        fs.rm(tmpRoot, { recursive: true, force: true }).catch(() => undefined);
      });
    }
  };

  return {
    name: "portfolio-export-web",
    configureServer(server) {
      server.middlewares.use("/__export/web", (req, res) => {
        void handler(req, res);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use("/__export/web", (req, res) => {
        void handler(req, res);
      });
    },
  };
};

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger(), exportWebPlugin()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
