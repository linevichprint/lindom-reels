// Horizontal 1920x1080 build video for Patreon. The phone footage is vertical, so it sits full-height in the centre
// over a blurred, darkened copy of itself; chapter number/title on the left, what's happening on the right.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CREAM, PINK, display, sans } from "./brand";

type Shot = { clip: string; start: number; rate: number; sec: number };
type Chapter = { title: string; text: string; shots: Shot[] };

const chapters: Chapter[] = [
  { title: "Filament", text: "The spool goes onto the printer.", shots: [
    { clip: "br_9504", start: 2, rate: 2, sec: 5 }, { clip: "br_9504", start: 25, rate: 3, sec: 5 } ] },
  { title: "Printing", text: "Each half prints layer by layer: blue on top, purple underneath.", shots: [
    { clip: "br_6183", start: 0, rate: 0.6, sec: 3 }, { clip: "br_6185", start: 0, rate: 0.6, sec: 3 } ] },
  { title: "Off the bed", text: "The finished halves come off the printer.", shots: [
    { clip: "br_6183", start: 1.2, rate: 1, sec: 6 }, { clip: "br_6185", start: 1.2, rate: 1, sec: 5.5 } ] },
  { title: "The halves", text: "Both halves, side by side.", shots: [
    { clip: "br_9586", start: 0, rate: 1, sec: 4.3 }, { clip: "br_9587", start: 0, rate: 1, sec: 3.1 } ] },
  { title: "Steel bowls", text: "Stainless steel bowls drop in.", shots: [
    { clip: "br_9593", start: 0, rate: 1, sec: 3.5 } ] },
  { title: "The snap", text: "The two halves come together.", shots: [
    { clip: "br_9574", start: 0, rate: 0.8, sec: 4 } ] },
  { title: "Done", text: "Bruno's bowl, ready for dinner.", shots: [{ clip: "br_9588", start: 0, rate: 0.4, sec: 4.5 }] },
];

const INTRO = 105, OUTRO = 150;
const FPS = 30;
const chapterFrames = chapters.map((c) => c.shots.reduce((a, s) => a + Math.round(s.sec * FPS), 0));
export const PATREON_BRUNO_DURATION = INTRO + chapterFrames.reduce((a, b) => a + b, 0) + OUTRO;

const Shot: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const dur = Math.round(shot.sec * FPS);
  const zoom = interpolate(frame, [0, dur], [1, 1.04]);
  const src = staticFile(`clips/${shot.clip}.mp4`);
  const common = { startFrom: Math.round(shot.start * FPS), playbackRate: shot.rate, muted: true } as const;
  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      <OffthreadVideo src={src} {...common} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(36px) brightness(0.42) saturate(1.1)", transform: "scale(1.15)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 608, height: 1080, overflow: "hidden", boxShadow: "0 0 80px rgba(0,0,0,0.6)" }}>
          <OffthreadVideo src={src} {...common} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Side: React.FC<{ n: number; c: Chapter }> = ({ n, c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14, stiffness: 150 } });
  const o = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 90, top: 380, width: 520, opacity: o, transform: `translateX(${(1 - s) * -40}px)` }}>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 30, letterSpacing: "0.2em", color: PINK }}>STEP {n} / {chapters.length}</div>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 92, color: "white", lineHeight: 1.05, marginTop: 14 }}>{c.title}</div>
      </div>
      <div style={{ position: "absolute", right: 90, top: 430, width: 480, opacity: interpolate(frame, [10, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 38, color: CREAM, lineHeight: 1.35 }}>{c.text}</div>
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, bottom: 60, display: "flex", gap: 10 }}>
        {chapters.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: i < n ? PINK : "rgba(255,255,255,0.25)" }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Card: React.FC<{ kicker: string; title: string; sub: string; clip: string }> = ({ kicker, title, sub, clip }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      <OffthreadVideo src={staticFile(`clips/${clip}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(30px) brightness(0.35)", transform: "scale(1.15)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: o, textAlign: "center" }}>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 32, letterSpacing: "0.25em", color: PINK }}>{kicker}</div>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 120, color: "white", marginTop: 18, lineHeight: 1.05 }}>{title}</div>
        <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 40, color: CREAM, marginTop: 26 }}>{sub}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const PatreonBruno: React.FC = () => {
  let f = INTRO;
  return (
    <AbsoluteFill style={{ backgroundColor: "#111" }}>
      <Sequence durationInFrames={INTRO}>
        <Card kicker="BEHIND THE SCENES" title="Building Bruno's bowl" sub="The full process, start to finish" clip="br_9588" />
      </Sequence>
      {chapters.map((c, i) => {
        const from = f;
        let g = 0;
        f += chapterFrames[i];
        return (
          <Sequence key={i} from={from} durationInFrames={chapterFrames[i]}>
            {c.shots.map((s, j) => {
              const d = Math.round(s.sec * FPS);
              const el = (
                <Sequence key={j} from={g} durationInFrames={d}>
                  <Shot shot={s} />
                </Sequence>
              );
              g += d;
              return el;
            })}
            <Side n={i + 1} c={c} />
          </Sequence>
        );
      })}
      <Sequence from={f}>
        <Card kicker="THANK YOU" title="Made by hand in Barcelona" sub="Thanks for supporting a tiny studio." clip="br_9586" />
      </Sequence>
      <Audio src={staticFile("audio/patreon_bruno.wav")} volume={(fr) => 0.75 * interpolate(fr, [PATREON_BRUNO_DURATION - 45, PATREON_BRUNO_DURATION], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
    </AbsoluteFill>
  );
};
