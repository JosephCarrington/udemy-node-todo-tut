require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

let app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }).catch(e => {
    res.status(400).send();
  });
});

app.get('/todos', (req, res) => {
  Todo
    .find()
    .then(todos => {
      res.send({todos});
    })
    .catch(e => {
      res.status(400).send();
    });
});

app.get('/todos/:id', (req, res) => {
  let idString = req.params.id;
  if(!ObjectID.isValid(idString)) return res.status(400).send(`${idString} is not a valid ID`);
  Todo
    .findById(idString)
    .then(todo => {
      if(!todo) return res.status(404).send();
      res.send({todo});
    })
    .catch(e => res.status(400).send());
});

app.delete('/todos/:id', (req, res) => {
  let idString = req.params.id;
  if(!ObjectID.isValid(idString)) return res.status(400).send(`${idString} is not a valid ID`);

  Todo.findByIdAndRemove(idString)
    .then(todo => {
      if(!todo) return res.status(404).send();
      res.send({todo});
    })
    .catch(e => res.status(400).send());
});

app.patch('/todos/:id', (req, res) => {
  let idString = req.params.id;
  if(!ObjectID.isValid(idString)) return res.status(400).send(`${idString} is not a valid ID`);
  let body = _.pick(req.body, ['text', 'completed']);

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(idString, {$set: body, $inc: {__v: 1}}, {new: true})
    .then(todo => {
      if(!todo) return res.status(404).send();
      res.send({todo});
    }).catch(e => res.status(400).send(e));
});

app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let newUser = new User(body);
  newUser.save().then(() => {
    return newUser.generateAuthToken();
  }).then(token => {
    res.header('x-auth', token).send(newUser);
  }).catch(e => res.status(400).send(e));
});

app.listen(process.env.PORT, () => {
  console.log(`Started on port ${process.env.PORT}`);
});

module.exports = {app};
