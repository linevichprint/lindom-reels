#!/bin/zsh
# vsheet.sh <out.jpg> <videos...> : contact sheet, 10 frames per video
S=$(mktemp -d)
B="/Users/tanya/Documents/Claude/Projects/Reel studio/reel-engine/node_modules/@remotion/compositor-darwin-arm64"; export DYLD_LIBRARY_PATH="$B"
out=$1; shift; : > "$S/m.txt"; r=0
for f in "$@"; do d=$("$B/ffprobe" -v error -show_entries format=duration -of csv=p=0 "$f"); echo "$r|$(basename "$f")|$d" >> "$S/m.txt"
  for i in 0 1 2 3 4 5 6 7 8 9; do t=$(python3 -c "print(round($d*($i+0.3)/10,2))"); "$B/ffmpeg" -v error -y -ss $t -i "$f" -frames:v 1 -vf "scale=w=130:h=231:force_original_aspect_ratio=decrease" "$S/${r}_$i.jpg" </dev/null; done; r=$((r+1)); done
python3 - "$out" "$S" <<'PY'
import sys,os
from PIL import Image, ImageDraw
out,S=sys.argv[1],sys.argv[2]; rows=[l.strip().split('|') for l in open(S+'/m.txt')]
im=Image.new('RGB',(10*130,len(rows)*246),'white'); d=ImageDraw.Draw(im)
for k,(r,n,du) in enumerate(rows):
    d.text((2,k*246+1),f"{n} {float(du):.1f}s",fill='black')
    for i in range(10):
        p=f"{S}/{r}_{i}.jpg"
        if os.path.exists(p): im.paste(Image.open(p),(i*130,k*246+14))
im.save(out,quality=80)
PY
