import { BEAT } from "./brand";
import type { ReelConfig } from "./Reel";

const DOG_TOP = "50% 0%"; // zoom from the top so Amy's head stays clear of the caption

// "Meet Amy, our quality control expert 🐾"
export const amy: ReelConfig = {
  music: "music_amy", duration: 330,
  cuts: [
    { clip: "dog", from: 0, dur: 75, startFrom: 30, zoom: [1, 1.1], origin: DOG_TOP },
    { clip: "print_close", from: 75, dur: 75, rate: 1.9, zoom: [1.08, 1.2] },
    { clip: "name", from: 150, dur: 45, startFrom: 20, rate: 1.5, zoom: [1, 1.08] },
    { clip: "dog2", from: 195, dur: 75, zoom: [1, 1.1], origin: DOG_TOP },
    { clip: "box", from: 270, dur: 60, rate: 0.72, zoom: [1.02, 1.1] },
  ],
  captions: [
    { kind: "words", from: 0, dur: 75, top: 150, size: 62, words: [{ t: "Meet Amy,", at: 3 }, { t: "our quality control expert 🐾", at: BEAT + 6, pink: true, br: true }] },
    { kind: "words", from: 75, dur: 75, words: [{ t: "Every bowl is", at: 3 }, { t: "printed to order.", at: BEAT + 6, pink: true, br: true }] },
    { kind: "words", from: 150, dur: 45, words: [{ t: "Then it goes", at: 3 }, { t: "to Amy.", at: BEAT + 3, pink: true, br: true }] },
    { kind: "words", from: 195, dur: 75, top: 150, size: 68, words: [{ t: "She has high standards.", at: 3 }, { t: "So do we.", at: BEAT * 2 + 6, pink: true, br: true }] },
    { kind: "stamp", from: 270, dur: 60, at: 5, lines: ["QUALITY CHECK", "Approved"] },
  ],
  vo: [
    { file: "amy_vo1", from: 3 }, { file: "amy_vo2", from: 78 }, { file: "amy_vo3", from: 153 },
    { file: "amy_vo4", from: 198 }, { file: "amy_vo5", from: 273 },
  ],
};

// "PLA vs PETG: what actually makes a print last"
export const pla: ReelConfig = {
  music: "music_pla", duration: 645,
  cuts: [
    { clip: "spool", from: 0, dur: 120, zoom: [1, 1.08] },
    { clip: "unbox", from: 120, dur: 150, rate: 1.9, zoom: [1, 1.06] },
    { clip: "print_mint", from: 270, dur: 135, rate: 2.2, zoom: [1.02, 1.12] },
    { clip: "bowl_mint", from: 405, dur: 150, rate: 1.6, zoom: [1, 1.06] },
    { clip: "toss_mint", from: 555, dur: 90, startFrom: 6, rate: 1.3, zoom: [1, 1.08] },
  ],
  captions: [
    {
      kind: "words", from: 0, dur: 120, top: 270, size: 120,
      words: [
        { t: "PLA", at: 3 }, { t: "vs", at: BEAT + 5, pink: true }, { t: "PETG", at: BEAT * 2 + 8 },
        { t: "what actually makes", at: BEAT * 4, br: true, size: 76 }, { t: "a print last?", at: BEAT * 5, pink: true, br: true, size: 76 },
      ],
    },
    { kind: "card", from: 120, dur: 150, title: "PLA", bullets: [{ t: "Crisp detail", at: 28 }, { t: "Bold matte color", at: 52 }, { t: "Softens above 60°C", at: 88, bad: true }] },
    { kind: "card", from: 270, dur: 135, title: "PETG", bullets: [{ t: "Tougher", at: 26 }, { t: "Takes more heat", at: 48 }, { t: "Softer detail", at: 84, bad: true }] },
    { kind: "card", from: 405, dur: 150, title: "What makes it last?", titleSize: 84, bullets: [{ t: "The right material for the job", at: 42 }, { t: "Sturdy walls", at: 88 }, { t: "Solid layers", at: 110 }] },
    { kind: "words", from: 555, dur: 90, top: 1130, size: 96, words: [{ t: "A bowl that", at: 3 }, { t: "lives indoors?", at: BEAT, br: true }, { t: "PLA wins.", at: 52, pink: true, br: true }] },
  ],
  vo: [
    { file: "pla_vo1", from: 3 }, { file: "pla_vo2", from: 124 }, { file: "pla_vo3", from: 274 },
    { file: "pla_vo4", from: 409 }, { file: "pla_vo5", from: 558 },
  ],
};

