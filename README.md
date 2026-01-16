# Agent Skills

A curated collection of high-performance agent skills I've developed and use in my own projects. These skills follow the [Agent Skills specification](https://agentskills.io) and work with Cursor, OpenCode, Claude Code, Codex, and other AI coding agents.

## Quick Start

```bash
# Initialize your workspace
npx @hussmarsidi/agent-skills init

# Browse and install skills
npx @hussmarsidi/agent-skills add-skills

# Install a specific skill
npx @hussmarsidi/agent-skills add-skills --skill project-scaffolder
```

## Featured Skills

### 🏗️ project-scaffolder
**Generate production-ready React + Hono monorepos**

Scaffolds feature-first architectures with platform layers, shared packages, and strict guardrails. Perfect for setting up new projects or refactoring existing codebases.

```bash
npx @hussmarsidi/agent-skills add-skills --skill project-scaffolder
```

### 📝 skill-names
**Guide for describing and refining skills**

Helps you think through skill requirements and documentation before implementation.

```bash
npx @hussmarsidi/agent-skills add-skills --skill skill-names
```

## Create Your Own Skills

Generate new skill templates that comply with the Agent Skills specification:

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

## Installation Options

**Project-level** (committed with your project):
```bash
npx @hussmarsidi/agent-skills add-skills --skill project-scaffolder
```

**Global** (available across all projects):
```bash
npx @hussmarsidi/agent-skills add-skills --skill project-scaffolder --global
```

**Multiple agents**:
```bash
npx @hussmarsidi/agent-skills add-skills --skill project-scaffolder --agent cursor --agent codex
```

## Supported Agents

- Cursor (`.cursor/skills/`)
- OpenCode (`.opencode/skill/`)
- Claude Code (`.claude/skills/`)
- Codex (`.codex/skills/`)
- Amp, Kilo Code, Roo Code, Goose, Antigravity

## Contributing

Found these skills useful? Contributions welcome! Whether it's improving existing skills or adding new ones, feel free to open issues or submit pull requests.

## License

MIT
