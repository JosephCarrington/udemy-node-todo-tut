const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err) return console.log('Unable to conenct to MongoDB server');
  console.log('Connected to MongoDB Server');
  const db = client.db('TodoApp');

  // db.collection('Todos')
  //   .insertOne({
  //     text: 'My first todo',
  //     completed: false
  //   }, (err, result) => {
  //     if(err) return console.log('Unable to insert todo', err);
  //     console.log(JSON.stringify(result.ops, undefined, 4));
  //   });

  // db.collection('Users')
  //   .insertOne({
  //     name: 'Joseph',
  //     age: 34,
  //     location: 'Santa Fe'
  //   }, (err, result) => {
  //     if(err) return console.log('Unable to insert user', err);
  //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 4));
  //   });
  client.close();
});
