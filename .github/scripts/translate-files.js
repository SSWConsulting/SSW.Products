const fs = require('fs');
const axios = require('axios');

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
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview';

    if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_API_KEY || !AZURE_OPENAI_DEPLOYMENT_NAME) {
      throw new Error('Azure OpenAI environment variables missing');
    }

    const { azure, projects: { YakShaver: { translationPrompt } } } = config;
    const translatedFiles = [];

    console.log(`Translating ${filteredData.filesToTranslate.length} files`);

    for (const fileChange of filteredData.filesToTranslate) {
      try {
        const fileContent = fs.readFileSync(fileChange.path, 'utf8');
        const userPrompt = translationPrompt.user.replace('{content}', fileContent);
        
        const deploymentName = encodeURIComponent(AZURE_OPENAI_DEPLOYMENT_NAME);
        const apiUrl = `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;
        console.log(`Deployment name: ${AZURE_OPENAI_DEPLOYMENT_NAME}`);
        console.log(`Calling API: ${apiUrl}`);
        const response = await axios.post(
          apiUrl,
          {
            messages: [
              { role: 'system', content: translationPrompt.system },
              { role: 'user', content: userPrompt }
            ],
            max_tokens: azure.maxTokens,
            temperature: azure.temperature,
            model: azure.model
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'api-key': AZURE_OPENAI_API_KEY
            }
          }
        );

        translatedFiles.push({
          originalPath: fileChange.path,
          translatedContent: response.data.choices[0].message.content,
          status: fileChange.status
        });

      } catch (error) {
        console.error(`Failed to translate ${fileChange.path}:`);
        console.error(`Error: ${error.message}`);
        if (error.response) {
          console.error(`Status: ${error.response.status}`);
          console.error(`Response: ${JSON.stringify(error.response.data, null, 2)}`);
        }
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