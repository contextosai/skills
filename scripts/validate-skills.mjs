#!/usr/bin/env node
/**
 * Validate every skill and the marketplace manifest.
 *
 * Checks:
 *   1. Each skills/<name>/ has a SKILL.md with YAML frontmatter.
 *   2. Frontmatter has non-empty `name` and `description`.
 *   3. `name` is lowercase-hyphen and matches its folder name.
 *   4. .claude-plugin/marketplace.json is valid JSON, every referenced skill
 *      path exists, and every skill folder is referenced (no orphans).
 *
 * Exits non-zero on any error. Pure Node, no dependencies.
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];

const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

/** Minimal YAML frontmatter parser — enough for `key: value` and `key: >- ...`. */
function parseFrontmatter(text, file) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) {
    err(`${file}: missing YAML frontmatter (must start with '---').`);
    return null;
  }
  const fields = {};
  const lines = m[1].split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let val = kv[2].trim();
    // Folded/block scalar: gather subsequent more-indented lines.
    if (val === ">-" || val === ">" || val === "|" || val === "|-" || val === "") {
      const block = [];
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) {
        block.push(lines[++i].trim());
      }
      val = block.join(" ").trim();
    }
    fields[key] = val.replace(/^["']|["']$/g, "");
  }
  return fields;
}

const skillsDir = join(root, "skills");
const skillFolders = existsSync(skillsDir)
  ? readdirSync(skillsDir).filter((d) => statSync(join(skillsDir, d)).isDirectory())
  : [];

if (skillFolders.length === 0) err("No skills found under skills/.");

const validated = [];
for (const folder of skillFolders) {
  const skillMd = join(skillsDir, folder, "SKILL.md");
  if (!existsSync(skillMd)) {
    err(`skills/${folder}/: missing SKILL.md.`);
    continue;
  }
  const fm = parseFrontmatter(readFileSync(skillMd, "utf8"), `skills/${folder}/SKILL.md`);
  if (!fm) continue;

  if (!fm.name) err(`skills/${folder}/SKILL.md: frontmatter missing 'name'.`);
  if (!fm.description) err(`skills/${folder}/SKILL.md: frontmatter missing 'description'.`);
  if (fm.description && fm.description.length < 20)
    warn(`skills/${folder}/SKILL.md: 'description' is very short — cover what AND when.`);
  if (fm.name && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.name))
    err(`skills/${folder}/SKILL.md: 'name' must be lowercase-hyphenated (got '${fm.name}').`);
  if (fm.name && fm.name !== folder)
    err(`skills/${folder}/SKILL.md: 'name' ('${fm.name}') must match folder name ('${folder}').`);

  validated.push(folder);
}

// Marketplace manifest.
const manifestPath = join(root, ".claude-plugin", "marketplace.json");
const referenced = new Set();
if (!existsSync(manifestPath)) {
  err(".claude-plugin/marketplace.json: not found.");
} else {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch (e) {
    err(`.claude-plugin/marketplace.json: invalid JSON — ${e.message}`);
  }
  if (manifest) {
    if (!manifest.name) err("marketplace.json: missing top-level 'name'.");
    if (!Array.isArray(manifest.plugins) || manifest.plugins.length === 0)
      err("marketplace.json: 'plugins' must be a non-empty array.");
    for (const p of manifest.plugins ?? []) {
      if (!p.name) err("marketplace.json: a plugin is missing 'name'.");
      if (!p.description) err(`marketplace.json: plugin '${p.name}' missing 'description'.`);
      for (const s of p.skills ?? []) {
        const rel = s.replace(/^\.\//, "");
        referenced.add(rel.replace(/^skills\//, ""));
        if (!existsSync(join(root, rel, "SKILL.md")))
          err(`marketplace.json: plugin '${p.name}' references '${s}' but ${rel}/SKILL.md is missing.`);
      }
    }
    for (const folder of validated)
      if (!referenced.has(folder))
        warn(`skills/${folder}/ is not referenced by any plugin in marketplace.json.`);
  }
}

for (const w of warnings) console.log(`  war: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`  ERR: ${e}`);
  console.error(`\n✗ Validation failed: ${errors.length} error(s), ${warnings.length} warning(s).`);
  process.exit(1);
}
console.log(`\n✓ Validated ${validated.length} skill(s), ${warnings.length} warning(s), 0 errors.`);
