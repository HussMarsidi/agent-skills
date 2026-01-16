#!/usr/bin/env node

// Skip if already handled by publish script
if (process.env.SKIP_PREPUBLISH === "true") {
  process.exit(0);
}

// Run tests and build as safety net
import { execSync } from "child_process";

try {
  execSync("pnpm run test && pnpm run build", { stdio: "inherit" });
} catch (err) {
  console.error("❌ prepublishOnly hook failed");
  process.exit(1);
}
