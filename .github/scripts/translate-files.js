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

const countFrontmatterDelimiters = (text) => ((text || '').match(/^---[ \t]*$/gm) || []).length;

// Structural corruption is the failure mode that survives review unnoticed,
// so verify the translation still parses as whatever the source claimed to be.
function validateStructure(content, targetPath, source) {
  if (targetPath.endsWith('.json')) {
    try {
      JSON.parse(content);
    } catch (error) {
      throw new Error(`translation is not valid JSON: ${error.message}`);
    }
  }

  if (targetPath.endsWith('.mdx')) {
    // Frontmatter is the block between a pair of --- delimiters. Dropping
    // either one leaves valid-looking text that Tina parses as a document
    // with no fields at all, which is how the Chinese docs sidebar sat empty
    // for six weeks.

    // Position first: the count can match while the frontmatter is still
    // unreachable, because a preface ahead of it ("Here is the translation:")
    // means Tina no longer sees the file as starting with frontmatter. Models
    // volunteer that kind of wrapper often enough that stripCodeFence exists
    // for the same reason.
    const startsWithFrontmatter = (text) => /^---[ \t]*\r?\n/.test(text || '');

    if (startsWithFrontmatter(source) && !startsWithFrontmatter(content)) {
      throw new Error(
        'frontmatter no longer starts the file; the model likely added a preface'
      );
    }

    // Then the count, which catches a delimiter dropped from either end.
    // Compare against the source rather than assuming two: files with a ---
    // rule in the body legitimately have more.
    const expected = countFrontmatterDelimiters(source);
    const actual = countFrontmatterDelimiters(content);

    if (actual !== expected) {
      throw new Error(
        `frontmatter delimiters changed: source has ${expected}, translation has ${actual}`
      );
    }
  }
}

// Content files reference each other by repo path (toc.mdx slugs, for
// example). Those paths must be remapped to the translated tree, but models
// tend to "translate" them back to the English original instead. The result
// still parses, so nothing else catches it: the Chinese sidebar silently
// links to English docs.
function remapInternalPaths(content, translationMapping) {
  let result = content;

  for (const [englishPath, chinesePath] of Object.entries(translationMapping)) {
    // Rewrite only references that kept the English path, so any the model
    // already mapped correctly are left alone.
    const stale = new RegExp(
      `${englishPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?!${chinesePath.slice(englishPath.length)})`,
      'g'
    );
    result = result.replace(stale, chinesePath);
  }

  return result;
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
    const translatedContent = remapInternalPaths(stripCodeFence(raw), translationMapping);

    validateStructure(translatedContent, targetPath, content);

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