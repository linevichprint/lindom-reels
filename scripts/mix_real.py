"""Puts the takes' own sound under a music track: mix_real.py <music.wav (in/out)> <music gain> <source.MOV>:<start s>:<frames> ...
Segments are laid back to back from 0, each normalised and faded, in the same order as the reel's shots (30 fps)."""
import sys, os, subprocess, tempfile, wave, numpy as np
SR = 44100
B = os.path.join(os.path.dirname(__file__), "..", "node_modules/@remotion/compositor-darwin-arm64")
def rd(p):
    w = wave.open(p); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    return a.reshape(-1, w.getnchannels()), w.getframerate()
music, gain, segs = sys.argv[1], float(sys.argv[2]), sys.argv[3:]
m, _ = rd(music); m = m if m.shape[1] == 2 else np.repeat(m, 2, 1)
real = np.zeros(len(m), np.float32); f = 0
for s in segs:
    src, st, d = s.rsplit(":", 2); st, d = float(st), int(d)
    tmp = tempfile.mktemp(suffix=".wav")
    subprocess.run([B + "/ffmpeg", "-v", "error", "-y", "-ss", str(st), "-t", str(d / 30), "-i", src, "-vn", "-ac", "1", "-ar", str(SR), tmp], env=dict(os.environ, DYLD_LIBRARY_PATH=B), check=True)
    a, _ = rd(tmp); os.remove(tmp); a = a[:, 0]
    a = a / (np.percentile(np.abs(a), 99.5) + 1e-6) * 0.7
    L = len(a); a *= np.minimum(1, np.minimum(np.arange(L), L - np.arange(L)) / 441.0)
    i = int(f / 30 * SR); j = min(len(real), i + L); real[i:j] += a[: j - i]; f += d
out = m * gain + real[:, None]
out = np.clip(out / max(1, np.abs(out).max() / 0.95), -1, 1)
w = wave.open(music, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype(np.int16).tobytes()); w.close()
