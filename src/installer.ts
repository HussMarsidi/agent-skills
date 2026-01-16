import { checkbox, input } from "@inquirer/prompts";
import chalk from "chalk";
import { execSync } from "child_process";
import fs from "fs-extra";
import ora from "ora";
import path from "path";

export interface SkillSource {
  name: string;
  description?: string;
  source: string; // GitHub repo URL or local path
  type: "github" | "local";
}

export interface InstallResult {
  success: boolean;
  installedSkills: string[];
  error?: string;
}

/**
 * Default skill sources - can be extended
 */
const DEFAULT_SKILL_SOURCES: SkillSource[] = [
  {
    name: "project-scaffolder",
    description:
      "Generate a production-ready React + Hono monorepo with feature-first architecture",
    source: "https://github.com/HussMarsidi/agent-skills.git",
    type: "github",
  },
];

/**
 * Fetches available skills from a GitHub repository or local path
 */
async function fetchSkillsFromRepo(repoUrl: string): Promise<SkillSource[]> {
  const spinner = ora("Fetching available skills...").start();

  try {
    let skillsDir: string;
    let tempDir: string | null = null;

    // Check if it's a local path (starts with . or / or is a relative path)
    const isLocalPath =
      repoUrl.startsWith(".") ||
      repoUrl.startsWith("/") ||
      !repoUrl.includes("github.com") ||
      !repoUrl.includes("http");

    if (isLocalPath) {
      // Resolve local path relative to current working directory
      const resolvedPath = path.isAbsolute(repoUrl)
        ? repoUrl
        : path.resolve(process.cwd(), repoUrl);

      skillsDir = path.join(resolvedPath, ".cursor", "skills");

      // Check if path exists
      if (!(await fs.pathExists(resolvedPath))) {
        throw new Error(`Local path does not exist: ${resolvedPath}`);
      }

      spinner.text = "Scanning local directory...";
    } else {
      // Create a temporary directory for cloning
      tempDir = path.join(process.cwd(), ".cursor", ".temp-skills-repo");

      // Clean up temp directory if it exists
      if (await fs.pathExists(tempDir)) {
        await fs.remove(tempDir);
      }

      // Clone the repository
      spinner.text = "Cloning repository...";
      execSync(`git clone --depth 1 ${repoUrl} "${tempDir}"`, {
        stdio: "pipe",
        cwd: process.cwd(),
      });

      skillsDir = path.join(tempDir, ".cursor", "skills");
    }

    const skills: SkillSource[] = [];

    if (await fs.pathExists(skillsDir)) {
      const entries = await fs.readdir(skillsDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const skillPath = path.join(skillsDir, entry.name);
          const skillMdPath = path.join(skillPath, "SKILL.md");

          if (await fs.pathExists(skillMdPath)) {
            // Read SKILL.md to get description
            const skillContent = await fs.readFile(skillMdPath, "utf-8");
            const frontmatterMatch = skillContent.match(
              /^---\s*\n([\s\S]*?)\n---/
            );
            let description = "";

            if (frontmatterMatch) {
              const descMatch =
                frontmatterMatch[1].match(/description:\s*(.+)/);
              if (descMatch) {
                description = descMatch[1].trim();
              }
            }

            skills.push({
              name: entry.name,
              description: description || `Skill: ${entry.name}`,
              source: repoUrl,
              type: "github",
            });
          }
        }
      }
    }

    // Clean up temp directory if it was created
    if (tempDir && (await fs.pathExists(tempDir))) {
      await fs.remove(tempDir);
    }

    spinner.succeed(`Found ${skills.length} skill(s)`);
    return skills;
  } catch (error) {
    spinner.fail("Failed to fetch skills from repository");
    throw error;
  }
}

/**
 * Installs selected skills to .cursor/skills/
 */
