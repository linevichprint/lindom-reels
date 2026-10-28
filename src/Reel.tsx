import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CREAM, INK, PINK, PINK_LIGHT, display, sans } from "./brand";

export type Cut = {
  clip: string;
  from: number; // frame in the reel
  dur: number;
  startFrom?: number; // frame in the clip
  rate?: number;
  zoom?: [number, number];
  origin?: string;
  window?: { top?: number; bottom?: number; pos?: string }; // show the footage below `top` px only (e.g. under a review card)
  photo?: "card" | "full"; // clip is a still in public/photos (card = framed print on pink, for low-res photos)
  bw?: boolean; // black & white until the snap, colour from the snap on
  snapAt?: number; // local frame of a magnetic snap: punch-in + flash
  fit?: "blur"; // horizontal: the clip sits whole in the middle over a blurred, enlarged copy of itself
  y?: number; // shift the footage down (px) to clear the caption; needs zoom >= 1 + y / 960
};

export type Word = { t: string; at: number; pink?: boolean; br?: boolean; size?: number; box?: boolean };

export type Caption = { from: number; dur: number } & (
  | { kind: "words"; words: Word[]; top?: number; size?: number }
  | { kind: "card"; title: string; titleSize?: number; top?: number; bullets: { t: string; at: number; bad?: boolean; mark?: string }[] }
  | { kind: "stamp"; lines: [string, string]; at: number; x?: number; y?: number; scale?: number; emoji?: string }
  | { kind: "bingo"; title: string; cells: string[]; step?: number }
  | { kind: "chat"; name: string; status?: string; top?: number; light?: boolean; msgs: { t: string; at: number; me?: boolean }[] }
  | { kind: "profile"; name: string; role: string; about: string; skills: [string, string][]; top: number }
  | { kind: "progress"; top?: number }
  | { kind: "cover"; until: number }
  | { kind: "review"; subject: string; stars: number; text: string; by?: string; top?: number }
);

export type ReelConfig = {
  cuts: Cut[];
  captions: Caption[];
  vo: { file: string; from: number }[];
  music: string;
  duration: number;
};

