import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadGreatVibes } from "@remotion/google-fonts/GreatVibes";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const display = loadPlayfair("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] }).fontFamily;
loadPlayfair("italic", { weights: ["700"], subsets: ["latin", "latin-ext"] });
export const sans = loadInter("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;

// lindomhome.com palette
export const PINK = "#FF1F7A";
export const CREAM = "#FAFAF8";
export const PINK_LIGHT = "#FFE5EF";
export const INK = "#111111";

// 120 BPM at 30fps: one beat = 15 frames
export const BEAT = 15;

// "chic" captions, after the reels that did well: thin serif, script for the accent word, heavy sans for BEFORE / AFTER
export const serif = loadCormorant("normal", { weights: ["500"], subsets: ["latin"] }).fontFamily;
loadCormorant("italic", { weights: ["500"], subsets: ["latin"] });
export const script = loadGreatVibes("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
export const heavy = loadMontserrat("normal", { weights: ["800"], subsets: ["latin"] }).fontFamily;
