const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

let app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }).catch(e => {
    res
    .status(400)
    .send();
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

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
