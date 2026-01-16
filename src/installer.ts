import { access, cp, mkdir, readdir, readFile, writeFile } from "fs/promises";
import { basename, join } from "path";
import matter from "gray-matter";
import { agents } from "./agents.js";
import type { AgentType, Skill } from "./types.js";

interface InstallResult {
  success: boolean;
  path: string;
  error?: string;
}

export async function installSkillForAgent(
  skill: Skill,
  agentType: AgentType,
  options: { global?: boolean; cwd?: string } = {}
): Promise<InstallResult> {
  const agent = agents[agentType];
  const skillName = skill.name || basename(skill.path);

  const targetBase = options.global
    ? agent.globalSkillsDir
    : join(options.cwd || process.cwd(), agent.skillsDir);

  const targetDir = join(targetBase, skillName);

  try {
    await mkdir(targetDir, { recursive: true });
    await copyDirectory(skill.path, targetDir);

    return { success: true, path: targetDir };
  } catch (error) {
    return {
      success: false,
      path: targetDir,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

const EXCLUDE_FILES = new Set(["README.md", "metadata.json"]);

const isExcluded = (name: string): boolean => {
  if (EXCLUDE_FILES.has(name)) return true;
  if (name.startsWith("_")) return true; // Templates, section definitions
  return false;
};

async function copyDirectory(src: string, dest: string): Promise<void> {
  await mkdir(dest, { recursive: true });

  const entries = await readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    if (isExcluded(entry.name)) {
      continue;
    }

    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else if (entry.name === 'SKILL.md') {
      // Remove snippet from SKILL.md during installation
      await removeSnippetFromSkillMd(srcPath, destPath);
    } else {
      await cp(srcPath, destPath);
    }
  }
}

async function removeSnippetFromSkillMd(srcPath: string, destPath: string): Promise<void> {
  const content = await readFile(srcPath, 'utf-8');
  const parsed = matter(content);
  
  // Remove snippet from frontmatter
  const { snippet, ...dataWithoutSnippet } = parsed.data;
  
  // Reconstruct frontmatter without snippet
  const frontmatterLines: string[] = [];
  for (const [key, value] of Object.entries(dataWithoutSnippet)) {
    if (value === null || value === undefined) continue;
    
    // Format the value properly for YAML
    let formattedValue: string;
    if (typeof value === 'string') {
      // If string contains special characters or newlines, quote it
      if (value.includes('\n') || value.includes(':') || value.includes('"') || value.includes("'")) {
        formattedValue = `"${value.replace(/"/g, '\\"')}"`;
      } else {
        formattedValue = value;
      }
    } else if (typeof value === 'object') {
      formattedValue = JSON.stringify(value);
    } else {
      formattedValue = String(value);
    }
    
    frontmatterLines.push(`${key}: ${formattedValue}`);
  }
  
  // Reconstruct the file without snippet
  const newContent = `---\n${frontmatterLines.join('\n')}\n---\n\n${parsed.content}`;
  
  await writeFile(destPath, newContent, 'utf-8');
}

export async function isSkillInstalled(
  skillName: string,
  agentType: AgentType,
  options: { global?: boolean; cwd?: string } = {}
): Promise<boolean> {
  const agent = agents[agentType];

  const targetBase = options.global
    ? agent.globalSkillsDir
    : join(options.cwd || process.cwd(), agent.skillsDir);

  const skillDir = join(targetBase, skillName);

  try {
    await access(skillDir);
    return true;
  } catch {
    return false;
  }
}

export function getInstallPath(
  skillName: string,
  agentType: AgentType,
  options: { global?: boolean; cwd?: string } = {}
): string {
  const agent = agents[agentType];

  const targetBase = options.global
    ? agent.globalSkillsDir
    : join(options.cwd || process.cwd(), agent.skillsDir);

  return join(targetBase, skillName);
}
