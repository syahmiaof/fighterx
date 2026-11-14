import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

console.log("=================================================================");
console.log("       FIGHTERX PRODUCTION CHUNK & ASSET PROFILER                ");
console.log("=================================================================");
console.log(`Root: ${ROOT_DIR}\n`);

const IN_SCOPE_ROUTES = [
  { name: "Homepage", route: "/", manifestPath: ".next/server/app/page_client-reference-manifest.js" },
  { name: "Guidelines", route: "/guidelines", manifestPath: ".next/server/app/guidelines/page_client-reference-manifest.js" },
  { name: "Disciplines", route: "/disciplines", manifestPath: ".next/server/app/disciplines/page_client-reference-manifest.js" },
  { name: "Competitions", route: "/competitions", manifestPath: ".next/server/app/competitions/page_client-reference-manifest.js" },
  { name: "Calendar", route: "/calendar", manifestPath: ".next/server/app/calendar/page_client-reference-manifest.js" },
  { name: "Leaderboard", route: "/leaderboard", manifestPath: ".next/server/app/leaderboard/page_client-reference-manifest.js" },
  { name: "Associations", route: "/associations", manifestPath: ".next/server/app/associations/page_client-reference-manifest.js" },
  { name: "Moments", route: "/moments", manifestPath: ".next/server/app/moments/page_client-reference-manifest.js" },
  { name: "Knowledge Hub", route: "/knowledge", manifestPath: ".next/server/app/knowledge/page_client-reference-manifest.js" },
  { name: "Knowledge Article", route: "/knowledge/[slug]", manifestPath: ".next/server/app/knowledge/[slug]/page_client-reference-manifest.js" },
];

const results = [];

for (const item of IN_SCOPE_ROUTES) {
  const fullManifest = path.join(ROOT_DIR, item.manifestPath);
  if (!fs.existsSync(fullManifest)) {
    console.error(`[WARN] Manifest missing: ${item.manifestPath}`);
    continue;
  }

  const manifestStr = fs.readFileSync(fullManifest, "utf8");
  
  // Extract entryJSFiles
  const jsMatch = manifestStr.match(/"entryJSFiles":(\{.*?\})\};/s);
  const cssMatch = manifestStr.match(/"entryCSSFiles":(\{.*?\})\,"entryJSFiles"/s);

  let jsFiles = [];
  let cssFiles = [];

  if (jsMatch) {
    try {
      const jsMap = JSON.parse(jsMatch[1]);
      const pageKey = Object.keys(jsMap).find((k) => k.endsWith("/page"));
      if (pageKey && Array.isArray(jsMap[pageKey])) {
        jsFiles = jsMap[pageKey];
      }
    } catch (e) {
      console.error(`Error parsing JS files for ${item.route}:`, e);
    }
  }

  if (cssMatch) {
    try {
      const cssMap = JSON.parse(cssMatch[1]);
      const pageKey = Object.keys(cssMap).find((k) => k.endsWith("/page"));
      if (pageKey && Array.isArray(cssMap[pageKey])) {
        cssFiles = cssMap[pageKey].map((entry) => (typeof entry === "string" ? entry : entry.path));
      }
    } catch (e) {
      console.error(`Error parsing CSS files for ${item.route}:`, e);
    }
  }

  // Calculate sizes
  let totalRawJs = 0;
  let totalGzipJs = 0;
  const jsDetails = [];

  for (const jsRel of jsFiles) {
    const cleanRel = jsRel.startsWith("/_next/") ? jsRel.replace("/_next/", "") : jsRel;
    const fullPath = path.join(ROOT_DIR, ".next", cleanRel);
    if (fs.existsSync(fullPath)) {
      const buffer = fs.readFileSync(fullPath);
      const rawSize = buffer.length;
      const gzipSize = zlib.gzipSync(buffer).length;
      totalRawJs += rawSize;
      totalGzipJs += gzipSize;
      jsDetails.push({ name: path.basename(jsRel), rawSize, gzipSize });
    }
  }

  let totalRawCss = 0;
  let totalGzipCss = 0;
  const cssDetails = [];

  for (const cssRel of cssFiles) {
    const cleanRel = cssRel.startsWith("/_next/") ? cssRel.replace("/_next/", "") : cssRel;
    const fullPath = path.join(ROOT_DIR, ".next", cleanRel);
    if (fs.existsSync(fullPath)) {
      const buffer = fs.readFileSync(fullPath);
      const rawSize = buffer.length;
      const gzipSize = zlib.gzipSync(buffer).length;
      totalRawCss += rawSize;
      totalGzipCss += gzipSize;
      cssDetails.push({ name: path.basename(cssRel), rawSize, gzipSize });
    }
  }

  results.push({
    route: item.route,
    name: item.name,
    jsChunksCount: jsFiles.length,
    rawJsBytes: totalRawJs,
    gzipJsBytes: totalGzipJs,
    rawCssBytes: totalRawCss,
    gzipCssBytes: totalGzipCss,
    jsDetails,
    cssDetails,
  });
}

console.log("-------------------------------------------------------------------------------------------------------------------");
console.log(
  "Route".padEnd(22) +
  "JS Chunks".padEnd(12) +
  "Raw JS (KB)".padEnd(14) +
  "Gzip JS (KB)".padEnd(15) +
  "Raw CSS (KB)".padEnd(15) +
  "Gzip CSS (KB)"
);
console.log("-------------------------------------------------------------------------------------------------------------------");

for (const r of results) {
  console.log(
    r.route.padEnd(22) +
    String(r.jsChunksCount).padEnd(12) +
    (r.rawJsBytes / 1024).toFixed(1).padEnd(14) +
    (r.gzipJsBytes / 1024).toFixed(1).padEnd(15) +
    (r.rawCssBytes / 1024).toFixed(1).padEnd(15) +
    (r.gzipCssBytes / 1024).toFixed(1)
  );
}
console.log("-------------------------------------------------------------------------------------------------------------------\n");

// Output JSON for reporting
const jsonOutPath = path.join(ROOT_DIR, "evidence", "production-chunk-profiles.json");
fs.writeFileSync(jsonOutPath, JSON.stringify(results, null, 2), "utf8");
console.log(`Saved detailed chunk report to: ${jsonOutPath}`);