// "Your dog deserves a bowl as one-of-a-kind as they are"
export const unique: ReelConfig = {
  music: "music_uni", duration: 315,
  cuts: [
    { clip: "dog2", from: 0, dur: 90, zoom: [1, 1.12], origin: DOG_TOP },
    { clip: "print_mint", from: 90, dur: 30, startFrom: 90, rate: 2, zoom: [1.04, 1.1] },
    { clip: "print_green", from: 120, dur: 30, rate: 2, zoom: [1.04, 1.1] },
    { clip: "c_orange", from: 150, dur: 15, startFrom: 10, zoom: [1.02, 1.05] },
    { clip: "c_blue", from: 165, dur: 15, startFrom: 20, zoom: [1.02, 1.05] },
    { clip: "c_green", from: 180, dur: 15, startFrom: 30, zoom: [1.02, 1.05] },
    { clip: "c_mint", from: 195, dur: 15, startFrom: 20, zoom: [1.02, 1.05] },
    { clip: "name", from: 210, dur: 45, startFrom: 20, rate: 1.5, zoom: [1, 1.08] },
    { clip: "dog", from: 255, dur: 60, startFrom: 40, zoom: [1, 1.1], origin: DOG_TOP },
  ],
  captions: [
    { kind: "words", from: 0, dur: 90, top: 150, size: 62, words: [{ t: "Your dog deserves a bowl", at: 3 }, { t: "as one-of-a-kind as they are.", at: BEAT * 2 + 8, pink: true, br: true }] },
    { kind: "words", from: 90, dur: 60, size: 90, words: [{ t: "So we print each one", at: 3 }, { t: "to order.", at: BEAT * 2 + 4, pink: true, br: true }] },
    { kind: "words", from: 150, dur: 60, words: [{ t: "Your", at: 2 }, { t: "colors.", at: 10, pink: true }] },
    { kind: "words", from: 210, dur: 45, words: [{ t: "Their name", at: 2 }, { t: "on it.", at: BEAT, pink: true }] },
    { kind: "words", from: 255, dur: 60, top: 150, size: 72, words: [{ t: "One of a kind.", at: 3 }, { t: "Just like them.", at: BEAT + 8, pink: true, br: true }] },
  ],
  vo: [
    { file: "uni_vo1", from: 3 }, { file: "uni_vo2", from: 93 }, { file: "uni_vo3", from: 153 },
    { file: "uni_vo4", from: 212 }, { file: "uni_vo5", from: 258 },
  ],
};

// "Don't buy this bowl. Print it yourself." — STL files
const design = (label: string, from: number) =>
  ({ kind: "words", from, dur: 15, size: 104, words: [{ t: "4 designs", at: -100 }, { t: label, at: 0, pink: true, br: true }] }) satisfies ReelConfig["captions"][number];

