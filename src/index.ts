#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { validateSkillName } from './validate.js';
import { generateSkill, GenerationOptions } from './generator.js';

const program = new Command();

program
  .name('create-cursor-skill')
  .description('Generate a Cursor skill template following Agent Skills specification')
  .version('0.1.0')
  .argument('<skill-name>', 'Name of the skill to create (lowercase, hyphens, 1-64 chars)')
  .option('--description <description>', 'Description of the skill')
  .option('--scripts', 'Include scripts/ directory')
  .option('--references', 'Include references/ directory')
  .option('--assets', 'Include assets/ directory')
  .action(async (skillName: string, options) => {
    // Validate skill name
    const validation = validateSkillName(skillName);
    if (!validation.valid) {
      console.error(chalk.red('Error:'), validation.error);
      process.exit(1);
    }

    // Show loading spinner
    const spinner = ora('Generating skill template...').start();

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
        spinner.fail('Failed to generate skill');
        console.error(chalk.red('Error:'), result.error);
        process.exit(1);
      }

      spinner.succeed('Skill template generated successfully!');

      // Success message with guidance
      console.log('\n' + chalk.green('✓'), chalk.bold('Skill created at:'), result.skillPath);
      console.log('\n' + chalk.cyan('Next steps:'));
      console.log('  1. Edit SKILL.md to customize your skill');
      console.log('  2. Run .cursor/commands prompts to refine your skill with detailed questions');
      console.log('  3. Add scripts, references, or assets as needed');
      console.log('\n' + chalk.dim('For more information, visit: https://agentskills.io'));
    } catch (error) {
      spinner.fail('Failed to generate skill');
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });

program.parse();
