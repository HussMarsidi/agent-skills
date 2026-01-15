## Context
This CLI tool generates Cursor skills following the Agent Skills specification. The tool must be reliable, user-friendly, and ensure spec compliance.

## Goals / Non-Goals
- **Goals**: 
  - Generate compliant skill templates quickly
  - Validate inputs according to Agent Skills spec
  - Provide clear guidance for next steps
  - Use battle-tested, maintainable tools
- **Non-Goals**:
  - Interactive prompts (handled by separate .cursor/commands)
  - Skill installation or publishing
  - Skill validation beyond format compliance

## Decisions

### Decision: Use Commander.js for CLI framework
- **Rationale**: Most popular Node.js CLI framework (8M+ weekly downloads), battle-tested, excellent documentation
- **Alternatives considered**: 
  - yargs: Also popular but Commander.js has simpler API
  - oclif: Too heavyweight for this use case

### Decision: Use Zod for validation
- **Rationale**: Type-safe schema validation, excellent TypeScript support, widely adopted
- **Alternatives considered**:
  - joi: More verbose, less TypeScript-friendly
  - yup: Less maintained than Zod

### Decision: Generate templates in current directory
- **Rationale**: Simple, predictable behavior; users can specify path via argument if needed
- **Alternatives considered**:
  - Default to $CODEX_HOME/skills: Requires environment variable, less flexible
  - Interactive path selection: Adds complexity, against non-goals

### Decision: Static template generation (no interactive prompts in CLI)
- **Rationale**: Separates concerns - CLI generates structure, .cursor/commands handle customization
- **Alternatives considered**:
  - Built-in prompts: Would duplicate functionality of .cursor/commands

## Risks / Trade-offs
- **Risk**: Generated templates may need updates if spec changes
  - **Mitigation**: Keep template simple, document spec version
- **Risk**: Users might not follow suggested .cursor/commands workflow
  - **Mitigation**: Clear messaging and documentation

## Migration Plan
N/A - New feature, no migration needed

## Open Questions
- Should CLI support generating skills from a template file?
- Should CLI validate existing skills (future enhancement)?