export const stl: ReelConfig = {
  music: "music_stl", duration: 450,
  cuts: [
    { clip: "sky", from: 0, dur: 45, startFrom: 40, rate: 1.5, zoom: [1.02, 1.1] },
    { clip: "print_close", from: 45, dur: 45, rate: 2, zoom: [1.08, 1.2] },
    { clip: "desk", from: 90, dur: 90, rate: 1.5, zoom: [1, 1.1] },
    { clip: "c_mint", from: 180, dur: 15, startFrom: 20, zoom: [1.02, 1.05] },
    { clip: "c_orange", from: 195, dur: 15, startFrom: 10, zoom: [1.02, 1.05] },
    { clip: "c_diag", from: 210, dur: 15, startFrom: 6, zoom: [1.02, 1.05] },
    { clip: "c_pyr", from: 225, dur: 15, startFrom: 6, zoom: [1.02, 1.05] },
    { clip: "print_mint", from: 240, dur: 60, rate: 3, zoom: [1.02, 1.14] },
    { clip: "peel", from: 300, dur: 90, rate: 2.2, zoom: [1, 1.08] },
    { clip: "c_green", from: 390, dur: 60, startFrom: 15, zoom: [1, 1.08] },
  ],
  captions: [
    { kind: "words", from: 0, dur: 45, size: 128, words: [{ t: "Don't buy", at: 2 }, { t: "this bowl.", at: 12, pink: true, br: true }] },
    { kind: "words", from: 45, dur: 45, size: 128, words: [{ t: "Print it", at: 2 }, { t: "yourself.", at: 12, pink: true, br: true }] },
    { kind: "words", from: 90, dur: 90, size: 100, words: [{ t: "Our bowl designs,", at: 3 }, { t: "now as", at: BEAT * 3, br: true }, { t: "STL files.", at: BEAT * 3 + 8, pink: true }] },
    design("Single", 180), design("Double", 195), design("Diagonal", 210), design("Pyramid", 225),
    { kind: "words", from: 240, dur: 60, size: 104, words: [{ t: "Download.", at: 3 }, { t: "Slice.", at: 18, br: true }, { t: "Print.", at: 31, pink: true, br: true }] },
    { kind: "words", from: 300, dur: 90, size: 92, top: 250, words: [{ t: "Selling your prints?", at: 3 }, { t: "Commercial license", at: BEAT * 2 + 6, pink: true, br: true }, { t: "available too.", at: BEAT * 3 + 6, br: true }] },
    { kind: "words", from: 390, dur: 60, words: [{ t: "Your printer.", at: 3 }, { t: "Our design.", at: BEAT + 8, pink: true, br: true }] },
  ],
  vo: [
    { file: "stl_vo1", from: 2 }, { file: "stl_vo2", from: 47 }, { file: "stl_vo3", from: 93 }, { file: "stl_vo4", from: 182 },
    { file: "stl_vo5", from: 243 }, { file: "stl_vo6", from: 303 }, { file: "stl_vo7", from: 393 },
  ],
};

const flash = (clips: [string, number][], from: number, each: number) =>
  clips.map(([clip, startFrom], i) => ({ clip, from: from + i * each, dur: each, startFrom, zoom: [1.03, 1.08] as [number, number] }));

// Shareable, non-salesy: "Pick a bowl. I'll guess your dog's personality."
const persona = (from: number, color: string, a: string, b: string, dog = false, dur = 90) =>
  ({
    kind: "words", from, dur, size: dog ? 62 : 88, top: dog ? 140 : 280,
    words: [{ t: color, at: 2, pink: true }, { t: a, at: dog ? 14 : 16, br: !dog }, { t: b, at: 46, br: true }],
  }) satisfies ReelConfig["captions"][number];

export const pick: ReelConfig = {
  music: "music_pick", duration: 585,
  cuts: [
    ...flash([["n_orange", 60], ["n_blue2", 70], ["n_green", 70], ["n_mint", 60], ["n_pinkbg", 100]], 0, 15),
    { clip: "n_orange", from: 75, dur: 90, zoom: [1.17, 1.22], y: 150 },
    { clip: "n_blue2", from: 165, dur: 90, zoom: [1, 1.08] },
    { clip: "n_green", from: 255, dur: 90, zoom: [1, 1.08] },
    { clip: "n_mint", from: 345, dur: 90, zoom: [1.14, 1.19], y: 120 },
    { clip: "dog", from: 435, dur: 90, startFrom: 20, zoom: [1, 1.12], origin: DOG_TOP },
    { clip: "n_pinkbg", from: 525, dur: 60, startFrom: 20, rate: 1.3, zoom: [1, 1.08] },
  ],
  captions: [
    { kind: "words", from: 0, dur: 75, size: 104, words: [{ t: "Pick a bowl.", at: 2 }, { t: "I'll guess your", at: BEAT * 2, br: true, size: 76 }, { t: "dog's personality.", at: BEAT * 2 + 8, pink: true, br: true, size: 76 }] },
    persona(75, "Orange", "Zoomies at 3 a.m.", "Zero regrets."),
    persona(165, "Blue", "Judges you silently.", "Always right."),
    persona(255, "Green", "Acts starving.", "Ate ten minutes ago."),
    persona(345, "Mint", "Pure angel.", "Steals socks."),
    persona(435, "Pink", "The boss.", "You just live in her house.", true),
    { kind: "words", from: 525, dur: 60, size: 100, words: [{ t: "Which one", at: 2 }, { t: "is yours?", at: 12, pink: true, br: true }] },
  ],
  vo: [
    { file: "pick_vo1", from: 2 }, { file: "pick_vo2", from: 78 }, { file: "pick_vo3", from: 168 }, { file: "pick_vo4", from: 258 },
    { file: "pick_vo5", from: 348 }, { file: "pick_vo6", from: 438 }, { file: "pick_vo7", from: 528 },
  ],
};

