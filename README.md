# Notion Next.js Mini Kit

This repository contains a mini kit for integrating Notion API with Next.js. This kit provides a simple and efficient way to connect your Next.js applications with Notion to access and display data.

## Features

- Seamless integration of Notion API with Next.js
- Easy setup and configuration
- Flexible customization options
- Lightweight and performant
- Revalidate path for static generation
- Renders Notion blocks straight from the official API — syntax-highlighted code blocks (Shiki) and Mermaid diagrams included
- Click-to-reveal answers via Notion toggles titled `[answer]` (Q&A / solutions posts)
- SEO out of the box: sitemap, robots.txt, RSS feed, JSON-LD article schema, and auto-generated OG images per post

## Tech Stack

- Next.js: version 14x
- Notion API

## Library
- [@notionhq/client](https://www.npmjs.com/package/@notionhq/client): official Notion API client — also powers the block renderer (no unofficial/undocumented endpoints)
- [Shiki](https://shiki.style/): syntax highlighting for code blocks
- [Mermaid](https://mermaid.js.org/): diagrams from ` ```mermaid ` code blocks
- [Headlessui](https://headlessui.com/): UI components, designed to integrate beautifully with Tailwind CSS
  

## Full Steps to Setup
- English: [Guide to building a personal blog with Next.js and Notion
](https://www.lexuankha.com/blog/guide-to-building-a-personal-blog-with-next-js-and-notion)
- Vietnamese: [Hướng dẫn xây dựng blog cá nhân với NextJs và Notion](https://viblo.asia/p/huong-dan-xay-dung-blog-ca-nhan-voi-nextjs-va-notion-WR5JRZjQJGv)


## Installation

To get started with the Notion Next.js Mini Kit, follow these steps:
    
Clone the repository:
```
git clone https://github.com/khaaleoo/notion-nextjs-mini-kit.git
```    

Install dependencies:
```
cd notion-nextjs-mini-kit
pnpm install
```

Copy the content in .env.sample to your .env or .env.local

Run the project
```
pnpm dev
```


### Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NOTION_TOKEN`

`NOTION_DATABASE_ID`


### Revalidating Static Pages

To revalidate static pages, access the following endpoint:

https://yourdomain/api/revalidate?path=/yourpath&secret=yoursecret

### Click-to-reveal answers (`[answer]` toggles)

For Q&A or solutions posts, hide answers behind a reveal CTA by using a Notion **Toggle** whose title starts with a reserved marker:

| Toggle title in Notion | Rendered on the blog |
| --- | --- |
| `[answer]` | “Click to view answer” / “Hide answer” |
| `[answer] Explanation` | Custom label “Explanation” (prefix stripped) |
| Any other title | Normal toggle |

Authoring pattern:

```
## Problem 1
Question statement...

▸ [answer]
    SQL / solution content...
    Explanation...
```

Unmarked toggles keep the default collapse UI, so you can still use toggles for optional notes.

## Used By

This project is used by the following pages/blogs:

- [Leo's Tech Blog](https://lexuankha.com)


## Feedback & Contributing

Contributions are always welcome!

If you have any feedback, please reach out to me at khalx.leo@gmail.com