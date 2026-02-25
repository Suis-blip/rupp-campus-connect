import fs from 'fs';
import path from 'path';

// Read package.json
const packagePath = path.join(process.cwd(), 'package.json');
const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Create a new package-lock.json structure
const lockData = {
  name: packageData.name,
  version: packageData.version,
  lockfileVersion: 3,
  requires: true,
  packages: {
    "": {
      name: packageData.name,
      version: packageData.version,
      dependencies: packageData.dependencies || {},
      devDependencies: packageData.devDependencies || {}
    }
  },
  dependencies: {}
};

// Write the lock file
const lockPath = path.join(process.cwd(), 'package-lock.json');
fs.writeFileSync(lockPath, JSON.stringify(lockData, null, 2));

console.log('✓ package-lock.json has been regenerated');
