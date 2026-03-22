const bcryptjs = require('bcryptjs');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs');
  response.json(users);
});

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'password must be at least 3 characters long',
    });
  }

  if (!username || username.length < 3) {
    return response.status(400).json({
      error: 'username must be at least 3 characters long',
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcryptjs.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  return response.status(201).json(savedUser);
});

usersRouter.delete('/:id', async (request, response) => {
  await User.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

module.exports = usersRouter;
