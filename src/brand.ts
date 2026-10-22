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
