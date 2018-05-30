const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err) return console.log('Unable to conenct to MongoDB server');
  console.log('Connected to MongoDB Server');
  const db = client.db('TodoApp');

  db.collection('Users').findOneAndDelete({name: 'Mike'}).then(result => {
    console.log(result);
  });
  // db.collection('Todos').findOneAndDelete({completed: false}).then(result => {
  //   console.log(result);
  // });

  client.close();
});
