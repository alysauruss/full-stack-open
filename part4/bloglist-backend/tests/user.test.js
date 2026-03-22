const assert = require('node:assert');
const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const api = supertest(app);

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcryptjs.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert.ok(usernames.includes(newUser.username));
  });

  test('creation fails if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes('expected `username` to be unique'));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails if username is too short', async () => {
    const newUser = {
      username: 'ml',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(
      result.body.error.includes('username must be at least 3 characters long'),
    );
  });

  test('creation fails if username is missing', async () => {
    const newUser = {
      name: 'Valid User',
      password: 'validpassword',
    };

    const result = await api.post('/api/users').send(newUser).expect(400);

    assert(
      result.body.error.includes('username must be at least 3 characters long'),
    );
  });

  test('creation fails if username contains non-letter characters', async () => {
    const newUser = {
      username: 'user123',
      name: 'Invalid User',
      password: 'validpassword',
    };

    const result = await api.post('/api/users').send(newUser).expect(400);

    assert(
      result.body.error.includes('username must be consisted of only letters'),
    );
  });

  test('creation fails if password is too short', async () => {
    const newUser = {
      username: 'validuser',
      name: 'Valid User',
      password: 'pw',
    };

    const result = await api.post('/api/users').send(newUser).expect(400);

    assert(
      result.body.error.includes('password must be at least 3 characters long'),
    );
  });

  test('creation fails if password is missing', async () => {
    const newUser = {
      username: 'validuser',
      name: 'Valid User',
    };

    const result = await api.post('/api/users').send(newUser).expect(400);

    assert(
      result.body.error.includes('password must be at least 3 characters long'),
    );
  });
});
after(async () => {
  await mongoose.connection.close();
});
