// Batch 4: reels built from the idea list. Each config is a list of scenes; `mk` lays them out back to back.
// Dog-only footage carries lines about the dog; bowls, printing and maps stay in their own cuts.
import type { ReelConfig } from "./Reel";

/* eslint-disable @typescript-eslint/no-explicit-any */
type V = [string, any?];
type Sc = { d: number; v: V | V[]; c?: any | any[]; vo?: string };

const DOGS = ["dog", "dog2"];
// where a caption can sit without covering the subject of each clip
const P: Record<string, { top: number; size: number; inline?: boolean }> = {
  d_laptop: { top: 1200, size: 80 }, d_sofa: { top: 1340, size: 80 }, d_studio: { top: 105, size: 72 },
  d_treat: { top: 1300, size: 80 }, d_grass: { top: 1150, size: 80 }, d_tongue: { top: 1320, size: 80 },
  d_lake: { top: 240, size: 84 }, d_kayak: { top: 260, size: 84 }, d_kayak2: { top: 260, size: 84 },
  d_balcony: { top: 240, size: 84 }, d_marina: { top: 260, size: 84 },
  dog: { top: 140, size: 62, inline: true }, dog2: { top: 140, size: 62, inline: true },
  qc_new: { top: 1400, size: 84 },
};

// seconds of footage in the short clips (longer ones never run out in a scene)
const LEN: Record<string, number> = {
  d_tongue: 2.6, d_kayak: 2.3, d_kayak2: 1.4, d_rocks: 1.9, d_hill: 2.4, d_lake: 3.2, d_studio: 5.2, d_marina: 5, d_grass: 5.2, d_balcony: 5, d_swim: 5, d_sofa: 6.5,
  dog: 5, dog2: 3.1, name: 5, z_orange: 2.4, z_blue: 2.4, z_green: 2.4, z_pink: 2.4, z_mint: 2.4, b_coffee: 1.3, b_spools: 1.7, b_spool_terra: 4.7, spool: 4.45,
  t_blue1: 14.4, t_blue2: 10.7, t_blue3: 11.6, t_bluepull: 8.6, t_sup1: 12.4, t_sup3: 11, t_purple: 2.3, t_purplepull: 18.8, t_arch1: 7.3, t_arch2: 27.4, t_arch3: 4.5,
  f_kids1: 2.3, f_drawing: 2.6, f_tools: 3.1, w_8983: 3.1, w_8985: 4.1, w_8984: 9.2, w_8987: 7.3,
  fail: 4.4,
  pk_9336: 13.4, pk_9337: 8.5, pk_9338: 21.2, pk_9339: 7.1, pk_9340: 52.2, pk_9342: 24.3, pk_9360: 22.9, pk_9361: 13.4, pk_9362: 26, pk_9366: 9.4, pk_9367: 13.1, pk_9368: 10.2, pk_9369: 9.3, pk_9370: 13.1, pk_9371: 6.9,
  mp_9372: 10.6, mp_9373: 11.2, mp_9374: 8.3, mp_9375: 9.8, mp_9376: 5.4, mp_9377: 8.7, mp_9378: 10.1,
  pu_6153: 10.2, pu_6154: 1.8, pu_6155: 1.6, pu_6156: 6.7, pu_6157: 20.9, pu_6158: 10.6, pu_6159: 8.6, pu_6160: 8, pu_9403: 4.2, pu_9404: 2.7, pu_9405: 5, pu_9406: 57.4, pu_9418: 16.4, pu_9427: 18.3, pu_9430: 9.1, pu_9433: 20.5, pu_9450: 18.2, pu_9499: 5.4, pu_9503: 18.8, pu_9507: 2.7, pu_9512: 60.5,
  se_6134: 9.7, se_6135: 10.2, se_6144: 6.7, se_6146: 5, se_6147: 4.5, se_6148: 4, se_6149: 6.5, se_6150: 5.9, se_6151: 3.6, se_6169: 11.7, se_6177: 6.8, se_6178: 8, se_6179: 7, se_9451: 4.6, se_9452: 84.4, se_9455: 21.6, se_9457: 10.8, se_9458: 12.3, se_9459: 5.9, se_9460: 7, se_9461: 4.2, se_9493: 16.4, se_9494: 6.9, se_9500: 5.4, se_9501: 7.6, se_9509: 3.2, se_9510: 9.1, se_9511: 74.6,
  br_6183: 8.4, br_6185: 7.7, br_9504: 53.9, br_9586: 4.5, br_9587: 3.3, br_9588: 2, br_9593: 15.7, br_9574: 7.3, se_6187: 24.4,
  t_long: 108, t_unpack: 11, t_load: 22, t_sup2: 2.1, t_bluewide: 1.5,
  t_fit: 18.1, t_join2: 8.4, t_join3: 7.3, t_join4: 9.1, t_close: 3.5, t_steel1: 5.9, t_steel2: 6.4, t_steel3: 6.7, th_join: 9.6,
  c_orange: 2.5, c_blue: 3, c_green: 3, c_mint: 2.4, c_diag: 2.5, c_pyr: 3, box: 1.55, p_mint_tall: 3, n_phoebe: 3.7, n_orange: 4.5, n_blue2: 4.3, n_green: 4.5, n_mint: 4.5, n_pinkbg: 5,
};

const mk = (music: string, scenes: Sc[], extra: any[] = []): ReelConfig => {
  const cuts: any[] = [], captions: any[] = [...extra], vo: any[] = [];
  let f = 0;
  for (const sc of scenes) {
    const vs = (Array.isArray(sc.v[0]) ? sc.v : [sc.v]) as V[];
    let g = f;
    for (const [clip, o = {}] of vs) {
      const dur = o.dur ?? Math.round(sc.d / vs.length);
      const dogDefaults = DOGS.includes(clip) && !o.window ? { origin: "50% 0%", zoom: [1, 1.1] } : {};
      const len = LEN[clip];
      const fit = len ? Math.min(o.rate ?? 1, (len - (o.startFrom ?? 0) / 30 - 0.08) / (dur / 30)) : undefined;
      cuts.push({ clip, from: g, zoom: [1, 1.06], ...dogDefaults, ...o, ...(fit ? { rate: Math.max(0.3, fit) } : {}), dur });
      g += dur;
    }
    for (const c of sc.c ? (Array.isArray(sc.c) ? sc.c : [sc.c]) : []) captions.push({ from: f, dur: sc.d, ...c });
    if (sc.vo) vo.push({ file: sc.vo, from: f + 3 });
    f += sc.d;
  }
  return { music, duration: f, cuts, captions, vo };
};

// label (pink) + one or two lines, positioned for the clip it sits on
const L = (clip: string, label: string | null, a: string, b?: string, o: any = {}) => {
  const p = { ...(P[clip] ?? { top: 280, size: 86 }), ...o };
  const words: any[] = [];
  if (label) words.push({ t: label, at: 2, pink: true, size: o.labelSize });
  words.push({ t: a, at: label ? 14 : 3, br: !!label && !p.inline });
  if (b) words.push({ t: b, at: o.bAt ?? (label ? 44 : 30), br: true, pink: !label });
  if (o.boxed) for (const w of words) if (!w.pink) w.box = true;
  return { kind: "words", top: p.top, size: p.size, words: words.filter((w) => w.t !== "") };
};
const W = 560;
const rv = (subject: string, stars: number, text: string, by?: string) => ({ kind: "review", subject, stars, text, by, top: 84 });
const win = (pos: string, o: any = {}) => ({ zoom: [1, 1.04], window: { top: W, pos }, ...o });
const opts = (title: string, items: string[], o: any = {}) => ({
  kind: "card", title, titleSize: 84, top: 230, ...o,
  bullets: items.map((t, i) => ({ t, at: 18 + i * 22, mark: "ABCD"[i] })),
});
const stamp = (item: string, verdict: string, x: number, y: number, scale = 0.62) => ({ kind: "stamp", lines: [item, verdict], at: 16, x, y, scale });

export const batch4: Record<string, ReelConfig> = {
  // 1 — Your dog's love language
  Idea01LoveLanguage: mk("i01", [
    { d: 60, v: ["d_marina"], c: L("d_marina", null, "Your dog's", "love language", { size: 104 }) },
    { d: 90, v: ["d_laptop", { startFrom: 20 }], c: L("d_laptop", "Quality time", "Sits on your laptop.", "During the meeting.") },
    { d: 90, v: ["d_studio", { startFrom: 10, origin: "50% 0%" }], c: L("d_studio", "Physical touch", "Must be carried.", "Like royalty.", { inline: true, size: 58 }) },
    { d: 90, v: ["d_grass", { startFrom: 40 }], c: L("d_grass", "Gifts", "Shows you the frisbee.", "Does not share it.") },
    { d: 90, v: ["d_treat", { startFrom: 200 }], c: L("d_treat", "Acts of service", "Offers to finish", "your dinner.") },
    { d: 90, v: ["dog2"], c: L("dog2", "Words of affirmation", "", "Only hears “dinner”.", { size: 58 }) },
    { d: 60, v: ["d_tongue"], c: L("d_tongue", null, "Which one", "is yours?", { size: 100 }) },
  ]),

  // 3 — Your dog as a coworker
  Idea03Coworker: mk("i03", [
    { d: 60, v: ["d_balcony", { startFrom: 15 }], c: L("d_balcony", null, "Your dog", "as a coworker", { size: 104 }) },
    { d: 90, v: ["d_laptop", { startFrom: 60 }], c: L("d_laptop", "The Micromanager", "Watches you type.", "Sighs.") },
    { d: 90, v: ["d_sofa", { startFrom: 60 }], c: L("d_sofa", "The Napper", "In every meeting.", "Camera off.") },
    { d: 90, v: ["d_treat", { startFrom: 300 }], c: L("d_treat", "The Lunch Thief", "“Are you going", "to finish that?”") },
    { d: 90, v: ["d_kayak", { rate: 0.7 }], c: L("d_kayak", "Works remotely", "Dials in", "from a boat.") },
    { d: 90, v: ["dog", { startFrom: 30 }], c: L("dog", "Quality Control", "Rejects everything.", "Loves the job.", { size: 60 }) },
    { d: 60, v: ["d_studio", { startFrom: 10, origin: "50% 0%" }], c: L("d_studio", null, "Tag your", "coworker.", { size: 80 }) },
  ]),

  // 6 — Dog bingo
  Idea06DogBingo: mk("i06", [
    { d: 45, v: ["d_sofa", { startFrom: 60 }], c: L("d_sofa", null, "Dog bingo:", "how many today?", { size: 96 }) },
    { d: 240, v: [["d_treat", { startFrom: 150, dur: 120 }], ["d_laptop", { dur: 120 }]], c: { kind: "bingo", title: "Dog bingo", step: 20, cells: ["Stole a sock", "Barked at nothing", "Begged at dinner", "Zoomies at 10 pm", "Was cute (free)", "Sat on the laptop", "Ignored their name", "Took the whole bed", "Acted starving"] } },
    { d: 75, v: ["dog2"], c: L("dog2", null, "Screenshot it.", "Send it to their other human.", { size: 60 }) },
  ]),

  // 8 — If my dog had a work profile
  Idea08WorkProfile: mk("i08", [
    { d: 60, v: ["d_lake"], c: L("d_lake", null, "If my dog had", "a work profile", { size: 100 }) },
    { d: 330, v: [["d_studio", { dur: 150, rate: 0.9, startFrom: 6, zoom: [1, 1.03], window: { bottom: 900, pos: "50% 22%" } }], ["dog", { dur: 180, startFrom: 20, zoom: [1, 1.03], window: { bottom: 900, pos: "50% 22%" } }]],
      c: { kind: "profile", top: 1040, name: "Amy", role: "Head of Quality Control · Lindom.home", about: "Barcelona · Open to: snacks", skills: [["Hearing cheese from three rooms away", "99+"], ["Staring until it works", "87"], ["Bowl inspection", "54"]] } },
    { d: 60, v: ["d_tongue"], c: L("d_tongue", null, "Endorse your dog", "in the comments.", { size: 84 }) },
  ]),

  // 13 — A day in my life as Head of Quality Control (voiced)
  Idea13AmyDay: mk("i13", [
    { d: 75, v: ["dog", { startFrom: 20 }], c: L("dog", null, "A day in my life as", "Head of Quality Control", { size: 60 }), vo: "day_vo1" },
    { d: 75, v: ["d_sofa", { startFrom: 60 }], c: L("d_sofa", "7:00", "Wake the human.", "With my face."), vo: "day_vo2" },
    { d: 75, v: ["d_kayak", { rate: 0.75 }], c: L("d_kayak", "8:30", "Commute."), vo: "day_vo3" },
    { d: 75, v: ["dog2"], c: L("dog2", "9:00", "Inspect the bowls.", "Still empty."), vo: "day_vo4" },
    { d: 75, v: ["p_mint_long", { startFrom: 200, rate: 2 }], c: L("p_mint_long", "11:00", "Supervise", "the machine."), vo: "day_vo5" },
    { d: 75, v: ["d_treat", { startFrom: 210 }], c: L("d_treat", "13:00", "Lunch", "negotiations."), vo: "day_vo6" },
    { d: 75, v: ["d_laptop", { startFrom: 30 }], c: L("d_laptop", "15:00", "Sit on", "the meeting."), vo: "day_vo7" },
    { d: 75, v: ["d_lake"], c: L("d_lake", "18:00", "Clock out.", "Hard day."), vo: "day_vo8" },
  ]),

  // 14 — Things I rejected this week
  Idea14Rejected: mk("i14", [
    { d: 60, v: ["d_studio", { startFrom: 10, origin: "50% 0%" }], c: L("d_studio", null, "Things I rejected", "this week") },
    { d: 60, v: ["d_laptop", { startFrom: 20 }], c: stamp("THE LAPTOP", "Rejected", 0, 440) },
    { d: 60, v: ["d_kayak"], c: stamp("THE BOAT", "Rejected", 0, -500) },
    { d: 60, v: ["dog2"], c: stamp("AN EMPTY BOWL", "Rejected", 270, -560, 0.5) },
    { d: 60, v: ["d_grass", { startFrom: 60 }], c: stamp("SHARING THE FRISBEE", "Rejected", 0, 380) },
    { d: 60, v: ["d_balcony", { startFrom: 30 }], c: stamp("COMING INSIDE", "Rejected", 0, -520) },
    { d: 90, v: ["d_treat", { startFrom: 300 }], c: stamp("THIS, HOWEVER", "Approved", 0, 560) },
  ]),

  // 16 — Dear diary (voiced)
  Idea16DearDiary: mk("i16", [
    { d: 90, v: ["dog2"], c: L("dog2", null, "Dear diary,", "day 412.", { size: 72 }), vo: "diary_vo1" },
    { d: 90, v: ["dog", { startFrom: 40 }], c: L("dog", null, "The bowl is empty.", "Again.", { size: 68 }), vo: "diary_vo2" },
    { d: 90, v: ["d_sofa", { startFrom: 60 }], c: L("d_sofa", null, "I have not eaten", "in eleven minutes."), vo: "diary_vo3" },
    { d: 90, v: ["d_treat", { startFrom: 210 }], c: L("d_treat", null, "The human says", "I “just had dinner”."), vo: "diary_vo4" },
    { d: 90, v: ["d_lake"], c: L("d_lake", null, "I remain", "brave.", { size: 104 }), vo: "diary_vo5" },
    { d: 90, v: ["d_tongue", { rate: 0.55 }], c: L("d_tongue", null, "Wait. The fridge opened.", "Never mind.", { size: 76 }), vo: "diary_vo6" },
  ]),

  // 18 — Interview with the boss
  Idea18Interview: mk("i18", [
    { d: 60, v: ["d_studio", { startFrom: 10, origin: "50% 0%" }], c: L("d_studio", null, "Interview", "with the boss", { size: 80 }) },
    { d: 90, v: ["dog", { startFrom: 20 }], c: L("dog", "What do you do here?", "", "Quality control.", { size: 58 }) },
    { d: 90, v: ["d_treat", { startFrom: 200 }], c: L("d_treat", "Biggest weakness?", "Cheese.", undefined, { labelSize: 62, size: 100 }) },
    { d: 90, v: ["d_sofa", { startFrom: 60 }], c: L("d_sofa", "How do you handle stress?", "I lie down.", undefined, { labelSize: 58, size: 100 }) },
    { d: 90, v: ["d_kayak", { rate: 0.6 }], c: L("d_kayak2", "Where do you see yourself in five years?", "On a boat.", undefined, { labelSize: 50, size: 100 }) },
    { d: 90, v: ["d_laptop", { startFrom: 40 }], c: L("d_laptop", "Any questions for us?", "When is dinner.", undefined, { labelSize: 60, size: 96 }) },
  ]),

  // 19 — Performance review of my human
  Idea19HumanReview: mk("i19", [
    { d: 60, v: ["d_balcony", { startFrom: 15 }], c: L("d_balcony", null, "Performance review:", "my human", { size: 92 }) },
    { d: 105, v: ["dog2", win("50% 50%", { rate: 0.85 })], c: rv("Punctuality", 2, "Dinner was four minutes late.") },
    { d: 105, v: ["d_treat", win("50% 40%", { startFrom: 290 })], c: rv("Snack policy", 1, "Holds it. Makes me sit. Why.") },
    { d: 105, v: ["d_laptop", win("50% 35%", { startFrom: 20 })], c: rv("Focus", 2, "Stares at the laptop. Not at me.") },
    { d: 105, v: ["d_kayak", win("50% 90%", { rate: 0.6 })], c: rv("Adventures", 5, "Boat. Mountains. No notes.") },
    { d: 105, v: ["d_studio", win("50% 30%", { rate: 0.9 })], c: rv("Overall", 5, "Would adopt again.") },
    { d: 60, v: ["d_tongue"], c: L("d_tongue", null, "Review your human", "below.", { size: 84 }) },
  ]),

  // 23 — Texts I'd get if my dog had a phone
  Idea23DogTexts: mk("i23", [
    { d: 60, v: ["dog2"], c: L("dog2", null, "Texts I'd get if", "my dog had a phone", { size: 62 }) },
    { d: 300, v: [["d_sofa", { dur: 150, startFrom: 55, rate: 0.5, zoom: [1, 1.03], window: { top: 1180, pos: "50% 42%" } }], ["d_balcony", { dur: 150, zoom: [1, 1.03], window: { top: 1180, pos: "50% 55%" } }]], c: { kind: "chat", name: "Amy", light: true, top: 70, msgs: [
      { t: "where are you", at: 8 }, { t: "you've been gone 4 hours", at: 44 }, { t: "It's been 6 minutes.", at: 84, me: true },
      { t: "the bowl is empty", at: 126 }, { t: "You ate at 6.", at: 166, me: true }, { t: "that was a different me", at: 204 }, { t: "come home. bring cheese.", at: 246 },
    ] } },
    { d: 60, v: ["d_tongue"], c: L("d_tongue", null, "What would", "yours text?", { size: 96 }) },
  ]),

  // 25 — Dog owner math
  Idea25OwnerMath: mk("i25", [
    { d: 60, v: ["dog", { startFrom: 30 }], c: L("dog", null, "Dog owner", "math", { size: 76 }) },
    { d: 75, v: ["b_coffee", { rate: 0.5 }], c: L("b_coffee", null, "Coffee, €4:", "“Too expensive.”") },
    { d: 75, v: ["name", { startFrom: 20 }], c: L("name", null, "Her name on a bowl:", "“Obviously.”") },
    { d: 75, v: ["d_treat", { startFrom: 300 }], c: L("d_treat", null, "Her snacks:", "hand-delivered.") },
    { d: 75, v: ["d_marina"], c: L("d_marina", null, "Her third harness:", "“She needs options.”", { size: 76 }) },
    { d: 75, v: ["d_kayak", { rate: 0.75 }], c: L("d_kayak", null, "Her holidays:", "better than mine.") },
    { d: 60, v: ["d_studio", { startFrom: 10, origin: "50% 0%" }], c: L("d_studio", null, "Add yours", "in the comments.") },
  ]),

  // 28 — Things in my house that belong to the dog now
  Idea28DogOwnsIt: mk("i28", [
    { d: 75, v: ["dog2"], c: L("dog2", null, "Things in my house that", "belong to the dog now", { size: 56 }) },
    { d: 60, v: ["d_sofa", { startFrom: 60 }], c: L("d_sofa", null, "", "The sofa.", { size: 110, bAt: 4 }) },
    { d: 60, v: ["d_laptop", { startFrom: 20 }], c: L("d_laptop", null, "", "My laptop.", { size: 110, bAt: 4 }) },
    { d: 60, v: ["d_balcony", { startFrom: 20 }], c: L("d_balcony", null, "", "The balcony.", { size: 110, bAt: 4 }) },
    { d: 60, v: ["d_kayak"], c: L("d_kayak", null, "", "The boat.", { size: 110, bAt: 4 }) },
    { d: 60, v: ["d_treat", { startFrom: 300 }], c: L("d_treat", null, "", "My snacks.", { size: 110, bAt: 4 }) },
    { d: 60, v: ["d_studio", { startFrom: 10, origin: "50% 0%" }], c: L("d_studio", null, "", "Me.", { size: 110, bAt: 4 }) },
    { d: 90, v: ["name", { startFrom: 20 }], c: L("name", null, "At least her bowl", "has her name on it.") },
  ]),

  // 37 — We matched a bowl to our dog's fur
  Idea37FurColours: mk("i37", [
    { d: 75, v: ["d_studio", { startFrom: 6, origin: "50% 0%" }], c: L("d_studio", null, "We matched a bowl", "to our dog's fur.", { size: 68 }) },
    { d: 60, v: ["b_spools", { rate: 0.8 }], c: L("b_spools", null, "Found", "her colours.") },
    { d: 60, v: ["p_terra_bed", { rate: 1.6 }], c: L("p_terra_bed", null, "Printed", "them.") },
    { d: 60, v: ["p_terra_peel", { startFrom: 150, rate: 2.5 }] },
    { d: 75, v: ["b_terra_asm", { startFrom: 30, rate: 1.6 }], c: L("b_terra_asm", null, "Two halves.", "One cocker-coloured bowl.", { size: 72 }) },
    { d: 60, v: ["b_terra2", { startFrom: 150 }] },
    { d: 60, v: ["d_tongue"], c: L("d_tongue", null, "What colour", "is your dog?", { size: 96 }) },
  ]),

  // 12 — If dogs left reviews: every review is signed by the dog whose name is on the bowl in shot
  DogReviews: mk("music_reviews", [
    { d: 60, v: ["d_studio", { startFrom: 10, zoom: [1, 1.05], origin: "50% 0%" }], c: L("d_studio", null, "If dogs", "left reviews", { size: 80 }) },
    { d: 90, v: ["n_nellie", win("50% 40%", { startFrom: 90 })], c: rv("My name on it", 5, "Correct spelling. Rare.", "Nellie") },
    { d: 90, v: ["z_green", win("50% 60%", { rate: 0.75, snapAt: 40 })], c: rv("Two halves", 5, "One for dinner. One for second dinner.", "Nugget") },
    { d: 90, v: ["dog2", win("50% 50%")], c: rv("Current status", 1, "Empty. Again. Who is responsible?", "Amy") },
    { d: 90, v: ["z_mint", win("50% 45%", { rate: 0.75, snapAt: 40 })], c: rv("The steel bowl", 4, "Nice clang. Humans disagree.", "Jam") },
    { d: 90, v: ["b_yp2", win("50% 50%", { startFrom: 20 })], c: rv("Three colours", 5, "Loud. Like me.", "Teo") },
    { d: 90, v: ["b_terra2", win("50% 50%", { startFrom: 150 })], c: rv("Shared bowl", 3, "Chips eats faster. Unfair.", "Beef") },
    { d: 60, v: ["p_lineup", { rate: 1.3 }], c: L("p_lineup", null, "What would yours", "review?") },
  ]),

  // 33 (+31) — Every colour, rainbow order
  Idea33Rainbow: mk("i33", [
    { d: 45, v: ["p_lineup", { rate: 1.4 }], c: L("p_lineup", null, "Every colour.", "Rainbow order.", { size: 100 }) },
    ...([["b_terra", 60, "Terracotta"], ["c_orange", 10, "Orange"], ["b_yp", 20, "Yellow"], ["c_diag", 6, "Olive"], ["c_green", 30, "Green"], ["c_mint", 20, "Mint"], ["c_blue", 30, "Blue"], ["n_pinkbg", 100, "Pink"], ["n_nellie", 110, "White"]] as [string, number, string][])
      .map(([clip, startFrom, name]) => ({ d: 30, v: [clip, { startFrom, zoom: [1.03, 1.07] }] as V, c: { kind: "words", top: 280, size: 100, words: [{ t: name, at: 0, pink: true }] } })),
    { d: 60, v: ["n_blue2", { startFrom: 60 }], c: L("n_blue2", null, "Which one", "is yours?", { size: 100 }) },
  ]),

  // 35 — The drop: same clang three times, slower each time
  Idea35TheDrop: mk("i35", [
    { d: 60, v: ["z_mint", { snapAt: 30, zoom: [1.02, 1.05] }], c: L("z_mint", null, "Wait", "for it.", { size: 100 }) },
    { d: 75, v: ["z_mint", { startFrom: 15, rate: 0.5, snapAt: 30, zoom: [1.1, 1.14] }], c: L("z_mint", null, "", "Slower.", { size: 100, bAt: 2 }) },
    { d: 90, v: ["z_mint", { startFrom: 22, rate: 0.2667, snapAt: 30, zoom: [1.22, 1.28] }], c: L("z_mint", null, "", "Slooower.", { size: 100, bAt: 2 }) },
  ]),

  // 36 — Guess the second colour
  Idea36GuessHalf: mk("i36", [
    { d: 90, v: ["z_blue", { rate: 0.6667, snapAt: 45, zoom: [1, 1.03] }], c: [{ kind: "cover", until: 28 }, L("z_blue", null, "Guess the", "second colour", { size: 92 })] },
    { d: 90, v: ["z_pink", { rate: 0.6667, snapAt: 45, zoom: [1, 1.03] }], c: [{ kind: "cover", until: 28 }, L("z_pink", null, "", "And this one?", { size: 92, bAt: 2 })] },
    { d: 90, v: ["z_orange", { rate: 0.6667, snapAt: 45, zoom: [1, 1.03] }], c: [{ kind: "cover", until: 28 }, L("z_orange", null, "", "Last one.", { size: 92, bAt: 2 })] },
    { d: 45, v: ["p_lineup", { startFrom: 60 }], c: L("p_lineup", null, "", "How many did you get?", { size: 84, bAt: 2 }) },
  ]),

  // 40 — Help us rename this colour
  Idea40RenameColour: mk("i40", [
    { d: 60, v: ["c_mint", { startFrom: 10 }], c: L("c_mint", null, "Help us rename", "this colour.") },
    { d: 135, v: ["p_mint_tall", { rate: 0.6, zoom: [1.3, 1.34], y: 300 }], c: opts("Mint is boring", ["Toothpaste", "Fancy pistachio", "Spa day"]) },
    { d: 45, v: ["b_terra", { startFrom: 30 }], c: L("b_terra", null, "", "And this one?", { bAt: 2 }) },
    { d: 135, v: ["b_terra2", { startFrom: 150, zoom: [1.3, 1.34], y: 300 }], c: opts("Terracotta?", ["Expensive brick", "Mild sunburn", "Cocker spaniel"]) },
    { d: 45, v: ["p_lineup", { startFrom: 40 }], c: L("p_lineup", null, "", "Best name wins.", { bAt: 2 }) },
  ]),

  // 41 — Hours of printing in a few seconds
  Idea41Timelapse: mk("i41", [
    { d: 45, v: ["p_mint_load", { startFrom: 60, rate: 3 }], c: L("p_mint_load", null, "Hours of printing.", "In ten seconds.", { size: 92 }) },
    { d: 75, v: ["p_mint_long", { rate: 4 }] },
    { d: 75, v: ["p_mint_long", { startFrom: 330, rate: 4 }] },
    { d: 45, v: ["p_mint_tall", { rate: 2 }] },
    { d: 60, v: ["p_mint_remove", { rate: 3 }] },
    { d: 75, v: ["n_jam", { startFrom: 20 }], c: L("n_jam", null, "", "Worth the wait.", { bAt: 2 }) },
  ], [{ kind: "progress", from: 45, dur: 255 }]),

  // 42 — Guess what it's printing
  Idea42GuessPrint: mk("i42", [
    { d: 75, v: ["p_yellow0", { rate: 1.6 }], c: L("p_yellow0", null, "Guess what", "it's printing.", { size: 100 }) },
    { d: 135, v: ["p_yellow", { startFrom: 120, rate: 2.5 }], c: opts("Your guess?", ["Lampshade", "Plant pot", "Dog bowl", "Tiny UFO"]) },
    { d: 60, v: ["p_yellow_remove", { startFrom: 120, rate: 2.5 }], c: L("p_yellow_remove", null, "", "Final answer?", { bAt: 2 }) },
    { d: 90, v: ["b_yp", { startFrom: 20 }], c: L("b_yp", null, "C.", "Obviously.", { size: 110 }) },
  ]),

  // 47 — From screen to dinner
  Idea47ScreenToBowl: mk("i47", [
    { d: 75, v: ["p_cad_green", { rate: 1.6 }], c: L("p_cad_green", null, "It starts", "on a screen.", { size: 100 }) },
    { d: 60, v: ["print_green", { rate: 2 }], c: L("print_green", null, "", "Then layers.", { bAt: 2, size: 100 }) },
    { d: 60, v: ["p_green_peel", { startFrom: 30, rate: 3 }], c: L("p_green_peel", null, "", "Then this.", { bAt: 2, size: 100 }) },
    { d: 75, v: ["p_green_asm", { startFrom: 60, rate: 1.6 }], c: L("p_green_asm", null, "", "Then a snap.", { bAt: 2, size: 100 }) },
    { d: 60, v: ["n_nugget_wb", { startFrom: 20 }], c: L("n_nugget_wb", null, "", "Then a name.", { bAt: 2, size: 100 }) },
    { d: 75, v: ["dog2"], c: L("dog2", null, "", "Then dinner.", { bAt: 2, size: 76 }) },
  ]),

  // 52 — Satisfying support removal
  Idea52Supports: mk("i52", [
    { d: 135, v: ["p_sup_grey", { rate: 1.5 }], c: { kind: "words", from: 0, dur: 50, top: 280, size: 88, words: [{ t: "Oddly satisfying:", at: 2 }, { t: "support removal", at: 12, pink: true, br: true }] } },
    { d: 90, v: ["p_sup_blue", { rate: 1.6 }] },
    { d: 90, v: ["p_sup_cream", { startFrom: 20 }] },
    { d: 45, v: ["p_blue_final", { startFrom: 60 }], c: L("p_blue_final", null, "", "Clean.", { bAt: 2, size: 110 }) },
  ]),

  // 56 — Types of people who own a 3D printer
  Idea56PrinterPeople: mk("i56", [
    { d: 60, v: ["n_workshop", { rate: 2.5 }], c: L("n_workshop", null, "Types of people", "who own a 3D printer", { size: 84 }) },
    { d: 90, v: ["m_grey_print2", { rate: 1.3 }], c: L("x", "The “I could print that”", "Has never", "printed that.", { labelSize: 70 }) },
    { d: 90, v: ["p_yellow", { startFrom: 200, rate: 1.5 }], c: L("x", "The Night Shift", "Starts a 14-hour print", "at 11 pm.") },
    { d: 90, v: ["b_spool_terra"], c: L("x", "The Collector", "Forty spools.", "Uses grey.") },
    { d: 90, v: ["m_purple_macro"], c: L("x", "The Watcher", "Stares at the first layer.", "For twenty minutes.", { size: 78 }) },
    { d: 60, v: ["p_lineup", { rate: 1.2 }], c: L("x", null, "Which one", "are you?", { size: 100 }) },
  ]),

  // 60 — My printer's personality by time of day
  Idea60PrinterMoods: mk("i60", [
    { d: 60, v: ["p_mint_long", { rate: 2 }], c: L("x", null, "My printer's personality", "by time of day", { size: 80 }) },
    { d: 90, v: ["m_cyan_print"], c: L("x", "9 am", "Perfect first layer.", "Smug.") },
    { d: 90, v: ["print_close", { rate: 1.3 }], c: L("x", "2 pm", "Humming.", "Thriving.") },
    { d: 90, v: ["p_terra_bed"], c: L("x", "11 pm", "“Start a long one,", "what could go wrong?”", { size: 78 }) },
    { d: 90, v: ["m_purple_print2"], c: L("x", "3 am", "Makes a new noise.", "Just one.") },
    { d: 60, v: ["p_mint_tall", { rate: 0.6 }], c: L("x", "Morning", "Acts innocent.") },
  ]),

  // 63 — Signs you've been printing too long
  Idea63PrintingTooLong: mk("i63", [
    { d: 60, v: ["m_purple_print", { rate: 1.5 }], c: L("x", null, "Signs you've been", "printing too long", { size: 92 }) },
    { d: 90, v: ["p_mint_long", { startFrom: 300, rate: 1.5 }], c: L("x", "Sign 1", "You measure time", "in layers.") },
    { d: 90, v: ["b_spools", { rate: 0.55 }], c: L("x", "Sign 2", "You own more spools", "than plates.") },
    { d: 90, v: ["p_sup_cream", { startFrom: 20 }], c: L("x", "Sign 3", "Peeling this", "is your therapy.") },
    { d: 90, v: ["p_tan_peel", { startFrom: 60, rate: 2 }], c: L("x", "Sign 4", "“I could print that.”", "In every shop.") },
    { d: 60, v: ["p_yellow", { startFrom: 100 }], c: L("x", null, "How many?", "Be honest.", { size: 100 }) },
  ]),

  // 64 — Print this for your dog this weekend
  Idea64PrintThis: mk("i64", [
    { d: 60, v: ["p_cad_blue", { rate: 1.6 }], c: L("x", null, "Got a", "3D printer?", { size: 104 }) },
    { d: 75, v: ["p_cad_blue2", { rate: 1.2 }], c: L("x", null, "Print this for your dog", "this weekend.", { size: 80 }) },
    { d: 60, v: ["print_blue2", { startFrom: 20, rate: 1.5 }], c: L("x", null, "", "Print.", { bAt: 2, size: 110 }) },
    { d: 60, v: ["p_sup_blue", { startFrom: 60, rate: 2 }], c: L("x", null, "", "Peel.", { bAt: 2, size: 110 }) },
    { d: 75, v: ["z_blue", { snapAt: 30, zoom: [1.02, 1.05] }], c: L("x", null, "", "Snap.", { bAt: 24, size: 110 }) },
    { d: 75, v: ["p_blue_final", { startFrom: 40 }], c: L("x", null, "Done by Sunday.", "File's on our page.", { size: 80 }) },
  ]),

  // 71 — Two cities, one heart: guess the story
  Idea71MapStory: mk("i71", [
    { d: 75, v: ["m_grey_frame1", { rate: 1.3 }], c: L("x", null, "Two cities.", "One heart.", { size: 104 }) },
    { d: 150, v: ["m_grey_frame2", { zoom: [1.3, 1.34], y: 300 }], c: opts("Guess the story", ["Long distance", "Met there, live here", "Mum's city + mine", "Best friends abroad"]) },
    { d: 75, v: ["m_grey_frame1", { startFrom: 200 }], c: L("x", null, "Which one", "is yours?", { size: 100 }) },
  ]),

  // 73 — Where we met / where we live now
  Idea73MetLive: mk("i73", [
    { d: 75, v: ["m_cyan_hand"], c: L("x", null, "", "Where we met.", { bAt: 3, size: 96 }) },
    { d: 75, v: ["m_purple_hand", { startFrom: 30 }], c: L("x", null, "", "Where we live now.", { bAt: 3, size: 96 }) },
    { d: 90, v: ["m_cp_a", { startFrom: 20 }], c: L("x", null, "And everything", "in between.", { size: 96 }) },
    { d: 75, v: ["m_cp_c", { startFrom: 30 }], c: L("x", null, "What would your", "two cities be?", { size: 88 }) },
  ]),

  // 74 — For long-distance people
  Idea74LongDistance: mk("i74", [
    { d: 60, v: ["m_purple_close"], c: L("x", null, "", "Your city.", { bAt: 3, size: 104 }) },
    { d: 60, v: ["m_cyan_hand", { startFrom: 60 }], c: L("x", null, "", "Their city.", { bAt: 3, size: 104 }) },
    { d: 60, v: ["m_purple_macro2", { startFrom: 60, rate: 1.5 }], c: L("x", null, "Printed", "street by street.", { size: 88 }) },
    { d: 90, v: ["m_cp_zoom", { startFrom: 120 }], c: L("x", null, "", "Same wall.", { bAt: 3, size: 104 }) },
    { d: 75, v: ["m_cp_d", { startFrom: 150 }], c: L("x", null, "Send this to your", "long-distance person.", { size: 80 }) },
  ]),

  // 80 — Home is two places
  Idea80TwoHomes: mk("i80", [
    { d: 75, v: ["m_cream", { rate: 1.2 }], c: L("x", null, "", "Where you're from.", { bAt: 3, size: 92 }) },
    { d: 75, v: ["m_grey_peel", { startFrom: 300, rate: 1.5 }], c: L("x", null, "", "Where you live.", { bAt: 3, size: 92 }) },
    { d: 90, v: ["m_grey_frame2", { startFrom: 120 }], c: L("x", null, "You don't have to", "choose.", { size: 92 }) },
    { d: 75, v: ["m_grey_frame1", { startFrom: 150 }], c: L("x", null, "Home is", "two places.", { size: 104 }) },
    { d: 60, v: ["m_cp_b", { startFrom: 30 }], c: L("x", null, "Which two", "are yours?", { size: 100 }) },
  ]),

  // 91 — Printing a whole city
  Idea91PrintCity: mk("i91", [
    { d: 60, v: ["m_grey_print2", { rate: 1.6 }], c: L("x", null, "Printing", "a whole city.", { size: 100 }) },
    { d: 75, v: ["m_grey_print", { startFrom: 60, rate: 3 }], c: L("x", null, "", "Street by street.", { bAt: 3, size: 92 }) },
    { d: 75, v: ["m_purple_macro", { rate: 2 }] },
    { d: 60, v: ["m_cyan_print", { startFrom: 60 }] },
    { d: 75, v: ["m_cyan_peel", { startFrom: 60, rate: 3 }], c: L("x", null, "", "Then the second one.", { bAt: 3, size: 84 }) },
    { d: 90, v: ["m_cp_c", { startFrom: 30 }], c: L("x", null, "Two cities.", "One heart.", { size: 104 }) },
  ], [{ kind: "progress", from: 60, dur: 285 }]),

  // 92 — Thousands of tiny buildings
  Idea92TinyBuildings: mk("i92", [
    { d: 60, v: ["m_purple_macro2", { rate: 1.5, zoom: [1.1, 1.2] }], c: L("x", null, "", "Every street.", { bAt: 3, size: 104 }) },
    { d: 60, v: ["m_purple_macro", { startFrom: 120, zoom: [1.1, 1.2] }], c: L("x", null, "", "Every block.", { bAt: 3, size: 104 }) },
    { d: 60, v: ["m_purple_close", { zoom: [1.15, 1.3] }], c: L("x", null, "", "Every building.", { bAt: 3, size: 104 }) },
    { d: 75, v: ["m_cyan_hand", { zoom: [1.2, 1.35] }], c: L("x", null, "", "Tiny.", { bAt: 3, size: 120 }) },
    { d: 90, v: ["m_cp_a", { startFrom: 60 }], c: L("x", null, "Can you find", "your street?", { size: 96 }) },
  ]),
};

