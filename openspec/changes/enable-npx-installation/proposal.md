# Change: Enable npx Installation

## Why
Currently, users must clone the repository and build the CLI locally to use `create-cursor-skill`. Making the CLI installable via `npx` will dramatically improve accessibility and user experience, allowing anyone to run the tool with a single command without any setup or installation steps.

## What Changes
- Configure `package.json` for npm publishing (files, repository, keywords, etc.)
- Ensure binary entry point is properly configured for npx execution
- Add `.npmignore` or configure `files` field to include only necessary files
- Update build process to ensure dist/ is ready for publishing
- Add publishing documentation and versioning strategy
- Update README with npx installation instructions

## Impact
- Affected specs: New capability `npm-distribution`
- Affected code: `package.json`, `.npmignore` (if needed), `README.md`
- User experience: Users can now run `npx @huss/cursor <skill-name>` without local installation
