const fs = require('fs');
const path = require('path');

const OPERATIONS = {
  REMOVED: 'removed',
  RENAMED: 'renamed',
  COPIED: 'copied'
};

function loadConfig() {
  const config = JSON.parse(fs.readFileSync('.github/translation-config.json', 'utf8'));
  return config.projects.YakShaver.translationMapping;
}

function getChineseFilePath(sourceFilePath, translationMapping) {
  for (const [englishPath, chinesePath] of Object.entries(translationMapping)) {
    if (sourceFilePath.startsWith(englishPath)) {
      return sourceFilePath.replace(englishPath, chinesePath);
    }
  }
  return null;
}

function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function processOperation(operation, translationMapping) {
  const { operation: type, filename, previous_filename } = operation;
  
  switch (type) {
    case OPERATIONS.REMOVED: {
      const chineseFilePath = getChineseFilePath(filename, translationMapping);
      if (chineseFilePath && fs.existsSync(chineseFilePath)) {
        fs.unlinkSync(chineseFilePath);
        console.log(`Deleted: ${chineseFilePath}`);
        return true;
      }
      break;
    }
    
    case OPERATIONS.RENAMED: {
      const oldPath = getChineseFilePath(previous_filename, translationMapping);
      const newPath = getChineseFilePath(filename, translationMapping);
      
      if (oldPath && newPath && fs.existsSync(oldPath)) {
        ensureDirectoryExists(newPath);
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed: ${oldPath} -> ${newPath}`);
        return true;
      }
      break;
    }
    
    case OPERATIONS.COPIED: {
      const sourcePath = getChineseFilePath(previous_filename, translationMapping);
      const targetPath = getChineseFilePath(filename, translationMapping);
      
      if (sourcePath && targetPath && fs.existsSync(sourcePath)) {
        ensureDirectoryExists(targetPath);
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`Copied: ${sourcePath} -> ${targetPath}`);
        return true;
      }
      break;
    }
  }
  
  return false;
}

async function handleFileOperations() {
  try {
    const fileOperationsEnv = process.env.FILE_OPERATIONS;
    if (!fileOperationsEnv) {
      console.log('No file operations to process');
      fs.appendFileSync(process.env.GITHUB_ENV, `HAS_FILE_OPERATIONS=false\n`);
      return;
    }

    const translationMapping = loadConfig();
    const fileOperations = JSON.parse(fileOperationsEnv);
    
    console.log(`Processing ${fileOperations.length} file operations...`);
    
    const hasChanges = fileOperations
      .map(operation => processOperation(operation, translationMapping))
      .some(changed => changed);

    const status = hasChanges ? 'true' : 'false';
    fs.appendFileSync(process.env.GITHUB_ENV, `HAS_FILE_OPERATIONS=${status}\n`);
    console.log(hasChanges ? 'File operations completed' : 'No operations needed');
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    fs.appendFileSync(process.env.GITHUB_ENV, `HAS_FILE_OPERATIONS=false\n`);
    process.exit(1);
  }
}

if (require.main === module) handleFileOperations();