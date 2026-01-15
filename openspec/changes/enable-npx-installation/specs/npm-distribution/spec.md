## ADDED Requirements

### Requirement: npm Package Configuration
The package SHALL be configured for npm publishing with proper metadata and file inclusion.

#### Scenario: Package files configuration
- **WHEN** package is published to npm
- **THEN** only necessary files are included (dist/, bin/, README.md, package.json) and source files are excluded

#### Scenario: Repository metadata
- **WHEN** package is published
- **THEN** package.json contains repository field pointing to GitHub repository

### Requirement: npx Execution
The CLI SHALL be executable via npx without requiring local installation.

#### Scenario: npx execution
- **WHEN** user runs `npx @huss/cursor <skill-name>`
- **THEN** CLI executes successfully and generates skill template

#### Scenario: Binary entry point
- **WHEN** package is installed via npx
- **THEN** binary at `bin/create-cursor-skill.js` is executable and correctly imports compiled code from dist/

### Requirement: Build Process for Publishing
The build process SHALL ensure compiled output is ready before publishing.

#### Scenario: Pre-publish build
- **WHEN** `npm publish` is executed
- **THEN** `prepublishOnly` script runs TypeScript compilation to generate dist/ directory

#### Scenario: Compiled output validation
- **WHEN** package is built for publishing
- **THEN** dist/ directory contains all compiled JavaScript files and type definitions

### Requirement: Documentation for npx Usage
Documentation SHALL include clear instructions for using the CLI via npx.

#### Scenario: README installation section
- **WHEN** user reads README.md
- **THEN** installation section shows npx command as primary installation method

#### Scenario: Usage examples
- **WHEN** user reads README.md
- **THEN** usage examples demonstrate npx command format
