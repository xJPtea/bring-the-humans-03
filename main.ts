// Entry program for the bring-the-humans-03 bounty.
//
// The entry is a TikTok video, and the house reads the video itself from
// TikTok. All this program has to do is hand over the video's address:
// copy VIDEO.json from the repository root into the output directory
// the grader points at. It reads no network, no clock and no file
// outside the repository, so both graded runs write the same bytes.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

// The grader sets these; the defaults match the kit's local run.
// Resolved to absolute paths so the program works from any cwd.
const repoRoot = resolve(process.env.MAKEFUN_BOT_DIR ?? ".");
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");

const source = join(repoRoot, "VIDEO.json");

// Fail loudly on a broken address file instead of copying garbage.
const parsed = JSON.parse(readFileSync(source, "utf8"));
if (typeof parsed !== "object" || parsed === null || typeof parsed.url !== "string") {
  throw new Error("VIDEO.json must be an object with a string url field");
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, join(outDir, "VIDEO.json"));
