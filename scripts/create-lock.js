import fs from 'fs';
import path from 'path';

const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'));

// Create a minimal but valid package-lock.json structure
const lockFile = {
  name: packageJson.name,
  version: packageJson.version,
  lockfileVersion: 3,
  requires: true,
  packages: {
    "": {
      name: packageJson.name,
      version: packageJson.version,
      type: packageJson.type,
      dependencies: packageJson.dependencies || {},
      devDependencies: packageJson.devDependencies || {},
      engines: {
        "node": ">=18.0.0"
      }
    }
  },
  dependencies: {}
};

// Write the lock file
fs.writeFileSync(
  path.join(process.cwd(), 'package-lock.json'),
  JSON.stringify(lockFile, null, 2)
);

console.log('✓ Created package-lock.json');
