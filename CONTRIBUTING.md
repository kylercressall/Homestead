# Contributing to LinkSapling

Feel free to contribute to LinkSapling! Features, icons, bug fixes are all welcome.

## Getting Started

1. Fork the repo and clone it locally
2. Install dependencies
   ```sh
   npm install
   ```
3. Make your changes
4. Run the tests to make sure nothing broke
   ```sh
   npm test
   ```
5. Run a build to verify the output
   ```sh
   npm run build
   ```
6. Open `dist/index.html` and confirm the output looks right

## Project Structure

```
src/
  build.js          # Main build — reads config, renders templates, writes dist/
  config.js         # Loads and validates linksapling.yaml
  icons.js          # Bundled SVG icons keyed by name (e.g. "github", "twitter")
  styles/
    base.css        # Base CSS using custom properties from theme config
  templates/
    index.html.hbs  # Handlebars template for the main page
    post.html.hbs   # Handlebars template for individual post pages
tests/
  unit/             # Unit tests for individual helper functions
  fixtures/         # Fake config and posts used by tests — not real content
posts/              # Example markdown posts
dist/               # Generated output — don't edit directly
```

## Adding an Icon

Icons live in `src/icons.js` as inline SVG strings. To add one:

1. Find or create an SVG — use `currentColor` for fill/stroke so it picks up the button text color
2. Add an entry to the exported object:
   ```js
   myplatform: `<svg ...>...</svg>`,
   ```
3. Update the supported icons list in the README

## Submitting a Pull Request

- Keep PRs focused with one feature or fix per PR
- Briefly describe what you changed and why in the PR description
- If you're fixing a bug, reference the issue number if there is one

## Reporting Bugs

Open an issue and include what you expected, what actually happened, your `linksapling.yaml` (strip personal info), and your Node.js version (`node -v`).

## Suggesting Features

Open an issue with the `enhancement` label. Describing the use case helps figure out the best way to implement it.
