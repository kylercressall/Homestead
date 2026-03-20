# LinkSapling — Project Plan

## Overview

**What it is:** A CLI tool (`npm install -g linksapling`) that reads a config file + assets from a directory and generates a ready-to-deploy static site.

**User workflow:**
1. `linksapling init` — scaffolds a `linksapling.yaml` config, `posts/` folder, and placeholder avatar
2. Edit `linksapling.yaml` to set their links, colors, fonts, etc.
3. Drop `.md` files into `posts/` for blog-style entries
4. `linksapling build` — outputs a `dist/` folder of plain HTML/CSS
5. Push `dist/` to GitHub Pages

---

## Config file (`linksapling.yaml`)

```yaml
title: "Jane Doe"
bio: "Designer & maker of things"
avatar: "./avatar.jpg"

theme:
  background: "#0d0d0d"
  surface: "#1a1a1a"
  accent: "#7c3aed"
  text: "#f5f5f5"
  font: "Inter"          # Google Font name or "system"
  radius: "12px"         # button corner radius

links:
  - label: "GitHub"
    url: "https://github.com/janedoe"
    icon: "github"       # optional: maps to a bundled SVG icon
  - label: "My Portfolio"
    url: "https://janedoe.com"

posts_dir: "./posts"     # omit to hide blog section
```

---

## Site design

- Centered single-column layout, max ~480px wide
- Circular avatar + name + bio at top
- Full-width pill buttons for each link, accent-colored on hover
- Optional "Posts" section below — cards with title, date, and excerpt, linking to generated post pages
- Post pages: simple readable article layout with a "back" link
- Fonts loaded via Google Fonts CDN (or system stack if `font: system`)
- No JavaScript required — pure HTML/CSS output

---

## Architecture

```
linksapling/
  bin/
    linksapling.js       # CLI entry point
  src/
    config.js            # load + validate yaml config
    build.js             # orchestrates the build
    templates/
      index.html.hbs     # main page template
      post.html.hbs      # individual post template
    styles/
      base.css           # injected inline or copied
    icons/               # bundled SVG icons (github, twitter, etc.)
  package.json
```

---

## Checklist

### Project setup
- [ ] Initialize npm package with `bin` field pointing to CLI entry
- [ ] Choose and install deps: `commander` (CLI), `js-yaml` (config), `marked` (markdown), `handlebars` (templates), `chokidar` (dev watch), `gray-matter` (post frontmatter)
- [ ] Set up `eslint` + `prettier`

### CLI
- [ ] `linksapling init` — write starter `linksapling.yaml`, create `posts/` dir, copy placeholder avatar
- [ ] `linksapling build` — main build command, output to `dist/`
- [ ] `linksapling dev` — build + serve `dist/` locally with file watcher (nice-to-have)
- [ ] `--output <dir>` flag to override `dist/`
- [ ] `--config <path>` flag to override config file location

### Config
- [ ] Load and parse `linksapling.yaml`
- [ ] Validate required fields (title, at least one link)
- [ ] Resolve relative paths for avatar and posts_dir

### Templates & styles
- [ ] Design `index.html.hbs` — avatar, bio, link buttons, posts section
- [ ] Design `post.html.hbs` — article layout, back link
- [ ] Write `base.css` with CSS custom properties driven by config theme values
- [ ] Google Fonts `<link>` injection based on `theme.font`
- [ ] Bundle ~10 common social icons as inline SVGs

### Markdown / posts
- [ ] Read all `.md` files from `posts_dir`
- [ ] Parse frontmatter (title, date, excerpt) with `gray-matter`
- [ ] Convert body to HTML with `marked`
- [ ] Generate `dist/posts/<slug>.html` for each post
- [ ] Sort posts by date descending on index page

### Output
- [ ] Copy avatar and any other local assets to `dist/`
- [ ] Inline CSS into `<style>` tag (keeps it self-contained, no extra files)
- [ ] Generate `dist/index.html`
- [ ] Add a `404.html` (copy of index — GitHub Pages fallback)

### GitHub Pages
- [ ] Add `deploy` script using `gh-pages` package: `linksapling deploy`
- [ ] Document `.nojekyll` file requirement
- [ ] README with step-by-step GitHub Pages setup

### Polish
- [ ] Sensible defaults so a minimal config (just title + links) works out of the box
- [ ] Friendly CLI error messages for missing fields or bad paths
- [ ] Publish to npm
