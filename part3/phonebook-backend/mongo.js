const mongoose = require('mongoose');

if (process.argv.length === 2) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.o4gipdu.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);
mongoose.connect(url, { family: 4 }); //the connection should always use IPv4

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', phoneBookSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length === 4) {
  console.log('please add a number');
  process.exit(1);
}

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });
  person.save().then(() => {
    console.log('person added to phonebook!');
    mongoose.connection.close();
  });
}
