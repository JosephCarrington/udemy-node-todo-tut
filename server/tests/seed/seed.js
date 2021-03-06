const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const dummyUsers = [
  {
    _id: userOneId,
    email: 'joseph.carrington@gmail.com',
    password: 'userOnePass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
  },
  {
    _id: userTwoId,
    email: 'test@example.com',
    password: 'userTwoPass',
  }
];

const dummyTodos = [
  {
    _id: new ObjectID(),
    text: 'First todo',
    completed: true,
    completedAt: new Date().getTime()
  },
  {
    _id: new ObjectID(),
    text: 'Second todo'
  }
];

const populateTodos = done => {
  Todo
    .remove({})
    .then(() => {
      return Todo.insertMany(dummyTodos);
    }).then(() => done());
};

const populateUsers = done => {
  User.remove({})
    .then(() => {
      let userOne = new User(dummyUsers[0]).save();
      let userTwo = new User(dummyUsers[1]).save();
      return Promise.all([userOne, userTwo])
    }).then(() => done());
}

module.exports = {dummyTodos, populateTodos, dummyUsers, populateUsers};
