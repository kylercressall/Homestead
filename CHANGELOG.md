# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- Jest testing framework with unit tests for `slugify`, `formatDate`, `extractPreview`, and `loadConfig`
- Babel config (`babel.config.js`) to allow Jest to transform ESM dependencies
- Test fixtures: sample `linksapling.yaml` and markdown post for isolated test runs
- CI workflow (`.github/workflows/ci.yml`) — runs tests and build on every push and pull request to `main`

### Changed

- `config.js` validation errors now throw instead of calling `process.exit`, allowing tests to catch them
- `build.js` helper functions (`slugify`, `formatDate`, `extractPreview`, `fontVars`) are now exported for testing
- `build.js` build execution is now guarded with `require.main === module` so importing the file doesn't trigger a build

## [0.1.0] - 2026-03-19

### Added

- Initial build script, reads `linksapling.yaml` and outputs static HTML to `dist/`
- Handlebars templates for the main page and individual post pages
- Markdown blog post support with YAML frontmatter (`title`, `date`, `excerpt`)
- Post preview cards on the index page with excerpt and date
- Theme customization via config: background, surface, accent, text, font, radius, border
- Google Fonts integration: load any font by name or fall back to system stack
- Bundled inline SVG icons: github, twitter, instagram, linkedin, youtube, twitch, discord, bluesky, email, globe, rss
- Avatar support: copies image to `dist/` for self-contained output