// ---- Batch 5: the rest of the idea list. Production numbers (about 700 layers, 6–7 h per half) come from the studio. ----
const big = (clip: string, t: string, o: any = {}) => L(clip, null, "", t, { bAt: 3, size: 100, ...o });

export const batch5: Record<string, ReelConfig> = {
  // 4 — Pick a bowl, get your dog's job title
  Idea04JobTitle: mk("i04", [
    { d: 60, v: ["p_lineup", { rate: 1.3 }], c: L("x", null, "Pick a bowl.", "Get your dog's job title.", { size: 80 }) },
    { d: 60, v: ["n_orange", { startFrom: 60, zoom: [1.17, 1.22], y: 150 }], c: L("x", "Orange", "Chief Barking Officer") },
    { d: 60, v: ["p_blue_final", { startFrom: 40 }], c: L("x", "Blue", "Head of Snacks") },
    { d: 60, v: ["n_green", { startFrom: 60 }], c: L("x", "Green", "Director of Naps") },
    { d: 60, v: ["c_mint", { startFrom: 10 }], c: L("x", "Mint", "VP of Zoomies") },
    { d: 60, v: ["b_terra", { startFrom: 60 }], c: L("x", "Terracotta", "Senior Sock Analyst") },
    { d: 60, v: ["b_yp2", { startFrom: 30 }], c: L("x", "Purple", "Intern. Forever.") },
    { d: 60, v: ["n_pinkbg", { startFrom: 20 }], c: L("x", null, "What's on their", "business card?", { size: 92 }) },
  ]),

  // 9 — My dog's villain origin story
  Idea09Villain: mk("i09", [
    { d: 60, v: ["d_lake"], c: L("d_lake", null, "My dog's", "villain origin story", { size: 92 }) },
    { d: 75, v: ["dog2"], c: L("dog2", null, "It was 6:01.", "The bowl was empty.", { size: 66 }) },
    { d: 75, v: ["d_sofa", { startFrom: 60 }], c: L("d_sofa", null, "She waited.", "Nobody came.") },
    { d: 75, v: ["d_marina", { startFrom: 60 }], c: { kind: "words", top: 1420, size: 80, words: [{ t: "Something changed", at: 3 }, { t: "that day.", at: 30, pink: true, br: true }] } },
    { d: 75, v: ["d_treat", { startFrom: 300 }], c: L("d_treat", null, "Now she takes", "what she wants.") },
    { d: 75, v: ["d_studio", { startFrom: 10, origin: "50% 0%" }], c: L("d_studio", null, "(Dinner was at 6:03.)", undefined, { size: 64 }) },
  ]),

  // 15 — My schedule vs my dog's
  Idea15Schedules: mk("i15", [
    { d: 60, v: ["d_balcony", { startFrom: 15 }], c: L("d_balcony", null, "My schedule", "vs my dog's", { size: 104 }) },
    { d: 90, v: ["d_sofa", { startFrom: 60 }], c: L("d_sofa", "7:00", "Me: snooze.", "Her: staring at me.") },
    { d: 90, v: ["d_laptop", { startFrom: 20 }], c: L("d_laptop", "10:00", "Me: in a meeting.", "Her: also in the meeting.") },
    { d: 90, v: ["d_treat", { startFrom: 290 }], c: L("d_treat", "13:00", "Me: a sandwich.", "Her: half the sandwich.") },
    { d: 90, v: ["d_marina"], c: L("d_marina", "18:00", "Me: tired.", "Her: walk. Now.") },
    { d: 90, v: ["d_sofa", { rate: 0.6 }], c: L("x", "23:00", "Me: the edge of the sofa.", "Her: the sofa.", { top: 240, size: 78 }) },
    { d: 60, v: ["d_tongue"], c: L("d_tongue", null, "Sound", "familiar?", { size: 100 }) },
  ]),

  // 17 — Amy rates dog names (the names embossed on the bowls)
  Idea17AmyRatesNames: mk("i17", [
    { d: 60, v: ["d_studio", { startFrom: 10, origin: "50% 0%" }], c: L("d_studio", null, "Amy rates", "dog names", { size: 80 }) },
    { d: 90, v: ["n_nugget_wb", win("50% 75%", { startFrom: 20 })], c: rv("Nugget", 5, "Edible. Strong start.") },
    { d: 90, v: ["p_blue_final", win("50% 50%", { startFrom: 40 })], c: rv("Bo", 3, "Efficient. A bit lazy.") },
    { d: 90, v: ["n_nellie", win("50% 40%", { startFrom: 90 })], c: rv("Nellie", 4, "Somebody's grandma. Respect.") },
    { d: 90, v: ["n_jam", win("50% 70%", { startFrom: 40 })], c: rv("Jam", 5, "Also edible. I see a pattern.") },
    { d: 90, v: ["n_phoebe", win("50% 55%", { startFrom: 20 })], c: rv("Phoebe", 2, "Too many letters to ignore.") },
    { d: 90, v: ["name", win("50% 85%", { startFrom: 20 })], c: rv("Amy", 5, "Perfect. No notes.") },
    { d: 60, v: ["d_tongue"], c: L("d_tongue", null, "Drop your dog's name.", "Amy will rate it.", { size: 76 }) },
  ]),

  // 20 — What I think the printer is
  Idea20PrinterByDog: mk("i20", [
    { d: 60, v: ["dog", { startFrom: 20 }], c: L("dog", null, "What my dog thinks", "the printer is", { size: 62 }) },
    { d: 75, v: ["print_close", { rate: 1.4 }], c: L("x", null, "A loud box.", "It never stops.") },
    { d: 75, v: ["p_mint_long", { startFrom: 240, rate: 2 }], c: L("x", null, "It makes bowls.", "Only bowls.") },
    { d: 75, v: ["p_mint_tall", { rate: 0.7 }], c: L("x", null, "Never", "food.") },
    { d: 75, v: ["d_sofa", { startFrom: 60 }], c: L("d_sofa", null, "I have filed", "a complaint.") },
    { d: 60, v: ["d_lake"], c: L("d_lake", null, "Zero stars.", "Would bark at again.", { size: 84 }) },
  ]),

  // 21 — Things dog owners say
  Idea21OwnersSay: mk("i21", [
    { d: 60, v: ["d_marina"], c: L("d_marina", null, "Things dog owners say", "with a straight face", { size: 80 }) },
    { d: 90, v: ["d_laptop", { startFrom: 20 }], c: L("d_laptop", null, "“She's helping", "me work.”") },
    { d: 90, v: ["d_sofa", { startFrom: 60 }], c: L("d_sofa", null, "“She's not allowed", "on the sofa.”") },
    { d: 90, v: ["d_treat", { startFrom: 200 }], c: L("d_treat", null, "“It's her favourite.", "She told me.”") },
    { d: 90, v: ["d_kayak", { rate: 0.65 }], c: L("d_kayak", null, "“She needed", "a holiday.”") },
    { d: 90, v: ["name", { startFrom: 20 }], c: L("x", null, "“It has her name on it", "so she knows it's hers.”", { size: 76 }) },
    { d: 60, v: ["d_tongue"], c: L("d_tongue", null, "Which one", "have you said?", { size: 96 }) },
  ]),

  // 30 — Before dog / after dog
  Idea30BeforeAfter: mk("i30", [
    { d: 60, v: ["d_hill", { rate: 0.8 }], c: L("x", null, "Before dog", "/ after dog", { size: 104 }) },
    { d: 90, v: ["d_rocks", { rate: 0.6 }], c: L("x", "Weekends", "Before: brunch.", "After: a mountain at 7 am.", { size: 78 }) },
    { d: 90, v: ["d_sofa", { startFrom: 60 }], c: L("d_sofa", "The sofa", "Before: mine.", "After: hers.") },
    { d: 90, v: ["d_laptop", { startFrom: 20 }], c: L("d_laptop", "Work calls", "Before: on mute.", "After: barking.") },
    { d: 90, v: ["d_swim"], c: L("x", "Holidays", "Before: city breaks.", "After: anything with a lake.", { size: 78 }) },
    { d: 90, v: ["dog2"], c: L("dog2", "Shopping", "Before: shoes.", "After: bowls.", { size: 58 }) },
    { d: 75, v: ["d_tongue", { rate: 0.6 }], c: L("d_tongue", null, "Worth it?", "Obviously.", { size: 100 }) },
  ]),

  // 38 — Colour combos that shouldn't work but do
  Idea38ColourCombos: mk("i38", [
    { d: 60, v: ["p_lineup", { startFrom: 30 }], c: L("x", null, "Colour combos that", "shouldn't work but do", { size: 84 }) },
    { d: 75, v: ["b_yp2", { startFrom: 20 }], c: L("x", "Purple + yellow + grey", "Chaos.", "Somehow perfect.", { labelSize: 70 }) },
    { d: 75, v: ["n_green", { startFrom: 50 }], c: L("x", "Olive + hot pink", "Sounds wrong.", "Looks right.", { labelSize: 76 }) },
    { d: 75, v: ["b_terra2", { startFrom: 150 }], c: L("x", "Terracotta + sand", "Basically", "a cocker spaniel.", { labelSize: 76 }) },
    { d: 75, v: ["n_orange", { startFrom: 60, zoom: [1.17, 1.22], y: 150 }], c: L("x", "Orange + white", "Traffic cone", "but chic.", { labelSize: 76 }) },
    { d: 75, v: ["n_blue2", { startFrom: 60 }], c: L("x", "Blue + stone", "The sensible one.", "Every family has one.", { labelSize: 76, size: 78 }) },
    { d: 60, v: ["n_pinkbg", { startFrom: 60 }], c: L("x", null, "Your wildest", "combo?", { size: 100 }) },
  ]),

  // 43 — What one spool becomes
  Idea43OneSpool: mk("i43", [
    { d: 60, v: ["spool", { startFrom: 10 }], c: L("x", null, "", "One spool.", { bAt: 3, size: 110 }) },
    { d: 60, v: ["p_mint_load", { startFrom: 90, rate: 3 }] },
    { d: 75, v: ["p_mint_long", { startFrom: 150, rate: 4 }], c: L("x", null, "About", "700 layers.", { size: 104 }) },
    { d: 60, v: ["p_mint_remove", { rate: 3 }] },
    { d: 75, v: ["n_mint", { zoom: [1.14, 1.19], y: 120 }], c: L("x", null, "", "One bowl.", { bAt: 3, size: 110 }) },
    { d: 60, v: ["b_spools", { rate: 0.8 }], c: L("x", null, "What would you make", "with the next one?", { size: 80 }) },
  ]),

  // 44 — Things nobody tells you about 3D printing (voiced)
  Idea44NobodyTells: mk("i44", [
    { d: 90, v: ["n_workshop", { rate: 2 }], c: L("x", null, "Things nobody tells you", "about 3D printing", { size: 80 }), vo: "nt_vo1" },
    { d: 90, v: ["p_yellow", { startFrom: 150, rate: 2 }], c: L("x", "It's slow", "One bowl:", "6-12 hours."), vo: "nt_vo2" },
    { d: 90, v: ["p_yellow0", { startFrom: 90, rate: 1.5 }], c: L("x", null, "The first layer", "decides everything."), vo: "nt_vo3" },
    { d: 90, v: ["p_sup_grey", { rate: 1.5 }], c: L("x", null, "Printing is only", "half the job."), vo: "nt_vo4" },
    { d: 90, v: ["p_mint_long", { startFrom: 330, rate: 2 }], c: L("x", null, "One bowl:", "about 700 layers."), vo: "nt_vo5" },
    { d: 90, v: ["p_mint_tall", { rate: 0.8 }], c: L("x", null, "And yes,", "we watch every one."), vo: "nt_vo6" },
  ]),

  // 49 — How many layers is a dog bowl?
  Idea49Layers: mk("i49", [
    { d: 75, v: ["print_close", { rate: 1.5 }], c: L("x", null, "How many layers", "is a dog bowl?", { size: 96 }) },
    { d: 135, v: ["p_mint_long", { startFrom: 200, rate: 2 }], c: opts("Your guess?", ["70", "300", "700", "2,000"]) },
    { d: 90, v: ["n_jam", { startFrom: 30 }], c: L("x", "C", "About 700.", "Every single one printed.", { size: 84 }) },
    { d: 90, v: ["z_green", { rate: 0.75, snapAt: 40, zoom: [1.02, 1.05] }], c: L("x", null, "A double bowl:", "6-7 hours per half.", { size: 84 }) },
    { d: 60, v: ["n_nugget_wb", { startFrom: 30 }], c: L("x", null, "Did you", "guess it?", { size: 100 }) },
  ]),

  // 61 — Explaining 3D printing to my mum
  Idea61ExplainingToMum: mk("i61", [
    { d: 60, v: ["m_grey_print2", { rate: 1.5 }], c: L("x", null, "Explaining 3D printing", "to my mum", { size: 88 }) },
    { d: 330, v: [["p_yellow", { dur: 165, startFrom: 120, rate: 1.5, zoom: [1, 1.03], window: { top: 1350, pos: "50% 60%" } }], ["p_green_asm", { dur: 165, startFrom: 60, zoom: [1, 1.03], window: { top: 1350, pos: "50% 80%" } }]],
      c: { kind: "chat", name: "Mum", status: "online · typing with one finger", light: true, top: 70, msgs: [
        { t: "so it's a printer", at: 8 }, { t: "Yes.", at: 40, me: true }, { t: "for paper", at: 72 }, { t: "For plastic. In layers.", at: 108, me: true },
        { t: "can it print a dog bowl", at: 150 }, { t: "That's literally my job.", at: 190, me: true }, { t: "how long does it take", at: 228 }, { t: "6-7 hours per half.", at: 262, me: true }, { t: "the shop takes 10 minutes", at: 296 },
      ] } },
    { d: 60, v: ["n_nugget_wb", { startFrom: 20 }], c: L("x", null, "Send this to someone", "who's had this chat.", { size: 78 }) },
  ]),

  // 69 — Design with me
  Idea69DesignWithMe: mk("i69", [
    { d: 75, v: ["p_cad_blue", { rate: 1.5 }], c: L("x", null, "Design with me:", "a dog bowl", { size: 96 }) },
    { d: 75, v: ["p_cad_blue2"], c: L("x", null, "Split it", "into two halves.") },
    { d: 90, v: ["p_cad_green", { rate: 1.4 }], c: L("x", null, "Pick colours.", "Add a name.") },
    { d: 60, v: ["print_green", { rate: 2 }], c: big("x", "Send to print.") },
    { d: 75, v: ["p_green_asm", { startFrom: 150 }], c: big("x", "Hello, Nugget.") },
  ]),

  // 70 — If filament was free
  Idea70FreeFilament: mk("i70", [
    { d: 75, v: ["b_spool_terra"], c: L("x", null, "If filament", "was free…", { size: 104 }) },
    { d: 75, v: ["p_terra_bed", { rate: 1.5 }], c: L("x", null, "…what would you", "print first?", { size: 92 }) },
    { d: 75, v: ["p_lineup", { rate: 1.2 }], c: big("x", "Wrong answers only.", { size: 88 }) },
  ]),

  // 75 — The city where it started / the city where it stayed
  Idea75StartedStayed: mk("i75", [
    { d: 75, v: ["m_cream", { startFrom: 60 }], c: L("x", null, "The city", "where it started.", { size: 92 }) },
    { d: 75, v: ["m_grey_peel", { startFrom: 420, rate: 1.3 }], c: L("x", null, "The city", "where it stayed.", { size: 92 }) },
    { d: 90, v: ["m_grey_frame2", { startFrom: 200 }], c: L("x", null, "One heart", "between them.", { size: 96 }) },
    { d: 75, v: ["m_grey_frame1", { startFrom: 60 }], c: L("x", null, "Tag the person", "you started it with.", { size: 84 }) },
  ]),

  // 78 — Best friends, different countries
  Idea78BestFriends: mk("i78", [
    { d: 75, v: ["m_cp_d", { startFrom: 20 }], c: L("x", null, "Best friends.", "Different countries.", { size: 92 }) },
    { d: 60, v: ["m_purple_hand", { startFrom: 120 }], c: big("x", "Their city.") },
    { d: 60, v: ["m_cyan_hand", { startFrom: 30 }], c: big("x", "Yours.") },
    { d: 90, v: ["m_cp_zoom", { startFrom: 60 }], c: L("x", null, "Zero distance", "on this wall.", { size: 96 }) },
    { d: 75, v: ["m_cp_b", { startFrom: 120 }], c: L("x", null, "Send this", "to your person.", { size: 96 }) },
  ]),
};

