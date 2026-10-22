import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BEAT, INK, PINK, display } from "./brand";

type Word = { t: string; at: number; pink?: boolean; br?: boolean };

type Scene = {
  clip: string;
  from: number; // frame in the reel
  dur: number;
  startFrom: number; // frame in the clip
  rate: number;
  zoom: [number, number];
  words: Word[];
  vo: string;
  captionTop?: number;
  captionSize?: number;
  origin?: string;
};

const SNAP = 150;
const END = 375;
export const REEL01_DURATION = END;

const scenes: Scene[] = [
  {
    clip: "print_wide", from: 0, dur: 60, startFrom: 0, rate: 2.2, zoom: [1.0, 1.06],
    words: [{ t: "It starts as", at: 3 }, { t: "one thin line.", at: BEAT + 4, pink: true, br: true }],
    vo: "vo1",
  },
  {
    clip: "print_close", from: 60, dur: 60, startFrom: 0, rate: 2, zoom: [1.08, 1.2],
    words: [{ t: "Layer", at: 2 }, { t: "by layer.", at: BEAT, pink: true }],
    vo: "vo2",
  },
  {
    clip: "snap", from: 120, dur: 60, startFrom: 21, rate: 1, zoom: [1.04, 1.04],
    words: [{ t: "Two halves.", at: 2 }, { t: "One snap.", at: SNAP - 120, pink: true, br: true }],
    vo: "vo3",
  },
  {
    clip: "name", from: 180, dur: 60, startFrom: 20, rate: 1.5, zoom: [1.0, 1.08],
    words: [{ t: "Their name", at: 2 }, { t: "on it.", at: BEAT, pink: true }],
    vo: "vo4",
  },
  {
    clip: "sky", from: 240, dur: 60, startFrom: 0, rate: 2, zoom: [1.0, 1.06],
    words: [{ t: "Your", at: 2 }, { t: "colors.", at: BEAT / 2 + 2, pink: true }],
    vo: "vo5",
  },
  {
    clip: "dog", from: 300, dur: 75, startFrom: 30, rate: 1, zoom: [1.0, 1.1],
    words: [{ t: "Quality checked", at: 2 }, { t: "by Amy.", at: BEAT * 2, pink: true }],
    vo: "vo6", captionTop: 175, captionSize: 72, origin: "50% 0%",
  },
];

const Caption: React.FC<{ words: Word[]; top?: number; size?: number }> = ({ words, top = 300, size = 112 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: top }}>
      <div
        style={{
          fontFamily: display,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.22,
          color: "white",
          textAlign: "center",
          width: 1000,
          textShadow: "0 4px 28px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.5)",
        }}
      >
        {words.map((w, i) => {
          const s = spring({ frame: frame - w.at, fps, config: { damping: 13, stiffness: 190, mass: 0.6 } });
          return (
            <React.Fragment key={i}>
              {w.br ? <br /> : null}
              <span
                style={{
                  display: "inline-block",
                  margin: "0 0.12em",
                  opacity: interpolate(frame - w.at, [0, 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                  transform: `translateY(${(1 - s) * 46}px) scale(${0.86 + 0.14 * s})`,
                  fontStyle: w.pink ? "italic" : "normal",
                  // accent words sit on a pink block so they read on any footage
                  ...(w.pink
                    ? {
                        backgroundColor: PINK,
                        padding: "0 0.22em 0.06em",
                        textShadow: "none",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
                        transform: `translateY(${(1 - s) * 46}px) scale(${0.86 + 0.14 * s}) rotate(-2deg)`,
                      }
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

const Clip: React.FC<{ scene: Scene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, scene.dur], scene.zoom);
  // punch-in on the cut and on the magnetic snap
  const cutPunch = interpolate(frame, [0, 5], [0.035, 0], { extrapolateRight: "clamp" });
  const snapLocal = SNAP - scene.from;
  const snapPunch =
    scene.clip === "snap"
      ? interpolate(frame, [snapLocal - 1, snapLocal, snapLocal + 8], [0, 0.09, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      <OffthreadVideo
        src={staticFile(`clips/${scene.clip}.mp4`)}
        startFrom={scene.startFrom}
        playbackRate={scene.rate}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom + cutPunch + snapPunch})`,
          transformOrigin: scene.origin ?? "50% 50%",
        }}
      />
      <AbsoluteFill
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0) 38%)" }}
      />
      <Caption words={scene.words} top={scene.captionTop} size={scene.captionSize} />
    </AbsoluteFill>
  );
};

const SnapFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [SNAP, SNAP + 1, SNAP + 9], [0, 0.55, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ backgroundColor: "white", opacity: o }} />;
};

export const Reel01: React.FC<{ voiceover: boolean; voice?: string }> = ({ voiceover, voice = "female" }) => {
  // "female"/"male" are macOS voices; anything else is a Kokoro voice prefix, e.g. "k_michael_"
  const voPrefix = voice === "male" ? "m_" : voice === "female" ? "" : voice;
  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      {scenes.map((s) => (
        <Sequence key={s.clip} from={s.from} durationInFrames={s.dur}>
          <Clip scene={s} />
        </Sequence>
      ))}
      <SnapFlash />

      <Audio
        src={staticFile("audio/music.wav")}
        volume={(f) =>
          (voiceover ? 0.5 : 0.9) *
          interpolate(f, [REEL01_DURATION - 24, REEL01_DURATION], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
        }
      />
      {voiceover
        ? scenes.map((s) => ({ vo: s.vo, from: s.from + 3 })).map((v) => (
            <Sequence key={v.vo} from={v.from}>
              <Audio src={staticFile(`audio/${voPrefix}${v.vo}.wav`)} volume={1} />
            </Sequence>
          ))
        : null}
    </AbsoluteFill>
  );
};
