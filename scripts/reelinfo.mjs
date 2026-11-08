// node scripts/reelinfo.mjs <bundled configs.mjs> <batch export name>: duration, snap times, and cuts that run past their clip
import fs from "fs"; import { execFileSync } from "child_process";
const m = await import(process.argv[2]); const B = "node_modules/@remotion/compositor-darwin-arm64";
const len = {}; const L = (c) => len[c] ??= (() => { try { execFileSync(`${B}/ffmpeg`, ["-i", `public/clips/${c}.mp4`], { env: { DYLD_LIBRARY_PATH: B }, stdio: "pipe" }); } catch (e) {
  const [h, mm, s] = String(e.stderr).split("Duration: ")[1].split(",")[0].split(":"); return +h * 3600 + +mm * 60 + +s; } })();
for (const [id, c] of Object.entries(m[process.argv[3]])) {
  const snaps = c.cuts.filter((x) => x.snapAt !== undefined && x.from + x.snapAt < c.duration).map((x) => ((x.from + x.snapAt) / 30).toFixed(2));
  const bad = c.cuts.filter((x) => (x.startFrom + x.dur * (x.rate ?? 1)) / 30 > L(x.clip) - 0.05).map((x) => `${x.clip}!`);
  console.log(id, c.music, (c.duration / 30).toFixed(2), snaps.join(",") || "-", bad.join(" "));
}
