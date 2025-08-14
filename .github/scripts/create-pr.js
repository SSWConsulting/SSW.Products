const { execSync } = require('child_process');
const fs = require('fs');

async function createPR() {
  try {
    const originalPrNumber = process.argv[2];
    if (!originalPrNumber) throw new Error('PR number required');

    const config = JSON.parse(fs.readFileSync('.github/translation-config.json', 'utf8'));
    
    let hasChanges = false;
    let generatedFiles = [];
    let deletedFiles = [];
    let originalPrInfo = null;

    if (fs.existsSync('.github/temp-generated.json')) {
      const data = JSON.parse(fs.readFileSync('.github/temp-generated.json', 'utf8'));
      if (data.filesGenerated) {
        hasChanges = true;
        generatedFiles = data.generatedFiles;
        originalPrInfo = data.originalPr;
      }
    }

    if (fs.existsSync('.github/temp-deletions.json')) {
      const data = JSON.parse(fs.readFileSync('.github/temp-deletions.json', 'utf8'));
      if (data.filesCleaned) {
        hasChanges = true;
        deletedFiles = data.deletedFiles;
        originalPrInfo = originalPrInfo || data.originalPr;
      }
    }

    if (!hasChanges) {
      console.log(`::set-output name=translation_pr_created::false`);
      return;
    }

    const branchName = `${config.github.branchPrefix}${originalPrNumber}`;
    
    execSync('git checkout main && git pull origin main', { stdio: 'inherit' });
    execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });

    for (const file of generatedFiles) {
      execSync(`git add "${file.targetPath}"`);
    }
    for (const file of deletedFiles) {
      try { execSync(`git add "${file.deletedPath}"`); } catch {}
    }

    const statusOutput = execSync('git status --porcelain', { encoding: 'utf8' });
    if (!statusOutput.trim()) {
      console.log(`::set-output name=translation_pr_created::false`);
      return;
    }

    const commitMessage = `🤖 Auto Translation: Chinese content for PR #${originalPrNumber}

- Generated ${generatedFiles.length} Chinese files
- Deleted ${deletedFiles.length} obsolete Chinese files

Original PR: ${originalPrInfo?.url || `#${originalPrNumber}`}`;

    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    execSync(`git push origin ${branchName}`, { stdio: 'inherit' });

    const fileList = [
      ...generatedFiles.map(f => `- Generated: \`${f.targetPath}\``),
      ...deletedFiles.map(f => `- Deleted: \`${f.deletedPath}\``)
    ].join('\n');

    const prBody = config.github.prBodyTemplate
      .replace('#{originalPrNumber}', originalPrNumber)
      .replace('#{originalPrLink}', originalPrInfo?.url || `#${originalPrNumber}`)
      .replace('{translatedFilesCount}', generatedFiles.length)
      .replace('{fileList}', fileList);

    const prTitle = config.github.prTitle.replace('#{originalPrNumber}', originalPrNumber);
    
    const prUrl = execSync(
      `gh pr create --title "${prTitle}" --body "${prBody}" --label "${config.github.prLabels.join(',')}"`,
      { encoding: 'utf8' }
    ).trim();

    const prNumber = prUrl.match(/\/pull\/(\d+)$/)?.[1] || 'unknown';

    console.log(`Created translation PR: ${prUrl}`);
    console.log(`::set-output name=translation_pr_created::true`);
    console.log(`::set-output name=translation_pr_number::${prNumber}`);
    console.log(`::set-output name=translation_pr_url::${prUrl}`);

  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log(`::set-output name=translation_pr_created::false`);
    process.exit(1);
  }
}

if (require.main === module) createPR();