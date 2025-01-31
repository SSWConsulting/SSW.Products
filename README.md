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

### To add an extra tenant/ domain you must

1. Head to the [Vercel instance](https://vercel.com/tinacms/ssw-products/settings/environment-variables) of this project

2. Navigate to Settings | Environment Variables

3. Edit the `NEXT_PUBLIC_PRODUCT_LIST` adding an extra object into the JSON object 

Ex:
    `{"product": "YakShaver", "domain": "www.yakshaver.ai"}`

4. Head to the [Tina Cloud](https://app.tina.io/projects/fe0389d9-41bc-42e5-872d-ef8b293b8d0b/overview) instance of this project 

5. Under Overview | Site URLs, add the domain URL that you added to the Vercel environment variable

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
