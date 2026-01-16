#!/usr/bin/env node

import { execSync } from "child_process";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const packageJsonPath = path.join(rootDir, "package.json");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ${message}`, "red");
  process.exit(1);
}

function success(message) {
  log(`✓ ${message}`, "green");
}

function info(message) {
  log(`ℹ ${message}`, "cyan");
}

function warning(message) {
  log(`⚠ ${message}`, "yellow");
}

// Check if user is logged in to npm
function checkNpmLogin() {
  try {
    const whoami = execSync("npm whoami", { encoding: "utf-8", stdio: "pipe" });
    const username = whoami.trim();
    success(`Logged in as: ${username}`);
    return true;
  } catch (err) {
    error("Not logged in to npm. Please run 'npm login' first.");
  }
}

// Get current version
function getCurrentVersion() {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
  return packageJson.version;
}

// Run tests
function runTests() {
  info("Running tests...");
  try {
    execSync("pnpm test", { stdio: "inherit", cwd: rootDir });
    success("All tests passed!");
  } catch (err) {
    error("Tests failed. Please fix errors before publishing.");
  }
}

// Build the project
function build() {
  info("Building project...");
  try {
    execSync("pnpm run build", { stdio: "inherit", cwd: rootDir });
    success("Build completed!");
  } catch (err) {
    error("Build failed. Please fix errors before publishing.");
  }
}

// Check if there are uncommitted changes
function checkGitStatus() {
  try {
    const status = execSync("git status --porcelain", {
      encoding: "utf-8",
      stdio: "pipe",
    });
    if (status.trim()) {
      warning("You have uncommitted changes. Consider committing them first.");
      return false;
    }
    return true;
  } catch (err) {
    // Not a git repo or git not available, continue anyway
    return true;
  }
}

// Publish to npm
function publish() {
  const version = getCurrentVersion();
  info(`Publishing version ${version} to npm...`);

  try {
    // Set env var to skip redundant prepublishOnly hook
    // (we already ran tests and build in this script)
    process.env.SKIP_PREPUBLISH = "true";
    execSync("npm publish", {
      stdio: "inherit",
      cwd: rootDir,
      env: { ...process.env, SKIP_PREPUBLISH: "true" },
    });
    success(`Successfully published version ${version}!`);
    info(
      `Package available at: https://www.npmjs.com/package/@hussmarsidi/cursor`
    );
  } catch (err) {
    error(`Failed to publish: ${err.message}`);
  }
}

// Main execution
async function main() {
  log("\n🚀 Starting publish workflow...\n", "blue");

  // Step 1: Check npm login
  log("Step 1: Checking npm authentication...", "cyan");
  checkNpmLogin();
  console.log();

  // Step 2: Check git status (warning only)
  log("Step 2: Checking git status...", "cyan");
  checkGitStatus();
  console.log();

  // Step 3: Run tests
  log("Step 3: Running tests...", "cyan");
  runTests();
  console.log();

  // Step 4: Build
  log("Step 4: Building project...", "cyan");
  build();
  console.log();

  // Step 5: Publish
  log("Step 5: Publishing to npm...", "cyan");
  publish();
  console.log();

  success("🎉 Publish workflow completed successfully!");
}

main().catch((err) => {
  error(`Unexpected error: ${err.message}`);
});
