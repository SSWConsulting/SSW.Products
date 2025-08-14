const axios = require('axios');
const fs = require('fs');
const path = require('path');
const minimatch = require('minimatch');

/**
 * 处理文件删除和重命名操作，确保中文文件同步更新
 */
async function handleFileOperations() {
  try {
    const prNumber = process.env.PR_NUMBER;
    if (!prNumber) throw new Error('PR_NUMBER environment variable required');

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO = process.env.GITHUB_REPOSITORY;
    const [OWNER, REPO_NAME] = REPO.split('/');

    console.log(`Processing file operations for PR #${prNumber}...`);

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

    // 读取配置
    const config = JSON.parse(fs.readFileSync('.github/translation-config.json', 'utf8'));
    const { watchPaths, excludePaths, translationMapping } = config.projects.YakShaver;

    let hasFileOperations = false;

    // 处理删除的文件
    const deletedFiles = response.data.filter(file => file.status === 'removed');
    for (const file of deletedFiles) {
      const isWatched = watchPaths.some(pattern => minimatch(file.filename, pattern));
      const isExcluded = excludePaths.some(pattern => minimatch(file.filename, pattern));
      
      if (isWatched && !isExcluded) {
        console.log(`Processing deleted file: ${file.filename}`);
        const chineseFilePath = getTargetPath(file.filename, translationMapping);
        
        if (chineseFilePath && fs.existsSync(chineseFilePath)) {
          fs.unlinkSync(chineseFilePath);
          console.log(`Deleted corresponding Chinese file: ${chineseFilePath}`);
          hasFileOperations = true;
        }
      }
    }

    // 处理重命名的文件
    const renamedFiles = response.data.filter(file => file.status === 'renamed');
    for (const file of renamedFiles) {
      const isWatched = watchPaths.some(pattern => minimatch(file.filename, pattern));
      const isExcluded = excludePaths.some(pattern => minimatch(file.filename, pattern));
      
      if (isWatched && !isExcluded) {
        console.log(`Processing renamed file: ${file.previous_filename} -> ${file.filename}`);
        
        const oldChineseFilePath = getTargetPath(file.previous_filename, translationMapping);
        const newChineseFilePath = getTargetPath(file.filename, translationMapping);
        
        if (oldChineseFilePath && newChineseFilePath && fs.existsSync(oldChineseFilePath)) {
          // 确保目标目录存在
          const targetDir = path.dirname(newChineseFilePath);
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          
          // 移动文件
          fs.renameSync(oldChineseFilePath, newChineseFilePath);
          console.log(`Renamed Chinese file: ${oldChineseFilePath} -> ${newChineseFilePath}`);
          hasFileOperations = true;
        }
      }
    }

    // 设置环境变量
    if (hasFileOperations) {
      fs.appendFileSync(process.env.GITHUB_ENV, `HAS_FILE_OPERATIONS=true\n`);
    } else {
      fs.appendFileSync(process.env.GITHUB_ENV, `HAS_FILE_OPERATIONS=false\n`);
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.response) {
      console.error(`API response: ${JSON.stringify(error.response.data)}`);
    }
    fs.appendFileSync(process.env.GITHUB_ENV, `HAS_FILE_OPERATIONS=false\n`);
    process.exit(1);
  }
}

function getTargetPath(sourceFilePath, translationMapping) {
  for (const [englishPath, chinesePath] of Object.entries(translationMapping)) {
    if (sourceFilePath.startsWith(englishPath)) {
      return sourceFilePath.replace(englishPath, chinesePath);
    }
  }
  return null;
}

if (require.main === module) handleFileOperations();
