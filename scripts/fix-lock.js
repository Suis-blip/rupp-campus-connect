#!/usr/bin/env node

/**
 * This script regenerates package-lock.json to match package.json
 * It resolves npm sync issues that prevent clean installs
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  // Get the current working directory
  const projectRoot = process.cwd();
  const packageLockPath = path.join(projectRoot, 'package-lock.json');
  const packageJsonPath = path.join(projectRoot, 'package.json');

  console.log('[v0] Fixing package-lock.json sync issues...');
  console.log('[v0] Current working directory:', projectRoot);
  console.log('[v0] Package.json path:', packageJsonPath);
  console.log('[v0] Package.json exists:', fs.existsSync(packageJsonPath));

  // Remove the out-of-sync lock file if it exists
  if (fs.existsSync(packageLockPath)) {
    console.log('[v0] Removing outdated package-lock.json...');
    fs.unlinkSync(packageLockPath);
    console.log('[v0] Removed outdated package-lock.json');
  }

  // Now run npm install with legacy peer deps to fill in all dependencies
  console.log('[v0] Running npm install --legacy-peer-deps...');
  execSync('npm install --legacy-peer-deps', {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: '/bin/bash'
  });

  console.log('[v0] Successfully fixed package-lock.json');
  process.exit(0);
} catch (error) {
  console.error('[v0] Error fixing lock file:', error.message);
  console.error('[v0] Stack:', error.stack);
  process.exit(1);
}
