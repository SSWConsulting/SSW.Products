const axios = require('axios');
const fs = require('fs');

function validateEnvironment() {
  const required = ['GITHUB_TOKEN', 'PR_NUMBER', 'BRANCH_NAME', 'REPO'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
  
  const [owner, repoName] = process.env.REPO.split('/');
  if (!owner || !repoName) {
    throw new Error('Invalid REPO format');
  }
  
  return {
    token: process.env.GITHUB_TOKEN,
    prNumber: process.env.PR_NUMBER,
    branchName: process.env.BRANCH_NAME,
    owner,
    repoName,
    serverUrl: process.env.GITHUB_SERVER_URL || 'https://github.com'
  };
}

function generatePRContent(prNumber, repo, serverUrl) {
  const title = `🤖 Auto Translation: PR #${prNumber}`;
  const body = `🤖 Automated Chinese translation for PR #${prNumber}

Original PR: ${serverUrl}/${repo}/pull/${prNumber}

⚠️ AI-generated content - please review before merging`;

  return { title, body };
}

async function makeRequest(url, data, token) {
  return axios.post(url, data, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
}

async function addLabels(owner, repoName, prNumber, token) {
  try {
    await makeRequest(
      `https://api.github.com/repos/${owner}/${repoName}/issues/${prNumber}/labels`,
      { labels: ['Auto-Translation', 'YakShaver'] },
      token
    );
    console.log(`Added labels to PR #${prNumber}`);
  } catch (error) {
    console.warn(`Warning: Failed to add labels: ${error.message}`);
  }
}

function writeOutput(prNumber, prUrl) {
  const githubOutput = process.env.GITHUB_OUTPUT;
  if (githubOutput) {
    fs.appendFileSync(githubOutput, `translation_pr_number=${prNumber}\n`);
    fs.appendFileSync(githubOutput, `translation_pr_url=${prUrl}\n`);
  }
}

async function createPullRequest() {
  try {
    const { token, prNumber, branchName, owner, repoName, serverUrl } = validateEnvironment();
    const { title, body } = generatePRContent(prNumber, process.env.REPO, serverUrl);
    
    const response = await makeRequest(
      `https://api.github.com/repos/${owner}/${repoName}/pulls`,
      { title, body, head: branchName, base: 'main' },
      token
    );

    const { number, html_url } = response.data;
    console.log(`Successfully created PR #${number}: ${html_url}`);
    
    writeOutput(number, html_url);
    await addLabels(owner, repoName, number, token);
    
    return response.data;
  } catch (error) {
    console.error(`Error creating pull request: ${error.message}`);
    if (error.response) {
      console.error(`API response: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

async function main() {
  try {
    await createPullRequest();
  } catch (error) {
    console.error(`Failed to create pull request: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) main();