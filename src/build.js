const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const { marked } = require('marked');
const matter = require('gray-matter');
const { loadConfig } = require('./config');
const icons = require('./icons');

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');

// --- Helpers ---

function readTemplate(name) {
  return fs.readFileSync(
    path.join(__dirname, 'templates', `${name}.html.hbs`),
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
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
// Used for the post card preview — strips headings, links, and emphasis
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

function loadPosts(config) {
  if (!config.posts_dir) return [];

  const dir = path.resolve(ROOT, config.posts_dir);
  if (!fs.existsSync(dir)) {
    console.warn(`Warning: posts_dir "${config.posts_dir}" does not exist, skipping posts.`);
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
        excerpt: data.excerpt || null,
        preview: extractPreview(content),
        content: marked(content, { gfm: true }),
        url: `posts/${slug}.html`,
      };
    })
    .sort((a, b) => b.rawDate - a.rawDate); // newest first
}

// --- Build ---

function build() {
  const config = loadConfig(ROOT);
  const css = fs.readFileSync(path.join(__dirname, 'styles', 'base.css'), 'utf8');
  const fonts = fontVars(config);
  const posts = loadPosts(config);

  // Clear and recreate dist/
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(path.join(DIST, 'posts'), { recursive: true });

  // Resolve avatar — copy into dist/ so the output is self-contained
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

  // Attach icon SVGs to each link
  const links = config.links.map(link => ({
    ...link,
    iconSvg: link.icon ? (icons[link.icon] || null) : null,
  }));

  // Shared template context
  const shared = {
    css,
    theme: config.theme,
    ...fonts,
  };

  // Render index.html
  const indexTpl = Handlebars.compile(readTemplate('index'));
  const indexHtml = indexTpl({
    ...shared,
    title: config.title,
    bio: config.bio,
    avatar: avatarPath,
    links,
    posts,
  });
  fs.writeFileSync(path.join(DIST, 'index.html'), indexHtml);

  // Render each post page
  const postTpl = Handlebars.compile(readTemplate('post'));
  for (const post of posts) {
    const postHtml = postTpl({
      ...shared,
      siteTitle: config.title,
      title: post.title,
      date: post.date,
      content: post.content,
    });
    fs.writeFileSync(path.join(DIST, 'posts', `${post.slug}.html`), postHtml);
  }

  console.log(`Built ${1 + posts.length} page(s) → dist/`);
  if (posts.length) {
    posts.forEach(p => console.log(`  posts/${p.slug}.html`));
  }
  console.log(`\n  file://${path.join(DIST, 'index.html')}`);
}

build();
