const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const commitCount = execSync('git rev-list --count HEAD').toString().trim();
const version = `1.0.${commitCount}`;

const versionFile = path.join(__dirname, '..', 'frontend', 'public', 'version.json');
fs.writeFileSync(versionFile, JSON.stringify({ version }, null, 2) + '\n');

console.log(`Version updated: ${version}`);
