const { extractPreview } = require('../../src/build');

describe('extractPreview', () => {
  test('returns the first non-heading paragraph', () => {
    const md = `# Heading\n\nThis is the intro paragraph.`;
    expect(extractPreview(md)).toBe('This is the intro paragraph.');
  });

  test('strips markdown links', () => {
    const md = `Check out [this link](https://example.com) for more.`;
    expect(extractPreview(md)).toBe('Check out this link for more.');
  });

  test('strips bold, italic, and code markers', () => {
    const md = `Some **bold** and _italic_ and \`code\` text.`;
    expect(extractPreview(md)).toBe('Some bold and italic and code text.');
  });

  test('returns null for content with only headings', () => {
    expect(extractPreview('# Just a heading')).toBeNull();
  });
});
