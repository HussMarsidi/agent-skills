# Agent Skills

A collection of agent skills I find useful, including custom skills I use regularly. I'm always scaffolding new projects and used to reference old projects for code structure—this repo captures those patterns as reusable agent skills that follow the [Agent Skills specification](https://agentskills.io).

# What's Included

### Skills
| Skill | Description |
|-------|-------------|
| [project-scaffolder](skills/project-scaffolder/SKILL.md) | Generate production-ready React + Hono monorepos with feature-first architecture, platform layers, and shared packages |
| [skill-names](skills/skill-names/SKILL.md) | Guide for describing and refining skills before implementation |

### Commands
| Command | What it does |
|---------|--------------|
| `/refine-skill` | Interactively refine a skill through exhaustive questioning about requirements, use cases, and best practices until every detail is clear |

## Installation

```bash
# Initialize your workspace
npx @hussmarsidi/agent-skills init
```

## Usage

### Add skills to your workspace
```bash
# Add skills to your workspace using interactive CLI
npx @hussmarsidi/agent-skills skills

# Install a specific skill
npx @hussmarsidi/agent-skills skills --add project-scaffolder

# List available skills
npx @hussmarsidi/agent-skills skills --list
```

### Create a New Skill

```bash
# Create a basic skill
npx @hussmarsidi/agent-skills create my-skill

# With description and optional directories
npx @hussmarsidi/agent-skills create my-skill \
  --description "A skill that does X" \
  --scripts \
  --references \
  --assets
```

After creating a skill, use the `/refine-skill` command in your IDE to interactively fill in all details.

## Supported Tools

- Cursor (`.cursor/skills/`)
- OpenCode (`.opencode/skill/`)
- Claude Code (`.claude/skills/`)
- Codex (`.codex/skills/`)
- Amp, Kilo Code, Roo Code, Goose, Antigravity

## Contributing

Contributions welcome! Whether it's improving existing skills or adding new ones, feel free to open issues or submit pull requests.

## License

MIT
