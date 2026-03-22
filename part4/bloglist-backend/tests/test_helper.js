const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://test.com',
    likes: 5,
    createdAt: '2026-03-21T17:29:21.830Z',
    updatedAt: '2026-03-21T17:29:21.830Z',
    user: '69becb8c309fab270e9b7cdc',
  },
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'http://test.com',
    likes: 7,
    createdAt: '2026-03-21T17:29:21.830Z',
    updatedAt: '2026-03-21T17:29:21.830Z',
    user: '69becb8c309fab270e9b7cdc',
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://test.com',
    likes: 12,
    createdAt: '2026-03-21T17:29:21.830Z',
    updatedAt: '2026-03-21T17:29:21.830Z',
    user: '69becb8c309fab270e9b7cdc',
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'Eldian kstra',
    url: 'http://willremovethissoon.com',
    createdAt: '2026-03-21T17:29:21.830Z',
    updatedAt: '2026-03-21T17:29:21.830Z',
    user: '69becb8c309fab270e9b7cdc',
  });
  await blog.save();
  await blog.deleteOne();

  return blog.id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => {
    const object = blog.toJSON();
    object.user = blog.user?.toString();
    return object;
  });
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
