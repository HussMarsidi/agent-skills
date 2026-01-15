# Cursor Skill Generator CLI

A CLI tool to generate Cursor skill templates that comply with the [Agent Skills specification](https://agentskills.io).

## Installation

```bash
pnpm install
pnpm run build
```

## Usage

```bash
# Basic usage
node bin/create-cursor-skill.js <skill-name>

# With description
node bin/create-cursor-skill.js my-skill --description "A skill that does X"

# With optional directories
node bin/create-cursor-skill.js my-skill --scripts --references --assets

# Show help
node bin/create-cursor-skill.js --help
```

## Examples

```bash
# Create a basic skill
node bin/create-cursor-skill.js pdf-processing

# Create a skill with all optional directories
node bin/create-cursor-skill.js data-analysis \
  --description "Analyze and visualize data" \
  --scripts \
  --references \
  --assets
```

## Skill Name Validation

Skill names must follow Agent Skills specification:
- 1-64 characters
- Lowercase letters, numbers, and hyphens only
- Must not start or end with hyphen
- Must not contain consecutive hyphens

## Generated Structure

```
skill-name/
├── SKILL.md          # Required - skill definition with YAML frontmatter
├── scripts/          # Optional - executable code
├── references/       # Optional - additional documentation
└── assets/           # Optional - static resources
```

## Next Steps

After generating a skill template:

1. Edit `SKILL.md` to customize your skill
2. Run `.cursor/commands` prompts to refine your skill with detailed questions
3. Add scripts, references, or assets as needed

## Development

```bash
# Build TypeScript
npm run build

# Watch mode
npm run dev
```

## License

MIT