const usePop = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (at: number) => ({
    s: spring({ frame: frame - at, fps, config: { damping: 13, stiffness: 190, mass: 0.6 } }),
    o: interpolate(frame - at, [0, 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  });
};

const Words: React.FC<{ words: Word[]; top?: number; size?: number }> = ({ words, top = 300, size = 112 }) => {
  const pop = usePop();
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: top }}>
      <div
        style={{
          fontFamily: display, fontWeight: 700, fontSize: size, lineHeight: 1.22, color: "white",
          textAlign: "center", width: 1010,
          textShadow: "0 4px 28px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.5)",
        }}
      >
        {words.map((w, i) => {
          const { s, o } = pop(w.at);
          return (
            <React.Fragment key={i}>
              {w.br ? <br /> : null}
              <span
                style={{
                  display: "inline-block", margin: "0 0.12em", opacity: o,
                  transform: `translateY(${(1 - s) * 46}px) scale(${0.86 + 0.14 * s})${w.pink ? " rotate(-2deg)" : ""}`,
                  fontStyle: w.pink ? "italic" : "normal",
                  fontSize: w.size,
                  // accent words sit on a pink block so they read on any footage
                  ...(w.pink
                    ? { backgroundColor: PINK, padding: "0 0.22em 0.06em", textShadow: "none", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }
                    : w.box
                      ? { backgroundColor: INK, padding: "0 0.22em 0.06em", textShadow: "none" } // dark block: readable on white footage
                      : {}),
                }}
              >
                {w.t}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Card: React.FC<{ title: string; titleSize?: number; top?: number; bullets: { t: string; at: number; bad?: boolean; mark?: string }[] }> = ({ title, titleSize = 120, top = 250, bullets }) => {
  const pop = usePop();
  const head = pop(2);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: top }}>
      <div
        style={{
          fontFamily: display, fontWeight: 700, fontStyle: "italic", fontSize: titleSize, lineHeight: 1.15, color: "white",
          backgroundColor: PINK, padding: "0 0.3em 0.06em", opacity: head.o,
          transform: `scale(${0.8 + 0.2 * head.s}) rotate(-2deg)`, boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
        }}
      >
        {title}
      </div>
      <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
        {bullets.map((b, i) => {
          const { s, o } = pop(b.at);
          return (
            <div
              key={i}
              style={{
                fontFamily: sans, fontWeight: 700, fontSize: 56, color: INK, backgroundColor: CREAM,
                padding: "16px 34px", display: "flex", alignItems: "center", gap: 20, opacity: o,
                transform: `translateY(${(1 - s) * 40}px)`, boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
              }}
            >
              <span style={{ color: b.bad ? INK : PINK, opacity: b.bad ? 0.55 : 1 }}>{b.mark ?? (b.bad ? "−" : "+")}</span>
              {b.t}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Review: React.FC<{ subject: string; stars: number; text: string; by?: string; top?: number }> = ({ subject, stars, text, by = "Amy", top = 240 }) => {
  const pop = usePop();
  const card = pop(3);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: top }}>
      <div
        style={{
          width: 900, backgroundColor: CREAM, padding: "40px 48px 46px", opacity: card.o,
          transform: `translateY(${(1 - card.s) * 60}px) rotate(-1.5deg)`, boxShadow: "0 12px 36px rgba(0,0,0,0.18)",
        }}
      >
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, letterSpacing: "0.2em", textTransform: "uppercase", color: INK, opacity: 0.6 }}>
          {subject}
        </div>
        <div style={{ fontSize: 76, lineHeight: 1.25, letterSpacing: "0.06em" }}>
          {[0, 1, 2, 3, 4].map((i) => {
            const st = pop(12 + i * 4);
            return (
              <span key={i} style={{ display: "inline-block", color: i < stars ? PINK : "#D9D9D4", transform: `scale(${st.s})` }}>
                ★
              </span>
            );
          })}
        </div>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 66, lineHeight: 1.18, color: INK, marginTop: 8, opacity: pop(34).o }}>
          “{text}”
        </div>
        <div style={{ fontFamily: display, fontStyle: "italic", fontWeight: 700, fontSize: 44, color: PINK, marginTop: 18, opacity: pop(46).o }}>
          - {by} 🐾
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Stamp: React.FC<{ lines: [string, string]; at: number; x?: number; y?: number; scale?: number; emoji?: string }> = ({ lines, at, x = 0, y = 0, scale = 1, emoji = "🐾" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 9, stiffness: 220, mass: 0.7 } });
  if (frame < at) return null;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: 560, height: 560, borderRadius: "50%", border: `14px solid ${PINK}`, backgroundColor: "rgba(250,250,248,0.94)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          transform: `translate(${x}px, ${y}px) scale(${(2.2 - 1.2 * s) * scale}) rotate(-12deg)`, boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
          outline: `4px solid ${PINK}`, outlineOffset: -34,
        }}
      >
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 36, letterSpacing: "0.16em", color: PINK, textAlign: "center", maxWidth: 440 }}>{lines[0]}</div>
        <div style={{ fontFamily: display, fontWeight: 700, fontStyle: "italic", fontSize: 98, color: PINK, lineHeight: 1.1 }}>{lines[1]}</div>
        <div style={{ fontSize: 76, marginTop: 6 }}>{emoji}</div>
      </div>
    </AbsoluteFill>
  );
};

