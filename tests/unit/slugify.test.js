const { slugify } = require('../../src/build');

describe('slugify', () => {
  test('lowercases the filename', () => {
    expect(slugify('Hello-World.md')).toBe('hello-world');
  });

  test('replaces spaces with hyphens', () => {
    expect(slugify('my post.md')).toBe('my-post');
  });

  test('strips special characters', () => {
    expect(slugify('my post!.md')).toBe('my-post');
  });

  test('strips the .md extension', () => {
    expect(slugify('about.md')).toBe('about');
  });
});