async function installSkills(
  selectedSkills: SkillSource[],
  repoUrl: string
): Promise<InstallResult> {
  const installedSkills: string[] = [];
  const cwd = process.cwd();
  const targetSkillsDir = path.join(cwd, ".cursor", "skills");

  // Ensure .cursor/skills directory exists
  await fs.ensureDir(targetSkillsDir);

  // Check if it's a local path
  const isLocalPath =
    repoUrl.startsWith(".") ||
    repoUrl.startsWith("/") ||
    !repoUrl.includes("github.com") ||
    !repoUrl.includes("http");

  let sourceSkillsDir: string;
  let tempDir: string | null = null;

  try {
    if (isLocalPath) {
      // Resolve local path
      const resolvedPath = path.isAbsolute(repoUrl)
        ? repoUrl
        : path.resolve(cwd, repoUrl);

      sourceSkillsDir = path.join(resolvedPath, ".cursor", "skills");

      if (!(await fs.pathExists(sourceSkillsDir))) {
        throw new Error(`Skills directory not found: ${sourceSkillsDir}`);
      }
    } else {
      // Clone the repository
      tempDir = path.join(cwd, ".cursor", ".temp-skills-repo");

      if (!(await fs.pathExists(tempDir))) {
        const cloneSpinner = ora("Cloning repository...").start();
        execSync(`git clone --depth 1 ${repoUrl} "${tempDir}"`, {
          stdio: "pipe",
          cwd: cwd,
        });
        cloneSpinner.succeed("Repository cloned");
      }

      sourceSkillsDir = path.join(tempDir, ".cursor", "skills");
    }

    for (const skill of selectedSkills) {
      const sourceSkillPath = path.join(sourceSkillsDir, skill.name);
      const targetSkillPath = path.join(targetSkillsDir, skill.name);

      // Check if skill already exists
      if (await fs.pathExists(targetSkillPath)) {
        console.log(chalk.yellow(`⚠ Skipping ${skill.name} - already exists`));
        continue;
      }

      // Check if source exists
      if (!(await fs.pathExists(sourceSkillPath))) {
        console.log(chalk.red(`✗ Skill ${skill.name} not found in repository`));
        continue;
      }

      const installSpinner = ora(`Installing ${skill.name}...`).start();

      try {
        // Copy the entire skill directory
        await fs.copy(sourceSkillPath, targetSkillPath);
        installedSkills.push(skill.name);
        installSpinner.succeed(`Installed ${skill.name}`);
      } catch (error) {
        installSpinner.fail(`Failed to install ${skill.name}`);
        console.error(
          chalk.red(`Error installing ${skill.name}:`),
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }

    // Clean up temp directory if it was created
    if (tempDir && (await fs.pathExists(tempDir))) {
      await fs.remove(tempDir);
    }

    return {
      success: installedSkills.length > 0,
      installedSkills,
    };
  } catch (error) {
    // Clean up temp directory on error
    if (tempDir && (await fs.pathExists(tempDir))) {
      await fs.remove(tempDir).catch(() => {});
    }

    return {
      success: false,
      installedSkills,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Main function to add skills interactively
 */
export async function addSkills(repoUrl?: string): Promise<InstallResult> {
  try {
    // If no repo URL provided, ask for it or use default
    let sourceRepo: string = repoUrl || "";

    if (!sourceRepo) {
      sourceRepo = await input({
        message:
          "Enter GitHub repository URL or local path (or press Enter for default):",
        default: "https://github.com/HussMarsidi/agent-skills.git",
      });
    }

    // Fetch available skills
    const availableSkills = await fetchSkillsFromRepo(sourceRepo);

    if (availableSkills.length === 0) {
      console.log(chalk.yellow("No skills found in the repository."));
      return {
        success: false,
        installedSkills: [],
        error: "No skills found",
      };
    }

    // Let user select skills
    const selectedSkillNames = await checkbox({
      message: "Select skills to install:",
      choices: availableSkills.map((skill) => ({
        name: `${skill.name}${
          skill.description ? ` - ${skill.description}` : ""
        }`,
        value: skill.name,
      })),
      pageSize: 10,
      loop: true,
    });

    if (selectedSkillNames.length === 0) {
      console.log(chalk.yellow("No skills selected."));
      return {
        success: false,
        installedSkills: [],
        error: "No skills selected",
      };
    }

    // Filter selected skills
    const selectedSkills = availableSkills.filter((skill) =>
      selectedSkillNames.includes(skill.name)
    );

    // Install selected skills
    const result = await installSkills(selectedSkills, sourceRepo);

    return result;
  } catch (error) {
    return {
      success: false,
      installedSkills: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
