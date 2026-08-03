const fs = require('fs');
const path = require('path');
const { AzureOpenAI } = require('openai');

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

  const choice = response.choices[0];

  // A truncated response still arrives as a normal 200 with a partial body.
  // Writing it would silently commit a half-finished file, so treat it as fatal.
  if (choice.finish_reason === 'length') {
    throw new Error(
      `output truncated at max_tokens=${azure.maxTokens}; file is too large to translate in a single request`
    );
  }

  const translated = choice.message.content;
  if (!translated || !translated.trim()) {
    throw new Error('model returned empty content');
  }

  return translated.trim();
}

// The prompt asks for raw content, but models routinely wrap output in a
// markdown fence anyway. Strip one if it wraps the entire response.
function stripCodeFence(text) {
  const fenced = text.match(/^```[^\n]*\n([\s\S]*?)\n?```$/);
  return fenced ? fenced[1].trim() : text;
}

// Structural corruption is the failure mode that survives review unnoticed,
// so verify the translation still parses as whatever the source claimed to be.
function validateStructure(content, targetPath) {
  if (targetPath.endsWith('.json')) {
    try {
      JSON.parse(content);
    } catch (error) {
      throw new Error(`translation is not valid JSON: ${error.message}`);
    }
  }
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

    const raw = await translateContent(content, translationPrompt, client, azure, deploymentName);
    const translatedContent = stripCodeFence(raw);

    validateStructure(translatedContent, targetPath);

    ensureDirectoryExists(targetPath);
    fs.writeFileSync(targetPath, translatedContent, 'utf8');
    console.log(`Translated: ${filePath} -> ${targetPath}`);

    return targetPath;
  } catch (error) {
    // Surfaced per-file so one bad file names itself in the log, then
    // rethrown so main() can fail the job rather than commit a partial set.
    console.error(`::error file=${filePath}::${error.message}`);
    throw error;
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
      apiVersion,
      maxRetries: 3
    });

    const results = await Promise.allSettled(
      changedFiles.map(file => processFile(file, config, client, deploymentName))
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
    const skipped = results.filter(r => r.status === 'fulfilled' && !r.value).length;
    // Pair each result with its file before filtering, so the index still maps.
    const failed = results
      .map((result, i) => ({ result, file: changedFiles[i] }))
      .filter(({ result }) => result.status === 'rejected');

    console.log(`Translated ${successful}/${changedFiles.length} files`);
    if (skipped > 0) {
      console.log(`Skipped ${skipped} file(s) with no translation mapping`);
    }

    // Committing a partial set would open a PR that looks complete but silently
    // omits files, so any failure fails the job and skips the commit step.
    if (failed.length > 0) {
      failed.forEach(({ result, file }) => console.error(`  - ${file}: ${result.reason.message}`));
      throw new Error(`${failed.length}/${changedFiles.length} file(s) failed to translate`);
    }

  } catch (error) {
    console.error(`Translation failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) main();