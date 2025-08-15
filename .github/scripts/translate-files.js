const fs = require('fs');
const path = require('path');
const { AzureOpenAI } = require('openai');
const { applyLinkReplacements } = require('./process-links');

function loadConfig() {
  const config = JSON.parse(fs.readFileSync('.github/translation-config.json', 'utf8'));
  return {
    ...config.projects.YakShaver,
    azure: config.azure
  };
}

function validateEnvironment() {
  const required = ['AZURE_OPENAI_ENDPOINT', 'AZURE_OPENAI_API_KEY', 'AZURE_OPENAI_DEPLOYMENT_NAME'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
  
  return {
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
    apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-04-01-preview'
  };
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

async function translateContent(content, translationPrompt, client, azure, deploymentName) {
  const userPrompt = translationPrompt.user.replace('{content}', content);
  
  const response = await client.chat.completions.create({
    messages: [
      { role: 'system', content: translationPrompt.system },
      { role: 'user', content: userPrompt }
    ],
    max_tokens: azure.maxTokens,
    temperature: azure.temperature,
    model: deploymentName
  });

  return response.choices[0].message.content.trim();
}

async function processFile(filePath, config, client, deploymentName) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { translationPrompt, translationMapping, azure } = config;
    
    const targetPath = getChineseFilePath(filePath, translationMapping);
    if (!targetPath) {
      console.warn(`No translation mapping found for: ${filePath}`);
      return null;
    }

    const translatedContent = await translateContent(content, translationPrompt, client, azure, deploymentName);
    
    // Apply link replacements to the translated content
    const processedContent = applyLinkReplacements(translatedContent);
    
    ensureDirectoryExists(targetPath);
    fs.writeFileSync(targetPath, processedContent, 'utf8');
    console.log(`Translated: ${filePath} -> ${targetPath}`);
    
    return targetPath;
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
    return null;
  }
}

async function main() {
  try {
    const changedFiles = process.env.CHANGED_FILES?.split('\n').filter(f => f.trim()) || [];
    
    if (changedFiles.length === 0) {
      console.log('No files to translate');
      return;
    }

    console.log(`Processing ${changedFiles.length} files...`);
    
    const config = loadConfig();
    const { endpoint, apiKey, deploymentName, apiVersion } = validateEnvironment();
    
    const client = new AzureOpenAI({
      endpoint,
      apiKey,
      deployment: deploymentName,
      apiVersion
    });

    const results = await Promise.allSettled(
      changedFiles.map(file => processFile(file, config, client, deploymentName))
    );
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
    console.log(`Successfully translated ${successful}/${changedFiles.length} files`);
    
  } catch (error) {
    console.error(`Translation failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) main();