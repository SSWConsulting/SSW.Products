This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

This project uses [TinaCMS](https://tina.io) and a custom [middleware](https://github.com/SSWConsulting/SSW.Products/blob/main/middleware.ts) that allows for a multi-domain architecture.

The purpose of this repository is to host the product pages for [SSW's](https://www.ssw.com.au) custom [software](https://www.ssw.com.au/products).

## Deployed Sites

**Note: Currently only the docs pages for TimePro are deployed. They are being proxied to the main app via [CloudFlare](https://github.com/SSWConsulting/SSW.Cloudflare).**

- [YakShaver (yakshaver.ai)](https://yakshaver.ai)
- [EagleEye (ssweagleeye.com)](https://ssweagleeye.com)
- [TimePro (sswtimepro.com)](https://sswtimepro.com/docs)

The `YakShaver` and `EagleEye` websites should be used as a guide for creating future product pages. 

###  Tina Branding 

`Tina` branding, e.g. 'Powered By Tina' should be included in the footers.
This is enabled by default, and can be configured in the respective `{product}-footer.json` files.


## Running this project locally?

1. Get access to the environment variables from Keeper

2. Paste the varables into your `.env` file

3. Ensure you set `DEFAULT_PRODUCT` environment variable to a valid product such as "YakShaver" or "TimePro"

4. Install Dependencies

```bash

pnpm install

```

3. Run the development server:

```bash

pnpm dev

```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

5. You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

> **Note**: We temporarily disabled the Visual Editing feature due to this [issue](https://github.com/SSWConsulting/SSW.Products/pull/33). To enable it, you can uncomment the `ui` section in `tina/collectionSchema/pages.tsx`.

### To add an extra tenant/ domain you must

1. Add project configuration to the `NEXT_PUBLIC_PRODUCT_LIST` environment variable in [Vercel](https://vercel.com/tinacms/ssw-products/settings/environment-variables). For example, `{"product": "YakShaver", "domain": "www.yakshaver.ai"}`

2. Add custom domain to the [Vercel](https://vercel.com/tinacms/ssw-products/settings/domains). Then follow the instructions to add the configuration to your domain provider.

### How does the MiddleWare work?

Context: Our file structure within our app router looks like

```bash
|- app
|   |- page.tsx
|   |- [product]
|          |- [filename]
|                  |- page.tsx
```

When the user serves the site a respective domain (i.e think www.YakShaver.ai), it will try to find a respective product mapping from the `NEXT_PUBLIC_PRODUCT_LIST`. If it successfully finds a product, it will fill the [product] dynamic mapping with the product value found from the `NEXT_PUBLIC_PRODUCT_LIST`. Then when it comes to serving data, our `page.tsx`
will use `relativePath: ${product}/home.json` using the specific product it found related to the domain.

This also means we have to set up the file structure for where we store our content. This is how we've organised our `content` structure;

```bash
|- content
      |- blogs
      |- footer
      ... other TinaCMS collections
      |- pages
           |- Product1
                 |- home.json
           |- Product2
                 |- home.json
```

Note in this instance Product1 and Product2 are just the product names such like [YakShaver](www.YakShaver.ai) or TimePro

## Algolia Search Indices


The search indices for the docs pages (e.g. `yakshaver.ai/docs`) are powered by Algolia, mearning that when changes are made to the docs, the search indices need to be rebuilt to reflect those changes.

This re-indexing is triggered automatically via GitHub Actions on pushes to `main` or manually via workflow dispatch.

For detailed instructions on how to rebuild the Algolia search indices, see [scripts/README.md](scripts/README.md).



## Wanting to use the Middleware for your own site?

We've documented how we use this middleware for our own sites and clients - [Do you know how to use single codebase for multiple domains with TinaCMS and Next.js?](https://www.ssw.com.au/rules/single-codebase-for-multiple-domains-with-tinacm-nextjs/)

## Updating the sitemap

If you are adding a new page using one of the existing [Tina collections](https://tina.io/docs/reference/collections) for the site, you do not need to update the sitemap as it will automatically include the new page.

If you are however adding a new collection for a page template you'll need to update the sitemap returned by `app/sitemap.xml/route.tsx` to include the new collection.

## 
