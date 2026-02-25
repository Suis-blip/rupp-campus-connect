#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const lockFilePath = path.join(process.cwd(), 'package-lock.json');

try {
  // Delete the corrupted lock file
  if (fs.existsSync(lockFilePath)) {
    fs.unlinkSync(lockFilePath);
    console.log('Deleted corrupted package-lock.json');
  }

  // Generate a fresh lock file
  execSync('npm install --package-lock-only --legacy-peer-deps', {
    stdio: 'inherit'
  });
  
  console.log('Successfully generated fresh package-lock.json');
} catch (error) {
  console.error('Error regenerating lock file:', error.message);
  process.exit(1);
}
