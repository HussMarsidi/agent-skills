#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import fs from "fs-extra";
import ora from "ora";
import path from "path";
import { generateSkill, GenerationOptions } from "./generator.js";
import { validateSkillName } from "./validate.js";

const program = new Command();

/**
 * Initialize workspace for first-time users
 * Creates necessary directories and configuration files
 */
async function initWorkspace(): Promise<{ success: boolean; error?: string }> {
  try {
    const cwd = process.cwd();

    // Create skills directory
    const skillsDir = path.join(cwd, "skills");
    await fs.ensureDir(skillsDir);

    // Create .cursor/commands directory for Cursor commands
    const cursorCommandsDir = path.join(cwd, ".cursor", "commands");
    await fs.ensureDir(cursorCommandsDir);

    // Create .gitignore entry for skills if .gitignore exists
    const gitignorePath = path.join(cwd, ".gitignore");
    if (await fs.pathExists(gitignorePath)) {
      const gitignoreContent = await fs.readFile(gitignorePath, "utf-8");
      if (!gitignoreContent.includes("skills/")) {
        await fs.appendFile(gitignorePath, "\n# Skills directory\nskills/\n");
      }
    }

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
      console.log("  • skills/          - Directory for your skills");
      console.log("  • .cursor/commands - Directory for Cursor commands");
      console.log("\n" + chalk.cyan("Next steps:"));
      console.log("  1. Create your first skill:");
      console.log("     " + chalk.dim("create-cursor-skill <skill-name>"));
      console.log("  2. Or create a skill in the skills directory:");
      console.log(
        "     " + chalk.dim("cd skills && create-cursor-skill <skill-name>")
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
      const generationOptions: GenerationOptions = {
        skillName,
        description: options.description,
        includeScripts: options.scripts,
        includeReferences: options.references,
        includeAssets: options.assets,
      };

      const result = await generateSkill(generationOptions);

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

program.parse();
