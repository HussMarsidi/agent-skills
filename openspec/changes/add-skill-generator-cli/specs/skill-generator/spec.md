## ADDED Requirements

### Requirement: Skill Name Validation
The CLI SHALL validate skill names according to Agent Skills specification rules.

#### Scenario: Valid skill name
- **WHEN** user provides a valid skill name (lowercase, hyphens, 1-64 chars, no leading/trailing hyphens, no consecutive hyphens)
- **THEN** validation passes and generation proceeds

#### Scenario: Invalid skill name - uppercase
- **WHEN** user provides skill name with uppercase letters
- **THEN** CLI displays error message and exits with non-zero code

#### Scenario: Invalid skill name - starts with hyphen
- **WHEN** user provides skill name starting with hyphen
- **THEN** CLI displays error message explaining the constraint

#### Scenario: Invalid skill name - exceeds 64 characters
- **WHEN** user provides skill name longer than 64 characters
- **THEN** CLI displays error message with character limit

### Requirement: Directory Structure Generation
The CLI SHALL create the proper directory structure for a skill following Agent Skills specification.

#### Scenario: Basic skill generation
- **WHEN** user runs CLI with valid skill name
- **THEN** CLI creates `skill-name/` directory in current working directory with `SKILL.md` file

#### Scenario: Optional directories creation
- **WHEN** user runs CLI with flags for optional directories (e.g., `--scripts`, `--references`, `--assets`)
- **THEN** CLI creates the corresponding directories (`scripts/`, `references/`, `assets/`) within the skill directory

### Requirement: SKILL.md Template Generation
The CLI SHALL generate a SKILL.md file with compliant YAML frontmatter and placeholder content.

#### Scenario: Frontmatter generation
- **WHEN** CLI generates SKILL.md
- **THEN** file contains YAML frontmatter with required fields (`name`, `description`) and the name field matches the skill name provided

#### Scenario: Placeholder content
- **WHEN** CLI generates SKILL.md
- **THEN** file contains placeholder Markdown body with recommended sections (instructions, examples, edge cases)

### Requirement: User Guidance
The CLI SHALL provide clear guidance on next steps after successful generation.

#### Scenario: Success message
- **WHEN** skill generation completes successfully
- **THEN** CLI displays success message with skill location and suggests running `.cursor/commands` prompts for customization

### Requirement: Error Handling
The CLI SHALL handle errors gracefully and provide helpful error messages.

#### Scenario: Directory already exists
- **WHEN** user attempts to generate skill with name matching existing directory
- **THEN** CLI displays error message and exits without overwriting

#### Scenario: File system errors
- **WHEN** CLI encounters file system errors (permissions, disk full, etc.)
- **THEN** CLI displays descriptive error message and exits with non-zero code
