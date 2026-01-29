# Rebuild Algolia Search Indices

This script rebuilds the Algolia search indices for the documentation pages of each product defined in the `NEXT_PUBLIC_PRODUCT_LIST` environment variable.

## What it does

- Reads the product list from `NEXT_PUBLIC_PRODUCT_LIST` environment variable
- For each product, reads all MDX documentation files from `content/docs/<product>/`
- Extracts frontmatter (title) and converts markdown content to plain text
- Uploads the processed documentation to Algolia indices (e.g., `yakshaver_docs`, `timepro_docs`, `eagleeye_docs`)
- Configures index settings to create 10-word snippets of the body content with search term highlighting

Take the following example for instance:

```
content/
└── docs/
    ├── YakShaver/
    │   └── *.mdx
    ├── TimePro/
    │   └── *.mdx
    └── EagleEye/
        └── *.mdx
```

In this case, the script will create Algolia indices (`yakshaver_docs`, `timepro_docs`, `eagleeye_docs`) containing all the documentation files for each product, provided they are defined in the `NEXT_PUBLIC_PRODUCT_LIST` environment variable.

## Prerequisites

- Node.js (see `.nvmrc` file for version)
- pnpm

## Setup

1. **Environment Variables**

   Create a `.env` file in the project root (see Keeper for values):

   ```env
   ALGOLIA_APP_ID=***
   ALGOLIA_API_KEY=***
   NEXT_PUBLIC_PRODUCT_LIST=***
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   ```


2. **Run the Script**

   ```bash
   pnpm rebuild-search-indices
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