const Bingo: React.FC<{ title: string; cells: string[]; step?: number }> = ({ title, cells, step = 20 }) => {
  const pop = usePop();
  const head = pop(2);
  return (
    <AbsoluteFill style={{ backgroundColor: "rgba(17,17,17,0.6)", alignItems: "center", paddingTop: 230 }}>
      <div style={{ fontFamily: display, fontWeight: 700, fontStyle: "italic", fontSize: 84, color: "white", backgroundColor: PINK, padding: "0 0.3em 0.06em", transform: `scale(${0.8 + 0.2 * head.s}) rotate(-2deg)` }}>
        {title}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 300px)", gap: 18, marginTop: 56 }}>
        {cells.map((c, i) => {
          const { s, o } = pop(14 + i * step);
          const mid = i === 4;
          return (
            <div
              key={i}
              style={{
                height: 300, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 22,
                fontFamily: sans, fontWeight: 700, fontSize: 42, lineHeight: 1.15, color: mid ? "white" : INK,
                backgroundColor: mid ? PINK : CREAM, opacity: o, transform: `scale(${0.6 + 0.4 * s})`,
              }}
            >
              {c}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Chat: React.FC<{ name: string; status?: string; top?: number; light?: boolean; msgs: { t: string; at: number; me?: boolean }[] }> = ({ name, status = "online · waiting by the door", top = 240, light, msgs }) => {
  const fg = light ? INK : "white";
  const pop = usePop();
  return (
    <AbsoluteFill style={{ backgroundColor: light ? "transparent" : "rgba(17,17,17,0.55)", paddingTop: top, paddingLeft: 70, paddingRight: 70 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 36 }}>
        <div style={{ width: 96, height: 96, borderRadius: "50%", backgroundColor: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>🐾</div>
        <div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 60, color: fg, lineHeight: 1.1 }}>{name}</div>
          <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 30, color: fg, opacity: 0.7 }}>{status}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {msgs.map((m, i) => {
          const { s, o } = pop(m.at);
          return (
            <div
              key={i}
              style={{
                alignSelf: m.me ? "flex-end" : "flex-start", maxWidth: 760, padding: "22px 36px", borderRadius: 44,
                borderBottomLeftRadius: m.me ? 44 : 10, borderBottomRightRadius: m.me ? 10 : 44,
                backgroundColor: m.me ? PINK : light ? "white" : CREAM, color: m.me ? "white" : INK, fontFamily: sans, fontWeight: 500, fontSize: 50, lineHeight: 1.2,
                opacity: o, transform: `translateY(${(1 - s) * 30}px) scale(${0.9 + 0.1 * s})`, transformOrigin: m.me ? "100% 100%" : "0% 100%",
                display: o === 0 ? "none" : "block",
              }}
            >
              {m.t}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Profile: React.FC<{ name: string; role: string; about: string; skills: [string, string][]; top: number }> = ({ name, role, about, skills, top }) => {
  const pop = usePop();
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: top }}>
      <div style={{ width: 960, backgroundColor: CREAM, padding: "44px 52px 50px", boxShadow: "0 12px 36px rgba(0,0,0,0.18)" }}>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 92, color: INK, lineHeight: 1.05 }}>{name}</div>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 40, color: INK, marginTop: 10, opacity: pop(10).o }}>{role}</div>
        <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 34, color: INK, opacity: 0.6 * pop(24).o, marginTop: 8 }}>{about}</div>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 30, letterSpacing: "0.2em", color: PINK, marginTop: 36, opacity: pop(50).o }}>TOP SKILLS</div>
        {skills.map(([skill, n], i) => {
          const { s, o } = pop(62 + i * 48);
          return (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 22, opacity: o, transform: `translateX(${(1 - s) * -40}px)` }}>
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: 50, color: INK, maxWidth: 660, lineHeight: 1.15 }}>{skill}</div>
              <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 40, color: "white", backgroundColor: PINK, padding: "8px 24px", borderRadius: 40, transform: `scale(${pop(74 + i * 48).s})` }}>{n}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Progress: React.FC<{ top?: number; dur: number }> = ({ top = 1500, dur }) => {
  const frame = useCurrentFrame();
  const p = Math.min(1, Math.max(0, frame / (dur - 1)));
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: top }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <div style={{ width: 760, height: 22, backgroundColor: "rgba(255,255,255,0.35)" }}>
          <div style={{ width: `${p * 100}%`, height: "100%", backgroundColor: PINK }} />
        </div>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 48, color: "white", width: 130, textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>{Math.round(p * 100)}%</div>
      </div>
    </AbsoluteFill>
  );
};

