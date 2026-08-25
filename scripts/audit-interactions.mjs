import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

const root = join(process.cwd(), "client/src");
const files = [];
const ignored = ["/components/ui/", "/pages/ComponentShowcase.tsx"];

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.name.endsWith(".tsx") && !ignored.some((part) => path.includes(part))) files.push(path);
  }
}
await walk(root);
const issues = [];
const records = [];
for (const file of files) {
  const source = await readFile(file, "utf8");
  const tagPattern = /<(Link|a|button|Button|TabsTrigger|PaginationLink|PaginationPrevious|PaginationNext)\b[\s\S]*?>/g;
  let match;
  while ((match = tagPattern.exec(source))) {
    const tag = match[0];
    const line = source.slice(0, match.index).split("\n").length;
    const kind = match[1];
    const hasDestination = /\bhref\s*=/.test(tag) || /\bto\s*=/.test(tag);
    const hasAction = /\bonClick\s*=/.test(tag) || /\bonSubmit\s*=/.test(tag) || /\bonValueChange\s*=/.test(tag) || /\btype\s*=\s*["']submit["']/.test(tag) || /\baria-haspopup\s*=/.test(tag) || kind === "TabsTrigger";
    const hasFakeDestination = /href\s*=\s*["']#?["']/.test(tag) || /href\s*=\s*\{\s*undefined\s*\}/.test(tag) && !hasAction;
    records.push(`${relative(process.cwd(), file)}:${line} <${kind}> ${hasDestination ? "destination" : hasAction ? "action" : "no-destination-or-action"}`);
    if (["Link", "a"].includes(kind) && (!hasDestination || hasFakeDestination)) issues.push(`${relative(process.cwd(), file)}:${line} ${kind} sans destination réelle`);
    if (["button", "Button", "PaginationLink", "PaginationPrevious", "PaginationNext"].includes(kind) && !hasAction && !hasDestination) issues.push(`${relative(process.cwd(), file)}:${line} ${kind} sans action ni destination`);
  }
}
await writeFile("interaction-audit-machine.txt", records.join("\n") + "\n");
if (issues.length) {
  console.error(issues.join("\n"));
  process.exit(1);
}
console.log(`Interactions contrôlées : ${records.length}`);
