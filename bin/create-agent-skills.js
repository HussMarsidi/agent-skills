#!/usr/bin/env node

import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Get the directory where this bin file is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve path to dist/index.js relative to the package root
// When installed via npm, the bin file is symlinked, so we need to resolve
// the path relative to where the actual package files are
const distPath = join(__dirname, "..", "dist", "index.js");

// Import the main entry point
await import(distPath);
