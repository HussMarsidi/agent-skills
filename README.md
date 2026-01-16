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
   mkdir test-cursor-skills
   cd test-cursor-skills
   ```

3. **Test the CLI commands:**
   ```bash
   # Test help
   node /path/to/agent-skills/bin/create-cursor-skill.js --help
   
   # Test init command
   node /path/to/agent-skills/bin/create-cursor-skill.js init
   
   # Test add-skills (interactive)
   node /path/to/agent-skills/bin/create-cursor-skill.js add-skills
   
   # Test add-skills with specific repo
   node /path/to/agent-skills/bin/create-cursor-skill.js add-skills --repo https://github.com/HussMarsidi/agent-skills.git
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
   cd ~/Desktop/Dev/test-cursor-skills
   create-cursor-skill --help
   create-cursor-skill init
   create-cursor-skill add-skills
   ```

4. **Uninstall when done testing:**
   ```bash
   pnpm uninstall -g @hussmarsidi/cursor
   ```

### Testing the `add-skills` Command Flow

When you run `add-skills`, the expected flow is:

1. **Repository prompt** (if `--repo` not provided):
   - Prompts for GitHub repository URL or local path
   - Defaults to `https://github.com/HussMarsidi/agent-skills.git`
   - Press Enter to use default

2. **Skill discovery**:
   - Clones the repository (or scans local path)
   - Scans `.cursor/skills/` directory
   - Extracts skill names and descriptions from `SKILL.md` frontmatter

3. **Interactive selection**:
   - Shows checkbox list of available skills
   - Each skill shows: `name - description`
   - Use arrow keys to navigate, space to select, Enter to submit

4. **Installation**:
   - Copies selected skills to your project's `.cursor/skills/` directory
   - Skips skills that already exist (with warning)
   - Shows success message with installed skill names

**Example output:**
```
✓ Successfully installed skills:
  • project-scaffolder
  • web-design-guidelines

Skills are available in: /path/to/project/.cursor/skills
```

## License

MIT
