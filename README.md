# Agent Skills CLI

A CLI tool to generate and manage Agent Skills templates that comply with the [Agent Skills specification](https://agentskills.io). Supports multiple AI coding agents including Cursor, OpenCode, Claude Code, Codex, and more.

## Installation

### Using npx (Recommended)

No installation required! Run directly with npx:

```bash
npx @hussmarsidi/agent-skills <skill-name>
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
npx @hussmarsidi/agent-skills init

# Create a new skill template
npx @hussmarsidi/agent-skills create <skill-name>

# With description
npx @hussmarsidi/agent-skills create my-skill --description "A skill that does X"

# With optional directories
npx @hussmarsidi/agent-skills create my-skill --scripts --references --assets

# Install skills from local collection (interactive)
npx @hussmarsidi/agent-skills add-skills

# Install specific skills
npx @hussmarsidi/agent-skills add-skills --skill project-scaffolder --agent cursor

# List available skills
npx @hussmarsidi/agent-skills add-skills --list

# Show help
npx @hussmarsidi/agent-skills --help
```

### Local Development

```bash
# Initialize workspace (first time setup)
node bin/create-agent-skills.js init

# Create a new skill template
node bin/create-agent-skills.js create <skill-name>

# With description
node bin/create-agent-skills.js create my-skill --description "A skill that does X"

# With optional directories
node bin/create-agent-skills.js create my-skill --scripts --references --assets

# Install skills from local collection (interactive)
node bin/create-agent-skills.js add-skills

# Install specific skills
node bin/create-agent-skills.js add-skills --skill project-scaffolder --agent cursor

# List available skills
node bin/create-agent-skills.js add-skills --list

# Show help
node bin/create-agent-skills.js --help
```

## Recommended Skills

This repository includes a curated collection of agent skills that I use personally. Here are some recommended skills you can install:

### 🏗️ project-scaffolder
**Generate production-ready monorepo structures**

A comprehensive skill for scaffolding React + Hono monorepos with feature-first architecture, platform layers, and shared packages. Perfect for:
- Setting up new projects with best practices
- Refactoring existing codebases into structured architectures
- Enforcing strict guardrails and patterns

**Install:**
```bash
npx @hussmarsidi/agent-skills add-skills --skill project-scaffolder
```

### 📝 skill-names
**Guide for describing and refining skills**

Helps you think through and document skills before generating them. Use this to:
- Clarify skill requirements and use cases
- Refine your thoughts before implementation
- Ensure comprehensive skill documentation

**Install:**
```bash
npx @hussmarsidi/agent-skills add-skills --skill skill-names
```

### Browse All Skills

To see all available skills in this collection:

```bash
npx @hussmarsidi/agent-skills add-skills --list
```

This will show all skills with their descriptions, allowing you to select which ones to install.

## Examples

```bash
# First time setup - initialize workspace
npx @hussmarsidi/agent-skills init

# Create a basic skill (will be created in skills/ collection)
npx @hussmarsidi/agent-skills create pdf-processing

# Create a skill with all optional directories
npx @hussmarsidi/agent-skills create data-analysis \
  --description "Analyze and visualize data" \
  --scripts \
  --references \
  --assets

# Install skills from local collection (interactive selection)
npx @hussmarsidi/agent-skills add-skills

# Install specific skill to specific agent
npx @hussmarsidi/agent-skills add-skills --skill project-scaffolder --agent cursor

# Install to multiple agents
npx @hussmarsidi/agent-skills add-skills --skill project-scaffolder --agent cursor --agent codex

# Install globally (available across all projects)
npx @hussmarsidi/agent-skills add-skills --skill project-scaffolder --global
```

## Skill Name Validation

Skill names must follow Agent Skills specification:
- 1-64 characters
- Lowercase letters, numbers, and hyphens only
- Must not start or end with hyphen
- Must not contain consecutive hyphens

## Generated Structure

Skills are created in `skills/` (collection) or IDE-specific directories (project-level):

```
skills/                    # Your skill collection
└── skill-name/
    ├── SKILL.md          # Required - skill definition with YAML frontmatter
    ├── scripts/          # Optional - executable code
    ├── references/       # Optional - additional documentation
    └── assets/           # Optional - static resources

.cursor/skills/           # Project-level skills (Cursor)
.codex/skills/            # Project-level skills (Codex)
.claude/skills/           # Project-level skills (Claude Code)
# ... and more
```

The `init` command creates:
- `skills/` - Directory for your skill collection
- IDE-specific directories (`.cursor/skills/`, `.codex/skills/`, etc.) based on your selection
- IDE-specific commands directories (`.cursor/commands/`, etc.) with `refine-skill.md` template

## Installing Skills

The `add-skills` command allows you to install skills from your local collection or remote repositories:

```bash
# Interactive mode - uses local skills/ directory by default
npx @hussmarsidi/agent-skills add-skills

# List available skills without installing
npx @hussmarsidi/agent-skills add-skills --list

# Install specific skills
npx @hussmarsidi/agent-skills add-skills --skill project-scaffolder --skill skill-names

# Install to specific agents
npx @hussmarsidi/agent-skills add-skills --skill project-scaffolder --agent cursor --agent codex

# Install globally (available across all projects)
npx @hussmarsidi/agent-skills add-skills --skill project-scaffolder --global

# Install from remote repository
npx @hussmarsidi/agent-skills add-skills https://github.com/user/repo.git
```

**How it works:**
1. Scans `skills/` directory (or specified repository) for available skills
2. Shows an interactive list of skills with snippets/descriptions
3. Lets you select which skills to install
4. Detects installed agents or lets you choose
5. Copies selected skills to the appropriate agent directories
6. Removes `snippet` field from installed SKILL.md files (snippet is only for display)

**Note:** Skills are copied, not linked, so you can customize them after installation.

## Supported Agents

This tool supports the following AI coding agents:

- **Cursor** - `.cursor/skills/`
- **OpenCode** - `.opencode/skill/`
- **Claude Code** - `.claude/skills/`
- **Codex** - `.codex/skills/`
- **Amp** - `.agents/skills/`
- **Kilo Code** - `.kilocode/skills/`
- **Roo Code** - `.roo/skills/`
- **Goose** - `.goose/skills/`
- **Antigravity** - `.agent/skills/`

## Next Steps

After generating a skill template:

1. **Refine your skill interactively**: Run the `/refine-skill` command in your IDE to get help filling in all placeholders with concrete examples and detailed instructions. This command will ask you specific questions one at a time until all ambiguities are resolved.

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
pnpm run build

# Watch mode
pnpm run dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui
```

## Publishing

### Version Bumping

Bump version without publishing:

```bash
# Bump major version (1.0.0 -> 2.0.0)
pnpm run version:major

# Bump minor version (1.0.0 -> 1.1.0)
pnpm run version:minor

# Bump patch version (1.0.0 -> 1.0.1)
pnpm run version:patch
```

### Publishing to npm

The publish scripts handle the complete workflow: version bump, tests, build, and publish.

**Before publishing, make sure you're logged in:**
```bash
npm login
```

**Then publish with automatic version bump:**

```bash
# Publish with major version bump
pnpm run publish:major

# Publish with minor version bump
pnpm run publish:minor

# Publish with patch version bump (recommended for bug fixes)
pnpm run publish:patch
```

**What the publish workflow does:**
1. ✅ Checks npm authentication
2. ✅ Warns about uncommitted git changes
3. ✅ Runs all tests
4. ✅ Builds the project
5. ✅ Publishes to npm

**Note:** The `prepublishOnly` hook automatically runs tests and builds before publishing, providing an extra safety check.

## Manual Testing

Before publishing, you can test the CLI locally to simulate how end users will experience it:

### Option 1: Direct Node Execution (Recommended for Testing)

1. **Build the project:**
   ```bash
   pnpm run build
   ```

2. **Create a test directory** (outside the project):
   ```bash
   cd ~/Desktop/Dev
   mkdir test-agent-skills
   cd test-agent-skills
   ```

3. **Test the CLI commands:**
   ```bash
   # Test help
   node ~/Desktop/Dev/agent-skills/bin/create-agent-skills.js --help
   
   # Test init command (selects IDEs interactively)
   node ~/Desktop/Dev/agent-skills/bin/create-agent-skills.js init
   
   # Test add-skills (uses local skills/ directory by default)
   node ~/Desktop/Dev/agent-skills/bin/create-agent-skills.js add-skills
   
   # Test listing skills
   node ~/Desktop/Dev/agent-skills/bin/create-agent-skills.js add-skills --list
   
   # Test installing specific skill
   node ~/Desktop/Dev/agent-skills/bin/create-agent-skills.js add-skills --skill project-scaffolder --agent cursor
   ```

### Option 2: Global Installation (Simulates Published Package)

1. **Build the project:**
   ```bash
   pnpm run build
   ```

2. **Install globally from local directory:**
   ```bash
   pnpm install -g .
   ```

3. **Test from any directory:**
   ```bash
   cd ~/Desktop/Dev/test-agent-skills
   create-agent-skills --help
   create-agent-skills init
   create-agent-skills add-skills
   ```

4. **Uninstall when done testing:**
   ```bash
   pnpm uninstall -g @hussmarsidi/agent-skills
   ```

### Testing the `add-skills` Command Flow

When you run `add-skills`, the expected flow is:

1. **Source detection**:
   - Defaults to local `skills/` directory
   - Can specify remote repository URL or local path
   - Scans for skills in common locations

2. **Skill discovery**:
   - Finds all skills with valid `SKILL.md` files
   - Extracts skill names, descriptions, and snippets from frontmatter
   - Uses `snippet` for display (if available), falls back to `description`

3. **Interactive selection**:
   - Shows multiselect list of available skills
   - Each skill shows: `name` with `snippet` as hint
   - Use arrow keys to navigate, space to select, Enter to submit

4. **Agent selection**:
   - Auto-detects installed agents
   - Prompts to select agents if multiple detected
   - Can specify agents with `--agent` flag

5. **Installation scope**:
   - Prompts for Project vs Global installation
   - Project: Installs in current directory (committed with project)
   - Global: Installs in home directory (available across all projects)

6. **Installation**:
   - Copies selected skills to appropriate agent directories
   - Removes `snippet` field from installed SKILL.md files
   - Shows installation summary with paths
   - Confirms before proceeding (unless `--yes` flag)

**Example output:**
```
✓ Successfully installed 1 skill
  ✓ project-scaffolder → Cursor
    /path/to/project/.cursor/skills/project-scaffolder
```

## License

MIT
