const fs = require('fs');
const path = require('path');

const applyLinkReplacements = content => content
  .replace(/(\[[^\]]*\]\()(\/)(?!zh\/)([^)]*)\)/g, '$1/zh/$3)')
  .replace(/(content\/[^\/]+\/YakShaver\/)(?!zh\/)([^\s\n]*)/g, '$1zh/$2');

const getAllFiles = dir => {
  if (!fs.existsSync(dir)) return [];
  
  return fs.readdirSync(dir, { withFileTypes: true })
    .flatMap(item => {
      const fullPath = path.join(dir, item.name);
      return item.isDirectory() 
        ? getAllFiles(fullPath)
        : item.name.match(/\.(mdx|json)$/) ? [fullPath] : [];
    });
};

const processFile = filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const processed = applyLinkReplacements(content);
  
  if (content !== processed) {
    fs.writeFileSync(filePath, processed, 'utf8');
    console.log(`Processed: ${filePath}`);
    return true;
  }
  return false;
};

const main = () => {
  const config = JSON.parse(fs.readFileSync('.github/translation-config.json', 'utf8')).projects.YakShaver;
  const files = Object.values(config.translationMapping).flatMap(getAllFiles);
  
  if (!files.length) {
    console.log('No files to process');
    return;
  }
  
  const processed = files.filter(processFile).length;
  console.log(`Processed ${processed}/${files.length} files`);
};

if (require.main === module) main();

module.exports = { applyLinkReplacements };