const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({})
//   .then(result => {
//     console.log(result);
//   });

Todo.findByIdAndRemove('5b0f1769323397ca60b4f7fb').then(todo => {
  console.log(todo);

});
