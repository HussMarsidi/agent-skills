import chalk from "chalk";

/**
 * CLI Output Formatter
 * Provides consistent formatting with emojis and visual hierarchy
 */

const EMOJI = {
  INFO: "◇",
  SECTION: "◆",
  SUCCESS: "✓",
  PIPE: "│",
  TOP_LEFT: "┌",
  BOTTOM_LEFT: "└",
} as const;

/**
 * Display command header with light blue background
 */
export function commandHeader(command: string): void {
  console.log(`${EMOJI.TOP_LEFT}   ${chalk.bgCyan(command)}`);
}

/**
 * Display command footer
 */
export function commandFooter(message: string = "Done!"): void {
  console.log(`${EMOJI.BOTTOM_LEFT}  ${message}`);
}

/**
 * Display an informational message with ◇ emoji and pipe
 */
export function info(message: string): void {
  console.log(`${EMOJI.PIPE}\n${chalk.cyan(EMOJI.INFO)}  ${message}`);
}

/**
 * Display a section header with ◆ emoji
 */
export function section(title: string): void {
  console.log(`\n${chalk.bold(EMOJI.SECTION)}  ${chalk.bold(title)}`);
}

/**
 * Display a success message with ✓ emoji
 */
export function success(message: string): void {
  console.log(`${chalk.green(EMOJI.SUCCESS)}  ${message}`);
}

/**
 * Display indented content (used after section headers)
 */
export function indent(content: string, level: number = 1): void {
  const indentStr = EMOJI.PIPE + "  ".repeat(level);
  console.log(`${indentStr}${content}`);
}

/**
 * Display an empty line with pipe character for continuation
 */
export function emptyLine(): void {
  console.log(EMOJI.PIPE);
}

/**
 * Format installation summary
 */
export interface InstallationItem {
  name: string;
  agent: string;
  path: string;
}

export function installationSummary(items: InstallationItem[]): void {
  info("Installation Summary");
  emptyLine();

  items.forEach((item) => {
    indent(item.name, 1);
    emptyLine();
    indent(`→ ${item.agent}: ${chalk.dim(item.path)}`, 2);
    emptyLine();
  });
}

/**
 * Format a list of items with indentation
 */
export function list(items: string[], level: number = 1): void {
  items.forEach((item) => {
    indent(item, level);
  });
}

/**
 * Display source information
 */
export function source(url: string): void {
  info(`Source: ${url}`);
  emptyLine();
}

/**
 * Display repository status
 */
export function repositoryStatus(status: string): void {
  info(status);
  emptyLine();
}

/**
 * Display skill count
 */
export function skillCount(count: number): void {
  info(`Found ${count} skill${count !== 1 ? "s" : ""}`);
  emptyLine();
}

/**
 * Display agent detection
 */
export function agentDetection(count: number): void {
  info(`Detected ${count} agent${count !== 1 ? "s" : ""}`);
  emptyLine();
}

/**
 * Display selected skills list
 */
export function selectedSkills(skills: string[]): void {
  info("Select skills to install");
  indent(skills.join(", "), 1);
  emptyLine();
}

/**
 * Display selected agent
 */
export function selectedAgent(agent: string): void {
  info("Select agents to install skills to");
  indent(agent, 1);
  emptyLine();
}

/**
 * Display proceed prompt
 */
export function proceedPrompt(answer: string = "Yes"): void {
  info("Proceed with installation?");
  indent(answer, 1);
  emptyLine();
}

/**
 * Display installation scope
 */
export function installationScope(scope: string): void {
  info(`Installation scope: ${chalk.bold(scope)}`);
}

/**
 * Display installation complete message
 */
export function installationCompleteMessage(): void {
  info("Installation complete");
  emptyLine();
}

/**
 * Display final success message with installed skills
 */
export function installationSuccess(
  items: Array<{ skill: string; agent: string; path: string }>
): void {
  section(`Successfully installed ${items.length} skill${items.length !== 1 ? "s" : ""}`);
  emptyLine();

  items.forEach((item) => {
    success(`${item.skill} → ${item.agent}`);
    emptyLine();
    indent(chalk.dim(item.path), 1);
    emptyLine();
  });
}

// Re-export path for convenience
import path from "path";
export { path };
