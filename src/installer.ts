import { checkbox } from "@inquirer/prompts";
import chalk from "chalk";
import { execSync } from "child_process";
import fs from "fs-extra";
import ora from "ora";
import path from "path";
import * as formatter from "./formatter.js";

export interface SkillSource {
  name: string;
  description?: string;
  snippet?: string; // Shorter version for display in checkbox list
  source: string; // GitHub repo URL or local path
  type: "github" | "local";
}

export interface InstallResult {
  success: boolean;
  installedSkills: string[];
  installedPaths?: Array<{ skill: string; agent: string; path: string }>;
  error?: string;
}

/**
 * Fetches available skills from a GitHub repository or local path
 */
async function fetchSkillsFromRepo(repoUrl: string): Promise<SkillSource[]> {
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

      // Local path - no action needed
    } else {
      // Create a temporary directory for cloning
      tempDir = path.join(process.cwd(), ".cursor", ".temp-skills-repo");

      // Clean up temp directory if it exists
      if (await fs.pathExists(tempDir)) {
        await fs.remove(tempDir);
      }

      // Clone the repository
      const spinner = ora("Cloning repository...").start();
      execSync(`git clone --depth 1 ${repoUrl} "${tempDir}"`, {
        stdio: "pipe",
        cwd: process.cwd(),
      });
      spinner.stop();
      formatter.repositoryStatus("Repository cloned");

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
            // Read SKILL.md to get description and snippet
            const skillContent = await fs.readFile(skillMdPath, "utf-8");
            const frontmatterMatch = skillContent.match(
              /^---\s*\n([\s\S]*?)\n---/
            );
            let description = "";
            let snippet = "";

            if (frontmatterMatch) {
              const frontmatter = frontmatterMatch[1];
              // Parse description
              const descMatch = frontmatter.match(/^description:\s*(.+)$/m);
              if (descMatch) {
                description = descMatch[1].trim();
              }
              // Parse snippet (preferred for display)
              const snippetMatch = frontmatter.match(/^snippet:\s*(.+)$/m);
              if (snippetMatch) {
                snippet = snippetMatch[1].trim();
              }
            }

            skills.push({
              name: entry.name,
              description: description || `Skill: ${entry.name}`,
              snippet: snippet && snippet.length > 0 ? snippet : undefined,
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

    formatter.skillCount(skills.length);
    return skills;
  } catch (error) {
    formatter.indent(
      chalk.red(
        `Failed to fetch skills: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      ),
      1
    );
    throw error;
  }
}

/**
 * Installs selected skills to .cursor/skills/
 */
async function installSkills(
  selectedSkills: SkillSource[],
  repoUrl: string,
  agentName: string = "Cursor"
): Promise<InstallResult> {
  const installedSkills: string[] = [];
  const installedPaths: Array<{ skill: string; agent: string; path: string }> =
    [];
  const skippedSkills: string[] = [];
  const failedSkills: string[] = [];
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
        execSync(`git clone --depth 1 ${repoUrl} "${tempDir}"`, {
          stdio: "pipe",
          cwd: cwd,
        });
      }

      sourceSkillsDir = path.join(tempDir, ".cursor", "skills");
    }

    for (const skill of selectedSkills) {
      const sourceSkillPath = path.join(sourceSkillsDir, skill.name);
      const targetSkillPath = path.join(targetSkillsDir, skill.name);

      // Check if skill already exists
      if (await fs.pathExists(targetSkillPath)) {
        formatter.indent(
          chalk.yellow(`${skill.name} already exists - skipping installation`),
          1
        );
        skippedSkills.push(skill.name);
        continue;
      }

      // Check if source exists
      if (!(await fs.pathExists(sourceSkillPath))) {
        formatter.indent(
          chalk.red(`Skill ${skill.name} not found in repository`),
          1
        );
        failedSkills.push(skill.name);
        continue;
      }

      const installSpinner = ora(`Installing ${skill.name}...`).start();

      try {
        // Copy the entire skill directory
        await fs.copy(sourceSkillPath, targetSkillPath);
        installedSkills.push(skill.name);
        installedPaths.push({
          skill: skill.name,
          agent: agentName,
          path: targetSkillPath,
        });
        installSpinner.succeed(`Installed ${skill.name}`);
      } catch (error) {
        installSpinner.fail(`Failed to install ${skill.name}`);
        failedSkills.push(skill.name);
        formatter.indent(
          chalk.red(
            `Error: ${error instanceof Error ? error.message : "Unknown error"}`
          ),
          1
        );
      }
    }

    // Clean up temp directory if it was created
    if (tempDir && (await fs.pathExists(tempDir))) {
      await fs.remove(tempDir);
    }

    // Return success if there were no actual failures (only skips are okay)
    return {
      success: failedSkills.length === 0,
      installedSkills,
      installedPaths,
      error:
        failedSkills.length > 0
          ? `Failed to install: ${failedSkills.join(", ")}`
          : undefined,
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
    // Use provided repo URL or default to our skills repository
    const sourceRepo: string =
      repoUrl || "https://github.com/HussMarsidi/agent-skills.git";

    // Display command header
    formatter.commandHeader("add-skill");
    formatter.emptyLine();

    // Display source information
    formatter.source(sourceRepo);

    // Fetch available skills
    const availableSkills = await fetchSkillsFromRepo(sourceRepo);

    if (availableSkills.length === 0) {
      formatter.indent(chalk.yellow("No skills found in the repository."), 1);
      formatter.commandFooter();
      return {
        success: false,
        installedSkills: [],
        error: "No skills found",
      };
    }

    // Let user select skills
    const selectedSkillNames = await checkbox({
      message: "Select skills to install",
      choices: availableSkills.map((skill) => {
        // Use snippet if available, otherwise use full description
        // Display in parentheses on the same line to show full text without truncation
        let displayText = "";
        if (skill.snippet) {
          displayText = ` (${skill.snippet})`;
        } else if (skill.description) {
          displayText = ` (${skill.description})`;
        }
        return {
          name: `${skill.name}${displayText}`,
          value: skill.name,
        };
      }),
      pageSize: 10,
      loop: true,
    });

    if (selectedSkillNames.length === 0) {
      formatter.indent(chalk.yellow("No skills selected."), 1);
      formatter.commandFooter();
      return {
        success: false,
        installedSkills: [],
        error: "No skills selected",
      };
    }

    // Display selected skills
    formatter.selectedSkills(selectedSkillNames);

    // Filter selected skills
    const selectedSkills = availableSkills.filter((skill) =>
      selectedSkillNames.includes(skill.name)
    );

    // For now, we only support Cursor agent
    // This can be extended later to support multiple agents
    const agentName = "Cursor";
    formatter.agentDetection(1);
    formatter.selectedAgent(agentName);
    formatter.installationScope("Project");

    // Display installation summary before proceeding
    formatter.installationSummary(
      selectedSkills.map((skill) => ({
        name: skill.name,
        agent: agentName,
        path: path.join(process.cwd(), ".cursor", "skills", skill.name),
      }))
    );

    // Proceed with installation (for now, auto-proceed)
    formatter.proceedPrompt("Yes");

    // Install selected skills
    const result = await installSkills(selectedSkills, sourceRepo, agentName);

    // Display completion message
    if (
      result.success &&
      result.installedPaths &&
      result.installedPaths.length > 0
    ) {
      formatter.installationCompleteMessage();
      formatter.emptyLine();
      formatter.installationSuccess(result.installedPaths);
    }

    formatter.emptyLine();
    formatter.commandFooter();

    return result;
  } catch (error) {
    formatter.commandFooter();
    return {
      success: false,
      installedSkills: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
