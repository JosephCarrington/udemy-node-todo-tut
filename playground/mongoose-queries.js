const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectID} = require('mongodb');

let id = '5b0efc767c9008cdd4d344c5';
if(!ObjectID.isValid(id)) return console.log('Id not valid');

// Todo.find({_id: id})
//   .then(todos => {
//     console.log('Todos:', todos);
//   });
//
// Todo.findOne({_id: id})
//   .then(todo => {
//     console.log('Todo: ', todo);
//   });

Todo.findById(id)
  .then(todo => {
    if(!todo) return console.log('ID not found');
    console.log('Todo By Id: ', todo);
  }).catch(e => console.log(e));

User.findById(id)
  .then(user => {
    if(!user) return console.log('ID for user not found');
    console.log('User by ID: ', user);
  }).catch(e => console.log(e));
