import { z } from 'zod';

/**
 * Validates skill names according to Agent Skills specification:
 * - 1-64 characters
 * - Lowercase letters, numbers, and hyphens only
 * - Must not start or end with hyphen
 * - Must not contain consecutive hyphens
 */
const skillNameSchema = z
  .string()
  .min(1, 'Skill name must be at least 1 character')
  .max(64, 'Skill name must be at most 64 characters')
  .regex(/^[a-z0-9-]+$/, 'Skill name may only contain lowercase letters, numbers, and hyphens')
  .refine((name) => !name.startsWith('-'), {
    message: 'Skill name must not start with a hyphen',
  })
  .refine((name) => !name.endsWith('-'), {
    message: 'Skill name must not end with a hyphen',
  })
  .refine((name) => !name.includes('--'), {
    message: 'Skill name must not contain consecutive hyphens',
  });

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a skill name according to Agent Skills specification
 */
export function validateSkillName(name: string): ValidationResult {
  try {
    skillNameSchema.parse(name);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        error: error.errors[0]?.message || 'Invalid skill name',
      };
    }
    return {
      valid: false,
      error: 'Invalid skill name',
    };
  }
}
