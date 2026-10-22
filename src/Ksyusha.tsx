// Ksyusha's blog: she explains in Spanish (own voice + subtitles), then the assembly sped up. Style follows her blog examples:
// a condensed white title with a black outline at the top, white outlined subtitles low in the frame.
// The phone footage is vertical 9:16 (stored with a -90° rotation flag); shown full-frame, no crop, no zoom.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { sans } from "./brand";

const anton = loadAnton("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] }).fontFamily;

const INTRO = 666; // 22.2 s of her talking
const FAST = 510; // 336.8 s of assembly at ~20x
export const KSYUSHA_DURATION = INTRO + FAST;

const subs: [number, number, string][] = [
  [0.0, 3.0, "¡Vamos a hacer clickers!"],
  [3.0, 6.5, "Vamos a necesitar: base,"],
  [6.5, 12.6, "letras… ¡y también hay un corazón!"],
  [14.2, 17.6, "los cordones para hacerlos como llavero"],
  [17.6, 20.8, "¡y un montón de clics!"],
];

const outline = (w: number) =>
  [`${w}px ${w}px 0 #000`, `-${w}px ${w}px 0 #000`, `${w}px -${w}px 0 #000`, `-${w}px -${w}px 0 #000`, `0 ${w}px 0 #000`, `0 -${w}px 0 #000`, `${w}px 0 0 #000`, `-${w}px 0 0 #000`].join(", ");

const Title: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 11, stiffness: 160 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 230 }}>
      <div style={{ fontFamily: anton, fontSize: 110, color: "white", letterSpacing: "0.02em", textShadow: outline(6), transform: `scale(${0.7 + 0.3 * s})`, textAlign: "center", lineHeight: 1.05, width: 1000 }}>
        {text}
      </div>
    </AbsoluteFill>
  );
};

const Sub: React.FC<{ text: string }> = ({ text }) => (
  <AbsoluteFill style={{ alignItems: "center", paddingTop: 1450 }}>
    <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 60, color: "white", textShadow: outline(4), textAlign: "center", width: 940, lineHeight: 1.2 }}>{text}</div>
  </AbsoluteFill>
);

export const Ksyusha: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Sequence durationInFrames={INTRO}>
        {/* landscape footage cropped to vertical around her */}
        <OffthreadVideo src={staticFile("clips/ks_6096.mp4")} style={{ width: "100%", height: "100%" }} />
        <Title text="¡MI TALLER DE CLICKERS!" />
        {subs.map(([a, b, t]) => (
          <Sequence key={a} from={Math.round(a * 30)} durationInFrames={Math.round((b - a) * 30)}>
            <Sub text={t} />
          </Sequence>
        ))}
      </Sequence>
      <Sequence from={INTRO} durationInFrames={FAST}>
        <OffthreadVideo src={staticFile("clips/ks_6097.mp4")} muted playbackRate={22} style={{ width: "100%", height: "100%" }} />
        <Sequence durationInFrames={75}><Title text="¡A MONTAR!" /></Sequence>
        <Sequence from={FAST - 75}><Title text="¡LISTO!" /></Sequence>
        <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "flex-start", padding: "1700px 60px 0 0" }}>
          <div style={{ fontFamily: anton, fontSize: 64, color: "white", textShadow: outline(4) }}>x20</div>
        </AbsoluteFill>
      </Sequence>
      <Audio src={staticFile("audio/ks_music.wav")} volume={(f) => interpolate(f, [INTRO - 20, INTRO, KSYUSHA_DURATION - 30, KSYUSHA_DURATION], [0.12, 0.8, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
    </AbsoluteFill>
  );
};
