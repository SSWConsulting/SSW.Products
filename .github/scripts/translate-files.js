const fs = require('fs');
const { AzureOpenAI } = require('openai');

async function translateFiles() {
  try {
    const config = JSON.parse(fs.readFileSync('.github/translation-config.json', 'utf8'));
    const filteredData = JSON.parse(fs.readFileSync('.github/temp-filtered.json', 'utf8'));

    if (filteredData.filesToTranslate.length === 0) {
      if (process.env.GITHUB_OUTPUT) {
        fs.appendFileSync(process.env.GITHUB_OUTPUT, 'translation_completed=false\n');
      }
      return;
    }

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

    const { azure, projects: { YakShaver: { translationPrompt } } } = config;
    const translatedFiles = [];

    console.log(`Translating ${filteredData.filesToTranslate.length} files`);

    for (const fileChange of filteredData.filesToTranslate) {
      try {
        const fileContent = fs.readFileSync(fileChange.path, 'utf8');
        const userPrompt = translationPrompt.user.replace('{content}', fileContent);
        
        console.log(`Translating: ${fileChange.path}`);
        const response = await client.chat.completions.create({
          messages: [
            { role: 'system', content: translationPrompt.system },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: azure.maxTokens,
          temperature: azure.temperature,
          model: AZURE_OPENAI_DEPLOYMENT_NAME
        });

        translatedFiles.push({
          originalPath: fileChange.path,
          translatedContent: response.choices[0].message.content,
          status: fileChange.status
        });

      } catch (error) {
        console.error(`Failed to translate ${fileChange.path}: ${error.message}`);
      }
    }

    const result = {
      originalPr: filteredData.originalPr,
      translatedFiles,
      translationCompleted: translatedFiles.length > 0
    };

    fs.writeFileSync('.github/temp-translations.json', JSON.stringify(result));

    console.log(`Translated ${translatedFiles.length} files`);
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `translation_completed=${result.translationCompleted}\n`);
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, 'translation_completed=false\n');
    }
    process.exit(1);
  }
}

if (require.main === module) translateFiles();