const Cover: React.FC<{ until: number }> = ({ until }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [until, until + 7], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "50%", backgroundColor: PINK, transform: `translateX(${x}%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: display, fontWeight: 700, fontStyle: "italic", fontSize: 420, color: "white" }}>?</div>
      </div>
    </AbsoluteFill>
  );
};

const Clip: React.FC<{ cut: Cut }> = ({ cut }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, cut.dur], cut.zoom ?? [1, 1.06]);
  const punch = interpolate(frame, [0, 5], [0.035, 0], { extrapolateRight: "clamp" }); // punch-in on the cut
  const sn = cut.snapAt;
  const clampBoth = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const snapPunch = sn === undefined ? 0 : interpolate(frame, [sn - 1, sn, sn + 8], [0, 0.08, 0], clampBoth);
  const flash = sn === undefined ? 0 : interpolate(frame, [sn, sn + 1, sn + 9], [0, 0.45, 0], clampBoth);
  const grey = cut.bw ? interpolate(frame, [(sn ?? 0) - 1, (sn ?? 0) + 1], [1, 0], clampBoth) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: cut.window ? PINK_LIGHT : INK }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: cut.window?.top ?? 0, bottom: cut.window?.bottom ?? 0, overflow: "hidden" }}>
      {cut.photo ? (
        cut.photo === "card" ? (
          <AbsoluteFill style={{ backgroundColor: PINK_LIGHT, alignItems: "center", justifyContent: "center" }}>
            <div style={{ backgroundColor: "white", padding: "26px 26px 90px", boxShadow: "0 24px 60px rgba(0,0,0,0.22)", transform: `translateY(120px) rotate(${(cut.clip.length % 5) - 2}deg) scale(${zoom + punch})` }}>
              <Img src={staticFile(`photos/${cut.clip}.jpg`)} style={{ width: 760, height: 1040, objectFit: "cover", display: "block" }} />
            </div>
          </AbsoluteFill>
        ) : (
          <Img src={staticFile(`photos/${cut.clip}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom + punch})` }} />
        )
      ) : (
      <>
      {cut.fit === "blur" ? (
        <OffthreadVideo src={staticFile(`clips/${cut.clip}.mp4`)} startFrom={cut.startFrom ?? 0} playbackRate={cut.rate ?? 1} muted
          style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: `blur(40px) brightness(0.75)${grey ? ` grayscale(${grey})` : ""}`, transform: "scale(1.15)" }} />
      ) : null}
      <OffthreadVideo
        src={staticFile(`clips/${cut.clip}.mp4`)}
        startFrom={cut.startFrom ?? 0}
        playbackRate={cut.rate ?? 1}
        muted
        style={{
          position: "absolute", width: "100%", height: "100%", objectFit: cut.fit === "blur" ? "contain" : "cover", objectPosition: cut.window?.pos ?? "50% 50%",
          filter: grey ? `grayscale(${grey}) contrast(${1 + 0.15 * grey})` : undefined,
          transform: `translateY(${cut.y ?? 0}px) scale(${zoom + punch + snapPunch})`, transformOrigin: cut.origin ?? "50% 50%",
        }}
      />
      </>
      )}
      <AbsoluteFill style={{ backgroundColor: "white", opacity: flash }} />
      </div>
      {cut.window ? null : <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 42%)" }} />}
    </AbsoluteFill>
  );
};

export const Reel: React.FC<{ config: ReelConfig; voiceover: boolean }> = ({ config, voiceover }) => (
  <AbsoluteFill style={{ backgroundColor: INK }}>
    {config.cuts.map((c, i) => (
      <Sequence key={i} from={c.from} durationInFrames={c.dur}>
        <Clip cut={c} />
      </Sequence>
    ))}
    {config.captions.map((c, i) => (
      <Sequence key={i} from={c.from} durationInFrames={c.dur}>
        {c.kind === "words" ? <Words words={c.words} top={c.top} size={c.size} /> : null}
        {c.kind === "card" ? <Card title={c.title} titleSize={c.titleSize} top={c.top} bullets={c.bullets} /> : null}
        {c.kind === "review" ? <Review subject={c.subject} stars={c.stars} text={c.text} by={c.by} top={c.top} /> : null}
        {c.kind === "stamp" ? <Stamp lines={c.lines} at={c.at} x={c.x} y={c.y} scale={c.scale} emoji={c.emoji} /> : null}
        {c.kind === "bingo" ? <Bingo title={c.title} cells={c.cells} step={c.step} /> : null}
        {c.kind === "chat" ? <Chat name={c.name} status={c.status} top={c.top} light={c.light} msgs={c.msgs} /> : null}
        {c.kind === "profile" ? <Profile name={c.name} role={c.role} about={c.about} skills={c.skills} top={c.top} /> : null}
        {c.kind === "progress" ? <Progress top={c.top} dur={c.dur} /> : null}
        {c.kind === "cover" ? <Cover until={c.until} /> : null}
      </Sequence>
    ))}
    <Audio
      src={staticFile(`audio/${config.music}.wav`)}
      volume={(f) =>
        (voiceover ? 0.45 : 0.9) *
        interpolate(f, [config.duration - 24, config.duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      }
    />
    {voiceover
      ? config.vo.map((v) => (
          <Sequence key={v.file} from={v.from}>
            <Audio src={staticFile(`audio/${v.file}.wav`)} />
          </Sequence>
        ))
      : null}
  </AbsoluteFill>
);
