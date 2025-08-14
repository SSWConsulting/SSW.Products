const fs = require('fs');
const path = require('path');
const { AzureOpenAI } = require('openai');

// 按照 TinaCMS 模式从环境变量获取文件列表
const CHANGED_FILES = process.env.CHANGED_FILES?.split('\n').filter(f => f.trim()) || [];

function getTargetPath(sourceFilePath, translationMapping) {
  for (const [englishPath, chinesePath] of Object.entries(translationMapping)) {
    if (sourceFilePath.startsWith(englishPath)) {
      return sourceFilePath.replace(englishPath, chinesePath);
    }
  }
  return null;
}

async function translateFile(filePath, config, client) {
  console.log(`Processing file: ${filePath}`);

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { translationPrompt, translationMapping } = config.projects.YakShaver;
    const { azure } = config;

    // 翻译内容
    const userPrompt = translationPrompt.user.replace('{content}', content);
    const response = await client.chat.completions.create({
      messages: [
        { role: 'system', content: translationPrompt.system },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: azure.maxTokens,
      temperature: azure.temperature,
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME
    });

    const translatedContent = response.choices[0].message.content.trim();

    // 确定目标路径
    const targetPath = getTargetPath(filePath, translationMapping);
    if (!targetPath) {
      console.warn(`No translation mapping found for: ${filePath}`);
      return null;
    }

    // 创建目录并写入文件
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(targetPath, translatedContent, 'utf8');
    console.log(`Translated and saved to: ${targetPath}`);

    return targetPath;
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
    if (error.response) {
      console.error(`API response: ${JSON.stringify(error.response.data)}`);
    }
    return null;
  }
}

async function main() {
  try {
    if (CHANGED_FILES.length === 0) {
      console.log('No files to translate');
      return;
    }

    console.log(`Processing ${CHANGED_FILES.length} changed files`);

    // 读取配置
    const config = JSON.parse(fs.readFileSync('.github/translation-config.json', 'utf8'));

    // 初始化 Azure OpenAI 客户端
    const { AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT_NAME } = process.env;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-04-01-preview';

    if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_API_KEY || !AZURE_OPENAI_DEPLOYMENT_NAME) {
      throw new Error('Azure OpenAI environment variables missing');
    }

    const client = new AzureOpenAI({
      endpoint: AZURE_OPENAI_ENDPOINT,
      apiKey: AZURE_OPENAI_API_KEY,
      deployment: AZURE_OPENAI_DEPLOYMENT_NAME,
      apiVersion: apiVersion
    });

    // 翻译所有文件
    const translatedFiles = [];

    for (const file of CHANGED_FILES) {
      const translatedFile = await translateFile(file, config, client);
      if (translatedFile) {
        translatedFiles.push(translatedFile);
      }
    }

    if (translatedFiles.length > 0) {
      console.log(`Successfully translated ${translatedFiles.length} files.`);
    } else {
      console.log('No files were translated.');
    }

  } catch (error) {
    console.error('Translation process failed:', error);
    process.exit(1);
  }
}

if (require.main === module) main();
