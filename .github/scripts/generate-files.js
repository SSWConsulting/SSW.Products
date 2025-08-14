const fs = require('fs');
const path = require('path');

async function generateFiles() {
  try {
    const config = JSON.parse(fs.readFileSync('.github/translation-config.json', 'utf8'));
    const translationsData = JSON.parse(fs.readFileSync('.github/temp-translations.json', 'utf8'));

    if (translationsData.translatedFiles.length === 0) {
      if (process.env.GITHUB_OUTPUT) {
        fs.appendFileSync(process.env.GITHUB_OUTPUT, 'files_generated=false\n');
      }
      return;
    }

    const translationMapping = config.projects.YakShaver.translationMapping;
    const generatedFiles = [];

    for (const translatedFile of translationsData.translatedFiles) {
      let targetPath = null;

      for (const [englishPath, chinesePath] of Object.entries(translationMapping)) {
        if (translatedFile.originalPath.startsWith(englishPath)) {
          targetPath = translatedFile.originalPath.replace(englishPath, chinesePath);
          break;
        }
      }

      if (!targetPath) continue;

      try {
        const targetDir = path.dirname(targetPath);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        fs.writeFileSync(targetPath, translatedFile.translatedContent, 'utf8');
        generatedFiles.push({
          originalPath: translatedFile.originalPath,
          targetPath,
          status: translatedFile.status
        });

      } catch (error) {
        console.error(`Failed to generate ${targetPath}: ${error.message}`);
      }
    }

    const result = {
      originalPr: translationsData.originalPr,
      generatedFiles,
      filesGenerated: generatedFiles.length > 0
    };

    fs.writeFileSync('.github/temp-generated.json', JSON.stringify(result));

    console.log(`Generated ${generatedFiles.length} files`);
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `files_generated=${result.filesGenerated}\n`);
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, 'files_generated=false\n');
    }
    process.exit(1);
  }
}

if (require.main === module) generateFiles();