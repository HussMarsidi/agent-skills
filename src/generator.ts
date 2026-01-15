import fs from 'fs-extra';
import path from 'path';
import { generateSkillTemplate } from './templates.js';

export interface GenerationOptions {
  skillName: string;
  description?: string;
  includeScripts?: boolean;
  includeReferences?: boolean;
  includeAssets?: boolean;
}

export interface GenerationResult {
  success: boolean;
  skillPath?: string;
  error?: string;
}

/**
 * Generates a skill directory structure and files
 */
export async function generateSkill(
  options: GenerationOptions,
  outputDir: string = process.cwd()
): Promise<GenerationResult> {
  const { skillName, description, includeScripts, includeReferences, includeAssets } = options;
  const skillPath = path.join(outputDir, skillName);

  try {
    // Check if directory already exists
    if (await fs.pathExists(skillPath)) {
      return {
        success: false,
        error: `Directory "${skillName}" already exists. Please choose a different name or remove the existing directory.`,
      };
    }

    // Create skill directory
    await fs.ensureDir(skillPath);

    // Generate and write SKILL.md
    const skillContent = generateSkillTemplate(skillName, description);
    await fs.writeFile(path.join(skillPath, 'SKILL.md'), skillContent, 'utf-8');

    // Create optional directories
    if (includeScripts) {
      await fs.ensureDir(path.join(skillPath, 'scripts'));
    }

    if (includeReferences) {
      await fs.ensureDir(path.join(skillPath, 'references'));
    }

    if (includeAssets) {
      await fs.ensureDir(path.join(skillPath, 'assets'));
    }

    return {
      success: true,
      skillPath,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
