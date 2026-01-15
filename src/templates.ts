/**
 * Generates the SKILL.md template content with YAML frontmatter
 */
export function generateSkillTemplate(skillName: string, description: string = ''): string {
  const frontmatter = `---
name: ${skillName}
description: ${description || '[Describe what this skill does and when to use it]'}
---`;

  const body = `# ${skillName}

## Overview
[Provide a brief overview of what this skill does]

## When to Use
[Describe when agents should activate this skill]

## Instructions

### Step 1: [First step]
[Detailed instructions for the first step]

### Step 2: [Second step]
[Detailed instructions for the second step]

## Examples

### Example 1: [Scenario name]
**Input**: [Example input]
**Output**: [Example output]

## Edge Cases
[Document common edge cases and how to handle them]

## Notes
[Additional notes or considerations]
`;

  return `${frontmatter}\n\n${body}`;
}