// ---- Batch 6: quality-control reel built on the workshop clip of Amy watching the bench, plus Spanish versions ----
const qc = (music: string, t: string[][], stampLines: [string, string]) => mk(music, [
  { d: 75, v: ["qc_new", { rate: 0.8, zoom: [1, 1.04] }], c: L("qc_new", null, t[0][0], t[0][1]) },
  { d: 60, v: ["print_close", { rate: 1.5, zoom: [1.08, 1.2] }], c: L("x", null, t[1][0], t[1][1]) },
  { d: 60, v: ["z_pink", { snapAt: 30, zoom: [1.02, 1.05] }], c: L("x", null, "", t[2][0], { bAt: 26, size: 104 }) },
  { d: 75, v: ["qc_new", { startFrom: 70, rate: 0.8, zoom: [1, 1.04] }], c: L("qc_new", null, t[3][0], t[3][1]) },
  { d: 60, v: ["dog", { startFrom: 60 }], c: L("dog", null, "", t[4][0], { bAt: 3, size: 76 }) },
  { d: 60, v: ["box", { rate: 0.72, zoom: [1.02, 1.1] }], c: { kind: "stamp", lines: stampLines, at: 5 } },
  { d: 75, v: ["qc_new", { startFrom: 125, rate: 0.55, zoom: [1.04, 1.1] }], c: L("qc_new", null, t[5][0], t[5][1]) },
]);

const pickEs = (clip: string, o: any, color: string, a: string, b: string) => ({ d: 90, v: [clip, o] as V, c: L(clip, color, a, b, { size: 80 }) });

export const batch6: Record<string, ReelConfig> = {
  QualityControl: qc("qc_en", [["Every order has", "a supervisor."], ["She watches", "every layer."], ["Every snap."], ["Every move", "we make."], ["Every bowl."], ["Quality control", "never blinks."]], ["QUALITY CHECK", "Approved"]),
  QualityControlEs: qc("qc_es", [["Cada pedido tiene", "una supervisora."], ["Vigila", "cada capa."], ["Cada clic."], ["Cada cosa", "que hacemos."], ["Cada cuenco."], ["Control de calidad:", "nunca parpadea."]], ["CONTROL DE CALIDAD", "Aprobado"]),

  // "Pick a bowl" in Spanish
  EsEligeUnCuenco: mk("es_pick", [
    { d: 75, v: [["n_orange", { startFrom: 60, dur: 15 }], ["n_blue2", { startFrom: 70, dur: 15 }], ["n_green", { startFrom: 70, dur: 15 }], ["n_mint", { startFrom: 60, dur: 15 }], ["n_pinkbg", { startFrom: 100, dur: 15 }]],
      c: { kind: "words", top: 300, size: 100, words: [{ t: "Elige un cuenco.", at: 2 }, { t: "Adivino cómo es", at: 30, br: true, size: 76 }, { t: "tu perro.", at: 38, pink: true, br: true, size: 76 }] } },
    pickEs("n_orange", { zoom: [1.17, 1.22], y: 150 }, "Naranja", "Carreras a las 3 a. m.", "Cero remordimientos."),
    pickEs("n_blue2", {}, "Azul", "Te juzga en silencio.", "Siempre tiene razón."),
    pickEs("n_green", {}, "Verde", "Se hace el hambriento.", "Comió hace diez minutos."),
    pickEs("n_mint", { zoom: [1.14, 1.19], y: 120 }, "Menta", "Un angelito.", "Roba calcetines."),
    { d: 90, v: ["dog", { startFrom: 20 }], c: L("dog", "Rosa", "La jefa.", "Tú solo vives en su casa.") },
    { d: 60, v: ["n_pinkbg", { startFrom: 20, rate: 1.3 }], c: L("x", null, "¿Cuál es", "el tuyo?", { size: 100 }) },
  ]),

  // "Texts I'd get if my dog had a phone" in Spanish
  EsMensajes: mk("es_texts", [
    { d: 60, v: ["dog2"], c: L("dog2", null, "Mensajes que recibiría", "si mi perra tuviera móvil", { size: 56 }) },
    { d: 300, v: [["d_sofa", { dur: 150, startFrom: 55, rate: 0.5, zoom: [1, 1.03], window: { top: 1180, pos: "50% 42%" } }], ["d_balcony", { dur: 150, zoom: [1, 1.03], window: { top: 1180, pos: "50% 55%" } }]],
      c: { kind: "chat", name: "Amy", status: "en línea · esperando en la puerta", light: true, top: 70, msgs: [
        { t: "dónde estás", at: 8 }, { t: "llevas 4 horas fuera", at: 44 }, { t: "Han pasado 6 minutos.", at: 84, me: true },
        { t: "el cuenco está vacío", at: 126 }, { t: "Comiste a las 6.", at: 166, me: true }, { t: "esa era otra yo", at: 204 }, { t: "vuelve. trae queso.", at: 246 },
      ] } },
    { d: 60, v: ["d_tongue"], c: L("d_tongue", null, "¿Qué te escribiría", "el tuyo?", { size: 88 }) },
  ]),

  // "Things I rejected this week" in Spanish
  EsRechazado: mk("es_rejected", [
    { d: 60, v: ["d_studio", { startFrom: 10, origin: "50% 0%" }], c: L("d_studio", null, "Cosas que he rechazado", "esta semana", { size: 66 }) },
    { d: 60, v: ["d_laptop", { startFrom: 20 }], c: stamp("EL PORTÁTIL", "Rechazado", 0, 440) },
    { d: 60, v: ["d_kayak"], c: stamp("EL BARCO", "Rechazado", 0, -500) },
    { d: 60, v: ["dog2"], c: stamp("UN CUENCO VACÍO", "Rechazado", 270, -560, 0.5) },
    { d: 60, v: ["d_grass", { startFrom: 60 }], c: stamp("COMPARTIR EL FRISBEE", "Rechazado", 0, 380) },
    { d: 60, v: ["d_balcony", { startFrom: 30 }], c: stamp("ENTRAR EN CASA", "Rechazado", 0, -520) },
    { d: 90, v: ["d_treat", { startFrom: 300 }], c: stamp("ESTO, EN CAMBIO", "Aprobado", 0, 560) },
  ]),

  // "Things in my house that belong to the dog now" in Spanish
  EsYaEsSuyo: mk("es_owns", [
    { d: 75, v: ["dog2"], c: L("dog2", null, "Cosas de mi casa que", "ahora son de la perra", { size: 58 }) },
    { d: 60, v: ["d_sofa", { startFrom: 60 }], c: big("d_sofa", "El sofá.", { size: 110, top: 1340 }) },
    { d: 60, v: ["d_laptop", { startFrom: 20 }], c: big("d_laptop", "Mi portátil.", { size: 110, top: 1200 }) },
    { d: 60, v: ["d_balcony", { startFrom: 20 }], c: big("d_balcony", "El balcón.", { size: 110, top: 240 }) },
    { d: 60, v: ["d_kayak"], c: big("d_kayak", "El barco.", { size: 110, top: 260 }) },
    { d: 60, v: ["d_treat", { startFrom: 300 }], c: big("d_treat", "Mis snacks.", { size: 110, top: 1300 }) },
    { d: 60, v: ["d_studio", { startFrom: 10, origin: "50% 0%" }], c: big("d_studio", "Yo.", { size: 110, top: 105 }) },
    { d: 90, v: ["name", { startFrom: 20 }], c: L("x", null, "Al menos su cuenco", "lleva su nombre.") },
  ]),

  // "Home is two places" in Spanish
  EsDosLugares: mk("es_homes", [
    { d: 75, v: ["m_cream", { rate: 1.2 }], c: big("x", "De donde eres.", { size: 92 }) },
    { d: 75, v: ["m_grey_peel", { startFrom: 300, rate: 1.5 }], c: big("x", "Donde vives.", { size: 92 }) },
    { d: 90, v: ["m_grey_frame2", { startFrom: 120 }], c: L("x", null, "No tienes que", "elegir.", { size: 92 }) },
    { d: 75, v: ["m_grey_frame1", { startFrom: 150 }], c: L("x", null, "Tu hogar son", "dos lugares.", { size: 100 }) },
    { d: 60, v: ["m_cp_b", { startFrom: 30 }], c: L("x", null, "¿Cuáles son", "los tuyos?", { size: 100 }) },
  ]),
};

// ---- Batch 7: oddly-satisfying set — pulling prints off the bed, slow snaps, printing in every colour. Almost no text. ----
const pull = (clip: string, startFrom: number, rate: number, c?: any) => ({ d: 75, v: [clip, { startFrom, rate, zoom: [1.02, 1.08] }] as V, c });
const col = (clip: string, startFrom: number, rate: number, name: string) =>
  ({ d: 45, v: [clip, { startFrom, rate, zoom: [1.04, 1.12] }] as V, c: { kind: "words", top: 280, size: 96, words: [{ t: name, at: 0, pink: true }] } });

export const batch7: Record<string, ReelConfig> = {
  // pulling finished bowl parts off the printer
  SatisfyingPeel: mk("sat_peel", [
    pull("peel", 0, 1.6, L("x", null, "The best part", "of the job.", { size: 96 })),
    pull("p_green_peel", 80, 2),
    pull("p_terra_peel", 30, 2.5),
    pull("p_mint_remove", 30, 1.6),
    pull("p_yellow_remove", 120, 1.6),
    pull("p_tan_peel", 30, 2, L("x", null, "", "Which colour next?", { bAt: 20, size: 88 })),
  ]),

  // peeling printed cities off the bed
  SatisfyingMapPeel: mk("sat_maps", [
    { d: 90, v: ["m_grey_peel", { rate: 3, zoom: [1.02, 1.08] }], c: L("x", null, "Peeling a city", "off the printer.", { size: 92 }) },
    { d: 90, v: ["m_cyan_peel", { startFrom: 60, rate: 3, zoom: [1.02, 1.08] }] },
    { d: 90, v: ["m_purple_peel", { rate: 3, zoom: [1.02, 1.08] }], c: L("x", null, "", "One more?", { bAt: 50, size: 100 }) },
  ]),

  // five snaps in slow motion; each lands at local frame 60
  SatisfyingSlowSnaps: mk("sat_snaps", ["z_pink", "z_orange", "z_green", "z_blue", "z_mint"].map((clip, i) => ({
    d: 90, v: [clip, { rate: 0.5, snapAt: 60, zoom: [1.04, 1.16] }] as V,
    c: i === 0 ? L("x", null, "Snaps,", "but slow.", { size: 104 }) : i === 4 ? L("x", null, "", "Favourite?", { bAt: 66, size: 100 }) : undefined,
  }))),

  // printing in every colour, one beat-and-a-half each
  SatisfyingColours: mk("sat_colours", [
    col("print_close", 0, 1.5, "Cream"),
    col("print_green", 30, 1.5, "Olive"),
    col("print_blue2", 80, 1, "Blue"),
    col("p_mint_long", 330, 2, "Mint"),
    col("p_yellow", 180, 2, "Yellow"),
    col("p_terra_bed", 90, 1.5, "Terracotta"),
    { d: 75, v: ["p_lineup", { rate: 1.2 }], c: L("x", null, "Which one", "is yours?", { size: 100 }) },
  ]),

  // close-ups of the nozzle, slowed down
  SatisfyingJustWatch: mk("sat_watch", [
    { d: 120, v: ["print_close", { startFrom: 60, rate: 0.6, zoom: [1.15, 1.3] }], c: { kind: "words", dur: 60, top: 280, size: 110, words: [{ t: "Just", at: 2 }, { t: "watch.", at: 12, pink: true }] } },
    { d: 120, v: ["p_mint_long", { startFrom: 420, rate: 0.8, zoom: [1.1, 1.25] }] },
    { d: 120, v: ["print_blue", { startFrom: 20, rate: 0.6, zoom: [1.02, 1.12] }] },
  ]),
};

// ---- Batch 8: forty more. S() = one scene: duration, clip, optional pink label, one or two lines. ----
const S = (d: number, clip: string, label: string | null, a: string, b?: string, v: any = {}, o: any = {}) => ({ d, v: [clip, v] as V, c: L(clip, label, a, b, o) });
const FACE = { startFrom: 60 };               // d_sofa close-up of the face
const BEG = { startFrom: 210 };               // d_treat: staring at the snack
const WIDE = { top: 240 };                    // caption on top for wide shots where the dog sits low
const chatWin = (clip: string, dur: number, pos: string, o: any = {}) => [clip, { dur, zoom: [1, 1.03], window: { top: 1180, pos }, ...o }] as V;
const ab = (d: number, a: [string, any, string], b: [string, any, string], title: string) => ({
  d, v: [[a[0], { ...a[1], dur: d / 2 }], [b[0], { ...b[1], dur: d / 2 }]] as V[],
  c: [{ kind: "words", top: 250, size: 76, words: [{ t: title, at: 2 }] }, { kind: "words", dur: d / 2, top: 360, size: 96, words: [{ t: "A · " + a[2], at: 2, pink: true }] }, { kind: "words", top: 360, size: 96, words: [{ t: "B · " + b[2], at: d / 2 + 2, pink: true }] }],
});

