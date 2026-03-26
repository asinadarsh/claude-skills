# ⚡ Claude Skills

> **50+ plug-and-play skills for Claude Code. Install in one command.**

```bash
npx claude-skills install seo-audit
```

Or install an entire pack:

```bash
npx claude-skills install-pack marketing
```

---

## What is this?

**Claude Skills** are pre-built prompts that give Claude Code specialized abilities — SEO audits, code reviews, PPT generation, data analysis, and more. Each skill is a single markdown file that drops into your `.claude/commands/` directory.

Think of it as **an app store for Claude Code**.

## Quick Start

```bash
# Install a single skill
npx claude-skills install code-review

# Install all marketing skills (10 skills)
npx claude-skills install-pack marketing

# Install everything (35+ skills)
npx claude-skills install-pack all

# Browse available skills
npx claude-skills list

# Search
npx claude-skills search "seo"
```

Then in Claude Code, use the skill:
```
/seo-audit
/code-review
/ppt-generator
```

---

## Skill Catalog

### Marketing (10 skills)

| Skill | Description |
|-------|-------------|
| `seo-audit` | Comprehensive SEO audit — meta tags, headings, schema, Core Web Vitals |
| `copywriting` | Marketing copy for landing pages, homepages, product pages (AIDA framework) |
| `content-strategy` | 90-day content plan — topic clusters, editorial calendar, keyword mapping |
| `email-sequence` | Email drip campaigns — welcome series, nurture, re-engagement |
| `social-content` | Social media content — LinkedIn, Twitter, Instagram, platform-optimized |
| `competitor-analysis` | Competitor deep dive — positioning, pricing, features, SWOT output |
| `landing-page-cro` | Landing page CRO — headline, CTA, social proof, friction analysis |
| `ad-creative` | Ad copy generator — Google Ads, Meta, LinkedIn, A/B variants |
| `pricing-strategy` | Pricing advisor — value metrics, packaging, freemium vs trial |
| `launch-strategy` | Product launch playbook — pre-launch, day-of, post-launch phases |

### Development (10 skills)

| Skill | Description |
|-------|-------------|
| `code-review` | Thorough code review — bugs, security, performance, SOLID principles |
| `tdd-london` | TDD London School — mock-first, red-green-refactor cycle |
| `refactor` | Code refactoring — identifies smells, applies patterns, preserves behavior |
| `api-design` | REST API design — OpenAPI spec, endpoints, error handling, versioning |
| `debug` | Systematic debugging — hypotheses, tracing, root cause analysis |
| `security-scan` | Security scanner — OWASP Top 10, dependencies, secrets, injection |
| `performance-audit` | Performance audit — N+1 queries, memory leaks, bundle size |
| `git-cleanup` | Git repo cleanup — stale branches, large files, commit hygiene |
| `typescript-migrate` | JS → TypeScript migration — incremental, interfaces, tsconfig |
| `docker-setup` | Docker & docker-compose — multi-stage builds, dev/prod configs |

### Productivity (5 skills)

| Skill | Description |
|-------|-------------|
| `ppt-generator` | PowerPoint generator — charts, consulting style, professional templates |
| `meeting-notes` | Meeting notes processor — action items, decisions, owners, deadlines |
| `project-planner` | Project planning — milestones, tasks, dependencies, Gantt timeline |
| `email-writer` | Professional email composer — cold, follow-up, negotiation, status |
| `document-analyzer` | Document analysis — PDF/doc summarizer, key info extraction |

### Data Analysis (4 skills)

| Skill | Description |
|-------|-------------|
| `csv-analyzer` | CSV data analysis — statistics, trends, outliers, correlations |
| `sql-generator` | Natural language to SQL — complex joins, aggregations, window functions |
| `data-visualizer` | Data visualization — bar, line, scatter, heatmap, funnel charts |
| `report-builder` | Business report builder — executive summaries, KPI dashboards |

### Design (3 skills)

| Skill | Description |
|-------|-------------|
| `ui-review` | UI/UX review — accessibility, hierarchy, spacing, contrast, mobile |
| `color-palette` | Color palette generator — brand palettes, CSS vars, WCAG contrast |
| `component-library` | UI component scaffolder — React/Vue, props, types, stories |

### DevOps (3 skills)

| Skill | Description |
|-------|-------------|
| `ci-cd-setup` | CI/CD pipelines — GitHub Actions, test/build/deploy, caching |
| `nginx-config` | Nginx config generator — reverse proxy, SSL, caching, rate limits |
| `monitoring-setup` | App monitoring — health checks, error tracking, alerting rules |

---

## Skill Packs

Install multiple skills at once:

| Pack | Skills | Command |
|------|--------|---------|
| `marketing` | 10 marketing skills | `npx claude-skills install-pack marketing` |
| `development` | 10 dev skills | `npx claude-skills install-pack development` |
| `productivity` | 5 productivity skills | `npx claude-skills install-pack productivity` |
| `data` | 4 data analysis skills | `npx claude-skills install-pack data` |
| `design` | 3 design skills | `npx claude-skills install-pack design` |
| `devops` | 3 devops skills | `npx claude-skills install-pack devops` |
| `all` | All 35+ skills | `npx claude-skills install-pack all` |

---

## Manual Installation

Don't want to use the CLI? Just copy the files:

```bash
# Clone the repo
git clone https://github.com/asina/claude-skills.git

# Copy the skills you want
cp claude-skills/skills/marketing/seo-audit.md ~/.claude/commands/
```

Or download individual files:
```bash
curl -o ~/.claude/commands/seo-audit.md \
  https://raw.githubusercontent.com/asinadarsh/claude-skills/main/skills/marketing/seo-audit.md
```

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Adding a new skill:**

1. Fork this repo
2. Create your skill file in the appropriate `skills/<category>/` directory
3. Follow the [skill template](#skill-format)
4. Add your skill to `catalog.json`
5. Submit a PR

### Skill Format

```markdown
---
name: my-skill
description: One-line description of what the skill does
category: marketing|development|productivity|data-analysis|design|devops
tags: [relevant, search, terms]
author: your-github-username
version: 1.0.0
---

# My Skill Name

[Detailed prompt instructions that Claude Code will execute]
```

---

## FAQ

**Q: Where do skills get installed?**
A: `~/.claude/commands/` — Claude Code's slash command directory.

**Q: Can I use these with Claude Desktop?**
A: These are designed for Claude Code (CLI/IDE). They won't work in Claude.ai chat.

**Q: How do I uninstall a skill?**
A: `npx claude-skills uninstall <name>` or delete the file from `~/.claude/commands/`.

**Q: Can I modify installed skills?**
A: Yes! They're just markdown files. Edit them however you want.

---

## Star History

If this repo helped you, give it a ⭐ — it helps others find it.

---

## License

MIT — use these skills however you want.