// "What your dog's name says about you" — the names are the ones embossed on the bowls
export const nameSays: ReelConfig = {
  music: "music_name", duration: 450,
  cuts: [
    ...flash([["c_nugget", 30], ["n_nellie", 120], ["n_blue", 40], ["n_trap", 80], ["n_amy_rot", 40]], 0, 15),
    ...flash([["n_nugget_wb", 40], ["n_trap", 50], ["n_jam", 80]], 75, 35),
    ...flash([["n_nellie", 100], ["n_phoebe", 20], ["n_amy_rot", 30]], 180, 35),
    { clip: "n_blue", from: 285, dur: 90, zoom: [1, 1.1] },
    { clip: "dog2", from: 375, dur: 75, zoom: [1, 1.1], origin: DOG_TOP },
  ],
  captions: [
    { kind: "words", from: 0, dur: 75, size: 96, words: [{ t: "What your dog's name", at: 2 }, { t: "says about you.", at: BEAT * 2, pink: true, br: true }] },
    persona(75, "A snack name", "You're fun.", "And always hungry.", false, 105),
    persona(180, "A human name", "That's not a pet.", "That's your firstborn.", false, 105),
    { kind: "words", from: 285, dur: 90, size: 70, top: 280, words: [{ t: "Two letters", at: 2, pink: true }, { t: "You knew you'd be yelling it", at: 16, br: true }, { t: "across the park.", at: 46, br: true }] },
    { kind: "words", from: 375, dur: 75, top: 150, size: 70, words: [{ t: "So… what's your", at: 2 }, { t: "dog's name?", at: 14, pink: true, br: true }] },
  ],
  vo: [
    { file: "nm_vo1", from: 2 }, { file: "nm_vo2", from: 78 }, { file: "nm_vo3", from: 183 }, { file: "nm_vo4", from: 288 }, { file: "nm_vo5", from: 378 },
  ],
};

// "Which eater is your dog?" — process footage behind each type
export const eaters: ReelConfig = {
  music: "music_eat", duration: 630,
  cuts: [
    { clip: "n_workshop", from: 0, dur: 60, rate: 2.5, zoom: [1, 1.06] },
    { clip: "print_green", from: 60, dur: 105, rate: 1.3, zoom: [1.02, 1.1] },
    { clip: "n_join_wb", from: 165, dur: 105, rate: 1.5, zoom: [1, 1.08] },
    { clip: "n_green_wb", from: 270, dur: 105, rate: 1.3, zoom: [1, 1.04] },
    { clip: "n_mint_bed", from: 375, dur: 105, rate: 1.5, zoom: [1, 1.08] },
    { clip: "dog", from: 480, dur: 105, startFrom: 40, zoom: [1, 1.12], origin: DOG_TOP },
    { clip: "n_pack", from: 585, dur: 45, startFrom: 90, rate: 3, zoom: [1, 1.06] },
  ],
  captions: [
    { kind: "words", from: 0, dur: 60, size: 108, words: [{ t: "Which eater", at: 2 }, { t: "is your dog?", at: 12, pink: true, br: true }] },
    persona(60, "1 · The Inhaler", "Gone in four seconds.", "Tasted nothing.", false, 105),
    persona(165, "2 · The Grazer", "One kibble. Walks away.", "Back at midnight.", false, 105),
    persona(270, "3 · The Critic", "Sniffs it. Looks at you.", "Disappointed.", false, 105),
    persona(375, "4 · The Relocator", "Carries every bite", "to the carpet.", false, 105),
    { kind: "words", from: 480, dur: 105, top: 140, size: 62, words: [{ t: "5 · The Supervisor", at: 2, pink: true }, { t: "Won't eat unless you watch.", at: 46, br: true }] },
    { kind: "words", from: 585, dur: 45, size: 100, words: [{ t: "Comment", at: 2 }, { t: "their number.", at: 10, pink: true, br: true }] },
  ],
  vo: [
    { file: "eat_vo1", from: 2 }, { file: "eat_vo2", from: 63 }, { file: "eat_vo3", from: 168 }, { file: "eat_vo4", from: 273 },
    { file: "eat_vo5", from: 378 }, { file: "eat_vo6", from: 483 }, { file: "eat_vo7", from: 587 },
  ],
};

