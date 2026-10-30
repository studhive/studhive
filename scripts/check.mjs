import { readdir, readFile, access } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const files = (await readdir("dist")).filter((name) => name.endsWith(".html"));
const issues = [];
let links = 0;
for (const name of files) {
  const html = await readFile(`dist/${name}`, "utf8");
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  if (new Set(ids).size !== ids.length)
    issues.push(`${name}: duplicate element IDs`);
  if ((html.match(/<h1[ >]/g) || []).length !== 1)
    issues.push(`${name}: expected one primary heading`);
  if (!html.includes('<html lang="en-GB">'))
    issues.push(`${name}: missing language`);
  if (!html.includes('name="description"'))
    issues.push(`${name}: missing description`);
  for (const [, attr, raw] of html.matchAll(/\b(href|src)="([^"]*)"/g)) {
    if (/^(https?:|mailto:|tel:|data:)/.test(raw)) continue;
    links++;
    if (!raw || raw === "#") {
      issues.push(`${name}: empty ${attr}`);
      continue;
    }
    const [pathname, hash] = raw.split("#");
    const file = pathname.split("?")[0] || name;
    try {
      await access(path.join("dist", file));
    } catch {
      issues.push(`${name}: missing ${file}`);
    }
    if (hash && (!pathname || file === name) && !ids.includes(hash))
      issues.push(`${name}: missing #${hash}`);
  }
  for (const img of html.matchAll(/<img\b[^>]*>/g))
    if (!/\balt=/.test(img[0])) issues.push(`${name}: image without alt`);
}
const css = await readFile("dist/styles.css", "utf8");
for (const [, url] of css.matchAll(/url\(['"]?([^)'"\s]+)/g)) {
  try {
    await access(path.join("dist", url));
  } catch {
    issues.push(`CSS: missing ${url}`);
  }
}
for (const file of [
  "build.mjs",
  "public/app.js",
  "server.mjs",
  "site.config.mjs",
]) {
  const result = spawnSync(process.execPath, ["--check", file], {
    encoding: "utf8",
  });
  if (result.status) issues.push(result.stderr);
}
if (issues.length) {
  console.error(issues.join("\n"));
  process.exit(1);
}
console.log(
  `Passed: ${files.length} pages, ${links} local references, unique IDs, image alternatives, font assets and JavaScript syntax.`,
);
