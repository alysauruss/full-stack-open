const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

// get all blogs
blogsRouter.get('/', (request, response, next) => {
  Blog.find({})
    .then((blogs) => response.json(blogs))
    .catch((error) => next(error));
});

// get a single blog by id
blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then((blog) => {
      if (blog) {
        return response.json(blog);
      }
      return response.status(404).end();
    })
    .catch((error) => next(error));
});

// create a new blog
blogsRouter.post('/', (request, response, next) => {
  const body = request.body;
  if (!body.title) {
    return response.status(400).json({ error: 'title missing' });
  }

  if (!body.author) {
    return response.status(400).json({ error: 'author missing' });
  }

  if (!body.url) {
    return response.status(400).json({ error: 'url missing' });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  });

  return blog
    .save()
    .then((savedBlog) => response.json(savedBlog))
    .catch((error) => next(error));
});

// delete a note by id
blogsRouter.delete('/:id', (request, response, next) => {
  Blog.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) => next(error));
});

module.exports = blogsRouter;