// "Signs your dog runs the house"
export const signs: ReelConfig = {
  music: "music_signs", duration: 525,
  cuts: [
    { clip: "dog2", from: 0, dur: 75, zoom: [1, 1.1], origin: DOG_TOP },
    { clip: "c_diag", from: 75, dur: 90, rate: 0.8, zoom: [1, 1.08] },
    { clip: "n_lilac", from: 165, dur: 90, rate: 1.4, zoom: [1, 1.08] },
    { clip: "n_mint2", from: 255, dur: 90, rate: 1.5, zoom: [1, 1.08] },
    { clip: "name", from: 345, dur: 105, startFrom: 20, zoom: [1, 1.1] },
    { clip: "n_amy_hands", from: 450, dur: 75, rate: 1.3, zoom: [1, 1.08] },
  ],
  captions: [
    { kind: "words", from: 0, dur: 75, top: 150, size: 70, words: [{ t: "Signs your dog", at: 2 }, { t: "runs the house.", at: BEAT + 4, pink: true, br: true }] },
    persona(75, "Sign 1", "You say “excuse me”", "to your dog."),
    persona(165, "Sign 2", "Your camera roll", "is 90% them."),
    persona(255, "Sign 3", "You left the party early.", "For them."),
    { kind: "words", from: 345, dur: 105, size: 80, top: 280, words: [{ t: "Sign 4", at: 2, pink: true }, { t: "Their name is on the bowl.", at: 16, br: true }, { t: "Yours is on the bills.", at: 54, br: true }] },
    { kind: "words", from: 450, dur: 75, size: 108, words: [{ t: "How many?", at: 2 }, { t: "Be honest.", at: BEAT + 4, pink: true, br: true }] },
  ],
  vo: [
    { file: "sg_vo1", from: 2 }, { file: "sg_vo2", from: 78 }, { file: "sg_vo3", from: 168 }, { file: "sg_vo4", from: 258 }, { file: "sg_vo5", from: 348 }, { file: "sg_vo6", from: 453 },
  ],
};

// ---- Batch 3: dog footage (no bowls in those shots) is paired with jokes about the dog; bowls stay in their own cuts ----

const zodiac_ = (from: number, element: string, signs: string, a: string, b: string, top = 280) =>
  ({
    kind: "words", from, dur: 105, size: 80, top,
    words: [{ t: element, at: 2, pink: true }, { t: signs, at: 8, br: true, size: 46 }, { t: a, at: 22, br: true }, { t: b, at: 58, br: true }],
  }) satisfies ReelConfig["captions"][number];

