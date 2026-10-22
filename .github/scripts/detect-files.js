const axios = require('axios');
const fs = require('fs');
const minimatch = require('minimatch');

const FILE_STATUS = {
  REMOVED: 'removed',
  RENAMED: 'renamed', 
  COPIED: 'copied'
};

function validateEnvironment() {
  const prNumber = process.env.PR_NUMBER;
  if (!prNumber) throw new Error('PR_NUMBER environment variable required');

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) throw new Error('GITHUB_TOKEN environment variable required');

  const repository = process.env.GITHUB_REPOSITORY;
  if (!repository) throw new Error('GITHUB_REPOSITORY environment variable required');

  const [owner, repoName] = repository.split('/');
  if (!owner || !repoName) {
    throw new Error(`Invalid GITHUB_REPOSITORY format: ${repository}`);
  }

  return { prNumber, githubToken, owner, repoName };
}

function loadConfig() {
  const config = JSON.parse(fs.readFileSync('.github/translation-config.json', 'utf8'));
  return config.projects.YakShaver;
}

async function fetchPRFiles(owner, repoName, prNumber, githubToken) {
  let allFiles = [];
  let page = 1;
  const perPage = 100; // GitHub API maximum per page
  
  while (true) {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repoName}/pulls/${prNumber}/files`,
      {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
        params: {
          page: page,
          per_page: perPage
        }
      }
    );
    
    const files = response.data;
    allFiles = allFiles.concat(files);
    
    if (files.length < perPage) {
      break;
    }
    
    page++;
  }
  
  console.log(`Fetched ${allFiles.length} files from PR #${prNumber}`);
  return allFiles;
}

function shouldProcessFile(filename, watchPaths, excludePaths) {
  const isWatched = watchPaths.some(pattern => minimatch(filename, pattern));
  const isExcluded = excludePaths.some(pattern => minimatch(filename, pattern));
  return isWatched && !isExcluded;
}

function processFileChange(file, fileOperations, contentFiles) {
  const { status, filename, previous_filename } = file;
  
  switch (status) {
    case FILE_STATUS.REMOVED:
      console.log(`File deleted: ${filename}`);
      fileOperations.push({ operation: status, filename });
      break;
      
    case FILE_STATUS.RENAMED:
      console.log(`File renamed: ${previous_filename} -> ${filename}`);
      fileOperations.push({ operation: status, previous_filename, filename });
      contentFiles.push(filename);
      break;
      
    case FILE_STATUS.COPIED:
      console.log(`File copied: ${previous_filename} -> ${filename}`);
      fileOperations.push({ operation: status, previous_filename, filename });
      contentFiles.push(filename);
      break;
      
    default:
      contentFiles.push(filename);
      break;
  }
}

function writeEnvironmentVariables(contentFiles, fileOperations) {
  const githubEnv = process.env.GITHUB_ENV;

  if (contentFiles.length > 0) {
    fs.appendFileSync(githubEnv, `HAS_CHANGED_FILES=true\n`);
    fs.appendFileSync(githubEnv, `CHANGED_FILES<<EOF\n${contentFiles.join('\n')}\nEOF\n`);
  } else {
    fs.appendFileSync(githubEnv, `HAS_CHANGED_FILES=false\n`);
  }

  if (fileOperations.length > 0) {
    fs.appendFileSync(githubEnv, `HAS_FILE_OPERATIONS=true\n`);
    fs.appendFileSync(githubEnv, `FILE_OPERATIONS<<EOF\n${JSON.stringify(fileOperations)}\nEOF\n`);
  } else {
    fs.appendFileSync(githubEnv, `HAS_FILE_OPERATIONS=false\n`);
  }
}

async function detectChanges() {
  try {
    // Env
    const { prNumber, githubToken, owner, repoName } = validateEnvironment();

    // Manual Config
    const { watchPaths, excludePaths } = loadConfig();
    
    console.log(`Fetching PR #${prNumber} files from GitHub API...`);

    // Fetch changed files via GitHub API
    const files = await fetchPRFiles(owner, repoName, prNumber, githubToken);
    
    const fileOperations = [];
    const contentFiles = [];
    
    files
      .filter(file => shouldProcessFile(file.filename, watchPaths, excludePaths))
      .forEach(file => processFileChange(file, fileOperations, contentFiles));
    
    console.log(`Found ${contentFiles.length} files for translation`);
    console.log(`Found ${fileOperations.length} files for other operations`);

    writeEnvironmentVariables(contentFiles, fileOperations);
    
  } catch (error) {
    // Deliberately does not fall back to HAS_*=false. Rethrowing fails this
    // step, which skips the gated steps anyway; writing the flags first would
    // only make a detection failure look like "nothing to translate".
    console.error(`::error::Failed to detect changed files: ${error.message}`);
    throw error;
  }
}

if (require.main === module) {
  detectChanges().catch(() => process.exit(1));
}
