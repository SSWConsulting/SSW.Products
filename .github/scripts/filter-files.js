const fs = require('fs');
const { minimatch } = require('minimatch');

async function filterFiles() {
  try {
    const config = JSON.parse(fs.readFileSync('.github/translation-config.json', 'utf8'));
    const changesData = JSON.parse(fs.readFileSync('.github/temp-changes.json', 'utf8'));

    const { watchPaths, excludePaths } = config.projects.YakShaver;
    const filesToTranslate = [];
    const filesToDelete = [];

    for (const change of changesData.changes) {
      const isWatched = watchPaths.some(pattern => minimatch(change.path, pattern));
      const isExcluded = excludePaths.some(pattern => minimatch(change.path, pattern));
      
      if (isWatched && !isExcluded) {
        if (change.status === 'deleted') {
          filesToDelete.push(change);
        } else {
          filesToTranslate.push(change);
        }
      }
    }

    const result = {
      originalPr: changesData.pr,
      filesToTranslate,
      filesToDelete,
      hasFiles: filesToTranslate.length > 0,
      hasDeletions: filesToDelete.length > 0
    };

    fs.writeFileSync('.github/temp-filtered.json', JSON.stringify(result));
    
    console.log(`Found ${filesToTranslate.length} files to translate, ${filesToDelete.length} to delete`);
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `has_files=${result.hasFiles}\nhas_deletions=${result.hasDeletions}\n`);
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, 'has_files=false\nhas_deletions=false\n');
    }
    process.exit(1);
  }
}

if (require.main === module) filterFiles();