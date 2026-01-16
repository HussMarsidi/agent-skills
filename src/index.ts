#!/usr/bin/env node

import * as p from '@clack/prompts';
import chalk from 'chalk';
import { program } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import packageJson from '../package.json' with { type: 'json' };
import { agents, detectInstalledAgents } from './agents.js';
import { generateSkill, GenerationOptions } from './generator.js';
import { cleanupTempDir, cloneRepo, parseSource } from './git.js';
import { getInstallPath, installSkillForAgent, isSkillInstalled } from './installer.js';
import { discoverSkills, getSkillDisplayName } from './skills.js';
import type { AgentType, Skill } from './types.js';
import { validateSkillName } from './validate.js';

const version = packageJson.version;

interface Options {
  global?: boolean;
  agent?: string[];
  yes?: boolean;
  skill?: string[];
  list?: boolean;
  description?: string;
  scripts?: boolean;
  references?: boolean;
  assets?: boolean;
}

// Initialize workspace for first-time users
async function initWorkspace(selectedAgents: AgentType[]): Promise<{ success: boolean; error?: string }> {
  try {
    const cwd = process.cwd();

    // Create skills directory for collection
    const skillsDir = path.join(cwd, 'skills');
    await fs.ensureDir(skillsDir);

    // Create commands directory for each selected IDE
    // Template is in project root commands/ directory
    const commandTemplatePath = path.join(process.cwd(), 'commands', 'refine-skill.md');
    const templateExists = await fs.pathExists(commandTemplatePath);

    for (const agentType of selectedAgents) {
      const agent = agents[agentType];
      const commandsDir = path.join(cwd, agent.commandsDir);
      await fs.ensureDir(commandsDir);

      // Copy refine-skill.md template if it exists
      if (templateExists) {
        const targetCommandPath = path.join(commandsDir, 'refine-skill.md');
        // Only copy if it doesn't already exist
        if (!(await fs.pathExists(targetCommandPath))) {
          await fs.copy(commandTemplatePath, targetCommandPath);
        }
      }

      // Create skills directory for project-level skills
      const projectSkillsDir = path.join(cwd, agent.skillsDir);
      await fs.ensureDir(projectSkillsDir);
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

program
  .name('create-cursor-skill')
  .description('Generate a Cursor skill template following Agent Skills specification')
  .version(version);

program
  .command('init')
  .description('Initialize workspace for first-time users')
  .action(async () => {
    console.log();
    p.intro(chalk.bgCyan.black(' create-cursor-skill '));

    try {
      // Ask user to select which IDEs they want to set up
      const allAgentChoices = Object.entries(agents).map(([key, config]) => ({
        value: key as AgentType,
        label: config.displayName,
      }));

      const selected = await p.multiselect({
        message: 'Select IDEs to set up',
        options: allAgentChoices,
        required: true,
      });

      if (p.isCancel(selected)) {
        p.cancel('Initialization cancelled');
        p.outro();
        process.exit(0);
      }

      const selectedAgents = selected as AgentType[];

      const spinner = p.spinner();
      spinner.start('Initializing workspace...');

      const result = await initWorkspace(selectedAgents);

      if (!result.success) {
        spinner.stop(chalk.red('Failed to initialize workspace'));
        p.log.error(result.error || 'Unknown error');
        p.outro(chalk.red('Initialization failed'));
        process.exit(1);
      }

      spinner.stop('Workspace initialized');

      console.log();
      p.log.step(chalk.bold('Workspace setup complete'));
      p.log.message(`  ${chalk.cyan('skills/')}            - Directory for your skill collection`);
      
      if (selectedAgents.length > 0) {
        p.log.message(`  Set up ${selectedAgents.length} IDE${selectedAgents.length > 1 ? 's' : ''}:`);
        for (const agentType of selectedAgents) {
          const agent = agents[agentType];
          p.log.message(`    ${chalk.cyan(agent.displayName)}:`);
          p.log.message(`      ${chalk.dim(agent.skillsDir)} - Project-level skills`);
          p.log.message(`      ${chalk.dim(agent.commandsDir)} - Commands (refine-skill.md created)`);
        }
      }
      
      console.log();
      p.log.step(chalk.bold('Next steps'));
      p.log.message(`  Create your first skill:`);
      p.log.message(`    ${chalk.dim('create-cursor-skill <skill-name>')}`);
      p.log.message(`  Skills will be created in skills/ (collection) or IDE-specific directories (project-level) automatically`);
      console.log();
      p.log.message(chalk.dim('For more information, visit: https://agentskills.io'));
      console.log();
      p.outro(chalk.green('Done!'));
    } catch (error) {
      p.log.error(error instanceof Error ? error.message : 'Unknown error');
      p.outro(chalk.red('Initialization failed'));
      process.exit(1);
    }
  });

program
  .command('create')
  .description('Create a new skill template')
  .argument('<skill-name>', 'Name of the skill to create (lowercase, hyphens, 1-64 chars)')
  .option('--description <description>', 'Description of the skill')
  .option('--scripts', 'Include scripts/ directory')
  .option('--references', 'Include references/ directory')
  .option('--assets', 'Include assets/ directory')
  .action(async (skillName: string, options: Options) => {
    console.log();
    p.intro(chalk.bgCyan.black(' create-cursor-skill '));

    // Validate skill name
    const validation = validateSkillName(skillName);
    if (!validation.valid) {
      p.log.error(validation.error || 'Invalid skill name');
      p.outro(chalk.red('Skill creation failed'));
      process.exit(1);
    }

    const spinner = p.spinner();
    spinner.start('Generating skill template...');

    try {
      // Determine output directory - prefer skills/ for collection, fallback to .cursor/skills/ for project-level
      const skillsDir = path.join(process.cwd(), 'skills');
      const cursorSkillsDir = path.join(process.cwd(), '.cursor', 'skills');
      const outputDir = (await fs.pathExists(skillsDir))
        ? skillsDir
        : (await fs.pathExists(cursorSkillsDir))
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
        spinner.stop(chalk.red('Failed to generate skill'));
        p.log.error(result.error || 'Unknown error');
        p.outro(chalk.red('Skill creation failed'));
        process.exit(1);
      }

      spinner.stop('Skill template generated');

      console.log();
      p.log.step(chalk.bold('Skill created'));
      p.log.success(`Skill created at: ${chalk.cyan(result.skillPath)}`);
      console.log();
      p.log.step(chalk.bold('Next steps'));
      p.log.message(`  Run ${chalk.cyan('`/refine-skill`')} command to interactively refine your skill with detailed questions`);
      p.log.message(`  Edit SKILL.md directly if you prefer manual customization`);
      p.log.message(`  Add scripts, references, or assets as needed`);
      console.log();
      p.log.message(
        chalk.yellow(
          '💡 Tip: Use `/refine-skill` to get help filling in all the placeholders with concrete examples and detailed instructions.'
        )
      );
      console.log();
      p.log.message(chalk.dim('For more information, visit: https://agentskills.io'));
      console.log();
      p.outro(chalk.green('Done!'));
    } catch (error) {
      spinner.stop(chalk.red('Failed to generate skill'));
      p.log.error(error instanceof Error ? error.message : 'Unknown error');
      p.outro(chalk.red('Skill creation failed'));
      process.exit(1);
    }
  });

program
  .command('add-skills')
  .description('Install skills from a Git repository')
  .argument('<source>', 'Git repo URL, GitHub shorthand (owner/repo), or direct path to skill')
  .option('-g, --global', 'Install skill globally (user-level) instead of project-level')
  .option('-a, --agent <agents...>', 'Specify agents to install to (opencode, claude-code, codex, cursor)')
  .option('-s, --skill <skills...>', 'Specify skill names to install (skip selection prompt)')
  .option('-l, --list', 'List available skills in the repository without installing')
  .option('-y, --yes', 'Skip confirmation prompts')
  .action(async (source: string, options: Options) => {
    await main(source, options);
  });

// Legacy command for backward compatibility
program
  .argument('<skill-name>', 'Name of the skill to create (lowercase, hyphens, 1-64 chars)')
  .option('--description <description>', 'Description of the skill')
  .option('--scripts', 'Include scripts/ directory')
  .option('--references', 'Include references/ directory')
  .option('--assets', 'Include assets/ directory')
  .action(async (skillName: string, options: Options) => {
    console.log();
    p.intro(chalk.bgCyan.black(' create-cursor-skill '));

    // Validate skill name
    const validation = validateSkillName(skillName);
    if (!validation.valid) {
      p.log.error(validation.error || 'Invalid skill name');
      p.outro(chalk.red('Skill creation failed'));
      process.exit(1);
    }

    const spinner = p.spinner();
    spinner.start('Generating skill template...');

    try {
      // Determine output directory - prefer skills/ for collection, fallback to .cursor/skills/ for project-level
      const skillsDir = path.join(process.cwd(), 'skills');
      const cursorSkillsDir = path.join(process.cwd(), '.cursor', 'skills');
      const outputDir = (await fs.pathExists(skillsDir))
        ? skillsDir
        : (await fs.pathExists(cursorSkillsDir))
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
        spinner.stop(chalk.red('Failed to generate skill'));
        p.log.error(result.error || 'Unknown error');
        p.outro(chalk.red('Skill creation failed'));
        process.exit(1);
      }

      spinner.stop('Skill template generated');

      console.log();
      p.log.step(chalk.bold('Skill created'));
      p.log.success(`Skill created at: ${chalk.cyan(result.skillPath)}`);
      console.log();
      p.log.step(chalk.bold('Next steps'));
      p.log.message(`  Run ${chalk.cyan('`/refine-skill`')} command to interactively refine your skill with detailed questions`);
      p.log.message(`  Edit SKILL.md directly if you prefer manual customization`);
      p.log.message(`  Add scripts, references, or assets as needed`);
      console.log();
      p.log.message(
        chalk.yellow(
          '💡 Tip: Use `/refine-skill` to get help filling in all the placeholders with concrete examples and detailed instructions.'
        )
      );
      console.log();
      p.log.message(chalk.dim('For more information, visit: https://agentskills.io'));
      console.log();
      p.outro(chalk.green('Done!'));
    } catch (error) {
      spinner.stop(chalk.red('Failed to generate skill'));
      p.log.error(error instanceof Error ? error.message : 'Unknown error');
      p.outro(chalk.red('Skill creation failed'));
      process.exit(1);
    }
  });

program.parse();

async function main(source: string, options: Options) {
  console.log();
  p.intro(chalk.bgCyan.black(' add-skills '));

  let tempDir: string | null = null;
  let searchPath: string;
  let subpath: string | undefined;

  try {
    const spinner = p.spinner();

    // Check if it's a local path
    const isLocalPath =
      source.startsWith('.') ||
      source.startsWith('/') ||
      (!source.includes('github.com') && !source.includes('gitlab.com') && !source.includes('http') && !source.includes('@'));

    if (isLocalPath) {
      // Resolve local path
      const resolvedPath = path.isAbsolute(source)
        ? source
        : path.resolve(process.cwd(), source);

      if (!(await fs.pathExists(resolvedPath))) {
        p.log.error(`Local path does not exist: ${resolvedPath}`);
        p.outro(chalk.red('Invalid source path'));
        process.exit(1);
      }

      searchPath = resolvedPath;
      spinner.start('Parsing source...');
      spinner.stop(`Source: ${chalk.cyan(resolvedPath)}`);
    } else {
      spinner.start('Parsing source...');
      const parsed = parseSource(source);
      spinner.stop(`Source: ${chalk.cyan(parsed.url)}${parsed.subpath ? ` (${parsed.subpath})` : ''}`);

      spinner.start('Cloning repository...');
      tempDir = await cloneRepo(parsed.url);
      spinner.stop('Repository cloned');

      searchPath = tempDir;
      subpath = parsed.subpath;
    }

    spinner.start('Discovering skills...');
    const skills = await discoverSkills(searchPath, subpath);

    if (skills.length === 0) {
      spinner.stop(chalk.red('No skills found'));
      p.outro(chalk.red('No valid skills found. Skills require a SKILL.md with name and description.'));
      await cleanup(tempDir);
      process.exit(1);
    }

    spinner.stop(`Found ${chalk.green(skills.length)} skill${skills.length > 1 ? 's' : ''}`);

    if (options.list) {
      console.log();
      p.log.step(chalk.bold('Available Skills'));
      for (const skill of skills) {
        p.log.message(`  ${chalk.cyan(getSkillDisplayName(skill))}`);
        p.log.message(`    ${chalk.dim(skill.description)}`);
      }
      console.log();
      p.outro('Use --skill <name> to install specific skills');
      await cleanup(tempDir);
      process.exit(0);
    }

    let selectedSkills: Skill[];

    if (options.skill && options.skill.length > 0) {
      selectedSkills = skills.filter(s =>
        options.skill!.some(name =>
          s.name.toLowerCase() === name.toLowerCase() ||
          getSkillDisplayName(s).toLowerCase() === name.toLowerCase()
        )
      );

      if (selectedSkills.length === 0) {
        p.log.error(`No matching skills found for: ${options.skill.join(', ')}`);
        p.log.info('Available skills:');
        for (const s of skills) {
          p.log.message(`  - ${getSkillDisplayName(s)}`);
        }
        await cleanup(tempDir);
        process.exit(1);
      }

      p.log.info(`Selected ${selectedSkills.length} skill${selectedSkills.length !== 1 ? 's' : ''}: ${selectedSkills.map(s => chalk.cyan(getSkillDisplayName(s))).join(', ')}`);
    } else if (skills.length === 1) {
      selectedSkills = skills;
      const firstSkill = skills[0]!;
      p.log.info(`Skill: ${chalk.cyan(getSkillDisplayName(firstSkill))}`);
      p.log.message(chalk.dim(firstSkill.description));
    } else if (options.yes) {
      selectedSkills = skills;
      p.log.info(`Installing all ${skills.length} skills`);
    } else {
      const skillChoices = skills.map(s => ({
        value: s,
        label: getSkillDisplayName(s),
        hint: s.description.length > 60 ? s.description.slice(0, 57) + '...' : s.description,
      }));

      const selected = await p.multiselect({
        message: 'Select skills to install',
        options: skillChoices,
        required: true,
      });

      if (p.isCancel(selected)) {
        p.cancel('Installation cancelled');
        await cleanup(tempDir);
        process.exit(0);
      }

      selectedSkills = selected as Skill[];
    }

    let targetAgents: AgentType[];

    if (options.agent && options.agent.length > 0) {
      const validAgents = ['opencode', 'claude-code', 'codex', 'cursor', 'antigravity', 'amp', 'kilo', 'roo', 'goose'];
      const invalidAgents = options.agent.filter(a => !validAgents.includes(a));

      if (invalidAgents.length > 0) {
        p.log.error(`Invalid agents: ${invalidAgents.join(', ')}`);
        p.log.info(`Valid agents: ${validAgents.join(', ')}`);
        await cleanup(tempDir);
        process.exit(1);
      }

      targetAgents = options.agent as AgentType[];
    } else {
      spinner.start('Detecting installed agents...');
      const installedAgents = await detectInstalledAgents();
      spinner.stop(`Detected ${installedAgents.length} agent${installedAgents.length !== 1 ? 's' : ''}`);

      if (installedAgents.length === 0) {
        if (options.yes) {
          targetAgents = ['opencode', 'claude-code', 'codex', 'cursor', 'antigravity', 'amp', 'kilo', 'roo', 'goose'];
          p.log.info('Installing to all agents (none detected)');
        } else {
          p.log.warn('No coding agents detected. You can still install skills.');

          const allAgentChoices = Object.entries(agents).map(([key, config]) => ({
            value: key as AgentType,
            label: config.displayName,
          }));

          const selected = await p.multiselect({
            message: 'Select agents to install skills to',
            options: allAgentChoices,
            required: true,
          });

          if (p.isCancel(selected)) {
            p.cancel('Installation cancelled');
            await cleanup(tempDir);
            process.exit(0);
          }

          targetAgents = selected as AgentType[];
        }
      } else if (installedAgents.length === 1 || options.yes) {
        targetAgents = installedAgents;
        if (installedAgents.length === 1) {
          const firstAgent = installedAgents[0]!;
          p.log.info(`Installing to: ${chalk.cyan(agents[firstAgent].displayName)}`);
        } else {
          p.log.info(`Installing to: ${installedAgents.map(a => chalk.cyan(agents[a].displayName)).join(', ')}`);
        }
      } else {
        const agentChoices = installedAgents.map(a => ({
          value: a,
          label: agents[a].displayName,
          hint: `${options.global ? agents[a].globalSkillsDir : agents[a].skillsDir}`,
        }));

        const selected = await p.multiselect({
          message: 'Select agents to install skills to',
          options: agentChoices,
          required: true,
          initialValues: installedAgents,
        });

        if (p.isCancel(selected)) {
          p.cancel('Installation cancelled');
          await cleanup(tempDir);
          process.exit(0);
        }

        targetAgents = selected as AgentType[];
      }
    }

    let installGlobally = options.global ?? false;

    if (options.global === undefined && !options.yes) {
      const scope = await p.select({
        message: 'Installation scope',
        options: [
          { value: false, label: 'Project', hint: 'Install in current directory (committed with your project)' },
          { value: true, label: 'Global', hint: 'Install in home directory (available across all projects)' },
        ],
      });

      if (p.isCancel(scope)) {
        p.cancel('Installation cancelled');
        await cleanup(tempDir);
        process.exit(0);
      }

      installGlobally = scope as boolean;
    }

    console.log();
    p.log.step(chalk.bold('Installation Summary'));

    for (const skill of selectedSkills) {
      p.log.message(`  ${chalk.cyan(getSkillDisplayName(skill))}`);
      for (const agent of targetAgents) {
        const installPath = getInstallPath(skill.name, agent, { global: installGlobally });
        const installed = await isSkillInstalled(skill.name, agent, { global: installGlobally });
        const status = installed ? chalk.yellow(' (will overwrite)') : '';
        p.log.message(`    ${chalk.dim('→')} ${agents[agent].displayName}: ${chalk.dim(installPath)}${status}`);
      }
    }
    console.log();

    if (!options.yes) {
      const confirmed = await p.confirm({ message: 'Proceed with installation?' });

      if (p.isCancel(confirmed) || !confirmed) {
        p.cancel('Installation cancelled');
        await cleanup(tempDir);
        process.exit(0);
      }
    }

    spinner.start('Installing skills...');

    const results: { skill: string; agent: string; success: boolean; path: string; error?: string }[] = [];

    for (const skill of selectedSkills) {
      for (const agent of targetAgents) {
        const result = await installSkillForAgent(skill, agent, { global: installGlobally });
        results.push({
          skill: getSkillDisplayName(skill),
          agent: agents[agent].displayName,
          ...result,
        });
      }
    }

    spinner.stop('Installation complete');

    console.log();
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    if (successful.length > 0) {
      p.log.success(chalk.green(`Successfully installed ${successful.length} skill${successful.length !== 1 ? 's' : ''}`));
      for (const r of successful) {
        p.log.message(`  ${chalk.green('✓')} ${r.skill} → ${r.agent}`);
        p.log.message(`    ${chalk.dim(r.path)}`);
      }
    }

    if (failed.length > 0) {
      console.log();
      p.log.error(chalk.red(`Failed to install ${failed.length} skill${failed.length !== 1 ? 's' : ''}`));
      for (const r of failed) {
        p.log.message(`  ${chalk.red('✗')} ${r.skill} → ${r.agent}`);
        p.log.message(`    ${chalk.dim(r.error)}`);
      }
    }

    console.log();
    p.outro(chalk.green('Done!'));
  } catch (error) {
    p.log.error(error instanceof Error ? error.message : 'Unknown error occurred');
    p.outro(chalk.red('Installation failed'));
    process.exit(1);
  } finally {
    await cleanup(tempDir);
  }
}

async function cleanup(tempDir: string | null) {
  if (tempDir) {
    try {
      await cleanupTempDir(tempDir);
    } catch {
      // Ignore cleanup errors
    }
  }
}
