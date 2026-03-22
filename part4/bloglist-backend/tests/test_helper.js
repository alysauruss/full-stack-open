const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://test.com',
    likes: 5,
  },
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'http://test.com',
    likes: 7,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://test.com',
    likes: 12,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    url: 'http://willremovethissoon.com',
  });
  await blog.save();
  await blog.deleteOne();

  return blog.id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};
