const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function loadConfig(root = process.cwd()) {
  const configPath = path.join(root, "linksapling.yaml");

  if (!fs.existsSync(configPath)) {
    throw new Error(`linksapling.yaml not found in ${root}`);
  }

  const raw = yaml.load(fs.readFileSync(configPath, "utf8"));

  if (!raw.title) {
    throw new Error('config must have a "title" field');
  }
  if (!raw.links || raw.links.length === 0) {
    throw new Error("config must have at least one link");
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
    links: raw.links,
    posts_dir: raw.posts_dir || null,
  };
}

module.exports = { loadConfig };
