const axios = require('axios');
const fs = require('fs');
const minimatch = require('minimatch');

async function detectChanges() {
  try {
    const prNumber = process.env.PR_NUMBER;
    if (!prNumber) throw new Error('PR_NUMBER environment variable required');

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO = process.env.GITHUB_REPOSITORY;
    const [OWNER, REPO_NAME] = REPO.split('/');

    console.log(`Fetching PR #${prNumber} files from GitHub API...`);

    // Get changed files list
    const response = await axios.get(
      `https://api.github.com/repos/${OWNER}/${REPO_NAME}/pulls/${prNumber}/files`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    // Filter Rule
    const config = JSON.parse(fs.readFileSync('.github/translation-config.json', 'utf8'));
    const { watchPaths, excludePaths } = config.projects.YakShaver;

    // Separate file operations and content changes
    const fileOperations = [];
    const contentFiles = [];

    response.data.forEach(file => {
      const fileToCheck = file.status === 'renamed' ? file.filename : file.filename;
      const isWatched = watchPaths.some(pattern => minimatch(fileToCheck, pattern));
      const isExcluded = excludePaths.some(pattern => minimatch(fileToCheck, pattern));
      
      if (!isWatched || isExcluded) return;

      if (file.status === 'removed') {
        console.log(`File deleted: ${file.filename}`);
        fileOperations.push({
          operation: 'removed',
          filename: file.filename
        });
      } else if (file.status === 'renamed') {
        console.log(`File renamed: ${file.previous_filename} -> ${file.filename}`);
        fileOperations.push({
          operation: 'renamed',
          previous_filename: file.previous_filename,
          filename: file.filename
        });
        // Also include renamed file for content translation
        contentFiles.push(file.filename);
      } else if (file.status === 'copied') {
        console.log(`File copied: ${file.previous_filename} -> ${file.filename}`);
        fileOperations.push({
          operation: 'copied',
          previous_filename: file.previous_filename,
          filename: file.filename
        });
        // Also include copied file for content translation
        contentFiles.push(file.filename);
      } else {
        // added or modified files
        contentFiles.push(file.filename);
      }
    });

    const relevantFiles = contentFiles;

    console.log(`Found ${relevantFiles.length} relevant files for translation`);
    console.log(`Found ${fileOperations.length} file operations`);

    // Set environment variables for content files
    if (relevantFiles.length > 0) {
      fs.appendFileSync(process.env.GITHUB_ENV, `HAS_CHANGED_FILES=true\n`);
      fs.appendFileSync(process.env.GITHUB_ENV, `CHANGED_FILES<<EOF\n${relevantFiles.join('\n')}\nEOF\n`);
    } else {
      fs.appendFileSync(process.env.GITHUB_ENV, `HAS_CHANGED_FILES=false\n`);
    }

    // Set environment variables for file operations
    if (fileOperations.length > 0) {
      fs.appendFileSync(process.env.GITHUB_ENV, `HAS_FILE_OPERATIONS=true\n`);
      fs.appendFileSync(process.env.GITHUB_ENV, `FILE_OPERATIONS<<EOF\n${JSON.stringify(fileOperations)}\nEOF\n`);
    } else {
      fs.appendFileSync(process.env.GITHUB_ENV, `HAS_FILE_OPERATIONS=false\n`);
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.response) {
      console.error(`API response: ${JSON.stringify(error.response.data)}`);
    }
    fs.appendFileSync(process.env.GITHUB_ENV, `HAS_CHANGED_FILES=false\n`);
    process.exit(1);
  }
}

if (require.main === module) detectChanges();
