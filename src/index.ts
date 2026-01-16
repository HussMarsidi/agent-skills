#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import fs from "fs-extra";
import ora from "ora";
import path from "path";
import { generateSkill, GenerationOptions } from "./generator.js";
import { addSkills } from "./installer.js";
import { validateSkillName } from "./validate.js";

const program = new Command();

/**
 * Initialize workspace for first-time users
 * Creates necessary directories and configuration files
 */
async function initWorkspace(): Promise<{ success: boolean; error?: string }> {
  try {
    const cwd = process.cwd();

    // Create .cursor/skills directory for project-level skills
    const cursorSkillsDir = path.join(cwd, ".cursor", "skills");
    await fs.ensureDir(cursorSkillsDir);

    // Create .cursor/commands directory for Cursor commands
    const cursorCommandsDir = path.join(cwd, ".cursor", "commands");
    await fs.ensureDir(cursorCommandsDir);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

program
  .name("create-cursor-skill")
  .description(
    "Generate a Cursor skill template following Agent Skills specification"
  )
  .version("0.1.0");

program
  .command("init")
  .description("Initialize workspace for first-time users")
  .action(async () => {
    const spinner = ora("Initializing workspace...").start();

    try {
      const result = await initWorkspace();

      if (!result.success) {
        spinner.fail("Failed to initialize workspace");
        console.error(chalk.red("Error:"), result.error);
        process.exit(1);
      }

      spinner.succeed("Workspace initialized successfully!");

      console.log(
        "\n" + chalk.green("✓"),
        chalk.bold("Workspace setup complete!")
      );
      console.log("\n" + chalk.cyan("Created directories:"));
      console.log("  • .cursor/skills/   - Directory for project-level skills");
      console.log("  • .cursor/commands/ - Directory for Cursor commands");
      console.log("\n" + chalk.cyan("Next steps:"));
      console.log("  1. Create your first skill:");
      console.log("     " + chalk.dim("create-cursor-skill <skill-name>"));
      console.log(
        "  2. Skills will be created in .cursor/skills/ automatically"
      );
      console.log(
        "\n" + chalk.dim("For more information, visit: https://agentskills.io")
      );
    } catch (error) {
      spinner.fail("Failed to initialize workspace");
      console.error(
        chalk.red("Error:"),
        error instanceof Error ? error.message : "Unknown error"
      );
      process.exit(1);
    }
  });

program
  .argument(
    "<skill-name>",
    "Name of the skill to create (lowercase, hyphens, 1-64 chars)"
  )
  .option("--description <description>", "Description of the skill")
  .option("--scripts", "Include scripts/ directory")
  .option("--references", "Include references/ directory")
  .option("--assets", "Include assets/ directory")
  .action(async (skillName: string, options) => {
    // Validate skill name
    const validation = validateSkillName(skillName);
    if (!validation.valid) {
      console.error(chalk.red("Error:"), validation.error);
      process.exit(1);
    }

    // Show loading spinner
    const spinner = ora("Generating skill template...").start();

    try {
      // Determine output directory - prefer .cursor/skills/ if it exists
      const cursorSkillsDir = path.join(process.cwd(), ".cursor", "skills");
      const outputDir = (await fs.pathExists(cursorSkillsDir))
        ? cursorSkillsDir
        : process.cwd();

      const generationOptions: GenerationOptions = {
        skillName,
        description: options.description,
        includeScripts: options.scripts,
        includeReferences: options.references,
        includeAssets: options.assets,
      };

      const result = await generateSkill(generationOptions, outputDir);

      if (!result.success) {
        spinner.fail("Failed to generate skill");
        console.error(chalk.red("Error:"), result.error);
        process.exit(1);
      }

      spinner.succeed("Skill template generated successfully!");

      // Success message with guidance
      console.log(
        "\n" + chalk.green("✓"),
        chalk.bold("Skill created at:"),
        result.skillPath
      );
      console.log("\n" + chalk.cyan("Next steps:"));
      console.log(
        "  1. Run `/refine-skill` command to interactively refine your skill with detailed questions"
      );
      console.log(
        "  2. Edit SKILL.md directly if you prefer manual customization"
      );
      console.log("  3. Add scripts, references, or assets as needed");
      console.log(
        "\n" + chalk.yellow("💡 Tip:"),
        "Use `/refine-skill` to get help filling in all the placeholders with concrete examples and detailed instructions."
      );
      console.log(
        "\n" + chalk.dim("For more information, visit: https://agentskills.io")
      );
    } catch (error) {
      spinner.fail("Failed to generate skill");
      console.error(
        chalk.red("Error:"),
        error instanceof Error ? error.message : "Unknown error"
      );
      process.exit(1);
    }
  });

program
  .command("add-skills")
  .description("Install skills from a GitHub repository")
  .option(
    "--repo <url>",
    "GitHub repository URL containing skills (default: https://github.com/HussMarsidi/agent-skills.git)"
  )
  .action(async (options) => {
    const spinner = ora("Setting up skill installation...").start();

    try {
      // Ensure .cursor/skills directory exists
      const cursorSkillsDir = path.join(process.cwd(), ".cursor", "skills");
      await fs.ensureDir(cursorSkillsDir);

      spinner.stop();

      const result = await addSkills(options.repo);

      if (!result.success) {
        console.error(
          chalk.red("Error:"),
          result.error || "Failed to install skills"
        );
        process.exit(1);
      }

      if (result.installedSkills.length > 0) {
        console.log(
          "\n" + chalk.green("✓"),
          chalk.bold("Successfully installed skills:")
        );
        result.installedSkills.forEach((skill) => {
          console.log(`  • ${skill}`);
        });
        console.log(
          "\n" + chalk.cyan("Skills are available in:"),
          cursorSkillsDir
        );
        console.log(
          "\n" +
            chalk.dim("For more information, visit: https://agentskills.io")
        );
      } else {
        console.log(chalk.yellow("No skills were installed."));
      }
    } catch (error) {
      spinner.fail("Failed to install skills");
      console.error(
        chalk.red("Error:"),
        error instanceof Error ? error.message : "Unknown error"
      );
      process.exit(1);
    }
  });

program.parse();
