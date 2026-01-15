## 1. Project Setup
- [ ] 1.1 Initialize Node.js project with package.json
- [ ] 1.2 Set up TypeScript configuration (tsconfig.json)
- [ ] 1.3 Install dependencies: commander, zod, chalk, ora, fs-extra, @types/node
- [ ] 1.4 Set up build scripts and entry point

## 2. Core CLI Implementation
- [ ] 2.1 Create CLI entry point with Commander.js setup
- [ ] 2.2 Implement skill name validation using Zod (lowercase, hyphens, 64 chars, etc.)
- [ ] 2.3 Create template generator for SKILL.md with frontmatter
- [ ] 2.4 Implement directory structure creation (skill-name/, optional scripts/, references/, assets/)
- [ ] 2.5 Add colored output using chalk for success/error messages
- [ ] 2.6 Add loading spinners using ora during file operations

## 3. Template Generation
- [ ] 3.1 Create SKILL.md template with YAML frontmatter placeholders
- [ ] 3.2 Generate proper frontmatter structure (name, description, optional fields)
- [ ] 3.3 Create placeholder Markdown body content
- [ ] 3.4 Handle optional directory creation (scripts/, references/, assets/)

## 4. User Experience
- [ ] 4.1 Add helpful success message after generation
- [ ] 4.2 Provide guidance on next steps (suggesting .cursor/commands prompts)
- [ ] 4.3 Add error handling for invalid inputs and file system errors
- [ ] 4.4 Add --help documentation

## 5. Validation & Testing
- [ ] 5.1 Test skill name validation (valid and invalid cases)
- [ ] 5.2 Test directory generation in current directory
- [ ] 5.3 Test template file creation and content
- [ ] 5.4 Verify generated skills comply with Agent Skills spec format
