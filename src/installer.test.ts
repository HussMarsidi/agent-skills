import { checkbox } from "@inquirer/prompts";
import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { addSkills } from "./installer.js";

// Mock dependencies
vi.mock("fs-extra");
vi.mock("child_process");
vi.mock("@inquirer/prompts");
vi.mock("ora", () => ({
  default: vi.fn(() => ({
    start: vi.fn(() => ({
      stop: vi.fn(),
      succeed: vi.fn(),
      fail: vi.fn(),
      text: "",
    })),
  })),
}));

const mockedFs = vi.mocked(fs);
const mockedExecSync = vi.mocked(execSync);
const mockedCheckbox = vi.mocked(checkbox);

describe("installer", () => {
  const testDir = path.join(process.cwd(), "test-temp");
  const skillsDir = path.join(testDir, ".cursor", "skills");

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset process.cwd mock
    vi.spyOn(process, "cwd").mockReturnValue(testDir);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("addSkills", () => {
    it("should use default repo URL when not provided", async () => {
      // Mock GitHub repo flow with default repo
      mockedFs.pathExists
        .mockResolvedValueOnce(false) // tempDir doesn't exist
        .mockResolvedValueOnce(false); // skillsDir doesn't exist
      mockedCheckbox.mockResolvedValue([]);

      const result = await addSkills();

      expect(result.success).toBe(false);
      expect(result.error).toBe("No skills found");
    });

    it("should fetch and display skills from local repository", async () => {
      const repoUrl = "/local/repo";
      const localSkillsDir = path.join(repoUrl, ".cursor", "skills");
      const skillMdPath = path.join(localSkillsDir, "test-skill", "SKILL.md");
      const targetSkillsDir = path.join(testDir, ".cursor", "skills");
      const targetSkillPath = path.join(targetSkillsDir, "test-skill");
      const sourceSkillPath = path.join(localSkillsDir, "test-skill");

      // Mock fetchSkillsFromRepo flow for local path
      mockedFs.pathExists
        .mockResolvedValueOnce(true) // resolvedPath exists
        .mockResolvedValueOnce(true) // skillsDir exists
        .mockResolvedValueOnce(true) // skillMdPath exists
        // Mock installSkills flow
        .mockResolvedValueOnce(true) // sourceSkillsDir exists
        .mockResolvedValueOnce(false) // targetSkillPath doesn't exist
        .mockResolvedValueOnce(true); // sourceSkillPath exists

      mockedFs.readdir.mockResolvedValue([
        {
          name: "test-skill",
          isDirectory: () => true,
          isFile: () => false,
        } as fs.Dirent,
      ]);
      mockedFs.readFile.mockResolvedValue(
        "---\nname: test-skill\ndescription: A test skill\n---\n# Test Skill"
      );
      mockedCheckbox.mockResolvedValue(["test-skill"]);

      // Mock installation
      mockedFs.ensureDir.mockResolvedValue(undefined);
      mockedFs.copy.mockResolvedValue(undefined);

      const result = await addSkills(repoUrl);

      expect(mockedFs.pathExists).toHaveBeenCalledWith(repoUrl);
      expect(mockedFs.pathExists).toHaveBeenCalledWith(localSkillsDir);
      expect(mockedFs.readdir).toHaveBeenCalledWith(localSkillsDir, {
        withFileTypes: true,
      });
      expect(mockedCheckbox).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.installedSkills).toContain("test-skill");
    });

    it("should fetch skills from GitHub repository", async () => {
      const repoUrl = "https://github.com/user/repo.git";
      const tempDir = path.join(testDir, ".cursor", ".temp-skills-repo");
      const tempSkillsDir = path.join(tempDir, ".cursor", "skills");
      const skillMdPath = path.join(
        tempSkillsDir,
        "project-scaffolder",
        "SKILL.md"
      );
      const targetSkillsDir = path.join(testDir, ".cursor", "skills");
      const targetSkillPath = path.join(targetSkillsDir, "project-scaffolder");
      const sourceSkillPath = path.join(tempSkillsDir, "project-scaffolder");

      // Mock fetchSkillsFromRepo flow for GitHub
      mockedFs.pathExists
        .mockResolvedValueOnce(false) // tempDir doesn't exist
        .mockResolvedValueOnce(true) // skillsDir exists
        .mockResolvedValueOnce(true) // skillMdPath exists
        .mockResolvedValueOnce(true) // tempDir exists for cleanup
        // Mock installSkills flow
        .mockResolvedValueOnce(false) // tempDir doesn't exist (for install)
        .mockResolvedValueOnce(false) // targetSkillPath doesn't exist
        .mockResolvedValueOnce(true) // sourceSkillPath exists
        .mockResolvedValueOnce(true); // tempDir exists for cleanup

      mockedFs.remove.mockResolvedValue(undefined);
      mockedFs.readdir.mockResolvedValue([
        {
          name: "project-scaffolder",
          isDirectory: () => true,
          isFile: () => false,
        } as fs.Dirent,
      ]);
      mockedFs.readFile.mockResolvedValue(
        "---\nname: project-scaffolder\ndescription: Scaffold projects\n---\n# Project Scaffolder"
      );
      mockedCheckbox.mockResolvedValue(["project-scaffolder"]);

      // Mock installation
      mockedFs.ensureDir.mockResolvedValue(undefined);
      mockedFs.copy.mockResolvedValue(undefined);

      const result = await addSkills(repoUrl);

      expect(mockedExecSync).toHaveBeenCalledWith(
        `git clone --depth 1 ${repoUrl} "${tempDir}"`,
        expect.any(Object)
      );
      expect(mockedCheckbox).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.installedSkills).toContain("project-scaffolder");
    });

    it("should extract description from SKILL.md frontmatter", async () => {
      const repoUrl = "/local/repo";
      const localSkillsDir = path.join(repoUrl, ".cursor", "skills");
      const targetSkillsDir = path.join(testDir, ".cursor", "skills");
      const targetSkillPath = path.join(targetSkillsDir, "my-skill");
      const sourceSkillPath = path.join(localSkillsDir, "my-skill");

      // Mock fetchSkillsFromRepo flow
      mockedFs.pathExists
        .mockResolvedValueOnce(true) // resolvedPath exists
        .mockResolvedValueOnce(true) // skillsDir exists
        .mockResolvedValueOnce(true) // skillMdPath exists
        // Mock installSkills flow
        .mockResolvedValueOnce(true) // sourceSkillsDir
        .mockResolvedValueOnce(false) // target skill
        .mockResolvedValueOnce(true); // source skill

      mockedFs.readdir.mockResolvedValue([
        {
          name: "my-skill",
          isDirectory: () => true,
          isFile: () => false,
        } as fs.Dirent,
      ]);
      mockedFs.readFile.mockResolvedValue(
        "---\nname: my-skill\ndescription: This is a test description\n---\n# My Skill"
      );
      mockedCheckbox.mockResolvedValue(["my-skill"]);

      // Mock installation
      mockedFs.ensureDir.mockResolvedValue(undefined);
      mockedFs.copy.mockResolvedValue(undefined);

      const result = await addSkills(repoUrl);

      expect(mockedCheckbox).toHaveBeenCalledWith(
        expect.objectContaining({
          choices: expect.arrayContaining([
            expect.objectContaining({
              name: expect.stringContaining("This is a test description"),
            }),
          ]),
        })
      );
      expect(result.success).toBe(true);
    });

    it("should use snippet from frontmatter when available", async () => {
      const repoUrl = "/local/repo";
      const localSkillsDir = path.join(repoUrl, ".cursor", "skills");
      const targetSkillsDir = path.join(testDir, ".cursor", "skills");
      const targetSkillPath = path.join(targetSkillsDir, "snippet-skill");
      const sourceSkillPath = path.join(localSkillsDir, "snippet-skill");

      // Mock fetchSkillsFromRepo flow
      mockedFs.pathExists
        .mockResolvedValueOnce(true) // resolvedPath exists
        .mockResolvedValueOnce(true) // skillsDir exists
        .mockResolvedValueOnce(true) // skillMdPath exists
        // Mock installSkills flow
        .mockResolvedValueOnce(true) // sourceSkillsDir
        .mockResolvedValueOnce(false) // target skill
        .mockResolvedValueOnce(true); // source skill

      mockedFs.readdir.mockResolvedValue([
        {
          name: "snippet-skill",
          isDirectory: () => true,
          isFile: () => false,
        } as fs.Dirent,
      ]);
      mockedFs.readFile.mockResolvedValue(
        "---\nname: snippet-skill\ndescription: This is a very long description that would normally be truncated in the checkbox list because it exceeds the maximum length limit\nsnippet: Short snippet for display\n---\n# Snippet Skill"
      );
      mockedCheckbox.mockResolvedValue(["snippet-skill"]);

      // Mock installation
      mockedFs.ensureDir.mockResolvedValue(undefined);
      mockedFs.copy.mockResolvedValue(undefined);

      const result = await addSkills(repoUrl);

      const checkboxCall = mockedCheckbox.mock.calls[0]?.[0];
      const choice = checkboxCall?.choices?.find(
        (c: { value: string }) => c.value === "snippet-skill"
      );
      expect(choice).toBeDefined();
      expect(choice.name).toContain("\n"); // Should contain line break
      expect(choice.name).toContain("Short snippet for display"); // Should contain snippet
      expect(choice.name).not.toContain("This is a very long description"); // Should not contain full description
      expect(result.success).toBe(true);
    });

    it("should use full description with line break when snippet is not available", async () => {
      const repoUrl = "/local/repo";
      const localSkillsDir = path.join(repoUrl, ".cursor", "skills");
      const targetSkillsDir = path.join(testDir, ".cursor", "skills");
      const targetSkillPath = path.join(targetSkillsDir, "long-desc-skill");
      const sourceSkillPath = path.join(localSkillsDir, "long-desc-skill");

      // Mock fetchSkillsFromRepo flow
      mockedFs.pathExists
        .mockResolvedValueOnce(true) // resolvedPath exists
        .mockResolvedValueOnce(true) // skillsDir exists
        .mockResolvedValueOnce(true) // skillMdPath exists
        // Mock installSkills flow
        .mockResolvedValueOnce(true) // sourceSkillsDir
        .mockResolvedValueOnce(false) // target skill
        .mockResolvedValueOnce(true); // source skill

      mockedFs.readdir.mockResolvedValue([
        {
          name: "long-desc-skill",
          isDirectory: () => true,
          isFile: () => false,
        } as fs.Dirent,
      ]);
      // Long description without snippet
      const longDescription =
        "This is a very long description that should be displayed in full with a line break";
      mockedFs.readFile.mockResolvedValue(
        `---\nname: long-desc-skill\ndescription: ${longDescription}\n---\n# Long Desc Skill`
      );
      mockedCheckbox.mockResolvedValue(["long-desc-skill"]);

      // Mock installation
      mockedFs.ensureDir.mockResolvedValue(undefined);
      mockedFs.copy.mockResolvedValue(undefined);

      const result = await addSkills(repoUrl);

      const checkboxCall = mockedCheckbox.mock.calls[0]?.[0];
      const choice = checkboxCall?.choices?.find(
        (c: { value: string }) => c.value === "long-desc-skill"
      );
      expect(choice).toBeDefined();
      expect(choice.name).toContain("\n"); // Should contain line break
      expect(choice.name).toContain(longDescription); // Should contain full description
      expect(result.success).toBe(true);
    });

    it("should handle skills without description in frontmatter", async () => {
      const repoUrl = "/local/repo";
      const localSkillsDir = path.join(repoUrl, ".cursor", "skills");
      const targetSkillsDir = path.join(testDir, ".cursor", "skills");
      const targetSkillPath = path.join(targetSkillsDir, "no-desc-skill");
      const sourceSkillPath = path.join(localSkillsDir, "no-desc-skill");

      // Mock fetchSkillsFromRepo flow
      mockedFs.pathExists
        .mockResolvedValueOnce(true) // resolvedPath exists
        .mockResolvedValueOnce(true) // skillsDir exists
        .mockResolvedValueOnce(true) // skillMdPath exists
        // Mock installSkills flow
        .mockResolvedValueOnce(true) // sourceSkillsDir
        .mockResolvedValueOnce(false) // target skill
        .mockResolvedValueOnce(true); // source skill

      mockedFs.readdir.mockResolvedValue([
        {
          name: "no-desc-skill",
          isDirectory: () => true,
          isFile: () => false,
        } as fs.Dirent,
      ]);
      mockedFs.readFile.mockResolvedValue(
        "---\nname: no-desc-skill\n---\n# Skill"
      );
      mockedCheckbox.mockResolvedValue(["no-desc-skill"]);

      // Mock installation
      mockedFs.ensureDir.mockResolvedValue(undefined);
      mockedFs.copy.mockResolvedValue(undefined);

      const result = await addSkills(repoUrl);

      expect(mockedCheckbox).toHaveBeenCalledWith(
        expect.objectContaining({
          choices: expect.arrayContaining([
            expect.objectContaining({
              name: expect.stringContaining("Skill: no-desc-skill"),
            }),
          ]),
        })
      );
      expect(result.success).toBe(true);
    });

    it("should skip skills that already exist without error", async () => {
      const repoUrl = "/local/repo";
      mockedFs.pathExists.mockResolvedValue(true);
      mockedFs.readdir.mockResolvedValue([
        {
          name: "existing-skill",
          isDirectory: () => true,
          isFile: () => false,
        } as fs.Dirent,
      ]);
      mockedFs.readFile.mockResolvedValue(
        "---\nname: existing-skill\n---\n# Skill"
      );
      mockedCheckbox.mockResolvedValue(["existing-skill"]);

      // Mock installation - skill already exists
      mockedFs.ensureDir.mockResolvedValue(undefined);
      mockedFs.pathExists
        .mockResolvedValueOnce(true) // sourceSkillsDir
        .mockResolvedValueOnce(true); // skill already exists in target

      const result = await addSkills(repoUrl);

      // Skipping existing skills should not be an error
      expect(result.success).toBe(true);
      expect(result.installedSkills).toHaveLength(0);
      expect(mockedFs.copy).not.toHaveBeenCalled();
    });

    it("should use default repo URL automatically", async () => {
      // Mock GitHub repo flow with default repo
      mockedFs.pathExists
        .mockResolvedValueOnce(false) // tempDir doesn't exist
        .mockResolvedValueOnce(true) // skillsDir exists
        .mockResolvedValueOnce(true) // skillMdPath exists
        .mockResolvedValueOnce(true) // tempDir exists for cleanup
        // Mock installSkills flow
        .mockResolvedValueOnce(false) // tempDir doesn't exist (for install)
        .mockResolvedValueOnce(false) // target skill doesn't exist
        .mockResolvedValueOnce(true) // source skill exists
        .mockResolvedValueOnce(true); // tempDir exists for cleanup

      mockedFs.remove.mockResolvedValue(undefined);
      mockedFs.readdir.mockResolvedValue([
        {
          name: "project-scaffolder",
          isDirectory: () => true,
          isFile: () => false,
        } as fs.Dirent,
      ]);
      mockedFs.readFile.mockResolvedValue(
        "---\nname: project-scaffolder\ndescription: Test\n---\n# Test"
      );
      mockedCheckbox.mockResolvedValue(["project-scaffolder"]);

      // Mock installSkills
      mockedFs.ensureDir.mockResolvedValue(undefined);
      mockedFs.copy.mockResolvedValue(undefined);

      const result = await addSkills();

      expect(mockedCheckbox).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.installedSkills).toContain("project-scaffolder");
    });

    it("should install selected skills", async () => {
      const repoUrl = "/local/repo";
      const localSkillsDir = path.join(repoUrl, ".cursor", "skills");
      const targetSkillsDir = path.join(testDir, ".cursor", "skills");

      // Mock fetchSkillsFromRepo flow
      mockedFs.pathExists
        .mockResolvedValueOnce(true) // resolvedPath exists
        .mockResolvedValueOnce(true) // skillsDir exists
        .mockResolvedValueOnce(true) // skill1 SKILL.md exists
        .mockResolvedValueOnce(true) // skill2 SKILL.md exists
        // Mock installSkills flow
        .mockResolvedValueOnce(true) // sourceSkillsDir
        .mockResolvedValueOnce(false) // skill1 target doesn't exist
        .mockResolvedValueOnce(true) // source skill1 exists
        .mockResolvedValueOnce(false) // skill2 target doesn't exist
        .mockResolvedValueOnce(true); // source skill2 exists

      mockedFs.readdir.mockResolvedValue([
        {
          name: "skill1",
          isDirectory: () => true,
          isFile: () => false,
        } as fs.Dirent,
        {
          name: "skill2",
          isDirectory: () => true,
          isFile: () => false,
        } as fs.Dirent,
      ]);
      mockedFs.readFile
        .mockResolvedValueOnce(
          "---\nname: skill1\ndescription: Skill 1\n---\n# Skill 1"
        )
        .mockResolvedValueOnce(
          "---\nname: skill2\ndescription: Skill 2\n---\n# Skill 2"
        );
      mockedCheckbox.mockResolvedValue(["skill1", "skill2"]);

      // Mock installSkills
      mockedFs.ensureDir.mockResolvedValue(undefined);
      mockedFs.copy.mockResolvedValue(undefined);

      const result = await addSkills(repoUrl);

      expect(result.success).toBe(true);
      expect(result.installedSkills).toContain("skill1");
      expect(result.installedSkills).toContain("skill2");
    });

    it("should return error if no skills found", async () => {
      const repoUrl = "/local/repo";

      // Mock fetchSkillsFromRepo - path exists but skillsDir doesn't
      // This will return empty array, which triggers "No skills found"
      mockedFs.pathExists
        .mockResolvedValueOnce(true) // resolvedPath exists
        .mockResolvedValueOnce(false); // skillsDir doesn't exist (returns empty array)

      const result = await addSkills(repoUrl);

      expect(result.success).toBe(false);
      expect(result.error).toBe("No skills found");
    });

    it("should return error if no skills selected", async () => {
      const repoUrl = "/local/repo";
      const localSkillsDir = path.join(repoUrl, ".cursor", "skills");

      // Mock fetchSkillsFromRepo flow
      mockedFs.pathExists
        .mockResolvedValueOnce(true) // resolvedPath exists
        .mockResolvedValueOnce(true) // skillsDir exists
        .mockResolvedValueOnce(true); // skillMdPath exists

      mockedFs.readdir.mockResolvedValue([
        {
          name: "skill1",
          isDirectory: () => true,
          isFile: () => false,
        } as fs.Dirent,
      ]);
      mockedFs.readFile.mockResolvedValue("---\nname: skill1\n---\n# Skill 1");
      mockedCheckbox.mockResolvedValue([]);

      const result = await addSkills(repoUrl);

      expect(result.success).toBe(false);
      expect(result.error).toBe("No skills selected");
    });
  });
});
