# BUILD_NOTES — bring-the-humans-03

Built in this session, after the bounty opened (2026-11-21T19:00:00Z).
Video: `ad-9x16.mp4`, 1080x1920, 18.0 s, 60 fps, H.264, ~2.0 MB. No audio track.

## Creative decisions (my own words)

The ad is text-on-screen, no voice: most TikTok is watched on mute, so the
words have to do the work. The concept is one blunt claim — "YOUR AI AGENT
CAN WIN REAL MONEY" — then the explanation, then proof, then the ask.

- 0.0–3.0 s, hook: "YOUR AI AGENT / CAN WIN / REAL MONEY" in big white
  DejaVu Sans Bold over a magenta-to-ink gradient. The first seconds decide
  whether a viewer stays, so the hook is a claim that sounds impossible.
- 3.0–7.0 s, what it is: "make.fun is where AI agents compete in bounties
  for real money." Plain, no jargon, name written lowercase with the dot.
- 7.0–11.0 s, proof: the press pack's competition screenshot
  (`competition-dark.png`, used as-is) framed in white, captioned "REAL
  BOUNTIES. REAL PRIZES." and "$500 across the top 20." A real screenshot
  makes the claim believable.
- 11.0–14.0 s, why join: "Your agent builds. / You enter it. / Winners get
  paid in USDC."
- 14.0–15.5 s, call to action: "ENTER YOUR AI AGENT / IN A BOUNTY ON /
  make.fun".
- 15.5–18.0 s, end card: the press pack's transparent referral card over
  the blurred clip, with my referral code `1hpjq5ct` typed into the field
  in JetBrains Mono Bold, ink #191419, per the manifest.

The brand badge (`makefun-badge-9x16.png`, full-frame overlay, used as-is)
sits at its manifest position (x 120–450, y 272–400) from the very first
frame until the end card comes in at 15.5 s. All on-screen text stays below
y 450 so it never collides with the badge, and above y 1500 so it stays
clear of TikTok's caption and buttons.

## Press files fetched in this session

From https://make.fun/press/manifest.json (edition 2026-11-21) and
https://make.fun/press/llms.txt, kept in `press/` (outside the repo):

- `makefun-badge-9x16.png` — 1080x1920, sha256
  7e4419566176002f68c52d30ef2ebaf98a9ccd5f361285afa6168d6f965dac53
  (the manifest's `files` list carries no badge entry; the URL is the one
  RULES.txt names, fetched live in this session).
- `makefun-card-9x16-transparent.webm` — sha256
  286b76c671fa3bf3b1580a7c71675d7b7e502f4fb374b56d30f1104044808cd1,
  matches the manifest exactly.
- `competition-dark.png` — press screenshot used in the proof scene.
  NOTE: its sha256/bytes do not match the manifest's entry for
  `screenshots/competition-dark.png` (manifest: 319120 bytes, sha256
  af198fb9…; fetched: 236031 bytes, sha256 c6b7d449…), and the same is true
  of `board-dark.png`. The site appears to serve newer screenshots than the
  manifest edition lists. The files are valid PNGs from the official press
  URLs, fetched in this session, and used as-is.
- `JetBrainsMono-Bold.ttf` — the manifest's font for the referral code,
  from the JetBrains Mono repo.
- Body text uses DejaVu Sans Bold, already installed on this machine.

## Render commands

Pass 1 — base clip (18 s) from an animated magenta/ink gradient, the
on-screen text (one file per line in `scratch/t_*.txt`), the screenshot
and the badge:

```sh
ffmpeg -y -v error -f lavfi -i "gradients=s=1080x1920:c0=0xc41c83:c1=0x191419:x0=0:y0=0:x1=1080:y1=1920:duration=18:speed=0.02" \
  -loop 1 -i press/competition-dark.png -i press/makefun-badge-9x16.png \
  -filter_complex_script scratch/render1.ff -map "[v]" -t 18 \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -r 30 scratch/clip.mp4
```

Pass 2 — end card, the recipe from llms.txt verbatim (card over the last
2.5 s, T = 15.5, code typed in once the field rests at T + 1.433 s):

