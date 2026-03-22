const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const { userExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const notes = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  });
  response.json(notes);
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post('/', userExtractor, async (request, response) => {
  const userDetails = request.userDetails;
  if (!userDetails) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const body = request.body;
  const user = await User.findById(userDetails.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  return response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const userDetails = request.userDetails;
  if (!userDetails) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const blogId = request.params.id;
  const blog = await Blog.findById(blogId);

  if (!blog) {
    return response
      .status(400)
      .json({ error: 'blog has already been deleted' });
  }

  if (blog.user.toString() !== userDetails.id) {
    return response
      .status(401)
      .json({ error: 'only the creator can delete a blog' });
  }

  await Blog.findByIdAndDelete(blogId);
  return response.status(204).end();
});

//edit something
blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body;

  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    response.status(404).end();
  }

  blog.title = title;
  blog.author = author;
  blog.url = url;
  blog.likes = likes;

  const updatedBlog = await blog.save();
  response.json(updatedBlog);
});

module.exports = blogsRouter;