// "Your dog's zodiac sign, explained by dinner time"
export const zodiac: ReelConfig = {
  music: "music_zodiac", duration: 555,
  cuts: [
    { clip: "sky", from: 0, dur: 75, startFrom: 20, rate: 1.3, zoom: [1, 1.08] },
    { clip: "d_tongue", from: 75, dur: 55, zoom: [1, 1.05] },
    { clip: "n_orange", from: 130, dur: 50, startFrom: 60, zoom: [1.02, 1.07] },
    { clip: "d_hill", from: 180, dur: 55, zoom: [1, 1.05] },
    { clip: "c_green", from: 235, dur: 50, startFrom: 20, zoom: [1.02, 1.07] },
    { clip: "d_marina", from: 285, dur: 55, zoom: [1, 1.05] },
    { clip: "c_mint", from: 340, dur: 50, startFrom: 10, zoom: [1.02, 1.07] },
    { clip: "d_kayak2", from: 390, dur: 55, rate: 0.8, zoom: [1, 1.05] },
    { clip: "n_blue2", from: 445, dur: 50, startFrom: 60, zoom: [1.02, 1.07] },
    { clip: "d_rocks", from: 495, dur: 60, rate: 0.5, zoom: [1, 1.06] },
  ],
  captions: [
    { kind: "words", from: 0, dur: 75, size: 92, words: [{ t: "Your dog's zodiac sign,", at: 2 }, { t: "explained by dinner time.", at: BEAT * 2 + 4, pink: true, br: true, size: 76 }] },
    zodiac_(75, "Fire", "Aries · Leo · Sagittarius", "Eats like it's a race.", "Wins every time.", 1220),
    zodiac_(180, "Earth", "Taurus · Virgo · Capricorn", "Dinner is at 6:00.", "Not 6:01."),
    zodiac_(285, "Air", "Gemini · Libra · Aquarius", "Forgets they were eating.", "Twice."),
    zodiac_(390, "Water", "Cancer · Scorpio · Pisces", "Cries if you leave", "mid-meal."),
    { kind: "words", from: 495, dur: 60, size: 100, words: [{ t: "What's", at: 2 }, { t: "their sign?", at: 10, pink: true, br: true }] },
  ],
  vo: [],
};

const two = (from: number, dur: number, a: string, b: string, top = 280, size = 86) =>
  ({ kind: "words", from, dur, size, top, words: [{ t: a, at: 3 }, { t: b, at: 34, pink: true, br: true }] }) satisfies ReelConfig["captions"][number];

// "Things my dog thinks I do for a living"
export const dogThinks: ReelConfig = {
  music: "music_thinks", duration: 510,
  cuts: [
    { clip: "d_lake", from: 0, dur: 75, zoom: [1, 1.08] },
    { clip: "d_laptop", from: 75, dur: 90, startFrom: 20, zoom: [1, 1.05] },
    { clip: "print_mint", from: 165, dur: 90, startFrom: 150, rate: 1.5, zoom: [1.02, 1.12] },
    { clip: "n_pack", from: 255, dur: 90, startFrom: 30, rate: 2.5, zoom: [1, 1.06] },
    { clip: "d_treat", from: 345, dur: 90, startFrom: 20, zoom: [1, 1.08] },
    { clip: "d_balcony", from: 435, dur: 75, startFrom: 15, zoom: [1, 1.08] },
  ],
  captions: [
    { kind: "words", from: 0, dur: 75, size: 92, top: 240, words: [{ t: "Things my dog thinks", at: 2 }, { t: "I do for a living", at: BEAT * 2, pink: true, br: true }] },
    two(75, 90, "Pets the warm flat thing.", "For hours.", 1200),
    two(165, 90, "Watches the noisy box", "make bowls."),
    two(255, 90, "Gives them all", "to strangers."),
    two(345, 90, "Guards the snacks.", "Badly.", 240),
    { kind: "words", from: 435, dur: 75, size: 84, top: 240, words: [{ t: "What does yours think", at: 2 }, { t: "you do?", at: 14, pink: true, br: true }] },
  ],
  vo: [],
};

// "If my dog left reviews" — every review is about the bowl and describes what the footage under the card shows
const W = 560; // review card sits in the top panel, footage plays below it
const rv = (from: number, subject: string, stars: number, text: string) =>
  ({ kind: "review", from, dur: 105, subject, stars, text, top: 84 }) satisfies ReelConfig["captions"][number];

