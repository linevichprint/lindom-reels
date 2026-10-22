// usage: node scripts/transcribe_ts.mjs <16k mono wav> <language> — prints timestamped chunks as JSON
import { pipeline } from "@huggingface/transformers";
import { readFileSync } from "node:fs";
const [file, language = "spanish"] = process.argv.slice(2);
const asr = await pipeline("automatic-speech-recognition", "onnx-community/whisper-small", { dtype: "q8" });
const buf = readFileSync(file);
const pcm = new Int16Array(buf.buffer, buf.byteOffset + 44, (buf.length - 44) >> 1);
const x = Float32Array.from(pcm, (v) => v / 32768);
const out = await asr(x, { language, task: "transcribe", chunk_length_s: 30, stride_length_s: 5, return_timestamps: true });
console.log(JSON.stringify(out.chunks.map((c) => [c.timestamp[0], c.timestamp[1], c.text.trim()])));
