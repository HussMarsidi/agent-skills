# Cursor Skill Generator CLI

A CLI tool to generate Cursor skill templates that comply with the [Agent Skills specification](https://agentskills.io).

## Installation

### Using npx (Recommended)

No installation required! Run directly with npx:

```bash
npx create-cursor-skill <skill-name>
```

### Local Development

For development or local installation:

```bash
pnpm install
pnpm run build
```

## Usage

### Using npx

```bash
# Initialize workspace (first time setup)
npx create-cursor-skill init

# Basic usage - creates skill in .cursor/skills/ if init was run
npx create-cursor-skill <skill-name>

# With description
npx create-cursor-skill my-skill --description "A skill that does X"

# With optional directories
npx create-cursor-skill my-skill --scripts --references --assets

# Show help
npx create-cursor-skill --help
```

### Local Development

```bash
# Initialize workspace (first time setup)
node bin/create-cursor-skill.js init

# Basic usage - creates skill in .cursor/skills/ if init was run
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
# First time setup - initialize workspace
npx create-cursor-skill init

# Create a basic skill (will be created in .cursor/skills/)
npx create-cursor-skill pdf-processing

# Create a skill with all optional directories
npx create-cursor-skill data-analysis \
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

Skills are created in `.cursor/skills/` (project-level) or current directory if `.cursor/skills/` doesn't exist:

```
.cursor/
└── skills/
    └── skill-name/
        ├── SKILL.md          # Required - skill definition with YAML frontmatter
        ├── scripts/          # Optional - executable code
        ├── references/       # Optional - additional documentation
        └── assets/           # Optional - static resources
```

The `init` command creates:
- `.cursor/skills/` - Directory for project-level skills (automatically discovered by Cursor)
- `.cursor/commands/` - Directory for Cursor commands

## Next Steps

After generating a skill template:

1. **Refine your skill interactively**: Run the `/refine-skill` command in Cursor to get help filling in all placeholders with concrete examples and detailed instructions. This command will ask you specific questions one at a time until all ambiguities are resolved.

2. **Manual editing**: Alternatively, edit `SKILL.md` directly to customize your skill

3. **Add resources**: Add scripts, references, or assets as needed

The generated template follows [Agent Skills best practices](https://agentskills.io), including:
- Clear "When to use this skill" section with concrete scenarios
- Step-by-step instructions with examples
- Complete examples with inputs and outputs
- Edge cases and error handling documentation

## Development

```bash
# Build TypeScript
npm run build

# Watch mode
npm run dev
```

## License

MIT
