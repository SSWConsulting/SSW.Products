# Rebuild Algolia Search Indices

This script rebuilds the Algolia search indices for the documentation pages of each product defined in the `NEXT_PUBLIC_PRODUCT_LIST` environment variable.


## What it does


- Reads the product list from `NEXT_PUBLIC_PRODUCT_LIST` environment variable
- For each product, reads all MDX documentation files from `content/docs/<product>/`
- Extracts frontmatter (title) and converts markdown content to plain text
- Uploads the processed documentation to Algolia indices (e.g., `yakshaver_docs`, `timepro_docs`, `eagleeye_docs`)
- Configures index settings to create 10-word snippets of the body content with search term highlighting

Take The following example for instance:

```
content/
  docs/
    YakShaver/
      *.mdx
```

In this case, the script will create an Algolia index named `yakshaver_docs` containing all the documentation files for the YakShaver product, provided that product is defined in the `NEXT_PUBLIC_PRODUCT_LIST` environment variable.

## Documentation File Structure



Each product in `NEXT_PUBLIC_PRODUCT_LIST` should have a corresponding folder under `content/docs/` containing its MDX documentation files. The script will automatically discover and index all `.mdx` files in each product's folder.

## Prerequisites

- Node.js v22.13.1 (see `.nvmrc`)
- pnpm 9.6.0 package manager
- Algolia account with write access

## Setup

1. **Environment Variables**

   Create a `.env` file in the project root with:

   ```env
   ALGOLIA_APP_ID=your_app_id
   ALGOLIA_API_KEY=your_admin_api_key
   NEXT_PUBLIC_PRODUCT_LIST='[{"product": "YakShaver", "domain": "tenant1.yakshaver.ai"}, {"product": "TimePro", "domain": "sswtimepro.com"}]'
   ```

   ⚠️ **Important**: Use the **Admin API Key** (not the Search API Key) as this script needs write permissions to create and update indices.

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

## Running the Script

### Using pnpm script (recommended)

```bash
pnpm rebuild-search-indices
```

This command:
1. Compiles the TypeScript file (`scripts/createIndices.ts`) to JavaScript
2. Runs the compiled script (`scripts/createIndices.js`)

### Manually

```bash
# Compile TypeScript
tsc --project ./scripts/tsconfig.json

# Run the compiled script
node ./scripts/createIndices.js
```

## Output

The script will show progress for each product index:

```
Rebuilding index: yakshaver_docs (5 documents)
✅ Index yakshaver_docs rebuilt successfully
Rebuilding index: timepro_docs (8 documents)
✅ Index timepro_docs rebuilt successfully
Rebuilding index: eagleeye_docs (3 documents)
✅ Index eagleeye_docs rebuilt successfully
Indices created successfully
```


## GitHub Actions

This script runs automatically via GitHub Actions in two ways:

### 1. Automatic (Push to branch)
- Triggers on pushes to the `main` branch
- Automatically rebuilds all search indices with the latest documentation

### 2. Manual (Workflow Dispatch)
- Go to **Actions** → **"Rebuild Algolia Search Indices"** → **"Run workflow"**
- Select which branch to run from (uses documentation from that branch)
- Useful for testing index changes before merging to main

**Configuration:**
- Workflow file: `.github/workflows/rebuild-search-indices.yml`
- Required GitHub Secrets:
  - `ALGOLIA_APP_ID`
  - `ALGOLIA_API_KEY`
- Required GitHub Variables:
  - `NEXT_PUBLIC_PRODUCT_LIST`

To set these up:
1. Go to your repository **Settings** → **Secrets and variables** → **Actions**
2. Add secrets in the **Secrets** tab
3. Add variables in the **Variables** tab