export const batch8: Record<string, ReelConfig> = {
  N01DogCeo: mk("n01", [
    S(60, "d_studio", null, "If my dog", "ran the company", { startFrom: 10, origin: "50% 0%" }),
    S(75, "d_sofa", "Meetings", "On the sofa.", "Lying down.", FACE),
    S(75, "d_marina", "Dress code", "Harness.", "Pink.", { rate: 0.55 }),
    S(75, "d_treat", "Lunch break", "All day.", "Mandatory.", BEG),
    S(75, "d_kayak", "Remote work", "From a boat.", undefined, {}),
    S(75, "dog", "Annual bonus", "", "A full bowl.", { startFrom: 30 }, { size: 60 }),
    S(60, "d_tongue", null, "Would you", "work for her?", {}, { size: 96 }),
  ]),
  N02WhyStaring: mk("n02", [
    S(60, "d_sofa", null, "Reasons my dog", "is staring at me", FACE),
    S(75, "d_treat", "Reason 1", "I have food.", undefined, BEG),
    S(75, "d_laptop", "Reason 2", "I'm working.", "Unacceptable.", { startFrom: 20 }),
    S(75, "dog2", "Reason 3", "", "It's 5:59.", {}, { size: 60 }),
    S(75, "d_balcony", "Reason 4", "I went inside", "without her.", { startFrom: 20 }),
    S(75, "d_studio", "Reason 5", "No reason.", undefined, { startFrom: 10, origin: "50% 0%" }, { inline: true, size: 58 }),
  ]),
  N03DogTranslator: mk("n03", [
    S(60, "d_marina", null, "Dog to human", "translator", {}, { size: 100 }),
    S(75, "d_tongue", "“Woof.”", "Feed me."),
    S(75, "d_marina", "“Woof woof.”", "A bird.", "Two kilometres away.", { startFrom: 60 }, { top: 1420 }),
    S(75, "d_sofa", "*sigh*", "You have", "disappointed me.", FACE),
    S(75, "d_treat", "*stare*", "That's mine.", "You know it's mine.", BEG),
    S(75, "dog2", "*silence*", "", "Something is being destroyed.", {}, { size: 52 }),
  ]),
  N04NapReviews: mk("n04", [
    S(60, "d_sofa", null, "Places I've napped,", "reviewed", { rate: 0.8 }, WIDE),
    { d: 90, v: ["d_sofa", win("50% 40%", { startFrom: 60, rate: 0.6 })], c: rv("The sofa", 5, "Not allowed. Excellent.") },
    { d: 90, v: ["d_laptop", win("50% 35%", { startFrom: 20 })], c: rv("The laptop", 3, "Warm. Humans complain.") },
    { d: 90, v: ["d_grass", win("50% 20%", { startFrom: 40 })], c: rv("The lawn", 4, "Good smells. Bring a frisbee.") },
    { d: 90, v: ["d_kayak", win("50% 90%", {})], c: rv("The boat", 2, "Wobbly. No blanket.") },
    { d: 90, v: ["d_balcony", win("50% 55%", { startFrom: 20 })], c: rv("The balcony chair", 5, "Sun. View. Mine now.") },
    S(60, "d_tongue", null, "Where does", "yours nap?", {}, { size: 96 }),
  ]),
  N05ToxicTraits: mk("n05", [
    S(60, "d_studio", null, "My dog's", "toxic traits", { startFrom: 10, origin: "50% 0%" }, { size: 80 }),
    S(75, "d_laptop", null, "Sits on", "my work.", { startFrom: 20 }),
    S(75, "d_treat", null, "Eye contact", "while I eat.", BEG),
    S(75, "d_grass", null, "Wants the frisbee thrown.", "Won't bring it back.", { startFrom: 40 }, { size: 70 }),
    S(75, "d_sofa", null, "Takes the whole sofa.", "Sighs at me.", FACE, { size: 76 }),
    S(75, "dog", null, "", "Still the best thing in the house.", { startFrom: 30 }, { size: 52 }),
  ]),
  N06StarterPack: mk("n06", [
    S(45, "d_tongue", null, "Dog parent", "starter pack", {}, { size: 96 }),
    { d: 240, v: [["d_balcony", { dur: 120 }], ["d_marina", { dur: 120 }]], c: { kind: "bingo", title: "Starter pack", step: 20, cells: ["Hair on everything", "800 photos of one nap", "A voice for the dog", "Treats in every pocket", "(spoiled)", "Cancelled plans", "Bowl with their name", "Talks about poop", "“She's not spoiled”"] } },
    S(75, "dog2", null, "How many do you own?", "Tag one who has them all.", {}, { size: 56 }),
  ]),
  N07MainCharacter: mk("n07", [
    S(60, "d_lake", null, "Signs your dog is", "the main character", {}, { size: 88 }),
    S(75, "d_marina", null, "Wind in the ears.", "Every single walk.", { rate: 0.55 }),
    S(75, "d_kayak", null, "Sits at the front", "of the boat."),
    S(75, "d_studio", null, "Gets carried.", "Like luggage. Like royalty.", { startFrom: 10, origin: "50% 0%" }, { size: 60 }),
    S(75, "d_rocks", null, "Poses on", "every mountain."),
    S(75, "name", null, "Has her name", "on the bowl.", { startFrom: 20 }),
  ]),
  N08ThisOrThat: mk("n08", [
    S(60, "d_tongue", null, "This or that:", "dog edition", {}, { size: 96 }),
    S(75, "d_sofa", "Sleeps", "On the sofa", "or on you?", FACE),
    S(75, "d_treat", "Begs", "With the eyes", "or with the paw?", BEG),
    S(75, "d_swim", "Water", "Jumps in", "or just watches?", {}, { top: 230, size: 76 }),
    S(75, "d_grass", "Fetch", "Brings it back", "or keeps it?", { startFrom: 40 }),
    S(75, "dog2", "Dinner", "", "Inhales it or negotiates?", {}, { size: 54 }),
    S(60, "d_balcony", null, "Send it to someone", "who has to answer.", { startFrom: 20 }, { size: 80 }),
  ]),
  N09OutOfOffice: mk("n09", [
    S(60, "dog", null, "Asking the Head of QC", "a quick question", { startFrom: 20 }, { size: 58 }),
    { d: 270, v: [chatWin("d_kayak", 135, "50% 95%"), chatWin("d_swim", 135, "50% 40%")], c: { kind: "chat", name: "Amy", status: "out of office", light: true, top: 70, msgs: [
      { t: "Amy, did you check the orders?", at: 8, me: true }, { t: "out of office", at: 50 }, { t: "Until when?", at: 88, me: true }, { t: "on a boat", at: 124 },
      { t: "That's not a date.", at: 162, me: true }, { t: "back never. send snacks.", at: 204 },
    ] } },
    S(60, "d_lake", null, "Tag a coworker", "who's like this.", {}, { size: 88 }),
  ]),
  N10JudgesMe: mk("n10", [
    S(60, "d_sofa", null, "Things my dog", "judges me for", FACE),
    S(75, "d_laptop", null, "My typing", "speed.", { startFrom: 20 }),
    S(75, "d_treat", null, "Eating", "without sharing.", BEG),
    S(75, "dog2", null, "", "Serving dinner at 6:02.", {}, { size: 62 }),
    S(75, "d_balcony", null, "Going inside", "too early.", { startFrom: 20 }),
    S(75, "d_studio", null, "Putting her down.", undefined, { startFrom: 10, origin: "50% 0%" }, { size: 72 }),
  ]),
  N11AmysWeek: mk("n11", [
    S(60, "d_studio", null, "My dog's", "week ahead", { startFrom: 10, origin: "50% 0%" }, { size: 80 }),
    S(60, "d_sofa", "Monday", "Rest.", undefined, FACE),
    S(60, "d_laptop", "Tuesday", "Help with emails.", undefined, { startFrom: 20 }),
    S(60, "d_treat", "Wednesday", "Negotiate snacks.", undefined, BEG),
    S(60, "d_grass", "Thursday", "Guard the frisbee.", undefined, { startFrom: 40 }),
    S(60, "d_kayak", "Friday", "Leave early. Boat."),
    S(75, "d_rocks", "Weekend", "Conquer a mountain."),
  ]),
  N12TheWWord: mk("n12", [
    S(75, "d_sofa", null, "Me: “Do you want to go", "for a w-”", FACE, { size: 72 }),
    S(60, "d_tongue", null, "", "Her:", {}, { bAt: 2, size: 110 }),
    { d: 30, v: ["d_hill"] }, { d: 30, v: ["d_rocks"] }, { d: 30, v: ["d_swim", { startFrom: 30 }] }, { d: 30, v: ["d_kayak"] },
    S(75, "d_lake", null, "Four hours later.", "Still not tired.", {}, { size: 88 }),
  ]),
  N13TravelReviews: mk("n13", [
    S(60, "d_lake", null, "Amy reviews", "her holidays", {}, { size: 96 }),
    { d: 90, v: ["d_swim", win("50% 40%")], c: rv("The lake", 5, "Wet. Cold. Perfect.") },
    { d: 90, v: ["d_kayak", win("50% 90%")], c: rv("Boat trip", 2, "No squirrels. Just water.") },
    { d: 90, v: ["d_rocks", win("50% 85%")], c: rv("The mountain", 4, "Great smells. Too many stairs.") },
    { d: 90, v: ["d_marina", win("50% 70%")], c: rv("The marina", 3, "Boats I'm not allowed on.") },
    { d: 90, v: ["dog2", win("50% 50%")], c: rv("Home", 5, "Has my bowl. Nothing beats it.") },
  ]),
  N14GreenFlags: mk("n14", [
    S(60, "d_tongue", null, "Green flags", "in a dog owner", {}, { size: 96 }),
    S(75, "d_studio", null, "Carries the dog", "when she's “tired”.", { startFrom: 10, origin: "50% 0%" }, { size: 62 }),
    S(75, "d_treat", null, "Always has", "a snack on them.", BEG),
    S(75, "d_kayak", null, "Plans holidays", "around the dog."),
    S(75, "d_laptop", null, "Lets her join", "the meeting.", { startFrom: 20 }),
    S(75, "name", null, "Put her name", "on the bowl.", { startFrom: 20 }),
  ]),

  N15BowlOrNot: mk("n15", [
    S(60, "p_yellow0", null, "Bowl or", "not a bowl?", { rate: 1.6 }, { size: 104 }),
    S(60, "p_yellow", null, "", "Bowl.", { startFrom: 200, rate: 2 }, { bAt: 30, size: 120 }),
    S(60, "m_grey_print", null, "", "Not a bowl. A city.", { startFrom: 60, rate: 2 }, { bAt: 30, size: 84 }),
    S(60, "p_terra_bed", null, "", "Bowl.", { rate: 1.5 }, { bAt: 30, size: 120 }),
    S(60, "m_purple_macro", null, "", "Also a city.", {}, { bAt: 30, size: 100 }),
    S(75, "p_mint_long", null, "Bowl.", "You're getting good at this.", { startFrom: 330, rate: 2 }, { size: 76 }),
  ]),
  N16GuessTheName: mk("n16", [
    S(60, "p_lineup", null, "Guess the name", "on the bowl", { rate: 1.3 }, { size: 96 }),
    { d: 120, v: ["c_green", { startFrom: 0, rate: 0.7, zoom: [1.3, 1.34], y: 300 }], c: opts("Green one?", ["Kale", "Pickle", "Nugget", "Shrek"]) },
    S(60, "n_nugget_wb", null, "", "Nugget.", { startFrom: 30 }, { bAt: 2, size: 120 }),
    { d: 120, v: ["c_mint", { rate: 0.6, zoom: [1.3, 1.34], y: 300 }], c: opts("Mint one?", ["Minty", "Jam", "Toothpaste", "Pistachio"]) },
    S(60, "n_jam", null, "", "Jam.", { startFrom: 60 }, { bAt: 2, size: 120 }),
    S(60, "n_pinkbg", null, "What would", "yours say?", { startFrom: 20 }, { size: 100 }),
  ]),
  N17BowlPersonalities: mk("n17", [
    S(60, "p_lineup", null, "If our colours", "were people", { rate: 1.3 }, { size: 96 }),
    S(75, "n_orange", "Orange", "Talks too loud.", "Great at parties.", { startFrom: 60, zoom: [1.17, 1.22], y: 150 }),
    S(75, "n_blue2", "Blue", "Has a spreadsheet", "for everything.", { startFrom: 60 }),
    S(75, "c_mint", "Mint", "Does yoga.", "Tells you about it.", { startFrom: 10 }),
    S(75, "b_terra2", "Terracotta", "Just got back", "from Tuscany.", { startFrom: 150 }),
    S(75, "n_pinkbg", "Pink", "Main character.", "Knows it.", { startFrom: 20 }),
    S(60, "b_yp2", null, "Which one", "are you?", { startFrom: 20 }, { size: 100 }),
  ]),
  N18VoteCombo: mk("n18", [
    S(60, "p_lineup", null, "You pick", "the next colour combo", { rate: 1.3 }, { size: 84 }),
    ab(120, ["n_orange", { startFrom: 60, zoom: [1.17, 1.22], y: 150 }, "Orange"], ["n_blue2", { startFrom: 60 }, "Blue"], "Round 1"),
    ab(120, ["c_green", { startFrom: 20 }, "Olive + pink"], ["b_terra2", { startFrom: 5 }, "Terracotta"], "Round 2"),
    ab(120, ["c_mint", { startFrom: 10 }, "Mint"], ["b_yp2", { startFrom: 20 }, "Purple + yellow"], "Final"),
    S(60, "n_pinkbg", null, "Comment", "your three letters.", { startFrom: 20 }, { size: 92 }),
  ]),
  N19StartedGoing: mk("n19", [
    S(75, "p_cad_green", "How it started", "A file on a laptop.", undefined, { rate: 1.5 }),
    S(75, "dog2", "How it's going", "", "Dinner.", {}, { size: 60 }),
    S(75, "spool", "How it started", "A roll of plastic.", undefined, { startFrom: 10 }),
    S(75, "c_mint", "How it's going", "Jam's bowl.", undefined, { startFrom: 10 }),
    S(75, "m_grey_print2", "How it started", "One thin layer.", undefined, { rate: 1.5 }),
    S(75, "m_grey_frame1", "How it's going", "Two cities, one wall.", undefined, { startFrom: 60 }),
  ]),
  N20StartToFinish: mk("n20", [
    S(60, "b_spool_terra", null, "", "Spool.", {}, { bAt: 2, size: 120 }),
    S(60, "p_terra_bed", null, "", "Print.", { rate: 1.6 }, { bAt: 2, size: 120 }),
    S(60, "p_terra_peel", null, "", "Peel.", { startFrom: 30, rate: 2.5 }, { bAt: 2, size: 120 }),
    S(60, "b_terra_asm", null, "", "Snap.", { startFrom: 30, rate: 1.6 }, { bAt: 2, size: 120 }),
    S(75, "b_terra2", null, "", "Dinner.", { startFrom: 150 }, { bAt: 2, size: 120 }),
  ], [{ kind: "progress", from: 0, dur: 240 }]),
  N21PackWithMe: mk("n21", [
    S(75, "n_pack", null, "Pack an order", "with us.", { rate: 2.5 }, { size: 100 }),
    { d: 75, v: ["n_pack", { startFrom: 190, rate: 2.5 }] },
    { d: 75, v: ["n_pack", { startFrom: 330, rate: 2 }] },
    { d: 60, v: ["box", { rate: 0.72, zoom: [1.02, 1.1] }], c: { kind: "stamp", lines: ["QUALITY CHECK", "Approved"], at: 5 } },
    S(75, "qc_new", null, "Supervised,", "as always.", { startFrom: 125, rate: 0.55 }),
  ]),
  N22WhichHalf: mk("n22", [
    S(75, "z_pink", null, "Left: food.", "Right: water.", { snapAt: 30, zoom: [1.02, 1.05] }),
    S(75, "z_blue", null, "Or left: food.", "Right: more food.", { snapAt: 30, zoom: [1.02, 1.05] }),
    S(75, "z_orange", null, "Or one each,", "for two dogs.", { snapAt: 30, zoom: [1.02, 1.05] }),
    S(75, "dog2", null, "", "What goes in yours?", {}, { size: 62 }),
  ]),

  N23ExpectationReality: mk("n23", [
    S(60, "n_workshop", null, "3D printing:", "expectation vs reality", { rate: 2 }, { size: 84 }),
    S(75, "p_cad_blue", "Expectation", "Press print.", "Done.", { rate: 1.5 }),
    S(75, "p_mint_long", "Reality", "Watch it", "for 6-12 hours.", { startFrom: 200, rate: 2 }),
    S(75, "p_mint_remove", "Expectation", "It pops", "right off.", { rate: 1.6 }),
    S(75, "p_sup_grey", "Reality", "Twenty minutes", "of this.", { rate: 1.5 }),
    S(75, "n_jam", null, "Worth it.", "Every time.", { startFrom: 40 }, { size: 100 }),
  ]),
  N24PrinterSounds: mk("n24", [
    S(60, "print_close", null, "Printer sounds,", "translated", { rate: 1.3 }, { size: 96 }),
    S(75, "p_yellow", "“Bzzzt.”", "Working.", "Leave me alone.", { startFrom: 180, rate: 1.5 }),
    S(75, "m_cyan_print", "“Click.”", "Thinking.", undefined, { startFrom: 60 }),
    S(75, "p_terra_bed", "“Whirr.”", "Nearly there.", "(Three more hours.)", {}),
    S(75, "p_mint_tall", "Silence", "Done.", "Or something is very wrong.", {}, { size: 76 }),
  ]),
  N25StagesOfWaiting: mk("n25", [
    S(60, "p_mint_load", null, "Stages of waiting", "for a print", { startFrom: 60, rate: 3 }, { size: 92 }),
    S(75, "p_mint_long", "Hour 1", "Excited.", undefined, { rate: 2 }),
    S(75, "p_mint_long", "Hour 3", "Just checking.", undefined, { startFrom: 240, rate: 2 }),
    S(75, "p_mint_long", "Hour 6", "Checking again.", undefined, { startFrom: 450, rate: 2 }),
    S(75, "p_mint_tall", "Hour 9", "It's fine.", "I'm fine."),
    S(75, "p_mint_remove", "Done", "Start another one", "immediately.", { rate: 1.6 }),
  ]),
  N26TalkToPrinter: mk("n26", [
    S(60, "m_purple_print", null, "Things I say", "to my printer", { rate: 1.5 }, { size: 100 }),
    S(75, "m_cyan_print", null, "“Good first layer.", "Proud of you.”", { startFrom: 40 }, { size: 80 }),
    S(75, "p_yellow", null, "“Please", "don't.”", { startFrom: 150, rate: 1.5 }, { size: 104 }),
    S(75, "p_terra_bed", null, "“You've", "got this.”", {}, { size: 104 }),
    S(75, "print_close", null, "“We don't talk", "about last week.”", { rate: 1.3 }, { size: 84 }),
    S(60, "p_mint_tall", null, "What do you say", "to yours?", {}, { size: 88 }),
  ]),
  N27SpoolToBowl: mk("n27", [
    S(60, "b_spool_terra", null, "What will", "it become?", {}, { size: 104 }),
    S(60, "b_terra", null, "", "This.", { startFrom: 60 }, { bAt: 2, size: 120 }),
    S(60, "spool", null, "", "And this one?", { startFrom: 10 }, { bAt: 2, size: 100 }),
    S(60, "c_mint", null, "", "This.", { startFrom: 10 }, { bAt: 2, size: 120 }),
    S(60, "b_spools", null, "", "And these two?", {}, { bAt: 2, size: 100 }),
    S(75, "b_terra_asm", null, "One bowl,", "two colours.", { startFrom: 150 }, { size: 100 }),
  ]),
  N28Layers700: mk("n28", [
    S(60, "print_green", null, "700 layers.", "Twelve seconds.", { rate: 2 }, { size: 100 }),
    { d: 60, v: ["print_green", { startFrom: 60, rate: 2.5 }] },
    { d: 75, v: ["p_green_peel", { startFrom: 80, rate: 2 }] },
    { d: 75, v: ["p_green_asm", { startFrom: 60, rate: 1.6 }] },
    S(90, "n_nugget_wb", null, "Layer 700:", "Nugget's dinner.", { startFrom: 20 }, { size: 92 }),
  ], [{ kind: "progress", from: 0, dur: 270 }]),
  N29DetailsNobodyNotices: mk("n29", [
    S(60, "n_pinkbg", null, "Details nobody notices", "(we do)", { startFrom: 20 }, { size: 84 }),
    S(75, "name", "1", "The name is printed in,", "not stuck on.", { startFrom: 20 }, { size: 76 }),
    S(75, "z_mint", "2", "The steel bowl", "lifts out.", { snapAt: 30, zoom: [1.02, 1.05] }),
    S(75, "c_green", "3", "The base is", "a second colour.", { startFrom: 20 }),
    S(75, "z_pink", "4", "Two halves.", "One snap.", { snapAt: 30, zoom: [1.02, 1.05] }),
    S(60, "p_lineup", null, "Which one did", "you spot first?", { rate: 1.2 }, { size: 88 }),
  ]),
  N30WhyTwoHalves: mk("n30", [
    S(75, "z_orange", null, "Why is it", "in two halves?", { snapAt: 30, zoom: [1.02, 1.05] }, { size: 100 }),
    S(75, "z_blue", "1", "Two colours.", "Your pick.", { snapAt: 30, zoom: [1.02, 1.05] }),
    S(75, "p_green_peel", "2", "Each half fits", "on the printer.", { startFrom: 80, rate: 2 }),
    S(75, "z_green", "3", "And this", "never gets old.", { rate: 0.6, snapAt: 50, zoom: [1.04, 1.12] }),
  ]),

  N32CloserThanTheyLook: mk("n32", [
    S(75, "m_purple_hand", null, "Far apart", "on a map.", { startFrom: 30 }, { size: 104 }),
    S(75, "m_cyan_hand", null, "Hours apart", "by plane.", {}, { size: 104 }),
    S(90, "m_cp_zoom", null, "Side by side", "on a wall.", { startFrom: 120 }, { size: 104 }),
    S(75, "m_cp_b", null, "Who's in", "your other city?", { startFrom: 60 }, { size: 96 }),
  ]),
  N33SmallGift: mk("n33", [
    S(75, "m_cp_b", null, "“It's just", "a small thing.”", {}, { size: 100 }),
    S(75, "m_cp_a", null, "", "The small thing:", { startFrom: 20 }, { bAt: 3, size: 96 }),
    S(90, "m_cp_zoom", null, "The street where you met.", "And the one you live on now.", { startFrom: 150 }, { size: 68 }),
    S(75, "m_cp_d", null, "Send this to someone", "who needs a hint.", { startFrom: 150 }, { size: 80 }),
  ]),
  N34MovedAway: mk("n34", [
    S(75, "m_cream", null, "", "You moved away.", { rate: 1.2 }, { bAt: 3, size: 96 }),
    S(75, "m_grey_peel", null, "", "They stayed.", { startFrom: 420, rate: 1.3 }, { bAt: 3, size: 100 }),
    S(90, "m_grey_frame2", null, "Still on", "the same wall.", { startFrom: 200 }, { size: 100 }),
    S(75, "m_grey_frame1", null, "Send this to", "the one who stayed.", { startFrom: 60 }, { size: 84 }),
  ]),
  N35PaletteVote: mk("n35", [
    S(60, "m_cp_c", null, "Same idea.", "Three palettes.", { startFrom: 30 }, { size: 100 }),
    S(75, "m_grey_frame1", "A", "Stone + red heart", undefined, { startFrom: 30 }),
    S(75, "m_cp_b", "B", "Sky + lilac", undefined, { startFrom: 60 }),
    S(75, "m_cream", "C", "All cream", undefined, { startFrom: 30 }),
    S(60, "m_grey_frame2", null, "A, B or C?", undefined, { startFrom: 200 }, { size: 110 }),
  ]),
  N36GiftsRanked: mk("n36", [
    S(60, "m_cp_d", null, "Anniversary gifts,", "ranked by lifespan", { startFrom: 20 }, { size: 84 }),
    S(75, "b_coffee", "A fancy coffee", "Ten minutes."),
    S(75, "d_treat", "Chocolate", "One evening.", "(The dog is watching.)", BEG),
    S(90, "m_cp_zoom", "Your two cities", "On the wall", "for good.", { startFrom: 120 }),
    S(60, "m_cp_c", null, "What's the best gift", "you ever got?", { startFrom: 60 }, { size: 80 }),
  ]),
  N37WhereHeartGoes: mk("n37", [
    S(75, "m_grey_frame1", null, "Where does", "the heart go?", { rate: 1.3 }, { size: 104 }),
    { d: 150, v: ["m_grey_frame2", { zoom: [1.3, 1.34], y: 300 }], c: opts("The heart goes…", ["Where we met", "Exactly halfway", "At the airport", "On the good bakery"]) },
    S(75, "m_cp_a", null, "Where would", "you put yours?", { startFrom: 60 }, { size: 96 }),
  ]),
  N38EveryCouple: mk("n38", [
    S(60, "m_cp_b", null, "Every couple", "has two cities", {}, { size: 100 }),
    S(75, "m_cyan_hand", null, "", "Where you met.", {}, { bAt: 3, size: 96 }),
    S(75, "m_purple_hand", null, "Where you argued", "about furniture.", { startFrom: 60 }, { size: 84 }),
    S(75, "m_purple_close", null, "", "Where you made up.", {}, { bAt: 3, size: 92 }),
    S(90, "m_cp_zoom", null, "Which two", "are yours?", { startFrom: 150 }, { size: 100 }),
  ]),

  N39EsBingo: mk("n39", [
    S(45, "d_sofa", null, "Bingo perruno:", "¿cuántas hoy?", FACE, { size: 92 }),
    { d: 240, v: [["d_treat", { startFrom: 150, dur: 120 }], ["d_laptop", { dur: 120 }]], c: { kind: "bingo", title: "Bingo perruno", step: 20, cells: ["Robó un calcetín", "Ladró a la nada", "Pidió en la cena", "Carreras a las 22 h", "Fue adorable (gratis)", "Se sentó en el portátil", "Ignoró su nombre", "Ocupó toda la cama", "Se hizo el hambriento"] } },
    S(75, "dog2", null, "Haz captura.", "Envíasela a su otro humano.", {}, { size: 56 }),
  ]),
  N40EsCompanero: mk("n40", [
    S(60, "d_balcony", null, "Tu perro como", "compañero de trabajo", { startFrom: 15 }, { size: 84 }),
    S(90, "d_laptop", "La controladora", "Te mira escribir.", "Suspira.", { startFrom: 60 }),
    S(90, "d_sofa", "La de la siesta", "En cada reunión.", "Cámara apagada.", FACE),
    S(90, "d_treat", "La ladrona de comida", "“¿Te vas a", "acabar eso?”", { startFrom: 300 }, { labelSize: 70 }),
    S(90, "d_kayak", "Teletrabajo", "Se conecta", "desde un barco."),
    S(90, "dog", "Control de calidad", "Lo rechaza todo.", "Le encanta su trabajo.", { startFrom: 30 }, { size: 54 }),
    S(60, "d_studio", null, "Etiqueta a", "tu compañero.", { startFrom: 10, origin: "50% 0%" }, { size: 80 }),
  ]),
  N31EsResenas: mk("n31", [
    S(60, "d_studio", null, "Si los perros", "dejaran reseñas", { startFrom: 10, zoom: [1, 1.05], origin: "50% 0%" }, { size: 76 }),
    { d: 90, v: ["n_nellie", win("50% 40%", { startFrom: 90 })], c: rv("Mi nombre", 5, "Bien escrito. Raro.", "Nellie") },
    { d: 90, v: ["z_green", win("50% 60%", { rate: 0.75, snapAt: 40 })], c: rv("Dos mitades", 5, "Una para cenar. Otra para la segunda cena.", "Nugget") },
    { d: 90, v: ["dog2", win("50% 50%")], c: rv("Estado actual", 1, "Vacío. Otra vez. ¿Quién es el responsable?", "Amy") },
    { d: 90, v: ["z_mint", win("50% 45%", { rate: 0.75, snapAt: 40 })], c: rv("El cuenco de acero", 4, "Suena genial. Los humanos no opinan igual.", "Jam") },
    { d: 90, v: ["b_terra2", win("50% 50%", { startFrom: 5 })], c: rv("Cuenco compartido", 3, "Chips come más rápido. Injusto.", "Beef") },
    S(60, "p_lineup", null, "¿Qué reseña", "dejaría el tuyo?", { rate: 1.3 }),
  ]),
};

// ---- Batch 9: the studio and the wall map of where orders have gone (opened 1 June 2026; 42 cities in 18 countries;
// yellow star = a physical order, pink star = a digital STL file; no stars in Africa, almost none in Asia). ----
const M = (d: number, clip: string, label: string | null, a: string, b?: string, v: any = {}, o: any = {}) =>
  ({ d, v: [clip, { zoom: [1, 1.05], ...v }] as V, c: L("x", label, a, b, { boxed: true, size: 88, top: 250, ...o }) });
const mapWin = (o: any = {}) => ({ zoom: [1, 1.04], window: { top: W, pos: "50% 50%" }, ...o });

