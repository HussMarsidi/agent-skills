# Change: Add Skill Generator CLI

## Why
Users need a streamlined way to create Cursor skills that follow the Agent Skills specification. Manually creating skill directories, frontmatter, and structure is error-prone and time-consuming. A CLI tool will ensure compliance with the spec and provide a consistent starting point for skill development.

## What Changes
- Add a Node.js CLI tool (`create-skill` or `skill-gen`) that generates skill templates
- CLI validates skill names according to Agent Skills spec (lowercase, hyphens, 64 char limit)
- Generates proper directory structure with `SKILL.md` and optional directories
- Creates compliant YAML frontmatter with required fields
- Provides guidance for next steps (suggesting `.cursor/commands` prompts)
- Uses battle-tested tools: Commander.js, Zod, chalk, ora, fs-extra

## Impact
- Affected specs: New capability `skill-generator`
- Affected code: New CLI package with TypeScript implementation
- New dependencies: commander, zod, chalk, ora, fs-extra, @types/node
