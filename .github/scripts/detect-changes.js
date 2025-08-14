const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function detectChanges() {
  try {
    const prNumber = process.argv[2];
    if (!prNumber) throw new Error('PR number required');

    const prInfo = JSON.parse(execSync(`gh pr view ${prNumber} --json number,title,url`, { encoding: 'utf8' }));
    const changedFiles = execSync(`gh pr diff ${prNumber} --name-only`, { encoding: 'utf8' })
      .trim().split('\n').filter(f => f);

    const fileChanges = [];
    for (const file of changedFiles) {
      try {
        const statusOutput = execSync(`gh pr diff ${prNumber} --name-status | grep "${file}"`, { encoding: 'utf8' });
        const status = statusOutput.charAt(0);
        fileChanges.push({
          path: file,
          status: status === 'A' ? 'added' : status === 'D' ? 'deleted' : 'modified'
        });
      } catch {
        fileChanges.push({ path: file, status: 'modified' });
      }
    }

    const result = { pr: prInfo, changes: fileChanges };
    fs.writeFileSync('.github/temp-changes.json', JSON.stringify(result));
    
    console.log(`Detected ${fileChanges.length} changes`);
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, 'changes_detected=true\n');
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, 'changes_detected=false\n');
    }
    process.exit(1);
  }
}

if (require.main === module) detectChanges();