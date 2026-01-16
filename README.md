# Cursor Skill Generator CLI

A CLI tool to generate Cursor skill templates that comply with the [Agent Skills specification](https://agentskills.io).

## Installation

### Using npx (Recommended)

No installation required! Run directly with npx:

```bash
npx @hussmarsidi/cursor <skill-name>
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
npx @hussmarsidi/cursor init

# Basic usage - creates skill in .cursor/skills/ if init was run
npx @hussmarsidi/cursor <skill-name>

# With description
npx @hussmarsidi/cursor my-skill --description "A skill that does X"

# With optional directories
npx @hussmarsidi/cursor my-skill --scripts --references --assets

# Install skills from a repository (interactive)
npx @hussmarsidi/cursor add-skills

# Install skills from a specific repository
npx @hussmarsidi/cursor add-skills --repo https://github.com/user/repo.git

# Show help
npx @hussmarsidi/cursor --help
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

# Install skills from a repository (interactive)
node bin/create-cursor-skill.js add-skills

# Install skills from a specific repository
node bin/create-cursor-skill.js add-skills --repo https://github.com/user/repo.git

# Show help
node bin/create-cursor-skill.js --help
```

## Examples

```bash
# First time setup - initialize workspace
npx @hussmarsidi/cursor init

# Create a basic skill (will be created in .cursor/skills/)
npx @hussmarsidi/cursor pdf-processing

# Create a skill with all optional directories
npx @hussmarsidi/cursor data-analysis \
  --description "Analyze and visualize data" \
  --scripts \
  --references \
  --assets

# Install skills from a repository (interactive selection)
npx @hussmarsidi/cursor add-skills

# Install skills from a specific repository
npx @hussmarsidi/cursor add-skills --repo https://github.com/HussMarsidi/agent-skills.git
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

## Installing Skills from Repositories

The `add-skills` command allows you to browse and install skills from GitHub repositories:

```bash
# Interactive mode - prompts for repository URL and skill selection
npx @hussmarsidi/cursor add-skills

# Specify a repository directly
npx @hussmarsidi/cursor add-skills --repo https://github.com/user/repo.git
```

**How it works:**
1. Clones the specified repository (or uses default)
2. Scans `.cursor/skills/` directory for available skills
3. Shows an interactive list of skills with descriptions
4. Lets you select which skills to install
5. Copies selected skills to your project's `.cursor/skills/` directory

**Note:** Skills are copied, not linked, so you can customize them after installation.

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
