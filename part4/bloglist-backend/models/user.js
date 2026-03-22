const moongoose = require('mongoose');

const userSchema = moongoose.Schema({
  username: {
    type: String,
    minlength: [3, 'username must be at least 3 characters long'],
    match: [/^[a-zA-Z]+$/, 'username must be consisted of only letters'],
    required: true,
    unique: true,
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: moongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

module.exports = moongoose.model('User', userSchema);
