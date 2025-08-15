const axios = require('axios');
const fs = require('fs');
const path = require('path');
const minimatch = require('minimatch');

/**
 * 处理文件删除、重命名和复制操作，确保中文文件同步更新
 */
async function handleFileOperations() {
  try {
    const prNumber = process.env.PR_NUMBER;
    if (!prNumber) throw new Error('PR_NUMBER environment variable required');

    console.log(`Processing file operations for PR #${prNumber}...`);

    // 读取配置
    const config = JSON.parse(fs.readFileSync('.github/translation-config.json', 'utf8'));
    const { translationMapping } = config.projects.YakShaver;

    let hasFileOperations = false;

    // 从环境变量中读取文件操作信息
    const fileOperationsEnv = process.env.FILE_OPERATIONS;
    if (!fileOperationsEnv) {
      console.log('No file operations to process');
      fs.appendFileSync(process.env.GITHUB_ENV, `HAS_FILE_OPERATIONS=false\n`);
      return;
    }

    const fileOperations = JSON.parse(fileOperationsEnv);
    console.log(`Found ${fileOperations.length} file operations to process`);

    for (const operation of fileOperations) {
      if (operation.operation === 'removed') {
        console.log(`Processing deleted file: ${operation.filename}`);
        const chineseFilePath = getTargetPath(operation.filename, translationMapping);
        
        if (chineseFilePath && fs.existsSync(chineseFilePath)) {
          fs.unlinkSync(chineseFilePath);
          console.log(`Deleted corresponding Chinese file: ${chineseFilePath}`);
          hasFileOperations = true;
        }
      } else if (operation.operation === 'renamed') {
        console.log(`Processing renamed file: ${operation.previous_filename} -> ${operation.filename}`);
        
        const oldChineseFilePath = getTargetPath(operation.previous_filename, translationMapping);
        const newChineseFilePath = getTargetPath(operation.filename, translationMapping);
        
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
      } else if (operation.operation === 'copied') {
        console.log(`Processing copied file: ${operation.previous_filename} -> ${operation.filename}`);
        
        const sourceChineseFilePath = getTargetPath(operation.previous_filename, translationMapping);
        const targetChineseFilePath = getTargetPath(operation.filename, translationMapping);
        
        if (sourceChineseFilePath && targetChineseFilePath && fs.existsSync(sourceChineseFilePath)) {
          // 确保目标目录存在
          const targetDir = path.dirname(targetChineseFilePath);
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          
          // 复制文件
          fs.copyFileSync(sourceChineseFilePath, targetChineseFilePath);
          console.log(`Copied Chinese file: ${sourceChineseFilePath} -> ${targetChineseFilePath}`);
          hasFileOperations = true;
        }
      }
    }

    // 更新环境变量
    if (hasFileOperations) {
      fs.appendFileSync(process.env.GITHUB_ENV, `HAS_FILE_OPERATIONS=true\n`);
      console.log('File operations completed successfully');
    } else {
      fs.appendFileSync(process.env.GITHUB_ENV, `HAS_FILE_OPERATIONS=false\n`);
      console.log('No file operations were needed');
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
