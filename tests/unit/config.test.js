const path = require('path');
const fs = require('fs');
const os = require('os');
const { loadConfig } = require('../../src/config');

const FIXTURES = path.join(__dirname, '../fixtures');

function withTmp(yaml, fn) {
  const tmp = path.join(os.tmpdir(), 'homestead-test-' + Date.now());
  fs.mkdirSync(tmp);
  fs.writeFileSync(path.join(tmp, 'homestead.yaml'), yaml);
  try {
    fn(tmp);
  } finally {
    fs.rmSync(tmp, { recursive: true });
  }
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
    expect(config.rows[0].sections[0].width).toBe(1);
    expect(config.rows[0].sections[1].id).toBe('blog');
    expect(config.rows[0].sections[1].type).toBe('blog');
    expect(config.rows[0].columnWidth).toBe('none'); // no column_width in fixture → defaults to large
    expect(config.theme.radius).toBe('10px');
  });

  test('throws if config file is missing', () => {
    expect(() => loadConfig('/nonexistent/path')).toThrow('homestead.yaml not found');
  });

  test('throws if rows is missing', () => {
    withTmp('title: "No Rows"\n', tmp => {
      expect(() => loadConfig(tmp)).toThrow('at least one row');
    });
  });

  test('throws if a row has no sections', () => {
    withTmp([
      'title: "Empty Row"',
      'rows:',
      '  - sections: []',
    ].join('\n'), tmp => {
      expect(() => loadConfig(tmp)).toThrow('at least one section');
    });
  });

  test('throws if a row is missing the sections key', () => {
    withTmp([
      'title: "Missing Sections Key"',
      'rows:',
      '  - column_width: small',
    ].join('\n'), tmp => {
      expect(() => loadConfig(tmp)).toThrow('at least one section');
    });
  });

  test('throws on duplicate section ids across rows', () => {
    withTmp([
      'title: "Dupe Test"',
      'rows:',
      '  - sections:',
      '      - id: foo',
      '        type: links',
      '  - sections:',
      '      - id: foo',
      '        type: blog',
    ].join('\n'), tmp => {
      expect(() => loadConfig(tmp)).toThrow('duplicate section id');
    });
  });

  test('throws on invalid section type', () => {
    withTmp([
      'title: "Bad Type"',
      'rows:',
      '  - sections:',
      '      - id: foo',
      '        type: gallery',
    ].join('\n'), tmp => {
      expect(() => loadConfig(tmp)).toThrow('invalid type');
    });
  });

  test('throws on invalid column_width', () => {
    withTmp([
      'title: "Bad Width"',
      'rows:',
      '  - column_width: huge',
      '    sections:',
      '      - id: foo',
      '        type: links',
    ].join('\n'), tmp => {
      expect(() => loadConfig(tmp)).toThrow('invalid column_width');
    });
  });

  test('resolves column_width values correctly', () => {
    withTmp([
      'title: "Width Test"',
      'rows:',
      '  - column_width: xsmall',
      '    sections:',
      '      - id: a',
      '        type: links',
      '  - column_width: small',
      '    sections:',
      '      - id: b',
      '        type: links',
      '  - column_width: medium',
      '    sections:',
      '      - id: c',
      '        type: links',
      '  - column_width: large',
      '    sections:',
      '      - id: d',
      '        type: links',
    ].join('\n'), tmp => {
      const config = loadConfig(tmp);
      expect(config.rows[0].columnWidth).toBe('360px');
      expect(config.rows[1].columnWidth).toBe('720px');
      expect(config.rows[2].columnWidth).toBe('1100px');
      expect(config.rows[3].columnWidth).toBe('none');
    });
  });
});
