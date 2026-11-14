import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const BASE_URL = process.env.BASE_URL || "http://localhost:3005";

console.log("=================================================================");
console.log("      FIGHTERX PRODUCTION IMAGE OPTIMIZATION PROFILER            ");
console.log("=================================================================");
console.log(`Target URL: ${BASE_URL}\n`);

const ASSETS_TO_PROFILE = [
  {
    name: "Hero Seni Athlete (LCP Priority)",
    sourceRel: "assets/fighterx/hero-silat-seni-athlete-lit.png",
    nextUrl: "/_next/image?url=%2Fassets%2Ffighterx%2Fhero-silat-seni-athlete-lit.png&w=1080&q=75",
    type: "Hero Cutout (Desktop LCP)",
  },
  {
    name: "Hero Olahraga Athlete (LCP Priority)",
    sourceRel: "assets/fighterx/hero-silat-olahraga-athlete-lit.png",
    nextUrl: "/_next/image?url=%2Fassets%2Ffighterx%2Fhero-silat-olahraga-athlete-lit.png&w=1080&q=75",
    type: "Hero Cutout (Desktop LCP)",
  },
  {
    name: "Hero Seni Athlete (Mobile w=640)",
    sourceRel: "assets/fighterx/hero-silat-seni-athlete-lit.png",
    nextUrl: "/_next/image?url=%2Fassets%2Ffighterx%2Fhero-silat-seni-athlete-lit.png&w=640&q=75",
    type: "Hero Cutout (Mobile)",
  },
  {
    name: "Programme Silat Seni (Below-Fold)",
    sourceRel: "assets/fighterx/programme-silat-seni-lit.png",
    nextUrl: "/_next/image?url=%2Fassets%2Ffighterx%2Fprogramme-silat-seni-lit.png&w=750&q=75",
    type: "Programme Card (Deferred)",
  },
  {
    name: "Programme Silat Olahraga (Below-Fold)",
    sourceRel: "assets/fighterx/programme-silat-olahraga-lit.png",
    nextUrl: "/_next/image?url=%2Fassets%2Ffighterx%2Fprogramme-silat-olahraga-lit.png&w=750&q=75",
    type: "Programme Card (Deferred)",
  },
  {
    name: "Coach Spotlight Portrait (Below-Fold)",
    sourceRel: "assets/fighterx/coach-portrait-spotlight.png",
    nextUrl: "/_next/image?url=%2Fassets%2Ffighterx%2Fcoach-portrait-spotlight.png&w=640&q=75",
    type: "Spotlight Card (Deferred)",
  },
  {
    name: "Guidelines Referee Waist (Desktop)",
    sourceRel: "assets/fighterx/referee-waist-large.png",
    nextUrl: "/_next/image?url=%2Fassets%2Ffighterx%2Freferee-waist-large.png&w=828&q=75",
    type: "Guidelines Cutout",
  },
  {
    name: "Hero Smoke Overlay (Settled)",
    sourceRel: "assets/fighterx/overlay-red-smoke-transparent.png",
    nextUrl: "/_next/image?url=%2Fassets%2Ffighterx%2Foverlay-red-smoke-transparent.png&w=1920&q=75",
    type: "Decorative Ambient",
  },
  {
    name: "Gayong Malaysia Emblem (Logo)",
    sourceRel: "assets/silat-logos/pertubuhan-silat-seni-gayong-malaysia.png",
    nextUrl: "/_next/image?url=%2Fassets%2Fsilat-logos%2Fpertubuhan-silat-seni-gayong-malaysia.png&w=256&q=75",
    type: "Association Logo",
  },
  {
    name: "Sendeng Malaysia Emblem (Logo)",
    sourceRel: "assets/silat-logos/persatuan-seni-silat-sendeng-malaysia.png",
    nextUrl: "/_next/image?url=%2Fassets%2Fsilat-logos%2Fpersatuan-seni-silat-sendeng-malaysia.png&w=256&q=75",
    type: "Association Logo",
  },
  {
    name: "Moments Action Photo (Gallery)",
    sourceRel: "assets/moments/galeri-77.jpg",
    nextUrl: "/_next/image?url=%2Fassets%2Fmoments%2Fgaleri-77.jpg&w=1080&q=75",
    type: "Moments Photo",
  },
];

async function profileImages() {
  const tableData = [];

  for (const item of ASSETS_TO_PROFILE) {
    const sourcePath = path.join(ROOT_DIR, "public", item.sourceRel);
    let sourceBytes = 0;
    if (fs.existsSync(sourcePath)) {
      sourceBytes = fs.statSync(sourcePath).size;
    }

    let optimizedBytes = 0;
    let contentType = "unknown";
    try {
      const res = await fetch(`${BASE_URL}${item.nextUrl}`, {
        headers: {
          Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        },
      });
      if (res.ok) {
        const buf = await res.arrayBuffer();
        optimizedBytes = buf.byteLength;
        contentType = res.headers.get("content-type") || "unknown";
      } else {
        console.error(`Failed to fetch ${item.nextUrl}: status ${res.status}`);
      }
    } catch (err) {
      console.error(`Error requesting ${item.nextUrl}:`, err.message);
    }

    const savingsPercent =
      sourceBytes > 0 && optimizedBytes > 0
        ? (((sourceBytes - optimizedBytes) / sourceBytes) * 100).toFixed(1)
        : "0.0";

    tableData.push({
      name: item.name,
      type: item.type,
      sourceRel: item.sourceRel,
      sourceBytes,
      sourceKb: (sourceBytes / 1024).toFixed(1),
      optimizedBytes,
      optimizedKb: (optimizedBytes / 1024).toFixed(1),
      contentType,
      savingsPercent: `${savingsPercent}%`,
    });
  }

  console.log("----------------------------------------------------------------------------------------------------------------------");
  console.log(
    "Asset Name".padEnd(38) +
    "Type".padEnd(25) +
    "Source (KB)".padEnd(16) +
    "Optimized (KB)".padEnd(18) +
    "Savings (%)".padEnd(14) +
    "Format"
  );
  console.log("----------------------------------------------------------------------------------------------------------------------");

  for (const row of tableData) {
    console.log(
      row.name.padEnd(38) +
      row.type.padEnd(25) +
      row.sourceKb.padEnd(16) +
      row.optimizedKb.padEnd(18) +
      row.savingsPercent.padEnd(14) +
      row.contentType
    );
  }
  console.log("----------------------------------------------------------------------------------------------------------------------\n");

  const outPath = path.join(ROOT_DIR, "evidence", "image-optimization-measurements.json");
  fs.writeFileSync(outPath, JSON.stringify(tableData, null, 2), "utf8");
  console.log(`Saved detailed measurements to: ${outPath}`);
}

profileImages().catch((err) => {
  console.error("Image profiling failed:", err);
  process.exit(1);
});
