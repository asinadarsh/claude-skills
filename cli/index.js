#!/usr/bin/env node

const https = require("https");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO = "asinadarsh/claude-skills";
const BRANCH = "main";
const BASE_URL = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;
const CATALOG_URL = `${BASE_URL}/catalog.json`;

const CLAUDE_DIR = path.join(process.env.HOME || process.env.USERPROFILE, ".claude", "commands");

// ── Colors ──
const c = {
  r: "\x1b[0m", red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m",
  blue: "\x1b[34m", magenta: "\x1b[35m", cyan: "\x1b[36m", bold: "\x1b[1m", dim: "\x1b[2m"
};

function log(msg) { console.log(msg); }
function success(msg) { log(`${c.green}✓${c.r} ${msg}`); }
function warn(msg) { log(`${c.yellow}!${c.r} ${msg}`); }
function error(msg) { log(`${c.red}✗${c.r} ${msg}`); }
function info(msg) { log(`${c.blue}→${c.r} ${msg}`); }

// ── HTTP fetch ──
function fetch(url) {
  return new Promise((resolve, reject) => {
    const get = (u) => {
      https.get(u, { headers: { "User-Agent": "claude-skills-cli" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location);
        }
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${u}`));
        let data = "";
        res.on("data", (chunk) => data += chunk);
        res.on("end", () => resolve(data));
      }).on("error", reject);
    };
    get(url);
  });
}

// ── Load catalog ──
async function loadCatalog() {
  const data = await fetch(CATALOG_URL);
  return JSON.parse(data);
}

// ── Install a skill ──
async function installSkill(catalog, name) {
  const skill = catalog.skills.find(s => s.name === name);
  if (!skill) {
    error(`Skill "${name}" not found. Run 'claude-skills list' to see available skills.`);
    return false;
  }

  const url = `${BASE_URL}/${skill.path}`;
  const content = await fetch(url);
  const destDir = skill.path.includes("/") ? path.join(CLAUDE_DIR, path.dirname(skill.path).replace("skills/", "")) : CLAUDE_DIR;

  fs.mkdirSync(destDir, { recursive: true });
  const destFile = path.join(destDir, path.basename(skill.path));
  fs.writeFileSync(destFile, content);
  success(`Installed ${c.bold}${skill.name}${c.r} → ${destFile}`);
  return true;
}

// ── Install a pack ──
async function installPack(catalog, packName) {
  const pack = catalog.packs.find(p => p.name === packName);
  if (!pack) {
    error(`Pack "${packName}" not found. Available: ${catalog.packs.map(p => p.name).join(", ")}`);
    return;
  }

  log(`\n${c.bold}${c.cyan}Installing pack: ${pack.name}${c.r} — ${pack.description}`);
  log(`${c.dim}${pack.skills.length} skills${c.r}\n`);

  let installed = 0;
  for (const name of pack.skills) {
    try {
      const ok = await installSkill(catalog, name);
      if (ok) installed++;
    } catch (e) {
      error(`Failed to install ${name}: ${e.message}`);
    }
  }
  log(`\n${c.green}${c.bold}Done!${c.r} Installed ${installed}/${pack.skills.length} skills.\n`);
}

// ── List skills ──
function listSkills(catalog, category) {
  log(`\n${c.bold}${c.cyan}Claude Skills Catalog${c.r}\n`);

  const categories = [...new Set(catalog.skills.map(s => s.category))];
  const filtered = category ? catalog.skills.filter(s => s.category === category) : catalog.skills;

  if (category && filtered.length === 0) {
    warn(`No skills in category "${category}". Available: ${categories.join(", ")}`);
    return;
  }

  const grouped = {};
  filtered.forEach(s => {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  });

  for (const [cat, skills] of Object.entries(grouped)) {
    log(`${c.bold}${c.magenta}${cat.toUpperCase()}${c.r}`);
    skills.forEach(s => {
      log(`  ${c.green}${s.name.padEnd(28)}${c.r} ${c.dim}${s.description}${c.r}`);
    });
    log("");
  }

  log(`${c.dim}Install: npx claude-skills install <name>${c.r}`);
  log(`${c.dim}Packs:   npx claude-skills install-pack <pack-name>${c.r}\n`);

  if (!category) {
    log(`${c.bold}Available Packs:${c.r}`);
    catalog.packs.forEach(p => {
      log(`  ${c.cyan}${p.name.padEnd(22)}${c.r} ${p.skills.length} skills — ${p.description}`);
    });
    log("");
  }
}

// ── Search ──
function searchSkills(catalog, query) {
  const q = query.toLowerCase();
  const results = catalog.skills.filter(s =>
    s.name.includes(q) || s.description.toLowerCase().includes(q) || s.tags.some(t => t.includes(q))
  );

  if (results.length === 0) {
    warn(`No skills matching "${query}".`);
    return;
  }

  log(`\n${c.bold}Search results for "${query}":${c.r}\n`);
  results.forEach(s => {
    log(`  ${c.green}${s.name.padEnd(28)}${c.r} ${c.dim}[${s.category}]${c.r} ${s.description}`);
  });
  log(`\n${c.dim}Install: npx claude-skills install <name>${c.r}\n`);
}

// ── Uninstall ──
function uninstallSkill(catalog, name) {
  const skill = catalog.skills.find(s => s.name === name);
  if (!skill) { error(`Skill "${name}" not found.`); return; }

  const destDir = skill.path.includes("/") ? path.join(CLAUDE_DIR, path.dirname(skill.path).replace("skills/", "")) : CLAUDE_DIR;
  const destFile = path.join(destDir, path.basename(skill.path));

  if (fs.existsSync(destFile)) {
    fs.unlinkSync(destFile);
    success(`Uninstalled ${c.bold}${name}${c.r}`);
  } else {
    warn(`${name} is not installed.`);
  }
}

// ── Main ──
async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const target = args.slice(1).join(" ");

  log(`\n${c.bold}${c.red}⚡ Claude Skills${c.r} ${c.dim}v1.0.0${c.r}\n`);

  if (!cmd || cmd === "help" || cmd === "--help") {
    log(`${c.bold}Usage:${c.r}`);
    log(`  ${c.cyan}npx claude-skills list${c.r}                    List all skills`);
    log(`  ${c.cyan}npx claude-skills list <category>${c.r}         List skills in category`);
    log(`  ${c.cyan}npx claude-skills search <query>${c.r}          Search skills`);
    log(`  ${c.cyan}npx claude-skills install <name>${c.r}          Install a skill`);
    log(`  ${c.cyan}npx claude-skills install-pack <pack>${c.r}     Install a skill pack`);
    log(`  ${c.cyan}npx claude-skills uninstall <name>${c.r}        Remove a skill`);
    log(`  ${c.cyan}npx claude-skills info <name>${c.r}             Show skill details`);
    log("");
    return;
  }

  try {
    const catalog = await loadCatalog();

    switch (cmd) {
      case "list":
      case "ls":
        listSkills(catalog, target || null);
        break;
      case "search":
      case "find":
        if (!target) { error("Usage: claude-skills search <query>"); break; }
        searchSkills(catalog, target);
        break;
      case "install":
      case "add":
        if (!target) { error("Usage: claude-skills install <name>"); break; }
        await installSkill(catalog, target);
        break;
      case "install-pack":
      case "pack":
        if (!target) { error("Usage: claude-skills install-pack <pack-name>"); break; }
        await installPack(catalog, target);
        break;
      case "uninstall":
      case "remove":
        if (!target) { error("Usage: claude-skills uninstall <name>"); break; }
        uninstallSkill(catalog, target);
        break;
      case "info":
        const skill = catalog.skills.find(s => s.name === target);
        if (!skill) { error(`Skill "${target}" not found.`); break; }
        log(`${c.bold}${skill.name}${c.r}`);
        log(`${c.dim}${skill.description}${c.r}\n`);
        log(`  Category:  ${skill.category}`);
        log(`  Tags:      ${skill.tags.join(", ")}`);
        log(`  Path:      ${skill.path}`);
        log(`\n${c.dim}Install: npx claude-skills install ${skill.name}${c.r}\n`);
        break;
      default:
        error(`Unknown command: ${cmd}. Run 'claude-skills help' for usage.`);
    }
  } catch (e) {
    error(`Failed: ${e.message}`);
    process.exit(1);
  }
}

main();
