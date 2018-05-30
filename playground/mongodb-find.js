const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err) return console.log('Unable to conenct to MongoDB server');
  console.log('Connected to MongoDB Server');
  const db = client.db('TodoApp');

  // db.collection('Todos')
  //   .find({
  //     _id: new ObjectID('5b0edd28323397ca60b4e34d')
  //   })
  //   .toArray()
  //   .then((docs) => {
  //     console.log('Todos');
  //     console.log(JSON.stringify(docs, undefined, 4));
  //   }).catch(err => {
  //     console.error('Unable to fetch todos', err);
  //   });
  // db.collection('Todos')
  //   .find()
  //   .count()
  //   .then((count) => {
  //     console.log(`Total Todos: ${count}`);
  //   }).catch(err => {
  //     console.error('Unable to fetch todos', err);
  //   });
  db.collection('Users')
    .find({name: 'Joseph'})
    .toArray()
    .then(docs => {
      console.log(JSON.stringify(docs, undefined, 4));
    }).catch(err => {
      console.error('Unable to fetch todos', err);
    });
  client.close();
});
