"""Contact sheet: grid.py out.jpg clips... -> 5 frames per clip, 3 clips per row (for checking footage)."""
import sys, subprocess, os, tempfile
from PIL import Image, ImageDraw
D = os.path.join(os.path.dirname(__file__), "..", "node_modules/@remotion/compositor-darwin-arm64")
env = dict(os.environ, DYLD_LIBRARY_PATH=D)
out, clips = sys.argv[1], sys.argv[2:]
tiles = []
for c in clips:
    r = subprocess.run([D + "/ffmpeg", "-i", c], capture_output=True, text=True, env=env).stderr
    h, m, s = r.split("Duration: ")[1].split(",")[0].split(":"); dur = int(h) * 3600 + int(m) * 60 + float(s)
    row = Image.new("RGB", (600, 227), "white"); ImageDraw.Draw(row).text((2, 0), f"{os.path.basename(c)[:-4]} {dur:.1f}s", fill="red")
    for i in range(5):
        f = tempfile.mktemp(suffix=".jpg")
        subprocess.run([D + "/ffmpeg", "-v", "error", "-y", "-ss", str(dur * (i + 0.5) / 5), "-i", c, "-frames:v", "1", "-vf", "scale=120:213", f], env=env)
        if os.path.exists(f): row.paste(Image.open(f), (i * 120, 14)); os.remove(f)
    tiles.append(row)
o = Image.new("RGB", (1820, ((len(tiles) + 2) // 3) * 228), "white")
for i, t in enumerate(tiles): o.paste(t, ((i % 3) * 610, (i // 3) * 228))
o.save(out)
