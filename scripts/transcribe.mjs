// usage: node scripts/transcribe.mjs <dir with 16k mono wavs>
import { pipeline } from "@huggingface/transformers";
import { readFileSync, readdirSync } from "node:fs";
const dir = process.argv[2];
const asr = await pipeline("automatic-speech-recognition", "onnx-community/whisper-base", { dtype: "q8" });
for (const f of readdirSync(dir).filter((x) => x.endsWith(".wav"))) {
  const buf = readFileSync(`${dir}/${f}`);
  const pcm = new Int16Array(buf.buffer, buf.byteOffset + 44, (buf.length - 44) >> 1);
  const x = Float32Array.from(pcm, (v) => v / 32768);
  const out = await asr(x, { chunk_length_s: 30, return_timestamps: true });
  console.log(`${f} [${(x.length / 16000).toFixed(1)}s]: ${out.text.trim()}`);
}
