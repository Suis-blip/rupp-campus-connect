import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

try {
  console.log('Generating fresh package-lock.json...');
  
  // Run npm install to generate a fresh lock file
  execSync('npm install --package-lock-only', {
    cwd: '/vercel/share/v0-project',
    stdio: 'inherit'
  });
  
  console.log('package-lock.json has been regenerated successfully!');
} catch (error) {
  console.error('Error regenerating lock file:', error.message);
  process.exit(1);
}