export const batch9: Record<string, ReelConfig> = {
  WmOpened: mk("wm1", [
    M(90, "w_8799", null, "We opened", "4 months ago.", { rate: 1.5 }, { size: 104 }),
    M(75, "w_8799", null, "Here's where our orders", "have been.", { startFrom: 170, rate: 1.4 }),
    M(75, "w_8789", "North America", "USA · Canada", "13 cities", {}, { bAt: 40 }),
    M(75, "w_8800", "Latin America", "8 countries", "Puerto Rico to Argentina", { startFrom: 75 }, { size: 80 }),
    M(90, "w_8790", "Europe", "6 countries", "13 cities", { startFrom: 150, rate: 0.45 }, { top: 1320 }),
    M(60, "w_8802", "Australia", "2 cities.", "The long way round.", { startFrom: 285 }, { size: 80, bAt: 30 }),
    M(75, "w_8788", null, "42 cities. 18 countries.", "Where next?", { rate: 0.8 }, { size: 84 }),
  ]),
  WmTinyStudio: mk("wm2", [
    M(75, "w_8803", null, "A tiny studio", "in Barcelona.", { rate: 1.5 }, { size: 104 }),
    M(60, "w_8803", null, "", "One wall of tools.", { startFrom: 190, rate: 1.5 }, { bAt: 3 }),
    M(60, "w_8794", null, "", "One workbench.", { startFrom: 20 }, { bAt: 3 }),
    { d: 60, v: ["qc_new", { startFrom: 125, rate: 0.55, zoom: [1.04, 1.1] }], c: L("qc_new", null, "", "One supervisor.", { bAt: 3 }) },
    M(90, "w_8794", null, "And one", "very big map.", { startFrom: 200 }, { size: 104 }),
    M(75, "w_8798", null, "42 cities", "so far."),
  ]),
  WmStars: mk("wm3", [
    M(90, "w_8810", null, "A star for every place", "our orders land.", { startFrom: 60 }, { size: 84 }),
    { d: 60, v: ["w_8789", { rate: 1.3 }] }, { d: 60, v: ["w_8800", { startFrom: 75 }] }, { d: 60, v: ["w_8790", { startFrom: 150, rate: 0.6 }] }, { d: 60, v: ["w_8790", {}] },
    M(90, "w_8811", null, "We keep needing", "more stars.", { startFrom: 60 }, { size: 96 }),
  ]),
  WmHowFar: mk("wm5", [
    M(75, "w_8788", null, "How far can", "a dog bowl travel?", {}, { size: 96 }),
    M(75, "w_8790", "Start", "Barcelona.", undefined, { startFrom: 150, rate: 0.5 }, { top: 1350 }),
    M(90, "w_8800", "Finish", "São Paulo.", "8,800 km.", { startFrom: 60 }),
    M(75, "w_8802", "Even further", "Australia.", "15,000+ km.", { startFrom: 285 }),
    M(75, "w_8797", null, "Where should the", "next one land?", { startFrom: 170 }),
  ]),
  WmBeFirst: mk("wm12", [
    M(60, "w_8788", null, "Our map", "has a problem.", {}, { size: 104 }),
    M(75, "w_8801", "Africa", "Zero stars.", undefined, { startFrom: 135, rate: 0.4 }),
    M(75, "w_8789", "Asia", "One. In Turkey.", undefined, { startFrom: 215, rate: 0.5 }),
    M(90, "w_8801", null, "Japan? India?", "Kenya? South Africa?", { startFrom: 150 }),
    M(75, "w_8810", null, "Be our", "first star there.", { startFrom: 60 }, { size: 100 }),
  ]),
  WmTwoStars: mk("wm13", [
    M(75, "w_8798", null, "Two kinds of stars", "on our wall.", {}),
    M(90, "w_8790", "Yellow", "A parcel", "flew there.", { startFrom: 150, rate: 0.45 }, { top: 1320 }),
    M(90, "w_8800", "Pink", "A file did.", "Printed right there.", { startFrom: 75 }),
    M(75, "w_8789", null, "Same bowl.", "Two ways to travel.", { startFrom: 10 }),
    M(60, "w_8802", null, "Which star", "would you be?"),
  ]),
  WmPrintedFarAway: mk("wm14", [
    M(90, "w_8800", null, "This bowl was printed in a city", "we've never been to.", { startFrom: 60 }, { size: 60 }),
    S(75, "p_cad_green", null, "We sent", "a file.", { rate: 1.5 }, { size: 100 }),
    S(75, "print_green", null, "Someone pressed print", "8,000 km away.", { rate: 2 }, { size: 84 }),
    M(75, "w_8789", null, "No parcel.", "No waiting.", { startFrom: 100 }, { size: 100 }),
    M(75, "w_8811", null, "It still gets", "a star.", { startFrom: 60 }, { size: 100 }),
  ]),
  WmAmyReviews: mk("wm16", [
    { d: 60, v: ["w_8669", { zoom: [1, 1.04] }], c: L("x", null, "The Head of QC reviews", "our expansion", { top: 240, size: 76 }) },
    { d: 105, v: ["w_8789", mapWin()], c: rv("North America", 5, "Many stars. Many dogs, I assume.") },
    { d: 105, v: ["w_8790", mapWin({ startFrom: 150, rate: 0.4 })], c: rv("Europe", 4, "Walking distance. Sort of.") },
    { d: 105, v: ["w_8802", mapWin({ startFrom: 285 })], c: rv("Australia", 2, "Too far to sniff.") },
    { d: 105, v: ["w_8801", mapWin({ startFrom: 135, rate: 0.3 })], c: rv("Africa", 1, "No stars. Unacceptable.") },
    { d: 60, v: ["w_8669", { startFrom: 70, zoom: [1, 1.04] }], c: L("x", null, "She expects", "improvement.", { top: 240, size: 92 }) },
  ]),
  WmAmysDream: mk("wm18", [
    S(75, "d_studio", null, "My dog's", "business plan:", { startFrom: 10, origin: "50% 0%" }, { size: 80 }),
    M(75, "w_8810", null, "", "A star in every city", { startFrom: 60 }, { bAt: 3, size: 84 }),
    { d: 75, v: ["w_8669", { zoom: [1, 1.04] }], c: L("x", null, "", "…that has a dog.", { top: 240, size: 96, bAt: 3 }) },
    M(75, "w_8788", null, "So.", "Every city.", {}, { size: 110 }),
    M(75, "w_8798", null, "Progress:", "42 cities."),
    S(60, "d_tongue", null, "She's not", "worried.", {}, { size: 96 }),
  ]),
  WmStudioTour: mk("wm19", [
    M(45, "w_8803", null, "", "Studio tour.", { rate: 2 }, { bAt: 2, size: 110 }),
    M(30, "w_8803", null, "", "The printer.", { startFrom: 60 }, { bAt: 0 }),
    M(30, "w_8803", null, "", "The tools.", { startFrom: 210 }, { bAt: 0 }),
    M(30, "w_8794", null, "", "The workbench.", { startFrom: 30 }, { bAt: 0 }),
    M(30, "p_lineup", null, "", "Fresh bowls.", { startFrom: 30 }, { bAt: 0 }),
    M(30, "b_spools", null, "", "The colours.", {}, { bAt: 0 }),
    { d: 30, v: ["qc_new", { startFrom: 125, rate: 0.55 }], c: L("qc_new", null, "", "The boss.", { bAt: 0 }) },
    M(60, "w_8794", null, "", "And the map.", { startFrom: 215 }, { bAt: 2, size: 104 }),
    M(75, "w_8798", null, "42 cities", "in 4 months."),
  ]),
  WmOneMoreStar: mk("wm20", [
    M(105, "w_8810", null, "", "One more star.", { rate: 1.9 }, { bAt: 60, size: 104 }),
    M(105, "w_8811", null, "", "And one more.", { rate: 1.9 }, { bAt: 60, size: 104 }),
    M(60, "w_8788", null, "", "Where's yours?", {}, { bAt: 3, size: 104 }),
  ]),

  // every city on the wall, one name per beat-third
  WmRollCall: (() => {
    const names = (list: string[], from: number, each: number, top: number) =>
      list.map((t, i) => ({ kind: "words", from: from + i * each, dur: each, top, size: 100, words: [{ t, at: 0, pink: true }] }));
    const na = ["Bronx", "Brooklyn", "Camp Hill", "Evans", "Fulshear", "Kirkland", "Pearl River", "San Diego", "Torrance", "Wilmington", "Woodland", "Toronto", "Angus", "Gurabo"];
    const la = ["São Paulo", "Alegre", "Bebedouro", "Casa", "Francisco Beltrão", "Varginha", "Buenos Aires", "Huechuraba", "Bogotá", "Belén", "Guayaquil", "Chaclacayo"];
    const eu = ["Barcelona", "Mutxamel", "Sant Antoni", "Aurich", "Düsseldorf", "Elsenfeld", "Köln", "Remagen", "Amersfoort", "Houten", "Ljubljana", "Rohrbach", "Sirnach", "Bozdoğan"];
    const au = ["Mossman", "Palm Beach"];
    return mk("wm21", [
      M(60, "w_8788", null, "42 cities.", "Is yours here?", {}, { size: 104 }),
      { d: 140, v: ["w_8789", { rate: 0.6, zoom: [1, 1.05] }] },
      { d: 120, v: ["w_8800", { startFrom: 75, rate: 0.6, zoom: [1, 1.05] }] },
      { d: 140, v: ["w_8790", { startFrom: 150, rate: 0.3, zoom: [1, 1.05] }] },
      { d: 40, v: ["w_8802", { startFrom: 285, zoom: [1, 1.05] }] },
      M(75, "w_8798", null, "18 countries.", "Add your city.", {}, { size: 100 }),
    ], [...names(na, 60, 10, 280), ...names(la, 200, 10, 280), ...names(eu, 320, 10, 1350), ...names(au, 460, 20, 280)]);
  })(),
};

// ---- Batch 10: "new day, new star" (map, hand placing a star with tweezers) and the new three-colour model as an STL drop ----
const STL_END = (clip: string, v: any = {}) => ({ d: 90, v: [clip, { zoom: [1, 1.06], ...v }] as V,
  c: { kind: "words", top: 280, size: 96, words: [{ t: "STL file", at: 3, box: true }, { t: "now on", at: 12, br: true, box: true }, { t: "Etsy & Patreon", at: 22, pink: true, br: true }] } });

export const batch10: Record<string, ReelConfig> = {
  // 1 — straight: new day, new star
  StarDay1: mk("sd1", [
    M(75, "w_8840", null, "New day.", "New star.", { rate: 0.9 }, { size: 110 }),
    M(105, "w_8840", null, "", "Another order landed.", { startFrom: 70, rate: 1.4 }, { bAt: 30, size: 88, top: 1350 }),
    M(90, "w_8841", null, "Our orders map", "keeps growing.", { rate: 1.6 }),
    M(60, "w_8841", null, "Where's", "the next one?", { startFrom: 180, rate: 1.2 }, { size: 100 }),
  ]),
  // 2 — the other side of the world
  StarDay2: mk("sd2", [
    M(75, "w_8839", null, "Today's star:", "the other side of the world.", { rate: 0.9 }, { size: 80 }),
    M(105, "w_8839", null, "", "Tweezers out.", { startFrom: 80, rate: 1.3 }, { bAt: 20, size: 96, top: 1400 }),
    M(90, "w_8841", null, "One star", "for every order.", { rate: 1.6 }),
    M(60, "w_8841", null, "Will yours", "be next?", { startFrom: 200, rate: 1.2 }, { size: 100 }),
  ]),
  // 3 — morning routine
  StarDay3: mk("sd3", [
    M(60, "w_8841", null, "Our morning", "routine", { startFrom: 60, rate: 1.4 }, { size: 104 }),
    S(60, "b_coffee", "1", "Coffee.", undefined, { rate: 0.6 }, { size: 100 }),
    S(60, "d_laptop", "2", "Check the orders.", undefined, { startFrom: 20 }, { size: 84 }),
    M(105, "w_8840", "3", "A new star", "on the map.", { startFrom: 40, rate: 1.4 }, { top: 1350 }),
    M(75, "w_8841", null, "Best part", "of the day.", { startFrom: 120, rate: 1.4 }, { size: 100 }),
  ]),
  // 4 — slow and quiet
  StarDay4: mk("sd4", [
    M(150, "w_8840", null, "", "One more star.", { startFrom: 40, rate: 0.75 }, { bAt: 90, size: 100 }),
    M(120, "w_8839", null, "", "And another.", { startFrom: 60, rate: 0.75 }, { bAt: 60, size: 100, top: 1400 }),
    M(75, "w_8841", null, "Our orders map,", "one star at a time.", { rate: 1.3 }, { size: 84 }),
  ]),
  // 5 — POV: you just ordered
  StarDay5: mk("sd5", [
    M(75, "w_8841", null, "POV: you just ordered", "from Lindom.home", { startFrom: 30, rate: 1.2 }, { size: 80 }),
    M(105, "w_8840", null, "This happens", "the next morning.", { startFrom: 40, rate: 1.4 }, { top: 1300 }),
    M(90, "w_8839", null, "We shipped it?", "Yellow star.", { startFrom: 90, rate: 1.4 }),
    M(90, "w_8841", null, "You printed our file?", "Pink star.", { startFrom: 0, rate: 1 }),
    M(60, "w_8841", null, "Either way,", "you're on the wall.", { startFrom: 210, rate: 1.2 }, { size: 88 }),
  ]),

  // the new three-colour model (TEO lettering in shot) as an STL drop — five takes
  Stl3Drop: mk("tc1", [
    S(60, "b_yp", null, "New model.", "Just dropped.", { startFrom: 20 }, { size: 104 }),
    { d: 60, v: ["p_yellow0", { rate: 1.6 }] },
    { d: 60, v: ["p_yellow", { startFrom: 150, rate: 2.5 }] },
    { d: 60, v: ["p_yellow_remove", { startFrom: 120, rate: 1.6 }] },
    { d: 75, v: ["b_yp2", { startFrom: 20 }], c: L("x", null, "Three colours.", "One bowl.", { size: 100 }) },
    STL_END("b_yp", { startFrom: 60 }),
  ]),
  Stl3Colours: mk("tc2", [
    S(60, "b_yp2", null, "Three colours.", "One bowl.", { startFrom: 20 }, { size: 104 }),
    S(45, "b_yp", "Purple.", "", undefined, { startFrom: 0, zoom: [1.2, 1.3] }, { size: 110 }),
    S(45, "p_yellow", "Yellow.", "", undefined, { startFrom: 200, zoom: [1.1, 1.2] }, { size: 110 }),
    S(45, "p_yellow0", "Grey.", "", undefined, { startFrom: 60, zoom: [1.1, 1.2] }, { size: 110 }),
    S(75, "b_yp2", null, "Our newest", "model.", { startFrom: 120 }, { size: 104 }),
    STL_END("b_yp", { startFrom: 90 }),
  ]),
  Stl3PrintIt: mk("tc3", [
    S(60, "p_yellow0", null, "Got a", "3D printer?", { rate: 1.6 }, { size: 104 }),
    S(75, "p_yellow", null, "Our newest bowl", "is now an STL.", { startFrom: 150, rate: 2 }, { size: 88 }),
    S(60, "p_yellow_remove", null, "", "Print it.", { startFrom: 120, rate: 1.6 }, { bAt: 3, size: 110 }),
    S(60, "b_yp", null, "", "Pick your colours.", { startFrom: 20 }, { bAt: 3, size: 96 }),
    STL_END("b_yp2", { startFrom: 20 }),
  ]),
  Stl3Satisfying: mk("tc4", [
    S(60, "p_yellow0", null, "", "Watch it grow.", { rate: 1.5 }, { bAt: 3, size: 104 }),
    { d: 75, v: ["p_yellow", { startFrom: 60, rate: 3 }] },
    { d: 75, v: ["p_yellow", { startFrom: 300, rate: 3 }] },
    { d: 60, v: ["p_yellow_remove", { startFrom: 150, rate: 1.6 }] },
    { d: 60, v: ["b_yp", { startFrom: 20 }], c: L("x", null, "", "Done.", { bAt: 3, size: 120 }) },
    STL_END("b_yp2", { startFrom: 60 }),
  ], [{ kind: "progress", from: 60, dur: 210 }]),
  Stl3Approved: mk("tc5", [
    S(60, "d_studio", null, "New model.", "Sent for inspection.", { startFrom: 10, origin: "50% 0%" }, { size: 72 }),
    { d: 75, v: ["b_yp", { startFrom: 20 }], c: { kind: "stamp", lines: ["QUALITY CHECK", "Approved"], at: 14, y: 560, scale: 0.7 } },
    S(60, "p_yellow", null, "Three colours.", "One bowl.", { startFrom: 180, rate: 2 }, { size: 96 }),
    S(60, "dog", null, "", "Amy's verdict: yes.", { startFrom: 30 }, { bAt: 3, size: 70 }),
    STL_END("b_yp2", { startFrom: 30 }),
  ]),
};

// ---- Batch 11: THEO (blue + purple double bowl) process, joins, and pulls off the printer. Bowls only — no map footage mixed in. ----
const CARD = (d: number, photo: string, label: string | null, a: string, b?: string, o: any = {}) =>
  ({ d, v: [photo, { photo: "card", zoom: [1, 1.04] }] as V, c: L("x", label, a, b, { top: 170, size: 84, ...o }) });
const FULL = (d: number, photo: string, label: string | null, a: string, b?: string, o: any = {}) =>
  ({ d, v: [photo, { photo: "full", zoom: [1, 1.08] }] as V, c: L("x", label, a, b, { size: 96, ...o }) });
const letters = (word: string, from: number, each: number) =>
  word.split("").map((ch, i) => ({ kind: "words", from: from + i * each, dur: word.length * each - i * each + 30, top: 260, size: 150, words: [{ t: word.slice(0, i + 1), at: 0, pink: true }] }));

export const batch11: Record<string, ReelConfig> = {
  // THEO reels: full process on video — blue half printing (t_blue*), off the bed (t_bluepull), cleanup (t_sup*),
  // purple half (th_p*, t_purplepull), inner parts (t_arch*, t_fit), the snap (th_join, t_join*), steel bowls (t_steel*), close-up (t_close).
  Theo01Story: mk("th1", [
    S(60, "t_blue1", null, "This is how", "Theo's bowl was made.", { rate: 1.6 }, { size: 84 }),
    S(45, "t_bluepull", null, "", "Blue half: done.", { startFrom: 60, rate: 1.5 }, { bAt: 3, size: 96 }),
    S(45, "t_sup3", null, "", "Clean it up.", { startFrom: 30, rate: 1.8 }, { bAt: 3, size: 100 }),
    S(45, "th_p2", null, "", "Purple half.", { startFrom: 120, rate: 2 }, { bAt: 3, size: 104 }),
    S(45, "t_purplepull", null, "", "Off the bed.", { startFrom: 120, rate: 1.6 }, { bAt: 3, size: 104 }),
    S(60, "t_fit", null, "", "The inside parts.", { startFrom: 150, rate: 1.6 }, { bAt: 3, size: 96 }),
    S(60, "th_join", null, "", "Snap.", { startFrom: 150, rate: 1.2 }, { bAt: 26, size: 120 }),
    S(45, "t_steel1", null, "", "Steel bowls in.", { startFrom: 30, rate: 1.4 }, { bAt: 3, size: 96 }),
    S(60, "t_close", null, "Theo's", "bowl.", { rate: 0.9 }, { size: 110 }),
  ]),
  Theo02BlueOrPurple: mk("th2", [
    S(60, "t_blue2", null, "Blue?", undefined, { rate: 1.4 }, { size: 120 }),
    S(60, "th_p4", null, "Or purple?", undefined, { rate: 1.6 }, { size: 120 }),
    S(75, "th_join", null, "Theo said:", "both.", { startFrom: 140, rate: 1.1 }, { size: 110 }),
    S(60, "t_close", null, "Which half", "would you pick?", { rate: 0.9 }, { size: 92 }),
  ]),
  Theo03Spell: mk("th3", [
    { d: 150, v: ["t_close", { rate: 0.7, zoom: [1.02, 1.12] }] },
    S(75, "t_steel3", null, "", "Spelled with love.", { startFrom: 60 }, { bAt: 3, size: 100 }),
  ], [...letters("THEO", 10, 25), { kind: "words", from: 120, dur: 30, top: 470, size: 70, words: [{ t: "(and two colours)", at: 0, box: true }] }]),
  Theo04Timelapse: mk("th4", [
    S(45, "t_blue3", null, "6-7 hours", "per half.", { rate: 2.5 }, { size: 104 }),
    { d: 45, v: ["t_blue1", { startFrom: 90, rate: 3 }] },
    { d: 45, v: ["t_blue2", { rate: 3 }] },
    { d: 45, v: ["th_p3", { startFrom: 90, rate: 3 }] },
    { d: 45, v: ["th_p1", { startFrom: 120, rate: 3 }] },
    { d: 45, v: ["th_p4", { rate: 3 }] },
    S(75, "th_join", null, "", "Worth every layer.", { startFrom: 150, rate: 1.2 }, { bAt: 30, size: 96 }),
  ], [{ kind: "progress", from: 0, dur: 270 }]),
  Theo05Guess: mk("th5", [
    S(75, "t_arch1", null, "Guess what", "these become.", { rate: 0.9 }, { size: 100 }),
    S(75, "t_sup1", "Hint", "A dog eats", "from it.", { rate: 1.6 }),
    S(75, "t_fit", null, "", "Getting closer…", { startFrom: 150, rate: 1.4 }, { bAt: 3, size: 100 }),
    S(75, "th_join", null, "", "This.", { startFrom: 150, rate: 1.1 }, { bAt: 26, size: 130 }),
    S(45, "t_close", null, "Did you", "get it?", { rate: 1 }, { size: 104 }),
  ]),
  Theo06Steps: mk("th6", [
    S(45, "t_blue1", "1", "Print the blue half.", undefined, { startFrom: 60, rate: 2 }, { size: 88 }),
    S(45, "t_bluepull", "2", "Take it off.", undefined, { startFrom: 60, rate: 1.5 }, { size: 96 }),
    S(45, "t_sup3", "3", "Clean it up.", undefined, { startFrom: 60, rate: 2 }, { size: 96 }),
    S(45, "t_purplepull", "4", "Purple half: same.", undefined, { startFrom: 120, rate: 1.8 }, { size: 88 }),
    S(45, "t_fit", "5", "Fit the inside.", undefined, { startFrom: 180, rate: 1.6 }, { size: 96 }),
    S(45, "th_join", "6", "Snap.", undefined, { startFrom: 165, rate: 1.2 }, { size: 110 }),
    S(45, "t_steel2", "7", "Steel bowls.", undefined, { startFrom: 90, rate: 1.4 }, { size: 96 }),
    S(60, "t_close", null, "Theo's bowl,", "step by step.", { rate: 0.9 }, { size: 96 }),
  ]),
  Theo07Satisfying: mk("th7", [
    S(105, "t_blue2", null, "", "Blue.", { rate: 0.7, zoom: [1.1, 1.22] }, { bAt: 20, size: 110 }),
    S(105, "th_p2", null, "", "Purple.", { startFrom: 150, rate: 0.6, zoom: [1.1, 1.25] }, { bAt: 20, size: 110 }),
    S(90, "t_sup3", null, "", "Clean.", { startFrom: 60, rate: 0.8 }, { bAt: 20, size: 110 }),
    S(90, "th_join", null, "", "Click.", { startFrom: 150, rate: 0.7 }, { bAt: 40, size: 110 }),
  ]),
  Theo08Pov: mk("th8", [
    S(60, "t_blue3", null, "POV: you ordered", "a bowl for Theo", { rate: 2 }, { size: 88 }),
    S(45, "t_blue1", null, "", "We print it.", { startFrom: 90, rate: 2 }, { bAt: 3, size: 104 }),
    S(45, "t_sup1", null, "", "We clean it.", { startFrom: 60, rate: 1.6 }, { bAt: 3, size: 104 }),
    S(45, "th_p4", null, "", "Twice.", { startFrom: 60, rate: 2 }, { bAt: 3, size: 110 }),
    S(60, "t_fit", null, "", "We build it.", { startFrom: 180, rate: 1.5 }, { bAt: 3, size: 104 }),
    S(60, "t_join4", null, "", "We snap it.", { startFrom: 60, rate: 1.2 }, { bAt: 3, size: 104 }),
    S(60, "t_steel3", null, "And it's on its way", "to Theo.", { startFrom: 60 }, { size: 88 }),
  ]),
  Theo09Day: mk("th9", [
    S(75, "t_blue1", "Morning", "The blue half", "starts printing.", { rate: 1.6 }),
    S(75, "th_p2", "Afternoon", "Now the purple.", undefined, { startFrom: 90, rate: 2 }),
    S(75, "t_sup3", "Evening", "Cleaning up", "every edge.", { startFrom: 30, rate: 1.5 }),
    S(75, "th_join", "Night", "Snap.", "Theo's bowl.", { startFrom: 150, rate: 1.2 }),
    S(60, "t_close", null, "One bowl.", "One long day.", { rate: 0.9 }, { size: 104 }),
  ]),
  Theo10Ready: mk("th10", [
    S(75, "t_purplepull", null, "Dear Theo,", "your bowl is almost ready.", { startFrom: 90, rate: 1.4 }, { size: 84 }),
    S(75, "t_fit", null, "Putting it", "together…", { startFrom: 150, rate: 1.5 }),
    S(75, "t_steel1", null, "Steel bowls in.", undefined, { startFrom: 20, rate: 1 }, { size: 100 }),
    S(75, "t_close", null, "See you", "at dinner.", { rate: 0.8 }, { size: 104 }),
  ]),

  // joins
  Join01Rate: mk("jn1", [
    S(60, "z_orange", "1", "Rate the click.", undefined, { snapAt: 30, zoom: [1.02, 1.05] }, { size: 96 }),
    S(60, "z_blue", "2", "", undefined, { snapAt: 30, zoom: [1.02, 1.05] }, { size: 96 }),
    S(60, "z_green", "3", "", undefined, { snapAt: 30, zoom: [1.02, 1.05] }, { size: 96 }),
    S(60, "z_pink", "4", "", undefined, { snapAt: 30, zoom: [1.02, 1.05] }, { size: 96 }),
    S(75, "t_join3", "5", "", undefined, { startFrom: 60 }, { size: 96 }),
    S(60, "j_amy_lilac", null, "Best one?", "1 to 5.", { startFrom: 60 }, { size: 104 }),
  ]),
  Join02Couples: mk("jn2", [
    S(75, "t_join2", null, "He was blue.", "She was purple.", { rate: 1.1 }, { size: 96 }),
    S(60, "th_join", null, "", "They clicked.", { startFrom: 150, rate: 1.2 }, { bAt: 3, size: 110 }),
    S(60, "z_pink", null, "Cream and pink:", "a classic.", { snapAt: 30, zoom: [1.02, 1.05] }),
    S(60, "z_orange", null, "Opposites", "attract.", { snapAt: 30, zoom: [1.02, 1.05] }),
    S(75, "j_olive", null, "Some just fit", "at an angle.", { startFrom: 20 }),
    S(60, "j_amy_lilac", null, "Tag your", "other half.", { startFrom: 90 }, { size: 104 }),
  ]),
  Join03SlowMo: mk("jn3", [
    S(105, "th_join", null, "", "Wait for the click.", { startFrom: 165, rate: 0.45, zoom: [1.05, 1.15] }, { bAt: 10, size: 96 }),
    S(90, "z_blue", null, "", "Again.", { rate: 0.5, snapAt: 60, zoom: [1.04, 1.16] }, { bAt: 10, size: 110 }),
    S(90, "z_green", null, "", "Slower.", { rate: 0.4, snapAt: 75, zoom: [1.04, 1.16] }, { bAt: 10, size: 110 }),
  ]),
  Join04WhichHalf: mk("jn4", [
    S(90, "t_join4", null, "Blue half", "or purple half?", { rate: 1 }, { size: 100 }),
    S(75, "z_pink", null, "Cream", "or pink?", { snapAt: 50, rate: 0.75 }, { size: 110 }),
    S(75, "z_orange", null, "White", "or orange?", { snapAt: 50, rate: 0.75 }, { size: 110 }),
    S(60, "j_green", null, "Comment", "your half.", { startFrom: 60 }, { size: 104 }),
  ]),
  Join05EveryColour: mk("jn5", [
    S(45, "b_terra_asm", "Terracotta", "", undefined, { startFrom: 60, rate: 1.6 }, { size: 100 }),
    S(45, "j_green", "Olive + pink", "", undefined, { startFrom: 30, rate: 1.2 }, { size: 100 }),
    S(45, "j_olive", "Olive + stone", "", undefined, { startFrom: 60, rate: 1.4 }, { size: 96 }),
    S(45, "z_orange", "Orange", "", undefined, { startFrom: 10, snapAt: 20, zoom: [1.02, 1.05] }, { size: 100 }),
    S(45, "z_blue", "Blue + stone", "", undefined, { startFrom: 10, snapAt: 20, zoom: [1.02, 1.05] }, { size: 96 }),
    S(45, "z_pink", "Cream + pink", "", undefined, { startFrom: 10, snapAt: 20, zoom: [1.02, 1.05] }, { size: 96 }),
    S(60, "th_join", "Blue + purple", "", undefined, { startFrom: 160, rate: 1.2 }, { size: 96 }),
    S(60, "j_amy_lilac", null, "Every colour", "clicks.", { startFrom: 90 }, { size: 104 }),
  ]),

  // pulls off the printer
  Pull01Fresh: mk("pl1", [
    S(45, "r_dark", null, "Fresh off", "the printer.", { startFrom: 90, rate: 2 }, { size: 104 }),
    { d: 45, v: ["r_grey", { startFrom: 50, rate: 1.5 }] },
    { d: 45, v: ["r_olive", { startFrom: 60, rate: 2 }] },
    { d: 45, v: ["r_greydiag", { startFrom: 90, rate: 2 }] },
    { d: 45, v: ["p_green_peel", { startFrom: 80, rate: 2 }] },
    { d: 45, v: ["p_terra_peel", { startFrom: 30, rate: 2.5 }] },
    { d: 45, v: ["p_yellow_remove", { startFrom: 120, rate: 1.6 }] },
    S(60, "r_nellie", null, "Still", "warm.", { startFrom: 90, rate: 1.5 }, { size: 110 }),
  ]),
  Pull02Rate: mk("pl2", [
    S(75, "r_grey", "1", "Rate the pull.", undefined, { startFrom: 40, rate: 1.4 }),
    S(75, "r_olive", "2", "", undefined, { startFrom: 60, rate: 1.8 }),
    S(75, "r_greydiag", "3", "", undefined, { startFrom: 90, rate: 1.8 }),
    S(75, "p_mint_remove", "4", "", undefined, { startFrom: 30, rate: 1.6 }),
    S(75, "r_nellie", "5", "", undefined, { startFrom: 60, rate: 1.6 }),
    S(60, "r_teo", null, "Best one?", "1 to 5.", {}, { size: 104 }),
  ]),
  Pull03PrinterPov: mk("pl3", [
    S(75, "r_dark", null, "6 hours of printing…", undefined, { startFrom: 30, rate: 1.5 }, { size: 88 }),
    S(75, "r_dark", null, "", "…and they just take it.", { startFrom: 120, rate: 2 }, { bAt: 3, size: 84 }),
    S(60, "r_olive", null, "", "Every. Single. Time.", { startFrom: 60, rate: 2 }, { bAt: 3, size: 96 }),
    S(60, "p_terra_peel", null, "No thank you.", "No goodbye.", { startFrom: 30, rate: 2.5 }),
    S(60, "r_grey", null, "Say thanks", "to your printer.", { startFrom: 50, rate: 1.5 }, { size: 96 }),
  ]),
  Pull04StillWarm: mk("pl4", [
    S(120, "r_greydiag", null, "", "Still warm.", { startFrom: 100, rate: 0.6, zoom: [1.05, 1.15] }, { bAt: 30, size: 110 }),
    S(105, "r_grey", null, "", "Slowly.", { startFrom: 60, rate: 0.6, zoom: [1.05, 1.15] }, { bAt: 30, size: 110 }),
    S(105, "r_nellie", null, "", "Gently.", { startFrom: 90, rate: 0.6, zoom: [1.05, 1.15] }, { bAt: 30, size: 110 }),
  ]),
  Pull05OffToBowl: mk("pl5", [
    S(60, "r_olive", null, "Off the printer…", undefined, { startFrom: 60, rate: 2 }, { size: 96 }),
    S(60, "j_olive", null, "", "…into a bowl.", { startFrom: 60 }, { bAt: 3, size: 96 }),
    { d: 45, v: ["p_terra_peel", { startFrom: 30, rate: 2.5 }] },
    { d: 45, v: ["b_terra2", { startFrom: 5 }] },
    { d: 45, v: ["p_yellow_remove", { startFrom: 120, rate: 1.6 }] },
    { d: 45, v: ["b_yp", { startFrom: 20 }] },
    { d: 45, v: ["p_green_peel", { startFrom: 80, rate: 2 }] },
    S(60, "n_nugget_wb", null, "Which one", "is yours?", { startFrom: 30 }, { size: 104 }),
  ]),
};

