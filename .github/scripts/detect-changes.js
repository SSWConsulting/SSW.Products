const axios = require('axios');
const fs = require('fs');

async function detectChanges() {
  try {
    const prNumber = process.env.PR_NUMBER;
    if (!prNumber) throw new Error('PR_NUMBER environment variable required');

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO = process.env.GITHUB_REPOSITORY;
    const [OWNER, REPO_NAME] = REPO.split('/');

    console.log(`Fetching PR #${prNumber} files from GitHub API...`);

    const response = await axios.get(
      `https://api.github.com/repos/${OWNER}/${REPO_NAME}/pulls/${prNumber}/files`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    const prResponse = await axios.get(
      `https://api.github.com/repos/${OWNER}/${REPO_NAME}/pulls/${prNumber}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    const prInfo = {
      number: prResponse.data.number,
      title: prResponse.data.title,
      url: prResponse.data.html_url,
      merged: prResponse.data.merged
    };

    const fileChanges = response.data.map(file => ({
      path: file.filename,
      status: file.status === 'added' ? 'added' : 
              file.status === 'removed' ? 'deleted' : 'modified',
      additions: file.additions,
      deletions: file.deletions
    }));

    const result = { pr: prInfo, changes: fileChanges };
    fs.writeFileSync('.github/temp-changes.json', JSON.stringify(result, null, 2));
    
    console.log(`Detected ${fileChanges.length} file changes for PR #${prNumber}`);
    console.log('Changed files:', fileChanges.map(f => `${f.path} (${f.status})`));
    
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, 'changes_detected=true\n');
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.response) {
      console.error(`API response: ${JSON.stringify(error.response.data)}`);
    }
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, 'changes_detected=false\n');
    }
    process.exit(1);
  }
}

if (require.main === module) detectChanges();
