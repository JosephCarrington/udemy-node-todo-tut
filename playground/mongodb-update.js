const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err) return console.log('Unable to conenct to MongoDB server');
  console.log('Connected to MongoDB Server');
  const db = client.db('TodoApp');

  db.collection('Users')
    .findOneAndUpdate({
      _id: new ObjectID('5b0ed8a28b21a64bf8dc2db7')
    }, {
      $set: {
        name: 'Joseph'
      },
      $inc: {
        age: 1
      }
    }, {
      returnOriginal: false
    }).then(result => {
      console.log(result);
    });
  client.close();
});