// Oval double bowls only, one snap per second, each snap on the beat (local frame 15). startFrom = snap time in clip − 0.5 s.
const SNAP1 = (clip: string, startFrom: number, label?: string) =>
  ({ d: 30, v: [clip, { startFrom, snapAt: 15, zoom: [1.03, 1.07] }] as V, c: label ? { kind: "words", top: 280, size: 100, words: [{ t: label, at: 0, pink: true }] } : undefined });
export const batch12: Record<string, ReelConfig> = {
  OvalSnaps: mk("ov1", [
    SNAP1("z_pink", 15, "Cream + pink"),
    SNAP1("z_orange", 15, "White + orange"),
    SNAP1("z_blue", 15, "Blue + stone"),
    SNAP1("z_green", 15, "Olive + pink"),
    SNAP1("th_join", 141, "Blue + purple"),
    SNAP1("j_amy_lilac", 69),
    SNAP1("t_join2", 133),
    SNAP1("j_green", 31),
    SNAP1("t_join4", 117),
    SNAP1("z_pink", 15),
    SNAP1("z_orange", 15),
    SNAP1("z_blue", 15),
    SNAP1("z_green", 15),
    { d: 60, v: ["th_join", { startFrom: 141, rate: 0.5, snapAt: 30, zoom: [1.04, 1.12] }], c: L("x", null, "", "Favourite?", { bAt: 30, size: 110 }) },
  ]),
};

// ---- Batch 13: oval double bowl joins held against the black wall (snap times found frame by frame), and process reels with repostable lines ----
const KS: Record<string, number> = { k_blue: 3.17, k_orange: 1.57, k_orange2: 1.69, k_green: 1.43, k_green2: 1.72, k_pink: 2.55, k_bp2: 1.38 };
// one join scene: `d` frames long, snap lands on local frame `at`, footage plays at `rate`
const KJ = (clip: string, d: number, at: number, rate = 1, zoom: [number, number] = [1.04, 1.1], c?: any) =>
  ({ d, v: [clip, { startFrom: Math.max(0, Math.round(KS[clip] * 30 - at * rate)), rate, snapAt: at, zoom }] as V, c });
const tag = (t: string) => ({ kind: "words", top: 280, size: 96, words: [{ t, at: 0, pink: true }] });
const FIVE = ["k_blue", "k_orange", "k_green", "k_pink", "k_bp2"];
const FIVE_ALT = ["k_blue", "k_orange2", "k_green2", "k_pink", "k_bp2"];
const NAMES: Record<string, string> = { k_blue: "Blue", k_orange: "Orange", k_orange2: "Orange", k_green: "Green", k_green2: "Green", k_pink: "Cream + pink", k_bp2: "Blue + purple" };

// a process montage under one quote that builds line by line
const Q = (music: string, cuts: [string, any][], lines: string[], each = 45, end?: string) => {
  const scenes: Sc[] = cuts.map(([clip, o]) => ({ d: each, v: [clip, { zoom: [1.02, 1.08], ...o }] as V }));
  const dur = scenes.reduce((a, s) => a + s.d, 0);
  const words = lines.map((t, i) => ({ t, at: 6 + i * 34, br: i > 0, box: !t.startsWith("*"), pink: t.startsWith("*") }));
  for (const w of words) w.t = w.t.replace(/^\*/, "");
  const extra: any[] = [{ kind: "words", from: 0, dur: end ? dur - 75 : dur, top: 250, size: 74, words }];
  if (end) extra.push({ kind: "words", from: dur - 75, dur: 75, top: 250, size: 84, words: [{ t: end, at: 3, pink: true }] });
  return mk(music, scenes, extra);
};

export const batch13: Record<string, ReelConfig> = {
  // joins — one model, five colours, black wall, held in hands
  BlackJoins1Beat: mk("bj1", [...FIVE.map((c) => KJ(c, 30, 15, 1, [1.04, 1.08], tag(NAMES[c]))), ...FIVE_ALT.map((c) => KJ(c, 30, 15)), ...FIVE.map((c) => KJ(c, 15, 8))]),
  BlackJoinsSlowMo: mk("bj2", FIVE.map((c, i) => KJ(c, 75, 45, 0.4, [1.06, 1.18], i === 0 ? tag("Wait for the click.") : undefined))),
  BlackJoinsClickClick: mk("bj3", [...FIVE.map((c) => KJ(c, 45, 25, 1, [1.06, 1.12])), ...FIVE_ALT.map((c) => KJ(c, 45, 25, 0.8, [1.1, 1.16]))]),
  BlackJoinsBuild: mk("bj4", [
    KJ("k_blue", 60, 30), KJ("k_orange", 60, 30), KJ("k_green", 30, 15), KJ("k_pink", 30, 15), KJ("k_bp2", 30, 15),
    KJ("k_orange2", 15, 8), KJ("k_green2", 15, 8), KJ("k_blue", 15, 8), KJ("k_pink", 15, 8), KJ("k_bp2", 15, 8), KJ("k_orange", 15, 8),
    KJ("k_bp2", 90, 45, 0.4, [1.06, 1.2], L("x", null, "", "Favourite?", { bAt: 50, size: 110 })),
  ]),

  // process + lines people want to repost
  QuoteJobs: Q("q1", [["t_blue1", { rate: 2 }], ["t_bluepull", { startFrom: 60, rate: 1.5 }], ["t_sup3", { startFrom: 30, rate: 2 }], ["th_p2", { startFrom: 120, rate: 2 }], ["t_fit", { startFrom: 150, rate: 1.6 }], ["n_pack", { startFrom: 120, rate: 2.5 }], ["t_steel1", { startFrom: 20 }]],
    ["Small business owner:", "designer.", "printer.", "packer.", "customer service.", "*and the dog's assistant."], 48, "Tag a small business owner."),
  QuoteLayers: Q("q2", [["print_green", { rate: 2 }], ["p_mint_long", { startFrom: 200, rate: 3 }], ["th_p4", { rate: 2 }], ["p_yellow", { startFrom: 150, rate: 2.5 }], ["t_blue2", { rate: 2 }], ["t_close", { rate: 0.9 }]],
    ["Nobody sees", "the 700 layers.", "*They see the bowl."], 50),
  QuotePrintedYet: Q("q3", [["p_yellow0", { rate: 1.6 }], ["p_yellow", { startFrom: 100, rate: 2 }], ["p_mint_long", { startFrom: 300, rate: 2 }], ["th_p3", { startFrom: 90, rate: 2 }], ["p_mint_remove", { rate: 1.6 }]],
    ["Running a small business:", "10% creating.", "*90% “is it printed yet?”"], 50, "Send this to someone who gets it."),
  QuoteWarehouse: Q("q4", [["w_8803", { rate: 1.5 }], ["t_sup1", { startFrom: 60, rate: 1.6 }], ["r_olive", { startFrom: 60, rate: 1.8 }], ["n_pack", { startFrom: 200, rate: 2.5 }], ["box", { rate: 0.6 }], ["qc_new", { startFrom: 125, rate: 0.55 }]],
    ["Every order is someone", "choosing a tiny studio", "over a giant warehouse.", "*We don't forget that."], 50),
  QuoteSlow: Q("q5", [["th_p2", { startFrom: 150, rate: 0.7 }], ["t_blue1", { startFrom: 60, rate: 0.8 }], ["t_sup3", { startFrom: 60, rate: 0.9 }], ["p_sup_cream", { startFrom: 20 }], ["t_steel3", { startFrom: 40 }]],
    ["Slow is not a bug.", "*Slow is the product."], 60),
  QuoteJustABowl: Q("q6", [["t_blue3", { rate: 2 }], ["th_p1", { startFrom: 90, rate: 2.5 }], ["t_sup3", { startFrom: 30, rate: 2 }], ["t_fit", { startFrom: 180, rate: 1.5 }], ["th_join", { startFrom: 141, rate: 1.1 }], ["dog", { startFrom: 30 }]],
    ["Behind every “just a bowl”:", "12 hours.", "2 colours.", "*1 very picky dog."], 48),
  QuoteEveryOrder: Q("q7", [["w_8840", { startFrom: 40, rate: 1.4 }], ["t_purplepull", { startFrom: 120, rate: 1.6 }], ["n_pack", { startFrom: 330, rate: 2 }], ["w_8839", { startFrom: 80, rate: 1.3 }], ["w_8841", { rate: 1.5 }]],
    ["Nobody tells you that", "running a small business means", "celebrating every single order.", "*Every. Single. One."], 55),
  QuoteFirstLayer: Q("q8", [["m_cyan_print", { rate: 1 }], ["p_yellow0", { startFrom: 60, rate: 1.4 }], ["print_close", { rate: 1.2 }], ["t_blue1", { rate: 1.5 }], ["th_p4", { rate: 1.4 }]],
    ["Your first layer", "doesn't have to be perfect.", "*It just has to stick."], 55, "Save this for a bad day."),
};

// ---- Batch 14: detailed THEO process, five takes. Footage map (seconds): t_long 3–12 unbag purple filament, 64–92 load the spool;
// t_load 0–16 clean the bed; t_unpack 0–5 unwrap steel bowls, 6–10 drop one into the blue half. ----
const TP = (d: number, clip: string, startSec: number, rate: number, label?: string | null, a?: string, b?: string, o: any = {}) =>
  ({ d, v: [clip, { startFrom: Math.round(startSec * 30), rate, zoom: [1.02, 1.08] }] as V, c: a !== undefined || label ? L("x", label ?? null, a ?? "", b, { size: 92, ...o }) : undefined });

export const batch14: Record<string, ReelConfig> = {
  // 1 — chaptered, from spool to bowl
  TheoProcess1: mk("tp1", [
    TP(60, "t_long", 4, 1.5, null, "From a spool", "to Theo's bowl.", { size: 96 }),
    TP(45, "t_long", 9, 1.4, "1", "Unbox the filament."),
    TP(45, "t_long", 70, 2, "2", "Load the spool."),
    TP(45, "t_load", 4, 1.5, "3", "Clean the bed."),
    TP(45, "t_bluewide", 0, 1, "4", "Print the blue half."),
    TP(45, "t_blue2", 2, 2.5, null),
    TP(45, "t_bluepull", 2, 1.5, "5", "Off the printer."),
    TP(45, "t_sup1", 1, 1.8, "6", "Clean every edge."),
    TP(30, "t_sup2", 0, 1, null),
    TP(45, "th_p3", 2, 2.5, "7", "Now the purple."),
    TP(45, "t_purplepull", 4, 1.6, null),
    TP(45, "t_arch2", 4, 1.5, "8", "The inside parts."),
    TP(45, "t_fit", 5, 1.6, null),
    TP(45, "th_join", 4.7, 1.1, "9", "Snap."),
    TP(45, "t_unpack", 1, 1.4, "10", "Steel bowls."),
    TP(45, "t_steel1", 0.6, 1, null),
    TP(60, "t_close", 0, 0.9, null, "Theo's", "bowl.", { size: 110 }),
  ]),
  // 2 — every step, no skipping: fast cuts and a progress bar
  TheoProcess2: mk("tp2", [
    TP(30, "t_long", 6, 2, null, "Every step.", "No skipping.", { size: 100 }),
    TP(20, "t_long", 10, 2), TP(20, "t_long", 75, 2.5), TP(20, "t_long", 86, 2.5), TP(20, "t_load", 3, 2), TP(20, "t_load", 10, 2),
    TP(20, "t_bluewide", 0, 1), TP(20, "t_blue1", 3, 3), TP(20, "t_blue3", 4, 3), TP(20, "t_blue2", 6, 3), TP(20, "t_bluepull", 3, 2),
    TP(20, "t_sup3", 1, 2), TP(20, "t_sup1", 5, 2), TP(20, "t_sup2", 0.5, 1.5), TP(20, "th_p1", 3, 3), TP(20, "th_p2", 5, 3), TP(20, "th_p4", 3, 3),
    TP(20, "t_purplepull", 5, 2), TP(20, "t_arch1", 1, 2), TP(20, "t_arch3", 1, 2), TP(20, "t_fit", 7, 2), TP(20, "t_fit", 10, 2),
    TP(30, "th_join", 4.9, 1), TP(20, "t_unpack", 2, 2), TP(20, "t_unpack", 7, 2), TP(20, "t_steel2", 3, 1.5), TP(20, "t_steel3", 2, 1.5),
    TP(60, "t_close", 0, 0.8, null, "27 steps later:", "Theo's bowl.", { size: 92 }),
  ], [{ kind: "progress", from: 30, dur: 540 }]),
  // 3 — five stages
  TheoProcess3: mk("tp3", [
    TP(45, "t_long", 9, 1.4, "Prep", "Fresh filament.", undefined, { size: 96 }),
    TP(45, "t_long", 80, 2, null, "", "Spool in.", { bAt: 3 }),
    TP(45, "t_load", 6, 1.5, null, "", "Clean bed.", { bAt: 3 }),
    TP(45, "t_blue1", 1, 2, "Print", "Blue half.", undefined, { size: 96 }),
    TP(45, "th_p2", 3, 2.5, null, "", "Purple half.", { bAt: 3 }),
    TP(45, "t_sup3", 0, 1.8, "Clean", "Every edge.", undefined, { size: 96 }),
    TP(45, "t_purplepull", 6, 1.5, null, "", "Off the bed.", { bAt: 3 }),
    TP(45, "t_arch2", 6, 1.6, "Build", "The inside.", undefined, { size: 96 }),
    TP(45, "t_fit", 6, 1.6, null),
    TP(45, "th_join", 4.7, 1.1, null, "", "Click.", { bAt: 14, size: 110 }),
    TP(45, "t_unpack", 6, 1.2, "Done", "Steel bowls in.", undefined, { size: 96 }),
    TP(60, "t_close", 0, 0.9, null, "Made for Theo.", undefined, { size: 100 }),
  ]),
  // 4 — POV: you're the purple filament
  TheoProcess4: mk("tp4", [
    TP(60, "t_long", 7, 1.3, null, "POV: you're", "the purple filament.", { size: 92 }),
    TP(45, "t_long", 12, 1.4, null, "", "Out of the bag.", { bAt: 3 }),
    TP(60, "t_long", 70, 2, null, "", "Into the machine.", { bAt: 3 }),
    TP(60, "th_p1", 2, 2, null, "", "Melted. Layer by layer.", { bAt: 3, size: 84 }),
    TP(45, "th_p4", 1, 2, null),
    TP(45, "t_purplepull", 5, 1.6, null, "", "Peeled off.", { bAt: 3 }),
    TP(45, "t_arch2", 8, 1.5, null, "", "Fitted.", { bAt: 3 }),
    TP(60, "th_join", 4.7, 1.1, null, "", "Meets the blue half.", { bAt: 3, size: 84 }),
    TP(45, "t_steel3", 1.5, 1.2, null),
    TP(60, "t_close", 0, 0.9, null, "Becomes", "Theo's dinner.", { size: 100 }),
  ]),
  // 5 — no story, just the process, slower and tactile
  TheoProcess5: mk("tp5", [
    TP(75, "t_long", 9, 0.8, null, "", "Making Theo's bowl.", { bAt: 10, size: 96 }),
    TP(60, "t_load", 8, 1, null),
    TP(75, "t_blue1", 5, 1, null),
    TP(60, "t_bluepull", 3, 0.9, null),
    TP(75, "t_sup1", 2, 0.9, null),
    TP(60, "th_p2", 6, 1, null),
    TP(60, "t_fit", 6, 1, null),
    TP(60, "th_join", 4.7, 0.7, null),
    TP(60, "t_unpack", 6, 0.9, null),
    TP(75, "t_close", 0, 0.7, null, "", "Theo.", { bAt: 20, size: 120 }),
  ]),
};

// ---- Batch 15: voiced. Each scene holds one VO line (scene length = line + breathing room, on the beat grid). ----
const VS = (d: number, clip: string, startSec: number, rate: number, vo: string, a: string, b?: string, o: any = {}) =>
  ({ d, v: [clip, { startFrom: Math.round(startSec * 30), rate, zoom: [1.02, 1.08] }] as V, c: L("x", null, a, b, { size: 84, bAt: 22, ...o }), vo });
// quote reels: the quote builds on screen in sync with the voice; footage cuts underneath every 1.5 s
const VQ = (music: string, prefix: string, lines: [string, number][], cuts: [string, number, number][], outro?: string) => {
  let f = 0; const words: any[] = []; const vo: any[] = [];
  lines.forEach(([t, d], i) => { words.push({ t, at: f + 4, br: i > 0, box: i < lines.length - 1, pink: i === lines.length - 1 }); vo.push({ file: `${prefix}vo${i + 1}`, from: f + 3 }); f += d; });
  const total = f + (outro ? 60 : 30);
  const each = Math.ceil(total / cuts.length / 15) * 15;
  const scenes: Sc[] = cuts.map(([clip, st, rate]) => ({ d: each, v: [clip, { startFrom: Math.round(st * 30), rate, zoom: [1.02, 1.08] }] as V }));
  const cfg = mk(music, scenes, [{ kind: "words", from: 0, dur: f + 30, top: 250, size: 76, words }, ...(outro ? [{ kind: "words", from: f + 30, dur: each * cuts.length - f - 30, top: 250, size: 84, words: [{ t: outro, at: 2, pink: true }] }] : [])]);
  return { ...cfg, vo };
};

export const batch15: Record<string, ReelConfig> = {
  VoiceProcessA: mk("vp1", [
    VS(75, "t_long", 6, 1.4, "vpa_vo1", "This is how we make", "one custom bowl."),
    VS(75, "t_long", 72, 2, "vpa_vo2", "Fresh filament", "into the printer."),
    VS(75, "t_blue1", 2, 2.2, "vpa_vo3", "The blue half,", "layer by layer."),
    VS(75, "t_sup1", 1, 1.8, "vpa_vo4", "Every edge", "cleaned by hand."),
    VS(60, "th_p3", 2, 2.5, "vpa_vo5", "Same again:", "purple."),
    VS(75, "t_fit", 6, 1.6, "vpa_vo6", "Inside parts in.", "And… click.", { bAt: 30 }),
    { d: 30, v: ["th_join", { startFrom: Math.round(4.7 * 30 - 15), snapAt: 15, zoom: [1.04, 1.1] }] as V },
    VS(90, "t_steel1", 0.4, 1, "vpa_vo7", "Steel bowls in.", "Theo's bowl is ready."),
  ]),
  VoiceProcessB: mk("vp2", [
    VS(90, "t_bluewide", 0, 0.6, "vpb_vo1", "How is a 3D printed", "bowl made?", { size: 88 }),
    VS(75, "t_load", 4, 1.5, "vpb_vo2", "It starts with", "a clean print bed."),
    VS(75, "th_p2", 3, 3, "vpb_vo3", "Then", "6-12 hours of printing."),
    VS(75, "t_sup3", 0, 1.8, "vpb_vo4", "Supports off.", "Edges smoothed."),
    VS(60, "th_join", 4.2, 1, "vpb_vo5", "Two halves.", "One click.", { bAt: 16 }),
    VS(75, "t_close", 0, 0.8, "vpb_vo6", "And a name,", "made for one dog."),
  ]),
  VoiceQuotePatience: VQ("vq1", "vqc_", [["3D printing teaches you patience.", 90], ["Every object is built one layer at a time.", 90], ["Nothing worth making happens all at once.", 90]],
    [["th_p1", 2, 1.2], ["t_blue1", 4, 1.2], ["print_close", 2, 1], ["th_p4", 2, 1], ["t_blue2", 2, 1], ["t_close", 0, 0.7]], "Save this."),
  VoiceQuoteFirstLine: VQ("vq2", "vqd_", [["Every great thing starts as one thin line.", 90], ["Keep going.", 45], ["Layer by layer, it becomes something.", 75]],
    [["m_cyan_print", 0, 1], ["t_bluewide", 0, 0.6], ["th_p3", 1, 1.4], ["t_blue1", 6, 1.6], ["th_join", 4.4, 0.8], ["t_steel3", 1, 1]], "Send this to someone who needs it."),
};

// ---- Batch 16: joins in black & white that burst into colour on the click ----
const BW = (clip: string, d: number, at: number, rate = 1, zoom: [number, number] = [1.04, 1.1]) =>
  ({ d, v: [clip, { startFrom: Math.max(0, Math.round(KS[clip] * 30 - at * rate)), rate, snapAt: at, bw: true, zoom }] as V });
const bwRun = (order: string[], d: number, at: number) => order.map((c) => BW(c, d, at));
const capt = (from: number, dur: number, a: string, aAt: number, b: string, bAt: number) =>
  ({ kind: "words", from, dur, top: 280, size: 110, words: [{ t: a, at: aAt, box: true }, { t: b, at: bAt, pink: true, br: true }] });

export const batch16: Record<string, ReelConfig> = {
  BwAddColour: mk("bw1", [
    BW("k_blue", 60, 45), ...bwRun(["k_orange", "k_green", "k_pink", "k_bp2"], 30, 15),
    ...bwRun(["k_orange2", "k_green2", "k_blue", "k_pink", "k_bp2"], 30, 15), ...bwRun(["k_orange", "k_green", "k_blue", "k_pink"], 15, 8),
    BW("k_bp2", 90, 45, 0.5, [1.06, 1.18]),
  ], [capt(0, 60, "Just add", 3, "some colour.", 45), capt(390, 90, "Just add", 0, "some colour.", 45)]),
  BwClicks: mk("bw2", [
    BW("k_pink", 75, 60, 0.8), ...bwRun(["k_blue", "k_orange", "k_green", "k_bp2"], 30, 15),
    ...bwRun(["k_green2", "k_pink", "k_orange2", "k_blue", "k_bp2"], 30, 15),
    BW("k_orange", 90, 45, 0.45, [1.06, 1.18]),
  ], [capt(0, 75, "When everything just…", 3, "clicks.", 60), capt(345, 90, "When everything just…", 0, "clicks.", 45)]),
};

// ---- All our bowl models in one reel. Snap times (s): j_olive 1.15 (diagonal half seats), b_terra_asm 3.45 (second hand lets go),
// z_mint 1.0 (steel bowl drops in). On k_blue the second hand lets go ~1.6 s after the click and the bowl hangs from one hand. ----
const AT = (clip: string, snapSec: number, d: number, at: number, rate = 1, zoom: [number, number] = [1.03, 1.08]) =>
  ({ d, v: [clip, { startFrom: Math.max(0, Math.round(snapSec * 30 - at * rate)), rate, snapAt: at, zoom }] as V });
