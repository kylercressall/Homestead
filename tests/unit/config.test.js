const path = require('path');
const { loadConfig } = require('../../src/config');

const FIXTURES = path.join(__dirname, '../fixtures');

describe('loadConfig', () => {
  test('loads a valid config and applies defaults', () => {
    const config = loadConfig(FIXTURES);
    expect(config.title).toBe('Test Site');
    expect(config.bio).toBe('A test bio');
    expect(config.links).toHaveLength(1);
    expect(config.theme.radius).toBe('10px');
  });

  test('throws if config file is missing', () => {
    expect(() => loadConfig('/nonexistent/path')).toThrow('homestead.yaml not found');
  });
});
