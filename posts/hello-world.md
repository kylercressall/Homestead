---
title: "Hello, World"
date: 2026-03-19
excerpt: "An example post to show how this feature works."
---

## Why I built this

I wanted a simple place to host all of my links that doesn't require even more account than I already have.
LinkSapling is a simple repo to easily add your own links and posts customized for you. It will also act as
a good starting point to build additional features on top of in the future.

## What it can do

- Customizable colors, fonts, and layout all in one YAML file
- Social links with icons
- Blog posts written in markdown (like this one)
- Outputs static HTML to easily host on Github Pages

## A code example

```js
// This is what the build script does at its core
const html = template({ title, links, posts });
fs.writeFileSync("dist/index.html", html);
```

## Potential Additional Features

More themes, more link options and icons, imbed photos/gifs, more complex posts, and building the repo as a cli tool.
