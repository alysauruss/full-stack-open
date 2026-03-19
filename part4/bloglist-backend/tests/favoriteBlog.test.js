const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

describe('favorite blog', () => {
  const blogs = [
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
    },
    { title: 'React patterns', author: 'Michael Chan', likes: 7 },
    {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    },
  ];

  test('returns the blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    });
  });
});
