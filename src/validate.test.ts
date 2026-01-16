import { describe, it, expect } from "vitest";
import { validateSkillName } from "./validate.js";

describe("validateSkillName", () => {
  it("should accept valid skill names", () => {
    expect(validateSkillName("my-skill")).toEqual({ valid: true });
    expect(validateSkillName("skill-name-123")).toEqual({ valid: true });
    expect(validateSkillName("a")).toEqual({ valid: true });
    expect(validateSkillName("a".repeat(64))).toEqual({ valid: true });
  });

  it("should reject invalid skill names", () => {
    expect(validateSkillName("")).toEqual({ valid: false, error: expect.any(String) });
    expect(validateSkillName("MySkill")).toEqual({ valid: false, error: expect.any(String) });
    expect(validateSkillName("skill_name")).toEqual({ valid: false, error: expect.any(String) });
    expect(validateSkillName("-skill")).toEqual({ valid: false, error: expect.any(String) });
    expect(validateSkillName("skill-")).toEqual({ valid: false, error: expect.any(String) });
    expect(validateSkillName("skill--name")).toEqual({ valid: false, error: expect.any(String) });
    expect(validateSkillName("a".repeat(65))).toEqual({ valid: false, error: expect.any(String) });
  });
});
