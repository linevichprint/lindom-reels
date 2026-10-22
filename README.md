# lindom-reels

Instagram / TikTok reels for [Lindom.home](https://www.lindomhome.com), built with [Remotion](https://www.remotion.dev).

## Layout

- `src/Reel.tsx` - the shared reel component (clips, captions, review cards, chats, stamps, snap flash, b&w-to-colour).
- `src/batch4.ts` - most reel configs, grouped in batches; `src/reels.ts` - the early ones.
- `src/Root.tsx` - registers every composition.
- `src/Ksyusha.tsx`, `src/PatreonTheo.tsx`, `src/Reel01.tsx` - one-off compositions.
- `scripts/make_music.py` - synthesizes 120 BPM tracks (styles: pop, bounce, funk, lofi, dream, swing, chip, house, clicky, clickonly).
- `scripts/tts.mjs` - Kokoro voice-over; `scripts/transcribe.mjs` - Whisper check of the voice-over.
- `scripts/render_batch4.sh` - renders compositions into `../готовые/`, copying only the media each reel needs and stripping container metadata.

Media (`public/clips`, `public/audio`, `public/photos`) is not in the repo.

## Render

```bash
npm install
scripts/render_batch4.sh <CompositionId> [...]
```
