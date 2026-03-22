const assert = require('node:assert');
const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);

describe('when there is initially some blogs saved', () => {
  let token;
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);

    await User.deleteMany({});
    const passwordHash = await bcryptjs.hash('testpassword', 10);
    await new User({
      username: 'testuser',
      name: 'Test User',
      passwordHash,
    }).save();

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'testpassword' });

    token = loginResponse.body.token;
  });

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs');

    const contents = response.body.map((e) => e.title);
    assert(contents.includes('React patterns'));
  });

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToView = blogsAtStart[0];

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.deepStrictEqual(resultBlog.body, blogToView);
    });

    test('fails with status code 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId();

      await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
    });

    test('fails with status code 400 id is invalid', async () => {
      const invalidId = '12345invalidid';

      await api.get(`/api/blogs/${invalidId}`).expect(400);
    });
  });

  describe('addition of a new blog', () => {
    test('succeeds with adding valid data', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://test.com',
        likes: 10,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

      const contents = blogsAtEnd.map((b) => b.title);
      assert(contents.includes('Test Blog'));
    });

    test('fails with status code 400 if added data invalid', async () => {
      const newBlog = { title: 'Test Blog' };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });

    test('fails with 401 if token missing', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://test.com',
        likes: 10,
      };

      await api
        .post('/api/blogs')
        .send(newBlog) // no token attached
        .expect(401);
    });

    test('fails with 401 when token is expired', async () => {
      // create an already-expired token
      const expiredToken = jwt.sign(
        { username: 'testuser', id: 'someid' },
        process.env.SECRET,
        { expiresIn: -1 },
      );

      const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://test.com',
        likes: 10,
      };

      const result = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send(newBlog)
        .expect(401);

      assert(result.body.error.includes('token expired'));
    });

    test('created blog is linked to the authenticated user', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://test.com',
        likes: 10,
      };

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201);

      // check the returned blog has a user field
      assert(response.body.user);

      // verify it matches the logged in user
      const users = await helper.usersInDb();
      const testUser = users.find((u) => u.username === 'testuser');
      assert.strictEqual(response.body.user, testUser.id);
    });
  });

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid and user is the creator', async () => {
      // Create a blog as the testuser
      const newBlog = {
        title: 'Blog to Delete',
        author: 'Test Author',
        url: 'http://delete-me.com',
        likes: 5,
      };

      const createResponse = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201);

      const blogToDelete = createResponse.body;

      // Delete the blog as the creator with valid token
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();
      const ids = blogsAtEnd.map((b) => b.id);
      assert(!ids.includes(blogToDelete.id));
    });

    test('fails with status code 401 if token is missing', async () => {
      const newBlog = {
        title: 'Blog to Delete',
        author: 'Test Author',
        url: 'http://delete-me.com',
        likes: 5,
      };

      const createResponse = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201);

      const blogToDelete = createResponse.body;

      // Try to delete without token
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401);
    });

    test('fails with status code 401 if token is expired', async () => {
      const newBlog = {
        title: 'Blog to Delete',
        author: 'Test Author',
        url: 'http://delete-me.com',
        likes: 5,
      };

      const createResponse = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201);

      const blogToDelete = createResponse.body;

      // Create an expired token
      const expiredToken = jwt.sign(
        { username: 'testuser', id: 'someid' },
        process.env.SECRET,
        { expiresIn: -1 },
      );

      const result = await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      assert(result.body.error.includes('token expired'));
    });

    test('fails with status code 401 if user is not the blog creator', async () => {
      // Create a blog as testuser
      const newBlog = {
        title: 'Blog to Delete',
        author: 'Test Author',
        url: 'http://delete-me.com',
        likes: 5,
      };

      const createResponse = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201);

      const blogToDelete = createResponse.body;

      // Create a different user and get their token
      const passwordHash = await bcryptjs.hash('otherpassword', 10);
      await new User({
        username: 'otheruser',
        name: 'Other User',
        passwordHash,
      }).save();

      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'otheruser', password: 'otherpassword' });

      const otherToken = loginResponse.body.token;

      // Try to delete with other user's token
      const result = await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(401);

      assert(result.body.error.includes('only the creator can delete a blog'));
    });

    test('fails with status code 400 if blog has already been deleted', async () => {
      // Create a blog as testuser
      const newBlog = {
        title: 'Blog to Delete',
        author: 'Test Author',
        url: 'http://delete-me.com',
        likes: 5,
      };

      const createResponse = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201);

      const blogToDelete = createResponse.body;

      // Delete the blog
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      // Try to delete the same blog again
      const result = await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      assert(result.body.error.includes('blog has already been deleted'));
    });
  });

  describe('updating a blog', () => {
    test('succeeds with updating valid data', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      const updatedBlogData = {
        title: 'Updated Title',
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes,
      };

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlogData)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      const updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id);

      assert.strictEqual(updatedBlog.title, 'Updated Title');
    });

    test('fails with status code 400 if updated data invalid', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      const invalidUpdatedBlogData = {
        title: '',
      };

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(invalidUpdatedBlogData)
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();
      const unchangedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id);

      assert.strictEqual(unchangedBlog.title, blogToUpdate.title);
    });
  });
});
after(async () => {
  await mongoose.connection.close();
});