export const dogReviews: ReelConfig = {
  music: "music_reviews", duration: 645,
  cuts: [
    { clip: "d_studio", from: 0, dur: 60, startFrom: 10, zoom: [1, 1.05], origin: "50% 0%" },
    { clip: "name", from: 60, dur: 105, startFrom: 20, zoom: [1, 1.06], window: { top: W, pos: "50% 85%" } },
    { clip: "z_pink", from: 165, dur: 105, rate: 0.68, snapAt: 44, zoom: [1, 1.04], window: { top: W, pos: "50% 60%" } },
    { clip: "dog2", from: 270, dur: 105, rate: 0.85, zoom: [1, 1.03], window: { top: W, pos: "50% 50%" } },
    { clip: "z_mint", from: 375, dur: 105, rate: 0.68, snapAt: 44, zoom: [1, 1.04], window: { top: W, pos: "50% 45%" } },
    { clip: "dog", from: 480, dur: 105, startFrom: 40, zoom: [1, 1.03], window: { top: W, pos: "50% 50%" } },
    { clip: "n_pinkbg", from: 585, dur: 60, startFrom: 20, rate: 1.3, zoom: [1, 1.08] },
  ],
  captions: [
    { kind: "words", from: 0, dur: 60, size: 80, top: 105, words: [{ t: "If my dog", at: 2 }, { t: "left reviews", at: 12, pink: true, br: true }] },
    rv(60, "My name on it", 5, "Correct spelling. Rare."),
    rv(165, "Two halves", 5, "One for dinner. One for second dinner."),
    rv(270, "Current status", 1, "Empty. Again. Who is responsible?"),
    rv(375, "The steel bowl", 4, "Nice clang. Humans disagree."),
    rv(480, "The colour", 5, "Matches my harness. Obviously."),
    { kind: "words", from: 585, dur: 60, size: 96, words: [{ t: "What would yours", at: 2 }, { t: "review?", at: 12, pink: true, br: true }] },
  ],
  vo: [],
};

const type_ = (from: number, name: string, a: string, b: string, top = 280) =>
  ({ kind: "words", from, dur: 90, size: 76, top, words: [{ t: name, at: 2, pink: true }, { t: a, at: 16, br: true }, { t: b, at: 46, br: true }] }) satisfies ReelConfig["captions"][number];

// "Types of dog owners at dinner time"
export const ownerTypes: ReelConfig = {
  music: "music_owners", duration: 495,
  cuts: [
    { clip: "d_treat", from: 0, dur: 75, startFrom: 200, zoom: [1, 1.06] },
    { clip: "print_close", from: 75, dur: 90, rate: 1.5, zoom: [1.08, 1.2] },
    { clip: "d_treat", from: 165, dur: 90, startFrom: 300, zoom: [1, 1.06] },
    { clip: "n_trap", from: 255, dur: 90, startFrom: 20, zoom: [1, 1.08] },
    { clip: "dog", from: 345, dur: 90, startFrom: 50, zoom: [1, 1.1], origin: DOG_TOP },
    { clip: "n_lilac", from: 435, dur: 60, startFrom: 60, rate: 1.4, zoom: [1, 1.08] },
  ],
  captions: [
    { kind: "words", from: 0, dur: 75, size: 92, top: 1260, words: [{ t: "Types of dog owners", at: 2 }, { t: "at dinner time", at: BEAT * 2, pink: true, br: true }] },
    type_(75, "The Measurer", "Weighs it. To the gram.", "Every single time."),
    type_(165, "The Negotiator", "“Sit. Sit. SIT.”", "“…fine, here.”", 1240),
    type_(255, "The Chef", "Cooks chicken for the dog.", "Eats cereal for dinner."),
    { kind: "words", from: 345, dur: 90, top: 140, size: 62, words: [{ t: "The Pushover", at: 2, pink: true }, { t: "“You already ate.”", at: 14 }, { t: "Feeds them again.", at: 46, br: true }] },
    { kind: "words", from: 435, dur: 60, size: 100, words: [{ t: "Which one", at: 2 }, { t: "are you?", at: 12, pink: true, br: true }] },
  ],
  vo: [],
};

// Oddly satisfying: five snaps, each landing on a beat (local frame 30)
export const snaps: ReelConfig = {
  music: "music_snap", duration: 300,
  cuts: ["z_orange", "z_blue", "z_green", "z_pink", "z_mint"].map((clip, i) => ({ clip, from: i * 60, dur: 60, snapAt: 30, zoom: [1.02, 1.05] as [number, number] })),
  captions: [
    { kind: "words", from: 0, dur: 60, size: 104, words: [{ t: "Rate the snap", at: 2 }, { t: "1-10", at: 14, pink: true, br: true }] },
    { kind: "words", from: 240, dur: 60, size: 104, words: [{ t: "Best one?", at: 36, pink: true }] },
  ],
  vo: [],
};
