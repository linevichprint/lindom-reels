// Local neural TTS (Kokoro). usage: node scripts/tts.mjs <voice> <outPrefix> [speed]
import { KokoroTTS } from "kokoro-js";
import { writeFileSync } from "node:fs";

// trim leading/trailing silence and write 16-bit PCM wav
const saveTrimmed = (samples, sr, file) => {
  let a = 0, b = samples.length - 1;
  while (a < b && Math.abs(samples[a]) < 0.01) a++;
  while (b > a && Math.abs(samples[b]) < 0.01) b--;
  a = Math.max(0, a - Math.round(sr * 0.02));
  b = Math.min(samples.length - 1, b + Math.round(sr * 0.08));
  const n = b - a + 1;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(sr, 24); buf.writeUInt32LE(sr * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(n * 2, 40);
  let peak = 0;
  for (let i = a; i <= b; i++) peak = Math.max(peak, Math.abs(samples[i]));
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.round((samples[a + i] / peak) * 0.92 * 32767), 44 + i * 2);
  writeFileSync(file, buf);
  return n / sr;
};

// usage: node scripts/tts.mjs <voice> <outPrefix> <speed> "line 1" "line 2" ...
const [voice, prefix, speed = "1", ...lines] = process.argv.slice(2);
const tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", { dtype: "q8", device: "cpu" });
for (let i = 0; i < lines.length; i++) {
  const audio = await tts.generate(lines[i], { voice, speed: Number(speed) });
  const d = saveTrimmed(audio.audio, audio.sampling_rate, `${prefix}vo${i + 1}.wav`);
  console.log(i + 1, d.toFixed(2));
}
