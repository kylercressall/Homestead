<a id="readme-top"></a>
[![CI](https://github.com/kylercressall/Homestead/actions/workflows/ci.yml/badge.svg)](https://github.com/kylercressall/Homestead/actions/workflows/ci.yml)
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/kylercressall/Homestead">
    <img src="images/homestead.svg" alt="Logo" width="508" height="98">
  </a>

<h3 align="center">Homestead</h3>

  <p align="center">
    Your corner of the internet. Edit one file, add your posts, upload to show the world.
    <br />
    <br />
    <a href="https://github.com/kylercressall/Homestead/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/kylercressall/Homestead/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

![screenshot][product-screenshot]

Your home base on the web. Compile your links and create posts to show off projects and work you've done.

**Why Homestead?**

- No third-party platform or account needed (outside Github)
- Create your own site without opening a code editor
- Zero JavaScript output, plain HTML and CSS for simplicity
- Blog support built in, just drop Markdown files in a folder
- Fully themeable from one config file
- Free to host on GitHub Pages

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![Node.js][Node-badge]][Node-url]
- [![Handlebars][Handlebars-badge]][Handlebars-url]
- [![marked][marked-badge]][marked-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/kylercressall/Homestead.git
   cd Homestead
   ```
2. Install dependencies
   ```sh
   npm install
   ```
3. Edit `homestead.yaml` with your own information (see [Usage](#usage))
4. Build the site
   ```sh
   npm run build
   ```
5. Preview at `dist/index.html` or deploy the `dist/` folder to GitHub Pages

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE -->

## Usage

All configuration lives in `homestead.yaml` at the project root.

```yaml
# Your display name — shown as the page title and <h1>
title: "Jane Doe"

# Short bio shown below your name (optional)
bio: "Designer & maker of things."

# Path to your profile picture, relative to this file (optional)
# avatar: ".images/avatar.png"

theme:
  background: "#f6f1e8" # page background
  surface: "#fffaf2" # card and button background
  accent: "#c26d3a" # hover and highlight color
  text: "#2f241f" # body text color
  font: "Oxygen" # Google Font name, or "system" for no CDN
  radius: "16px" # button corner radius
  border: "#d4b99a" # optional border/shadow color (omit to disable)

links:
  - label: "GitHub"
    url: "https://github.com/janedoe"
    icon: github
  - label: "Twitter / X"
    url: "https://x.com/janedoe"
    icon: twitter
  - label: "My Website"
    url: "https://janedoe.com"
    icon: globe

# Folder of Markdown files to render as blog posts (optional — omit to hide)
posts_dir: "./posts"
```

**Supported icons:** `github`, `twitter`, `instagram`, `linkedin`, `youtube`, `twitch`, `discord`, `bluesky`, `email`, `globe`, `rss`

### Writing Posts

Drop `.md` files into your `posts/` folder with a frontmatter block:

```markdown
---
title: "My First Post"
date: 2026-03-01
excerpt: "A short summary shown on the index page."
---

Your post content here, written in standard Markdown.
```

Each post gets its own page at `dist/posts/<slug>.html` after a build.

### Deploying to GitHub Pages

1. Push your repo to GitHub
2. Go to **Settings → Pages** and set the source to the `dist/` folder (or use a `gh-pages` branch)
3. Your site will be live at `https://<your-username>.github.io/Homestead`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] More built-in icons
- [ ] Multiple bundled themes to pick from
- [ ] Image and GIF support in posts
- [ ] "Use this template" GitHub template repo setup
- [ ] Auto-deploy via GitHub Actions on push
- [ ] Full from-zero video tutorial

See the [open issues](https://github.com/kylercressall/Homestead/issues) for a full list of proposed features and known bugs.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

PRs and issues are welcome. Fork the repo, make your change, and open a pull request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a pull request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top Contributors

<a href="https://github.com/kylercressall/Homestead/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=kylercressall/Homestead" alt="contrib.rocks image" />
</a>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Kyler Cressall - [GitHub](https://github.com/kylercressall)

Project Link: [https://github.com/kylercressall/Homestead](https://github.com/kylercressall/Homestead)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [Handlebars.js](https://handlebarsjs.com) - templating
- [marked](https://marked.js.org) - Markdown parsing
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - frontmatter parsing
- [Best-README-Template](https://github.com/othneildrew/Best-README-Template) - README Template
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[contributors-shield]: https://img.shields.io/github/contributors/kylercressall/Homestead.svg?style=for-the-badge
[contributors-url]: https://github.com/kylercressall/Homestead/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/kylercressall/Homestead.svg?style=for-the-badge
[forks-url]: https://github.com/kylercressall/Homestead/network/members
[stars-shield]: https://img.shields.io/github/stars/kylercressall/Homestead.svg?style=for-the-badge
[stars-url]: https://github.com/kylercressall/Homestead/stargazers
[issues-shield]: https://img.shields.io/github/issues/kylercressall/Homestead.svg?style=for-the-badge
[issues-url]: https://github.com/kylercressall/Homestead/issues
[license-shield]: https://img.shields.io/github/license/kylercressall/Homestead.svg?style=for-the-badge
[license-url]: https://github.com/kylercressall/Homestead/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[Node-badge]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Handlebars-badge]: https://img.shields.io/badge/Handlebars.js-000000?style=for-the-badge&logo=handlebarsdotjs&logoColor=white
[Handlebars-url]: https://handlebarsjs.com/
[marked-badge]: https://img.shields.io/badge/marked-000000?style=for-the-badge
[marked-url]: https://marked.js.org/
