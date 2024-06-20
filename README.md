# Notion Next.js Mini Kit

This repository contains a mini kit for integrating Notion API with Next.js. This kit provides a simple and efficient way to connect your Next.js applications with Notion to access and display data.

## Features

- Seamless integration of Notion API with Next.js
- Easy setup and configuration
- Flexible customization options
- Lightweight and performant
- Revalidate path for static generation

## Tech Stack

- Next.js: version 14x
- Notion API

## Library
- [React Notion](https://github.com/splitbee/react-notion): minimal renderer for blogs & content pages
- [@notionhq/client](https://www.npmjs.com/package/@notionhq/client): A simple and easy to use client for the Notion API
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

## Used By

This project is used by the following pages/blogs:

- [Leo's Tech Blog](https://lexuankha.com)


## Feedback & Contributing

Contributions are always welcome!

If you have any feedback, please reach out to me at khalx.leo@gmail.com