const MODEL = (from: number, dur: number, t: string) => ({ kind: "words", from, dur, top: 250, size: 92, words: [{ t, at: 2, pink: true }] });

export const batch17: Record<string, ReelConfig> = {
  // 15-second cut: same models, tighter
  AllModels15: mk("am2", [
    { d: 30, v: ["p_lineup", { rate: 1.5, zoom: [1, 1.06] }], c: L("x", null, "Every bowl", "we make.", { size: 104, bAt: 10 }) },
    KJ("k_orange", 15, 8), KJ("k_green", 15, 8), KJ("k_pink", 15, 8), KJ("k_bp2", 15, 8),
    AT("k_blue", 3.17, 90, 15),
    { d: 30, v: ["n_jam", { startFrom: 30, rate: 2, zoom: [1, 1.05] }] }, AT("z_mint", 1.0, 30, 15),
    AT("j_olive", 1.15, 30, 15),
    AT("b_terra_asm", 3.45, 45, 15),
    { d: 30, v: ["b_yp", { startFrom: 20, zoom: [1.03, 1.08] }] }, { d: 30, v: ["r_teo", { startFrom: 40, rate: 1.3, zoom: [1.03, 1.08] }] },
    { d: 60, v: ["p_lineup", { startFrom: 40, zoom: [1, 1.06] }], c: L("x", null, "Which one", "is yours?", { size: 104 }) },
  ], [
    MODEL(30, 150, "Magnetic Double"),
    { kind: "words", from: 150, dur: 30, top: 380, size: 70, words: [{ t: "Look, one hand.", at: 0, box: true }] },
    MODEL(180, 60, "Name & Paw"), MODEL(240, 30, "Diagonal Double"), MODEL(270, 45, "Pyramid Double"), MODEL(315, 60, "3 Layers"),
  ]),
  AllModels: mk("am1", [
    { d: 45, v: ["p_lineup", { rate: 1.3, zoom: [1, 1.06] }], c: L("x", null, "Every bowl", "we make.", { size: 104 }) },
    KJ("k_orange", 30, 15), KJ("k_green", 30, 15), KJ("k_pink", 30, 15), KJ("k_bp2", 30, 15),
    AT("k_blue", 3.17, 105, 15),
    { d: 60, v: ["n_jam", { startFrom: 10, rate: 1.5, zoom: [1, 1.05] }] }, AT("z_mint", 1.0, 30, 15),
    AT("j_olive", 1.15, 45, 15), { d: 30, v: ["c_diag", { startFrom: 20, zoom: [1.03, 1.08] }] },
    AT("b_terra_asm", 3.45, 60, 15), { d: 30, v: ["c_pyr", { startFrom: 30, zoom: [1.03, 1.08] }] },
    { d: 45, v: ["b_yp", { startFrom: 20, zoom: [1.03, 1.08] }] }, { d: 45, v: ["r_teo", { startFrom: 30, rate: 1.2, zoom: [1.03, 1.08] }] },
    { d: 60, v: ["p_lineup", { startFrom: 40, zoom: [1, 1.06] }], c: L("x", null, "Which one", "is yours?", { size: 104 }) },
  ], [
    MODEL(45, 225, "Magnetic Double"),
    { kind: "words", from: 228, dur: 42, top: 380, size: 70, words: [{ t: "Look, one hand.", at: 0, box: true }] },
    MODEL(270, 90, "Name & Paw"), MODEL(360, 75, "Diagonal Double"), MODEL(435, 90, "Pyramid Double"), MODEL(525, 90, "3 Layers"),
  ]),
};

export const batch18: Record<string, ReelConfig> = {
  // Theo's bowl, whole process in 14 s
  Theo15: mk("t15", [
    TP(30, "t_blue1", 0, 2, null, "Theo's bowl", "in 15 seconds.", { size: 100, bAt: 10 }),
    TP(15, "t_long", 9, 1.5), TP(15, "t_long", 75, 2.5), TP(15, "t_load", 5, 2), TP(15, "t_bluewide", 0, 1),
    TP(30, "t_blue1", 4, 3), TP(30, "t_bluepull", 3, 2), TP(30, "t_sup3", 1, 2), TP(30, "th_p2", 4, 3), TP(30, "t_purplepull", 5, 2), TP(30, "t_fit", 7, 2),
    AT("th_join", 5.2, 30, 15),
    TP(30, "t_unpack", 6, 1.5), TP(30, "t_steel1", 1, 1.2),
    TP(60, "t_close", 0, 0.8, null, "Theo's", "bowl.", { size: 110 }),
  ], [{ kind: "progress", from: 30, dur: 330 }]),
};

// ---- Batch 19: the user's own lines. The quote builds line by line (timing by word count) over matching footage. ----
const Q2 = (music: string, lines: string[], cuts: [string, number, number][], extra: any[] = []) => {
  const words: any[] = []; let f = 8;
  lines.forEach((t, i) => {
    const pink = t.startsWith("*"); const txt = t.replace(/^\*/, "");
    words.push({ t: txt, at: f, br: i > 0, box: !pink, pink });
    f += Math.max(24, txt.split(" ").length * 9);
  });
  const need = f + 75;
  const each = Math.max(45, Math.ceil(need / cuts.length / 15) * 15);
  const scenes: Sc[] = cuts.map(([clip, st, rate]) => ({ d: each, v: [clip, { startFrom: Math.round(st * 30), rate, zoom: [1.02, 1.08] }] as V }));
  return mk(music, scenes, [{ kind: "words", from: 0, dur: each * cuts.length, top: 240, size: 72, words }, ...extra]);
};

export const batch19: Record<string, ReelConfig> = {
  F01OneFile: Q2("f01", ["This took one file,", "two colors,", "*and about a day of waiting."],
    [["p_cad_green", 0, 1.5], ["th_p1", 1, 2.5], ["t_blue1", 3, 2.5], ["t_fit", 7, 1.6], ["th_join", 4.4, 1], ["t_close", 0, 0.8]]),
  F02Setup: Q2("f02", ["Nobody tells you", "the hardest part of running", "a 3D printing business", "is setting it up correctly -", "*not the printing."],
    [["w_8803", 0, 1.5], ["t_long", 70, 2.5], ["t_load", 3, 1.6], ["p_mint_load", 2, 2.5], ["p_yellow0", 1, 1.5], ["th_p2", 4, 2.5]]),
  F03NotCheap: Q2("f03", ["“3D printed” doesn't mean “cheap.”", "It means somebody chose", "*to do it their way."],
    [["t_sup3", 0, 1.6], ["t_fit", 6, 1.5], ["th_join", 4.4, 1], ["t_steel1", 0.5, 1], ["t_close", 0, 0.8]]),
  F04OneStep: Q2("f04", ["There's one step in this process", "that decides if the whole thing looks", "handmade or homemade.", "*Stick around."],
    [["th_p1", 1, 2], ["t_blue1", 2, 2.5], ["t_bluepull", 2, 1.5], ["t_purplepull", 4, 1.6], ["t_sup1", 0, 1.4], ["t_sup3", 0, 1.4], ["t_sup2", 0, 1]]),
  F05Fine: Q2("f05", ["If your 3D printed product looks “fine,”", "you skipped a step.", "*“Fine” is not a compliment."],
    [["t_bluepull", 2, 1.5], ["t_sup1", 1, 1.6], ["p_sup_grey", 2, 1.5], ["t_sup3", 2, 1.6], ["t_close", 0, 0.8]]),
  F06Warehouse: Q2("f06", ["You don't need a warehouse", "to run a real business.", "*You need a printer that doesn't quit on you."],
    [["w_8803", 0, 1.5], ["p_mint_long", 200, 2.5], ["p_yellow", 150, 2.5], ["th_p2", 4, 2.5], ["n_pack", 4, 2.5], ["box", 0, 0.6]]),
  F13Inspector: Q2("f13", ["4 letters.", "Two colors.", "*One very opinionated quality inspector with a tail."],
    [["t_close", 0, 0.7], ["th_join", 4.4, 1], ["qc_new", 3, 0.8], ["dog", 1, 1], ["dog2", 0, 1]]),
  F14ShowingUp: Q2("f14", ["She didn't ask for a job.", "She just started showing up", "*every time something new came off the printer."],
    [["qc_new", 0, 0.8], ["t_bluepull", 2, 1.5], ["dog", 1, 1], ["r_teo", 1, 1.2], ["qc_new", 4, 0.6], ["d_studio", 0.3, 1]]),
  F15Minimalism: Q2("f15", ["Your dog doesn't care", "about minimalism.", "*Neither should their bowl."],
    [["d_tongue", 0, 0.8], ["b_yp", 0.6, 1], ["k_orange", 1, 1], ["k_pink", 2, 1], ["k_bp2", 0.8, 1], ["dog2", 0, 1]]),
  F16Materials: Q2("f16", ["There's a reason this bowl", "has two different materials in it,", "*and it's not for looks."],
    [["t_unpack", 0, 1.4], ["t_unpack", 6, 1.2], ["t_steel1", 0.5, 1], ["z_mint", 0.3, 1], ["t_steel3", 1, 1], ["n_jam", 0.3, 1.5]]),
  F23TwoFiles: Q2("f23", ["Two files.", "One license upgrade.", "The difference between a hobby", "*and something you can actually sell."],
    [["p_cad_blue", 0, 1.5], ["p_cad_blue2", 0, 1.2], ["print_blue2", 0.5, 1.5], ["p_sup_blue", 2, 2], ["p_blue_final", 1, 1]]),
  F24OneLine: Q2("f24", ["There's one line in every STL license", "*that most people never read until it's too late."],
    [["p_cad_green", 0, 1.4], ["p_cad_blue", 1, 1.4], ["print_green", 0.5, 2], ["p_green_peel", 2, 2], ["n_nugget_wb", 0.5, 1]]),
  F25BeforeAfter: Q2("f25", ["Before: a file sitting", "in your downloads folder.", "*After: a certificate with your name on it", "*and the right to actually sell."],
    [["p_cad_blue", 0, 1.2], ["p_cad_blue2", 0, 1.2], ["print_blue", 0.5, 1.2], ["p_blue_final", 1, 1], ["n_pack", 4, 2.5], ["box", 0, 0.6]]),
  F31Handmade: Q2("f31", ["“3D printed” isn't a downgrade", "from “handmade.”", "On a small scale,", "*it basically is handmade."],
    [["t_sup3", 0, 1.5], ["t_fit", 5, 1.5], ["t_unpack", 6, 1.2], ["th_join", 4.4, 1], ["t_steel3", 1, 1], ["t_close", 0, 0.8]]),
};

// ---- Batch 20: family studio, models, licences, map (new star clips w_8983–8987), studio details, STL ----
const LAB = (clip: string, d: number, st: number, rate: number, t: string, o: any = {}) =>
  ({ d, v: [clip, { startFrom: Math.round(st * 30), rate, zoom: [1.02, 1.08] }] as V, c: L("x", null, "", t, { bAt: 4, size: 96, boxed: true, ...o }) });

export const batch20: Record<string, ReelConfig> = {
  FamilyStudio: mk("fs1", [
    { d: 75, v: ["f_kids2", { startFrom: 30, rate: 0.9, zoom: [1, 1.05] }], c: L("x", null, "This is what we mean when we say", "“small family studio.”", { size: 76, boxed: true }) },
    LAB("f_kids3", 60, 2, 1, "The team."),
    LAB("qc_new", 60, 2, 0.8, "Head of quality control."),
    LAB("f_kids2", 60, 6, 1, "Junior makers."),
    LAB("f_drawing", 45, 0.3, 1, "Art department."),
    LAB("f_kids3", 60, 11, 1, "Everyone helps."),
    LAB("dog2", 60, 0, 1, "Even the dog.", { top: 140, size: 80 }),
  ]),
  Personality: mk("ps1", [
    { d: 75, v: ["d_tongue", { rate: 0.6 }], c: L("d_tongue", null, "Because your dog deserves a bowl", "that matches their personality.", { size: 70, boxed: true }) },
    { ...KJ("k_orange", 45, 22), c: tag("Loud.") }, { ...KJ("k_blue", 45, 22), c: tag("Calm.") }, { ...KJ("k_green", 45, 22), c: tag("Grounded.") },
    { ...KJ("k_pink", 45, 22), c: tag("Sweet.") }, { ...KJ("k_bp2", 45, 22), c: tag("A bit of both.") },
    { d: 60, v: ["dog", { startFrom: 30 }], c: L("dog", null, "", "Which one is yours?", { bAt: 4, size: 76 }) },
  ]),
  LicenseChoice: mk("lc1", [
    LAB("p_cad_blue", 60, 0, 1.4, "Print it for your dog…"),
    LAB("print_blue2", 45, 0.5, 1.5, "…in any colour."),
    LAB("p_blue_final", 45, 1, 1, "Done by Sunday."),
    LAB("n_pack", 60, 4, 2.5, "…or sell the printed ones."),
    { d: 105, v: ["box", { rate: 0.5, zoom: [1.3, 1.34], y: 300 }], c: { kind: "card", title: "Choose your license", titleSize: 80, top: 230, bullets: [{ t: "Personal: print for your own dog", at: 20, mark: "1" }, { t: "Commercial: sell what you print", at: 44, mark: "2" }] } },
  ]),
  MapStarA: mk("ms1", [
    LAB("w_8983", 60, 0, 1, "Every day…"),
    LAB("w_8985", 75, 0.5, 1, "…a new star on our map."),
    LAB("w_8986", 75, 3, 1.4, "One star. One order."),
    LAB("w_8987", 75, 0, 1.4, "Where should the next one go?", { size: 80 }),
  ]),
  MapStarB: mk("ms2", [
    LAB("w_8987", 60, 0, 1.6, "Our orders map."),
    LAB("w_8984", 75, 1.5, 1.4, "New day."),
    LAB("w_8986", 75, 5, 1.3, "New star."),
    LAB("w_8983", 60, 1, 1, "And counting."),
    LAB("w_8987", 60, 3.5, 1, "Will you be next?"),
  ]),
  StudioDetails: mk("sd6", [
    { d: 60, v: ["w_8799", { rate: 1.6, zoom: [1, 1.05] }], c: L("x", null, "What a real family studio", "looks like", { size: 84, boxed: true }) },
    LAB("f_drawing", 45, 0.2, 1, "The art."), LAB("f_kids3", 45, 13, 1, "The team."), LAB("f_tools", 45, 0, 1, "The tools."),
    LAB("w_8803", 45, 1, 1.5, "The printers."), LAB("w_8987", 45, 1, 1.5, "The map."), LAB("w_8794", 45, 1, 1.4, "The workbench."),
    LAB("qc_new", 60, 4, 0.6, "The boss."),
  ]),
  StartedHere: mk("sh7", [
    { d: 90, v: ["w_8799", { rate: 0.9, zoom: [1, 1.06] }], c: L("x", null, "", "This all started here.", { bAt: 6, size: 96, boxed: true }) },
    LAB("w_8803", 60, 0, 1, "A small room in Barcelona."),
    LAB("w_8794", 60, 0.5, 1, "One workbench."),
    LAB("w_8787", 1, 0, 1, ""),
  ].filter((x: any) => (x.v as V)[0] !== "w_8787").concat([
    LAB("p_lineup", 60, 0.5, 1, "Our bowls."),
    LAB("w_8987", 60, 1, 1.2, "Our orders, around the world."),
    LAB("qc_new", 60, 4, 0.6, "Still the same room."),
  ])),
  StlHowTo: mk("st8", [
    LAB("p_cad_blue", 60, 0, 1.4, "Got a 3D printer?"),
    LAB("p_cad_blue2", 45, 0, 1.2, "1. Download the STL."),
    LAB("print_blue2", 45, 0.5, 1.5, "2. Print."),
    LAB("p_sup_blue", 45, 2, 2, "3. Clean up."),
    { ...KJ("k_blue", 45, 25), c: L("x", null, "", "4. Snap.", { bAt: 25, size: 96, boxed: true }) },
    LAB("p_blue_final", 60, 1, 1, "Personal or commercial license.", { size: 80 }),
  ]),
  StlColours: mk("st9", [
    LAB("p_cad_green", 60, 0, 1.4, "One STL file."),
    { ...KJ("k_orange", 30, 15), c: tag("Orange?") }, { ...KJ("k_green", 30, 15), c: tag("Green?") }, { ...KJ("k_pink", 30, 15), c: tag("Pink?") },
    { ...KJ("k_blue", 30, 15), c: tag("Blue?") }, { ...KJ("k_bp2", 30, 15), c: tag("Two colours?") },
    LAB("p_lineup", 60, 0.5, 1, "Your printer. Your colours."),
  ]),
};

// ---- Batch 21: the failed "spaghetti" print (fail.mp4: wide shot of the tangle 0–2.2 s, close-up of the empty bed 2.6–4.4 s), and THEO in Spanish ----
export const batch21: Record<string, ReelConfig> = {
  FailExpectation: mk("fl1", [
    LAB("t_blue1", 60, 2, 2, "What we planned:"),
    LAB("fail", 75, 0, 0.6, "What we got:"),
    LAB("fail", 60, 2.4, 0.6, "Spaghetti.", { size: 104 }),
    LAB("t_load", 45, 4, 1.6, "Clean the bed."),
    LAB("t_blue1", 45, 6, 2.5, "Try again."),
    LAB("t_close", 60, 0, 0.8, "Worth it."),
  ]),
  FailNobodyPosts: mk("fl2", [
    { d: 90, v: ["fail", { rate: 0.5, zoom: [1, 1.08] }], c: L("x", null, "The part of 3D printing", "nobody posts.", { size: 88, boxed: true }) },
    { d: 60, v: ["fail", { startFrom: 70, rate: 0.6, zoom: [1.05, 1.15] }], c: L("x", null, "", "It happens.", { bAt: 6, size: 100, boxed: true }) },
    LAB("t_long", 45, 72, 2.5, "Check the setup."),
    LAB("t_load", 45, 4, 1.6, "Clean the bed."),
    LAB("t_blue1", 45, 4, 2.5, "Start again."),
    LAB("t_close", 60, 0, 0.8, "And move on."),
  ]),
  FailRate: mk("fl3", [
    { d: 105, v: ["fail", { rate: 0.4, zoom: [1, 1.1] }], c: L("x", null, "Rate this print", "1 to 10.", { size: 100, boxed: true }) },
    { d: 45, v: ["fail", { startFrom: 80, rate: 0.8, zoom: [1.05, 1.12] }], c: L("x", null, "", "(It was supposed to be a bowl.)", { bAt: 4, size: 72, boxed: true }) },
    LAB("t_close", 60, 0, 0.8, "This is the bowl."),
    { d: 45, v: ["fail", { startFrom: 20, rate: 1 }], c: L("x", null, "", "Comment your worst fail.", { bAt: 4, size: 80 }) },
  ]),
  EsFailExpectation: mk("fl4", [
    LAB("t_blue1", 60, 2, 2, "Lo que planeamos:"),
    LAB("fail", 75, 0, 0.6, "Lo que salió:"),
    LAB("fail", 60, 2.4, 0.6, "Espaguetis.", { size: 104 }),
    LAB("t_load", 45, 4, 1.6, "Limpiar la cama."),
    LAB("t_blue1", 45, 6, 2.5, "Volver a empezar."),
    LAB("t_close", 60, 0, 0.8, "Vale la pena."),
  ]),
  EsFailNobodyPosts: mk("fl5", [
    { d: 90, v: ["fail", { rate: 0.5, zoom: [1, 1.08] }], c: L("x", null, "La parte de la impresión 3D", "que nadie publica.", { size: 80, boxed: true }) },
    { d: 60, v: ["fail", { startFrom: 70, rate: 0.6, zoom: [1.05, 1.15] }], c: L("x", null, "", "Pasa.", { bAt: 6, size: 110, boxed: true }) },
    LAB("t_long", 45, 72, 2.5, "Revisa la configuración.", { size: 84 }),
    LAB("t_load", 45, 4, 1.6, "Limpia la cama."),
    LAB("t_blue1", 45, 4, 2.5, "Empieza de nuevo."),
    LAB("t_close", 60, 0, 0.8, "Y sigue adelante."),
  ]),
  EsFailRate: mk("fl6", [
    { d: 105, v: ["fail", { rate: 0.4, zoom: [1, 1.1] }], c: L("x", null, "Puntúa esta impresión", "del 1 al 10.", { size: 92, boxed: true }) },
    { d: 45, v: ["fail", { startFrom: 80, rate: 0.8, zoom: [1.05, 1.12] }], c: L("x", null, "", "(Iba a ser un cuenco.)", { bAt: 4, size: 76, boxed: true }) },
    LAB("t_close", 60, 0, 0.8, "Este es el cuenco."),
    { d: 45, v: ["fail", { startFrom: 20, rate: 1 }], c: L("x", null, "", "Cuéntanos tu peor fallo.", { bAt: 4, size: 80 }) },
  ]),

  // Spanish
  EsTheoProceso: mk("et1", [
    TP(60, "t_long", 6, 1.4, null, "Así hacemos", "el cuenco de Theo.", { size: 92 }),
    TP(45, "t_long", 72, 2.5, "1", "Cargamos el filamento."),
    TP(45, "t_load", 4, 1.6, "2", "Limpiamos la cama."),
    TP(45, "t_blue1", 2, 2.5, "3", "Imprimimos la mitad azul."),
    TP(45, "t_sup3", 0, 1.8, "4", "Repasamos cada borde."),
    TP(45, "th_p2", 3, 2.5, "5", "Ahora, la morada."),
    TP(45, "t_fit", 6, 1.6, "6", "Las piezas de dentro."),
    { ...AT("th_join", 5.2, 45, 22), c: L("x", "7", "¡Clic!", undefined, { size: 110 }) },
    TP(60, "t_close", 0, 0.8, null, "El cuenco", "de Theo.", { size: 110 }),
  ]),
  EsTheo15: mk("et2", [
    TP(30, "t_blue1", 0, 2, null, "El cuenco de Theo", "en 15 segundos.", { size: 92, bAt: 10 }),
    TP(15, "t_long", 9, 1.5), TP(15, "t_long", 75, 2.5), TP(15, "t_load", 5, 2), TP(15, "t_bluewide", 0, 1),
    TP(30, "t_blue1", 4, 3), TP(30, "t_bluepull", 3, 2), TP(30, "t_sup3", 1, 2), TP(30, "th_p2", 4, 3), TP(30, "t_purplepull", 5, 2), TP(30, "t_fit", 7, 2),
    AT("th_join", 5.2, 30, 15), TP(30, "t_unpack", 6, 1.5), TP(30, "t_steel1", 1, 1.2),
    TP(60, "t_close", 0, 0.8, null, "Hecho para", "Theo.", { size: 110 }),
  ], [{ kind: "progress", from: 30, dur: 330 }]),
  EsTheoPov: mk("et3", [
    TP(60, "t_long", 7, 1.3, null, "POV: eres", "el filamento morado.", { size: 92 }),
    TP(45, "t_long", 12, 1.4, null, "", "Fuera de la bolsa.", { bAt: 3 }),
    TP(60, "t_long", 70, 2, null, "", "Dentro de la máquina.", { bAt: 3 }),
    TP(60, "th_p1", 2, 2, null, "", "Capa a capa.", { bAt: 3 }),
    TP(45, "t_purplepull", 5, 1.6, null, "", "Fuera de la cama.", { bAt: 3 }),
    TP(60, "th_join", 4.7, 1.1, null, "", "Conoce a la mitad azul.", { bAt: 3, size: 84 }),
    TP(60, "t_close", 0, 0.9, null, "Y acaba siendo", "la cena de Theo.", { size: 92 }),
  ]),
};

// ---- Batch 22: STL / process hooks. Fast cuts (~1 s each) under a quote that builds line by line. ----
type Cut3 = [string, number, number, number?]; // clip, start (s), rate, frames (default 30)
const H = (music: string, lines: string[], cuts: Cut3[], o: { top?: number; size?: number; end?: string } = {}) => {
  const scenes: Sc[] = cuts.map(([clip, st, rate, d = 30]) => ({ d, v: [clip, { startFrom: Math.round(st * 30), rate, zoom: [1.03, 1.09] }] as V }));
  const total = scenes.reduce((a, x) => a + x.d, 0);
  const words: any[] = []; let f = 6;
  lines.forEach((t, i) => {
    const pink = t.startsWith("*"); const txt = t.replace(/^\*/, "");
    words.push({ t: txt, at: f, br: i > 0, box: !pink, pink });
    f += Math.max(20, txt.split(" ").length * 8);
  });
  const endFrom = o.end ? total - 60 : total;
  const extra: any[] = [{ kind: "words", from: 0, dur: endFrom, top: o.top ?? 240, size: o.size ?? 76, words }];
  if (o.end) extra.push({ kind: "words", from: endFrom, dur: 60, top: o.top ?? 240, size: 88, words: [{ t: o.end, at: 2, pink: true }] });
  return mk(music, scenes, extra);
};
// reusable runs of process footage
const PRINT: Cut3[] = [["t_bluewide", 0, 1], ["t_blue1", 3, 3], ["th_p3", 2, 3], ["print_close", 1, 2], ["p_mint_long", 200, 3], ["p_yellow", 150, 3], ["th_p2", 5, 3], ["t_blue2", 3, 3]];
const PULLS: Cut3[] = [["t_bluepull", 2, 1.5, 45], ["r_olive", 2, 1.8, 45], ["t_purplepull", 4, 1.6, 45], ["r_grey", 1.6, 1.4, 45], ["p_mint_remove", 1, 1.6, 45], ["r_greydiag", 3, 1.8, 45], ["p_yellow_remove", 4, 1.6, 45], ["r_nellie", 2, 1.6, 45], ["p_terra_peel", 1, 2.5, 45]];
const SNAPS: Cut3[] = [["k_orange", 1.07, 1], ["k_green", 0.93, 1], ["k_pink", 2.05, 1], ["k_blue", 2.67, 1], ["k_bp2", 0.88, 1]];

