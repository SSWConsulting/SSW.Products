const fs = require('fs');
const path = require('path');

async function handleDeletions() {
  try {
    const config = JSON.parse(fs.readFileSync('.github/translation-config.json', 'utf8'));
    const filteredData = JSON.parse(fs.readFileSync('.github/temp-filtered.json', 'utf8'));

    if (filteredData.filesToDelete.length === 0) {
      if (process.env.GITHUB_OUTPUT) {
        fs.appendFileSync(process.env.GITHUB_OUTPUT, 'files_cleaned=false\n');
      }
      return;
    }

    const translationMapping = config.projects.YakShaver.translationMapping;
    const deletedFiles = [];

    for (const deletedFile of filteredData.filesToDelete) {
      let targetPath = null;

      for (const [englishPath, chinesePath] of Object.entries(translationMapping)) {
        if (deletedFile.path.startsWith(englishPath)) {
          targetPath = deletedFile.path.replace(englishPath, chinesePath);
          break;
        }
      }

      if (!targetPath) continue;

      try {
        if (fs.existsSync(targetPath)) {
          fs.unlinkSync(targetPath);
          deletedFiles.push({
            originalPath: deletedFile.path,
            deletedPath: targetPath
          });
        }
      } catch (error) {
        console.error(`Failed to delete ${targetPath}: ${error.message}`);
      }
    }

    const result = {
      originalPr: filteredData.originalPr,
      deletedFiles,
      filesCleaned: deletedFiles.length > 0
    };

    fs.writeFileSync('.github/temp-deletions.json', JSON.stringify(result));

    console.log(`Deleted ${deletedFiles.length} files`);
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `files_cleaned=${result.filesCleaned}\n`);
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, 'files_cleaned=false\n');
    }
    process.exit(1);
  }
}

if (require.main === module) handleDeletions();