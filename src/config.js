const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const VALID_SECTION_TYPES = ['links', 'portfolio', 'blog'];
const COLUMN_WIDTHS = { xsmall: '360px', small: '720px', medium: '1100px', large: 'none' };

function resolveColumnWidth(value, context) {
  const key = value || 'large';
  if (!COLUMN_WIDTHS[key]) {
    throw new Error(`invalid column_width "${key}" in ${context}. Valid options: ${Object.keys(COLUMN_WIDTHS).join(', ')}`);
  }
  return COLUMN_WIDTHS[key];
}

function loadConfig(root = process.cwd()) {
  const configPath = path.join(root, "homestead.yaml");

  if (!fs.existsSync(configPath)) {
    throw new Error(`homestead.yaml not found in ${root}`);
  }

  const raw = yaml.load(fs.readFileSync(configPath, "utf8"));

  if (!raw.title) {
    throw new Error('config must have a "title" field');
  }
  if (!raw.rows || raw.rows.length === 0) {
    throw new Error('config must have at least one row');
  }

  // Section IDs must be unique across all rows
  const ids = new Set();

  for (const [rowIndex, row] of raw.rows.entries()) {
    if (!row.sections || row.sections.length === 0) {
      throw new Error(`row ${rowIndex + 1} must have at least one section`);
    }

    for (const section of row.sections) {
      if (!section.id) {
        throw new Error('each section must have an "id" field');
      }
      if (ids.has(section.id)) {
        throw new Error(`duplicate section id: "${section.id}"`);
      }
      ids.add(section.id);

      if (!section.type || !VALID_SECTION_TYPES.includes(section.type)) {
        throw new Error(
          `section "${section.id}" has invalid type "${section.type}". Valid types: ${VALID_SECTION_TYPES.join(', ')}`
        );
      }
    }
  }

  return {
    title: raw.title,
    bio: raw.bio || null,
    avatar: raw.avatar || null,
    theme: {
      background: raw.theme?.background || "#0d0d0d",
      surface: raw.theme?.surface || "#1a1a1a",
      accent: raw.theme?.accent || "#7c3aed",
      text: raw.theme?.text || "#f5f5f5",
      font: raw.theme?.font || "Inter",
      radius: raw.theme?.radius || "10px",
      border: raw.theme?.border || null,
    },
    rows: raw.rows.map((row, i) => ({
      columnWidth: resolveColumnWidth(row.column_width, `row ${i + 1}`),
      sections: row.sections.map(s => ({
        id: s.id,
        type: s.type,
        title: s.title || null,
        links: s.links || [],
        posts_dir: s.posts_dir || null,
        width: s.width != null ? s.width : 1,
      })),
    })),
  };
}

module.exports = { loadConfig };