export const batch22: Record<string, ReelConfig> = {
  H01Barcelona: H("h01", ["Designed in Barcelona.", "*Printed all over the world", "*with our STL files."],
    [["w_8803", 0, 1.6, 45], ["p_cad_green", 0, 1.5, 45], ["p_cad_blue", 0, 1.5], ["print_green", 0.5, 2], ["t_blue1", 3, 3], ["t_sup3", 1, 2], ["th_join", 4.2, 1], ["w_8840", 2, 1.5, 45], ["w_8987", 0, 1.5, 45], ["w_8839", 3, 1.4, 45], ["w_8987", 3.5, 1.2, 45]]),
  H02Overnight: H("h02", ["My printer made this", "overnight while I slept.", "*You can print it too -", "*with our STL file."],
    [["p_yellow0", 0, 2], ["p_yellow", 60, 4], ["p_yellow", 250, 4], ["th_p1", 2, 4], ["th_p4", 1, 3], ["t_blue1", 6, 4], ["t_bluepull", 3, 1.5], ["t_sup3", 2, 2], ["th_join", 4.2, 1], ["t_steel1", 1, 1.2], ["t_close", 0, 0.8, 60]]),
  H03Satisfying: H("h03", ["The most", "*satisfying moment."], PULLS, { top: 240, size: 96 }),
  H04OnePiece: H("h04", ["No screws.", "No glue.", "*Prints in one piece."],
    [["p_yellow0", 0, 1.6], ["p_yellow", 80, 3], ["p_yellow", 300, 3], ["p_yellow", 450, 2.5], ["p_yellow_remove", 2, 1.6, 45], ["p_yellow_remove", 6, 1.6], ["b_yp", 0.5, 1, 45], ["r_teo", 1, 1.2, 45], ["b_yp2", 1, 1, 60]], { size: 96 }),
  H11Download: H("h11", ["Download.", "Slice.", "*Print.", "*That's it."],
    [["p_cad_blue", 0, 1.6], ["p_cad_blue2", 0, 1.4], ["p_cad_green", 1, 1.6], ["print_blue2", 0.5, 2], ["t_blue1", 2, 3], ["print_blue", 1, 2], ["t_bluepull", 2, 1.5], ["p_sup_blue", 2, 2], ["k_blue", 2.67, 1], ["p_blue_final", 1, 1, 45]], { size: 96 }),
  H12Tonight: H("h12", ["Got a printer?", "*You can have this by tonight."],
    [["k_bp2", 0.5, 1, 45], ["p_cad_blue", 0, 1.6], ["t_bluewide", 0, 1], ["t_blue1", 4, 4], ["th_p2", 4, 4], ["t_bluepull", 3, 1.5], ["t_sup1", 2, 2], ["t_fit", 7, 2], ["th_join", 4.2, 1], ["t_steel1", 1, 1.2], ["t_close", 0, 0.8, 45]], { size: 88 }),
  H18Idle: H("h18", ["Printer sitting idle?", "*Here's your weekend project."],
    [["p_terra_bed", 0, 1.4, 45], ["p_cad_green", 0, 1.6], ["print_green", 0.5, 2.5], ["p_green_peel", 2, 2.5], ["p_green_asm", 2, 1.6, 45], ["k_green", 0.93, 1], ["n_nugget_wb", 0.5, 1], ["p_lineup", 0.5, 1.2, 45]], { size: 88 }),
  H19LegallySell: H("h19", ["Printing to sell?", "*Here's a model you can legally sell."],
    [["p_lineup", 0, 1.4, 45], ...SNAPS, ["p_yellow", 200, 3], ["r_olive", 2, 1.8], ["n_pack", 4, 2.5, 45], ["n_pack", 12, 2.5], ["box", 0, 0.6, 45]], { size: 84, end: "Commercial license available." }),
  H24SixDesigns: H("h24", ["Want to sell dog bowls?", "Start with our 6 designs", "*+ a commercial license."],
    [["p_lineup", 0, 1.3, 45], ["k_orange", 1.07, 1], ["k_pink", 2.05, 1], ["c_diag", 0.5, 1], ["c_pyr", 0.5, 1], ["n_jam", 1, 1.6], ["b_yp", 0.5, 1], ["p_yellow", 200, 3], ["r_grey", 1.6, 1.4], ["n_pack", 4, 2.5, 45], ["box", 0, 0.6, 45]], { size: 80 }),
  H26TwelveHours: H("h26", ["12 hours of printing", "*in 15 seconds."],
    [["t_bluewide", 0, 1, 30], ["t_blue3", 0, 4], ["t_blue1", 2, 5], ["t_blue1", 9, 5], ["t_blue2", 3, 5], ["t_bluepull", 3, 1.5], ["th_p1", 1, 4], ["th_p3", 2, 5], ["th_p2", 4, 5], ["th_p4", 2, 5], ["t_purplepull", 5, 1.6], ["th_join", 4.2, 1, 45], ["t_close", 0, 0.8, 45]], { size: 92 }),
  H27ThisOne: H("h27", ["The most satisfying moment", "in 3D printing.", "*This one."],
    [["t_bluepull", 2, 1.2, 60], ["t_purplepull", 4, 1.3, 60], ["r_teo", 0.5, 1, 45], ["p_mint_remove", 1, 1.3, 45], ["r_nellie", 2, 1.4, 45], ["p_yellow_remove", 4, 1.4, 45]], { size: 84 }),
  H29Layer200: H("h29", ["Watch layer 200.", "*That's where the magic starts."],
    [["m_cyan_print", 0, 1, 45], ["print_close", 0, 1.3, 45], ["th_p3", 1, 2], ["th_p1", 2, 3], ["th_p2", 3, 3], ["th_p4", 1, 2], ["t_blue2", 3, 2.5], ["p_mint_tall", 0, 0.8, 45], ["t_close", 0, 0.8, 45]], { size: 88 }),
  H33Binned: H("h33", ["I binned 400g of filament", "*so you don't have to."],
    [["fail", 0, 0.6, 60], ["fail", 2.4, 0.6, 45], ["t_long", 72, 2.5], ["t_load", 4, 1.6], ["t_blue1", 3, 3], ["t_bluepull", 3, 1.5], ["t_sup3", 1, 2], ["th_join", 4.2, 1], ["t_close", 0, 0.8, 45]], { size: 84, end: "Our STL files are tested." }),
  H42DogsName: H("h42", ["A bowl with your dog's name on it.", "*Prints in one evening."],
    [["name", 0.5, 1, 45], ["n_nugget_wb", 0.5, 1], ["n_jam", 1, 1.6], ["t_close", 0, 0.9], ["n_nellie", 3, 1], ["print_green", 0.5, 2.5], ["p_green_peel", 2, 2.5], ["k_green", 0.93, 1], ["dog2", 0, 1, 45]], { size: 80 }),
  H47WouldYou: H("h47", ["Would you print this?"],
    [["t_close", 0, 0.8, 45], ["t_blue1", 3, 3], ["th_p2", 4, 3], ["t_sup3", 1, 2], ["th_join", 4.2, 1], ["b_yp", 0.5, 1], ["k_orange", 1.07, 1], ["k_bp2", 0.88, 1]], { size: 100, end: "Yes or no?" }),
  H50NextWeek: H("h50", ["What should I print next week?", "*The most-liked idea becomes an STL."],
    [["w_8803", 0, 1.6, 45], ["p_cad_green", 0, 1.5], ["print_close", 1, 2], ["p_yellow", 150, 3], ["th_p2", 4, 3], ["r_olive", 2, 1.8], ["p_lineup", 0.5, 1.2, 45]], { size: 80, end: "Comment your idea." }),
};

// ---- Batch 23: pumpkin (orange filament → model → print → off the bed → steel bowl in), new stars on the map ----
// pk_9371 spool in hand, pk_9370 unwrapping, pk_9340 spool on the printer, pk_9337–9339 model on the laptop, pk_9336 bed prep,
// pk_9342 first layers, pk_9360/61/62 the pumpkin growing, pk_9366/67 off the bed, pk_9368 in hand, pk_9369 steel bowl drops in at ~3.5 s
const PK_FULL: Cut3[] = [["pk_9371", 0.5, 1.4], ["pk_9370", 2, 2], ["pk_9340", 8, 3], ["pk_9337", 1, 1.5], ["pk_9336", 4, 1.6], ["pk_9342", 2, 3], ["pk_9342", 14, 3],
  ["pk_9360", 2, 3], ["pk_9362", 6, 3], ["pk_9361", 4, 2], ["pk_9360", 14, 3], ["pk_9366", 3, 1.4, 45], ["pk_9368", 1, 1, 45], ["pk_9369", 2.5, 1, 45]];

export const batch23: Record<string, ReelConfig> = {
  PkCozy: H("pk1", ["Your dog also needs", "*a cozy autumn vibe."],
    [["d_sofa", 1.5, 0.6, 45], ["pk_9342", 3, 3], ["pk_9360", 3, 3], ["pk_9362", 8, 3], ["pk_9366", 3, 1.4, 45], ["pk_9369", 2.5, 1, 60], ["d_tongue", 0, 0.6, 45]], { size: 88, end: "Pumpkin bowl season." }),
  PkFromSpool: H("pk2", ["From a spool of orange…", "*to a pumpkin."], PK_FULL, { size: 88 }),
  PkThreeUses: mk("pk3", [
    LAB("pk_9360", 60, 2, 2.5, "One pumpkin."),
    LAB("pk_9362", 45, 8, 3, "Three jobs."),
    { ...{ d: 75, v: ["pk_9369", { startFrom: 60, rate: 1, snapAt: 45, zoom: [1.03, 1.08] }] as V }, c: L("x", "1", "A dog bowl.", undefined, { size: 100 }) },
    { d: 60, v: ["pk_9368", { startFrom: 15, zoom: [1.03, 1.08] }], c: L("x", "2", "Storage.", "Treats, toys, leads.", { size: 92 }) },
    { d: 60, v: ["pk_9367", { startFrom: 240, rate: 1.2, zoom: [1.03, 1.08] }], c: L("x", "3", "Autumn decor.", undefined, { size: 100 }) },
    LAB("pk_9368", 60, 5, 0.8, "Which one is yours?"),
  ]),
  PkWatchGrow: H("pk4", ["Watch a pumpkin", "*grow on our printer."],
    [["pk_9342", 0, 2], ["pk_9342", 8, 3], ["pk_9342", 18, 3], ["pk_9360", 0, 3], ["pk_9360", 8, 3], ["pk_9360", 16, 3], ["pk_9362", 4, 3], ["pk_9362", 14, 3], ["pk_9361", 6, 2], ["pk_9366", 3, 1.4, 45], ["pk_9368", 2, 1, 45]], { size: 88 }),
  PkNotOnlyDogs: H("pk5", ["Not just for dogs.", "Snacks. Keys. Yarn.", "*Or just autumn on your shelf."],
    [["pk_9368", 0, 1, 45], ["pk_9337", 1, 1.6], ["pk_9340", 20, 3], ["pk_9342", 6, 3], ["pk_9360", 10, 3], ["pk_9362", 18, 3], ["pk_9367", 4, 1.6, 45], ["pk_9369", 2.5, 1, 45], ["pk_9368", 6, 0.8, 45]], { size: 80 }),

  MapStar1: H("ms3", ["New orders,", "*new stars."],
    [["mp_9373", 0, 1.2, 45], ["mp_9374", 1, 1.2, 45], ["mp_9375", 2, 1.2, 45], ["mp_9376", 0.5, 1, 45], ["mp_9378", 2, 1.2, 45], ["mp_9377", 1, 1.2, 45], ["mp_9372", 1, 1.2, 45]], { size: 100, end: "Where's yours?" }),
  MapStar2: H("ms4", ["Every star on this wall", "is an order", "*that found its home."],
    [["mp_9372", 0, 1.4, 45], ["mp_9378", 2, 1, 60], ["mp_9374", 1, 1, 60], ["mp_9377", 1.5, 1, 60], ["mp_9373", 5, 1.2, 45]], { size: 80, end: "Could the next one be you?" }),
  MapStar3: H("ms5", ["This week", "*on our orders map."],
    [["mp_9376", 0, 0.8, 45], ["mp_9378", 3, 1.4], ["mp_9374", 2, 1.4], ["mp_9375", 3, 1.4], ["mp_9377", 2, 1.4], ["mp_9373", 4, 1.4], ["mp_9372", 4, 1.2, 60]], { size: 96 }),
};

// ---- Batch 24: Pumba (green + grey wave double bowl) and Swane Eddy (sand + mauve double bowl, two names) process reels ----
// snap moments (halves fully together): pu_6158 5.8 s, se_6169 3.9 s, br_9574 0.95 s. No magnet shots (pu_9512, se_9509–9511, se_6151): the user asked to keep them out.
const PU_PROC: Cut3[] = [["pu_9403", 0.5, 1], ["pu_9406", 10, 3], ["pu_9406", 35, 3], ["pu_9418", 1, 2], ["pu_9418", 9, 2.5], ["pu_9427", 2, 3], ["pu_9427", 10, 3],
  ["pu_9430", 2, 1.4], ["pu_9433", 3, 3], ["pu_9433", 12, 3], ["pu_9499", 1, 2], ["pu_9450", 4, 1.6], ["pu_9503", 6, 1.6], ["pu_6153", 3, 1.5], ["pu_6157", 4, 2], ["pu_6156", 1, 1.2]];
const SE_PROC: Cut3[] = [["se_9451", 0.5, 1], ["se_9452", 20, 3], ["se_9452", 50, 3], ["se_9457", 3, 1.6], ["se_9455", 2, 3], ["se_9455", 12, 3], ["se_9493", 4, 3], ["se_9493", 11, 3],
  ["se_9494", 1, 1.2], ["se_6134", 2, 1.4], ["se_6135", 3, 1.4], ["se_9458", 2, 1.6], ["se_6146", 1, 1.2], ["se_6147", 1, 1.2]];
const PU_SNAP = AT("pu_6158", 5.8, 150, 90, 1, [1.02, 1.08]); // whole join: halves apart → click → finished bowl
const SE_SNAP = AT("se_6169", 3.9, 150, 72, 1, [1.02, 1.08]);
const BR_SNAP = AT("br_9574", 0.95, 120, 28, 1, [1.02, 1.08]); // Bruno joined in hands on the black wall
// process cuts, then the snap as the last shot (it matters most)
const HS = (music: string, lines: string[], cuts: Cut3[], snap: Sc, o: { top?: number; size?: number; end?: string } = {}) => {
  const base = H(music, lines, cuts, { ...o, end: undefined });
  const scenes: Sc[] = cuts.map(([clip, st, rate, d = 30]) => ({ d, v: [clip, { startFrom: Math.round(st * 30), rate, zoom: [1.03, 1.09] }] as V }));
  const cfg = mk(music, [...scenes, snap]);
  const captions = base.captions.map((c: any) => ({ ...c, dur: cfg.duration - (o.end ? 75 : 0) }));
  if (o.end) captions.push({ kind: "words", from: cfg.duration - 75, dur: 75, top: o.top ?? 240, size: 92, words: [{ t: o.end, at: 32, pink: true }] });
  return { ...cfg, captions };
};

const BR_PROC: Cut3[] = [["br_9504", 4, 2.5], ["br_9504", 18, 3], ["br_9504", 38, 3], ["br_6183", 0, 0.8], ["br_6183", 1.2, 1.2, 45], ["br_6185", 0.3, 0.8], ["br_6185", 1.5, 1.2, 45],
  ["br_9586", 0.2, 1], ["br_9587", 0.2, 1], ["br_9588", 0.1, 0.7], ["br_9593", 0.3, 1.3, 45], ["br_9593", 3.2, 1.2, 45]];

export const batch24: Record<string, ReelConfig> = {
  PuProcess: HS("pu1", ["POV: you ordered", "a bowl for Pumba.", "*Here's every step."], PU_PROC, PU_SNAP, { size: 84, end: "Click." }),
  PuWave: HS("pu2", ["Green waves.", "Grey base.", "*Now watch it click."],
    [["pu_9405", 1, 1], ["pu_9406", 20, 3], ["pu_9418", 4, 2.5], ["pu_9418", 12, 2.5], ["pu_9427", 4, 3], ["pu_9427", 14, 2.5], ["pu_9430", 2, 1.4], ["pu_9433", 6, 3], ["pu_9499", 2, 2], ["pu_9503", 8, 1.6], ["pu_6153", 5, 1.4], ["pu_6157", 8, 2], ["pu_6154", 0.2, 1]], PU_SNAP, { size: 96 }),
  PuEvery: HS("pu3", ["Every bowl", "starts as a spool.", "*Wait for the click."],
    [["pu_9404", 0.3, 1], ["pu_9406", 30, 3], ["pu_9406", 48, 3], ["pu_9418", 6, 2.5], ["pu_9427", 8, 3], ["pu_9433", 6, 3], ["pu_9433", 15, 3], ["pu_9450", 4, 1.6], ["pu_9503", 10, 1.6], ["pu_6153", 6, 1.4], ["pu_6156", 3, 1.2]], PU_SNAP, { size: 88 }),
  PuTrying: HS("pu4", ["Trying out", "*our new model."], PU_PROC.slice(1, 15), PU_SNAP, { size: 100, end: "Verdict: it clicks." }),
  PuPrintIt: HS("pu5", ["Print it", "*for your dog."], [["p_cad_green", 0, 1.5], ...PU_PROC.slice(3, 16)], PU_SNAP, { size: 104, end: "STL file available." }),
  SeProcess: HS("se1", ["Two dogs.", "One bowl.", "*Swane & Eddy."], SE_PROC, SE_SNAP, { size: 96, end: "Click." }),
  SeShare: HS("se2", ["When your dogs", "share dinner…", "*they share the bowl too."],
    [["se_9452", 40, 3], ["se_9457", 5, 1.6], ["se_9455", 4, 3], ["se_9455", 14, 3], ["se_9493", 6, 3], ["se_9493", 13, 3], ["se_9494", 3, 1.2], ["se_6134", 4, 1.2], ["se_6135", 5, 1.4], ["se_9458", 6, 1.6], ["se_6149", 0.3, 1.2], ["se_6146", 1, 1.2]], SE_SNAP, { size: 84 }),
  SeNames: HS("se3", ["Two names.", "Two colours.", "*Watch them click."],
    [["se_6144", 0.5, 0.8], ["se_9451", 1, 1], ["se_9452", 60, 3], ["se_9455", 10, 3], ["se_9493", 6, 3], ["se_9494", 2, 1.2], ["se_6134", 5, 1.4], ["se_6135", 4, 1.4], ["se_9458", 4, 1.6], ["se_6148", 0.3, 1.2]], SE_SNAP, { size: 96 }),
  SeTrying: HS("se4", ["Trying out", "*our new model."], SE_PROC.slice(1, 14), SE_SNAP, { size: 100, end: "Verdict: it clicks." }),
  SePrintIt: HS("se5", ["Print it", "*for your dog."], [["p_cad_blue", 0, 1.5], ...SE_PROC.slice(3, 14)], SE_SNAP, { size: 104, end: "STL file available." }),
  SePacking: H("se6", ["Packing Swane & Eddy's bowl.", "*Off to its new home."],
    [["se_6169", 4.2, 1, 45], ["se_6187", 0.5, 1.2, 45], ["se_6187", 4, 1.4, 45], ["se_6187", 8, 1.6, 45], ["se_6187", 12, 1.6, 45], ["se_6187", 16, 1.6, 45], ["se_6187", 20, 1.4, 45], ["box", 0, 0.6, 45]], { size: 84, end: "Next stop: a very happy dog." }),
  BrProcess: HS("br1", ["Bruno's bowl,", "*start to finish."], BR_PROC, BR_SNAP, { size: 96, end: "Click." }),
  BrColours: HS("br2", ["Blue on top.", "Purple underneath.", "*Made for Bruno."], BR_PROC.slice(0, 11), BR_SNAP, { size: 96 }),
  BrTrying: HS("br3", ["Trying out", "*our new model."], BR_PROC.slice(1), BR_SNAP, { size: 100, end: "Verdict: it clicks." }),
  BrPrintIt: HS("br4", ["Print it", "*for your dog."], [["p_cad_blue", 0, 1.5], ...BR_PROC.slice(2)], BR_SNAP, { size: 104, end: "STL file available." }),
};

// every bowl model's whole join, back to back: ~1.5 s before the click, ~1 s after
const J = (clip: string, snapSec: number, label?: string, d = 75, rate = 1) => {
  const at = Math.min(45, Math.floor((snapSec * 30) / rate)); // output frames before the click
  return { d, v: [clip, { startFrom: Math.max(0, Math.round(snapSec * 30 - at * rate)), rate, snapAt: at, zoom: [1.03, 1.08] }] as V, c: label ? { kind: "words", top: 280, size: 92, words: [{ t: label, at: 0, pink: true }] } : undefined };
};
// [clip, click time (s), dog's name on the bowl, colour]
const ALL_JOINS: [string, number, string, string][] = [
  ["k_orange", 1.57, "Nellie", "White + orange"], ["k_green", 1.43, "Nugget", "Olive + pink"], ["k_pink", 2.55, "Amy", "Cream + pink"], ["k_blue", 3.17, "Bo", "Blue + stone"], ["k_bp2", 1.38, "Theo", "Blue + purple"],
  ["pu_6158", 5.8, "Pumba", "Green + grey"], ["se_6169", 3.9, "Swane & Eddy", "Sand + mauve"], ["br_9574", 0.95, "Bruno", "Blue + violet"], ["b_terra_asm", 3.45, "Chips & Beef", "Terracotta + sand"], ["j_olive", 1.15, "Phoebe", "Olive + stone"],
];
const intro = (t: string, b: string) => ({ d: 45, v: ["p_lineup", { rate: 1.3, zoom: [1, 1.06] }] as V, c: L("x", null, t, b, { size: 92 }) });
const JBW = (clip: string, snapSec: number, label?: string) => { const x: any = J(clip, snapSec, label); x.v[1].bw = true; return x; };
// separate videos per caption type: dogs' names, colours, no captions, slow-mo, black & white → colour on the click
export const batch26: Record<string, ReelConfig> = {
  JoinsAllBeat: mk("ja1", [intro("Every bowl", "has a name."), ...ALL_JOINS.map(([c, t, name]) => J(c, t, name))]),
  JoinsAllColours: mk("ja4", [intro("Every colour", "clicks."), ...ALL_JOINS.map(([c, t, , col]) => J(c, t, col))]),
  JoinsAllClicks: mk("ja2", ALL_JOINS.map(([c, t]) => J(c, t, undefined, 75))),
  JoinsAllSlow: mk("ja3", [...ALL_JOINS.slice(0, 8).map(([c, t], i) => ({ ...J(c, t, undefined, 90, 0.5), c: i === 0 ? L("x", null, "", "Slow-mo clicks.", { bAt: 4, size: 100 }) : undefined }))]),
  JoinsAllBw: mk("ja5", [{ d: 45, v: ["k_orange", { startFrom: 0, rate: 0.5, bw: true, snapAt: 999, zoom: [1, 1.04] }] as V, c: L("x", null, "Just add", "some colour.", { size: 100 }) }, ...ALL_JOINS.map(([c, t]) => JBW(c, t))]),
};

// ---- Batch 27: "process vs result" / "wait for the result": a labelled process run, then the full join as the reveal ----
const PVR = (music: string, hook: string, cuts: Cut3[], snap: Sc, reveal: string) => {
  const scenes: Sc[] = cuts.map(([clip, st, rate, d = 30]) => ({ d, v: [clip, { startFrom: Math.round(st * 30), rate, zoom: [1.03, 1.09] }] as V }));
  const cfg = mk(music, [...scenes, snap]);
  const proc = scenes.reduce((a, x) => a + x.d, 0);
  return { ...cfg, captions: [
    { kind: "words", from: 0, dur: proc, top: 220, size: 84, words: [{ t: hook, at: 4, box: true }] },
    { kind: "words", from: 0, dur: proc, top: 1500, size: 110, words: [{ t: "PROCESS", at: 10, pink: true }] },
    { kind: "words", from: proc, dur: cfg.duration - proc, top: 1500, size: 110, words: [{ t: "RESULT", at: 0, pink: true }] },
    { kind: "words", from: cfg.duration - 60, dur: 60, top: 220, size: 92, words: [{ t: reveal, at: 6, box: true }] },
  ] };
};
const TH_PROC: Cut3[] = [["t_long", 70, 2.5], ["t_load", 4, 1.6], ["t_blue1", 3, 3], ["t_blue2", 3, 3], ["t_bluepull", 3, 1.5], ["t_sup3", 1, 2], ["th_p2", 4, 3], ["th_p4", 2, 3], ["t_purplepull", 5, 1.6], ["t_fit", 7, 1.6], ["t_steel1", 1, 1.2]];
const TH_SNAP = AT("th_join", 5.2, 120, 50, 1, [1.02, 1.08]);

export const batch27: Record<string, ReelConfig> = {
  PvrPumba: PVR("pv1", "Process vs result.", PU_PROC, PU_SNAP, "Worth the wait."),
  PvrSwane: PVR("pv2", "Wait for the result…", SE_PROC, SE_SNAP, "Two dogs, one bowl."),
  PvrBruno: PVR("pv3", "Process vs result.", BR_PROC, BR_SNAP, "Bruno approved."),
  PvrTheo: PVR("pv4", "Wait for the result…", TH_PROC, TH_SNAP, "Hello, Theo."),
};