```sh
CLIP=scratch/clip.mp4 CODE=1hpjq5ct FONT=press/JetBrainsMono-Bold.ttf
W=1080 H=1920 CARD=press/makefun-card-9x16-transparent.webm LEN=2.5 REST=1.433
CX=210 CY=1232 CW=5 CH=78 MID=1271 SIZE=62 HOLD=0
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$CLIP")
T=$(awk "BEGIN{print $D+$HOLD-$LEN}")
ffmpeg -y -v error -i "$CLIP" -c:v libvpx-vp9 -i "$CARD" -filter_complex "
[0:v]scale=$W:$H:force_original_aspect_ratio=increase,crop=$W:$H,setsar=1,fps=60,tpad=stop_mode=clone:stop_duration=$HOLD,format=yuva420p,split[clip][soft];
[soft]gblur=sigma=28,eq=saturation=0.35,fade=t=in:st=$T:d=0.8:alpha=1[soft];
[clip][soft]overlay[bg];
[1:v]format=yuva420p,setpts=PTS-STARTPTS+$T/TB[card];
[bg][card]overlay=eof_action=pass,
drawbox=x=$CX-2:y=$CY-2:w=$CW+4:h=$CH+4:color=white:t=fill:enable='gte(t,$T+$REST)',
drawtext=fontfile=$FONT:text=$CODE:fontsize=$SIZE:fontcolor=0x191419:x=$CX:y=$MID-(ascent-descent)/2:enable='gte(t,$T+$REST)'[v]" \
  -map '[v]' -map '0:a?' -c:v libx264 -pix_fmt yuv420p -crf 18 -c:a aac -movflags +faststart ad-9x16.mp4
```

## Frame checks (all inspected visually)

- First frame: badge visible upper-left, gradient behind, no text yet
  (hook fades in over the first 0.3 s). PASS.
- t=1.5 s: hook "YOUR AI AGENT / CAN WIN / REAL MONEY", badge present. PASS.
- t=5 s: "make.fun is where AI agents compete in bounties for real money."
  PASS.
- t=9 s: screenshot framed, "REAL BOUNTIES. REAL PRIZES." /
  "$500 across the top 20." PASS.
- t=12.5 s: "Your agent builds. / You enter it. / Winners get paid in USDC."
  PASS.
- t=14.8 s: CTA "ENTER YOUR AI AGENT / IN A BOUNTY ON / make.fun". PASS.
- Last frame: end card fully built — magenta wash, ghost mark, make.fun
  wordmark, "Use my referral code", white field with `1hpjq5ct` and the
  copy button. PASS.
- Full decode check: `ffmpeg -i ad-9x16.mp4 -f null -` clean. PASS.

## Entry program

`main.ts` (Node 22, written in this session, in my own words) copies
`VIDEO.json` from the repo root to the output directory and validates it
is an object with a string `url` first. Tested the way the grader does:

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

Copies `VIDEO.json` byte-for-byte to `out/VIDEO.json`. Revised once after
the first run (paths resolved to absolute so it works from any cwd),
then re-run clean.

## What is NOT done (deliberately)

- The video is NOT posted anywhere and no TikTok account was created:
  there is no TikTok account yet, so `VIDEO.json` holds a placeholder URL
  (`https://www.tiktok.com/@xJPtea/video/0000000000000000000`). Replace it
  with the real posted video's address before submitting.
- Nothing was submitted. Posting + submit wait for JP's TikTok account.

## Files

- `ad-9x16.mp4` — the rendered ad (the file to post).
- `main.ts`, `VIDEO.json`, `README.md`, `LICENSE` (MIT, copied from the
  kit starter — the one file copied), `BUILD_NOTES.md` — the repo files.
- `press/` — press pack downloads (NOT part of the repo).
- `scratch/` — render intermediates: `clip.mp4`, `render1.ff`, `t_*.txt`,
  frame checks (`first.png`, `hook.png`, `what.png`, `proof.png`,
  `why.png`, `cta.png`, `last.png`). Exclude from the commit.
- `out/` — local test output of `main.ts`. Exclude from the commit.
