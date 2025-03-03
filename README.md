This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

This project uses [TinaCMS](https://tina.io) and a custom [middleware](https://github.com/SSWConsulting/SSW.Products/blob/main/middleware.ts) that allows for a multi-domain architecture.

The purpose of this repository is to host the product pages for [SSW's](https://www.ssw.com.au) custom [software](https://www.ssw.com.au/products).

## Running this project locally?

1. Copy `.env.example` to `.env`

2. Install Dependencies

```bash

yarn install

```

**Note for Windows**: Remove `TINA_PUBLIC_IS_LOCAL=true` from `package.json`, only keeping the `tinacms` command.

3. Run the development server:

```bash

yarn dev

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

## Wanting to use the Middleware for your own site?

We've documented how we use this middleware for our own sites and clients - [Do you know how to use single codebase for multiple domains with TinaCMS and Next.js?](https://www.ssw.com.au/rules/single-codebase-for-multiple-domains-with-tinacm-nextjs/)
