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

    // 获取 PR 文件变更
    const response = await axios.get(
      `https://api.github.com/repos/${OWNER}/${REPO_NAME}/pulls/${prNumber}/files`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    // 读取配置来过滤文件
    const config = JSON.parse(fs.readFileSync('.github/translation-config.json', 'utf8'));
    const { watchPaths, excludePaths } = config.projects.YakShaver;

    // 过滤符合条件的文件，只处理添加或修改的文件
    const relevantFiles = response.data
      .filter(file => {
        // 只处理添加或修改的文件，跳过删除和重命名的文件
        if (file.status === 'removed') {
          console.log(`Skipping deleted file: ${file.filename}`);
          return false;
        }
        
        // 对于重命名的文件，使用新文件名
        const fileToCheck = file.status === 'renamed' ? file.filename : file.filename;
        
        const isWatched = watchPaths.some(pattern => minimatch(fileToCheck, pattern));
        const isExcluded = excludePaths.some(pattern => minimatch(fileToCheck, pattern));
        
        if (file.status === 'renamed') {
          console.log(`File renamed: ${file.previous_filename} -> ${file.filename}`);
        }
        
        return isWatched && !isExcluded;
      })
      .map(file => file.filename);

    console.log(`Found ${relevantFiles.length} relevant files for translation`);

    if (relevantFiles.length > 0) {
      // 设置环境变量供后续步骤使用 (TinaCMS 模式)
      fs.appendFileSync(process.env.GITHUB_ENV, `HAS_CHANGED_FILES=true\n`);
      fs.appendFileSync(process.env.GITHUB_ENV, `CHANGED_FILES<<EOF\n${relevantFiles.join('\n')}\nEOF\n`);
    } else {
      fs.appendFileSync(process.env.GITHUB_ENV, `HAS_CHANGED_FILES=false\n`);
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
