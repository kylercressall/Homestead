const path = require('path');
const fs = require('fs');
const os = require('os');
const { loadConfig } = require('../../src/config');

const FIXTURES = path.join(__dirname, '../fixtures');

function makeTmp(yaml) {
  const tmp = path.join(os.tmpdir(), 'homestead-test-' + Date.now());
  fs.mkdirSync(tmp);
  fs.writeFileSync(path.join(tmp, 'homestead.yaml'), yaml);
  return tmp;
}

describe('loadConfig', () => {
  test('loads a valid config and applies defaults', () => {
    const config = loadConfig(FIXTURES);
    expect(config.title).toBe('Test Site');
    expect(config.bio).toBe('A test bio');
    expect(config.rows).toHaveLength(1);
    expect(config.rows[0].sections).toHaveLength(2);
    expect(config.rows[0].sections[0].id).toBe('connect');
    expect(config.rows[0].sections[0].type).toBe('links');
    expect(config.rows[0].sections[1].id).toBe('blog');
    expect(config.rows[0].sections[1].type).toBe('blog');
    expect(config.theme.radius).toBe('10px');
  });

  test('throws if config file is missing', () => {
    expect(() => loadConfig('/nonexistent/path')).toThrow('homestead.yaml not found');
  });

  test('throws if rows is missing', () => {
    const tmp = makeTmp('title: "No Rows"\n');
    expect(() => loadConfig(tmp)).toThrow('at least one row');
    fs.rmSync(tmp, { recursive: true });
  });

  test('throws if a row has no sections', () => {
    const tmp = makeTmp([
      'title: "Empty Row"',
      'rows:',
      '  - sections: []',
    ].join('\n'));
    expect(() => loadConfig(tmp)).toThrow('at least one section');
    fs.rmSync(tmp, { recursive: true });
  });

  test('throws on duplicate section ids', () => {
    const tmp = makeTmp([
      'title: "Dupe Test"',
      'rows:',
      '  - sections:',
      '      - id: foo',
      '        type: links',
      '  - sections:',
      '      - id: foo',
      '        type: blog',
    ].join('\n'));
    expect(() => loadConfig(tmp)).toThrow('duplicate section id');
    fs.rmSync(tmp, { recursive: true });
  });

  test('throws on invalid section type', () => {
    const tmp = makeTmp([
      'title: "Bad Type"',
      'rows:',
      '  - sections:',
      '      - id: foo',
      '        type: gallery',
    ].join('\n'));
    expect(() => loadConfig(tmp)).toThrow('invalid type');
    fs.rmSync(tmp, { recursive: true });
  });
});
