// usage: node scripts/assets.mjs <bundled-configs.mjs> <id>  → prints public-relative paths the composition uses
const [mod, id] = process.argv.slice(2);
const m = await import(mod);
let cfg;
for (const v of Object.values(m)) {
  if (v && typeof v === "object" && "duration" in v && v === m[id]) cfg = v;
  if (v && typeof v === "object" && v[id] && "duration" in v[id]) cfg = v[id];
}
if (!cfg && m[id]) cfg = m[id];
if (!cfg) { const low = id[0].toLowerCase() + id.slice(1); if (m[low] && "duration" in m[low]) cfg = m[low]; }
if (!cfg) { console.error("unknown id " + id); process.exit(1); }
const out = new Set(["logo.png", `audio/${cfg.music}.wav`]);
for (const c of cfg.cuts) out.add(c.photo ? `photos/${c.clip}.jpg` : `clips/${c.clip}.mp4`);
for (const v of cfg.vo) out.add(`audio/${v.file}.wav`);
console.log([...out].join("\n"));
