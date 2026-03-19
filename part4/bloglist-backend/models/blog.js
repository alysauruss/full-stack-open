const mongoose = require('mongoose');

// define the shape of a blog post document in MongoDB
const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

// customize how note documents are serialized to JSON
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(); // expose _id as a plain string id
    delete returnedObject._id; // remove the mongo internal _id field
    delete returnedObject.__v; // remove the mongo versioning field
  },
});

// creates the 'notes' collection in MongoDB
module.exports = mongoose.model('Blog', blogSchema);
