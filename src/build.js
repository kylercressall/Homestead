const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const { marked } = require('marked');
const matter = require('gray-matter');
const { loadConfig } = require('./config');
const icons = require('./icons');

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');

// Known section types — each maps to a partial in src/templates/sections/.
// Adding a new type means adding a .hbs file there and listing it here.
const SECTION_TYPES = ['links', 'portfolio', 'blog'];

// --- Helpers ---

function readTemplate(name) {
  return fs.readFileSync(
    path.join(__dirname, 'templates', `${name}.html.hbs`),
    'utf8'
  );
}

function readSectionTemplate(type) {
  return fs.readFileSync(
    path.join(__dirname, 'templates', 'sections', `${type}.hbs`),
    'utf8'
  );
}

function slugify(filename) {
  return path.basename(filename, '.md')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function formatDate(raw) {
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d)) return String(raw);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function fontVars(config) {
  const font = config.theme.font;
  if (!font || font === 'system') {
    return {
      googleFont: false,
      fontFamily: null,
      fontStack: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    };
  }
  return {
    googleFont: true,
    fontFamily: font.replace(/ /g, '+'),
    fontStack: `"${font}", sans-serif`,
  };
}

// Extracts plain text from the first body paragraph of a markdown file.
// Used for post card previews — strips headings, links, and emphasis
// so the card shows readable prose rather than raw markdown syntax.
function extractPreview(markdown) {
  const paragraphs = markdown.split(/\n{2,}/);
  const first = paragraphs.find(p => p.trim() && !p.trim().startsWith('#'));
  if (!first) return null;
  return first
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [text](url) → text
    .replace(/[*_`>]/g, '')                   // bold, italic, code, blockquote markers
    .trim();
}

// --- Posts ---

// Loads all .md posts from a directory. sectionId becomes the URL namespace
// so links on the index page point to the right output path.
function loadPostsFromDir(postsDir, sectionId) {
  const dir = path.resolve(ROOT, postsDir);
  if (!fs.existsSync(dir)) {
    console.warn(`Warning: posts_dir "${postsDir}" does not exist, skipping.`);
    return [];
  }

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(filename => {
      const raw = fs.readFileSync(path.join(dir, filename), 'utf8');
      const { data, content } = matter(raw);
      const slug = slugify(filename);
      return {
        slug,
        title: data.title || slug,
        date: formatDate(data.date),
        rawDate: data.date ? new Date(data.date) : new Date(0),
        subtitle: data.subtitle || null,
        preview: extractPreview(content),
        content: marked(content, { gfm: true }),
        url: `${sectionId}/${slug}.html`,
      };
    })
    .sort((a, b) => b.rawDate - a.rawDate); // newest first
}

// --- Build ---

function build() {
  const config = loadConfig(ROOT);
  const css = fs.readFileSync(path.join(__dirname, 'styles', 'base.css'), 'utf8');
  const fonts = fontVars(config);

  // Register one Handlebars partial per section type. The index template uses
  // {{> (lookup . 'type') this}} to dispatch dynamically, so a new section type
  // only needs a new .hbs file plus an entry in SECTION_TYPES above.
  for (const type of SECTION_TYPES) {
    Handlebars.registerPartial(type, readSectionTemplate(type));
  }

  // Clear and recreate dist/
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  // Avatar — copy into dist/ so the output is self-contained
  let avatarPath = null;
  if (config.avatar) {
    const src = path.resolve(ROOT, config.avatar);
    if (fs.existsSync(src)) {
      const ext = path.extname(src);
      const dest = path.join(DIST, `avatar${ext}`);
      fs.copyFileSync(src, dest);
      avatarPath = `avatar${ext}`;
    } else {
      console.warn(`Warning: avatar "${config.avatar}" not found, skipping.`);
    }
  }

  // Flatten all sections across all rows so we can load posts once per section.
  // We keep two representations per section:
  //   allPosts  — full data including content, used to render individual pages
  //   cardPosts — possibly stripped (portfolio removes preview/date), used in index
  const allSections = config.rows.flatMap(row => row.sections);
  const sectionPostMap = new Map(); // sectionId -> { allPosts, cardPosts }

  for (const section of allSections) {
    const allPosts = section.posts_dir
      ? loadPostsFromDir(section.posts_dir, section.id)
      : [];

    const cardPosts = section.type === 'portfolio'
      ? allPosts.map(p => ({ ...p, preview: null, date: null }))
      : allPosts;

    sectionPostMap.set(section.id, { allPosts, cardPosts });
  }

  // Build the rows structure passed to the index template
  const rows = config.rows.map(row => ({
    columnWidth: row.columnWidth,
    sections: row.sections.map(section => {
      const { cardPosts } = sectionPostMap.get(section.id);
      const links = section.links.map(link => ({
        ...link,
        iconSvg: link.icon ? (icons[link.icon] || null) : null,
      }));
      return {
        id: section.id,
        type: section.type,
        title: section.title,
        width: section.width,
        links,
        posts: cardPosts,
      };
    }),
  }));

  // Render index.html
  const shared = { css, theme: config.theme, ...fonts };
  const indexTpl = Handlebars.compile(readTemplate('index'));
  const indexHtml = indexTpl({
    ...shared,
    title: config.title,
    bio: config.bio,
    avatar: avatarPath,
    rows,
  });
  fs.writeFileSync(path.join(DIST, 'index.html'), indexHtml);

  // Render individual post pages, one directory per section
  const postTpl = Handlebars.compile(readTemplate('post'));
  let postCount = 0;

  for (const section of allSections) {
    const { allPosts } = sectionPostMap.get(section.id);
    if (!allPosts.length) continue;

    fs.mkdirSync(path.join(DIST, section.id), { recursive: true });

    for (const post of allPosts) {
      const postHtml = postTpl({
        ...shared,
        siteTitle: config.title,
        title: post.title,
        date: post.date,
        content: post.content,
      });
      fs.writeFileSync(path.join(DIST, section.id, `${post.slug}.html`), postHtml);
      postCount++;
    }
  }

  fs.writeFileSync(path.join(DIST, '.nojekyll'), '');

  console.log(`Built ${1 + postCount} page(s) → dist/`);
  console.log(`\n  file://${path.join(DIST, 'index.html')}`);
}

if (require.main === module) {
  build();
}

module.exports = { slugify, formatDate, extractPreview, fontVars };
