const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {dummyTodos, populateTodos, dummyUsers, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err) return done(err);

        Todo.find({text}).then(todos => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch(e => done(e));
      });
  });

  it('should not create a todo with invalid body data', done => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err) return done(err);

        Todo.find().then(todos => {
          expect(todos.length).toBe(dummyTodos.length);
          done();
        })
      })
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(dummyTodos.length);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', done => {
    request(app)
      .get(`/todos/${dummyTodos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(dummyTodos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', done => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 400 if id is invalid', done => {
    request(app)
      .get('/todos/123')
      .expect(400)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', done => {
    let hexId = dummyTodos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if(err) return done(err);

        Todo.findById(hexId).then(todo => {
          expect(todo).toBeNull();
          done();
        }).catch(e => done(e));
      });
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 400 if objectId is invalid', (done) => {
    request(app)
      .delete('/todos/123')
      .expect(400)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  let hexId = dummyTodos[0]._id.toHexString();
  it('should update the todo', (done) => {
    request(app)
      .patch(`/todos/${hexId}`)
      .send({text: 'New test text', completed: true})
      .expect(200)
      .expect(res => {
        let todo = res.body.todo;
        expect(todo.text).toBe('New test text');
        expect(todo.completed).toBe(true);
        expect(typeof todo.completedAt).toBe('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is uncompleted', (done) => {
    request(app)
      .patch(`/todos/${hexId}`)
      .send({text: 'Some other test text', completed: false})
      .expect(200)
      .expect(res => {
        let todo = res.body.todo;
        expect(todo.text).toBe('Some other test text');
        expect(todo.completed).toBe(false);
        expect(todo.completedAt).toBeNull();
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return a user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', dummyUsers[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(dummyUsers[0]._id.toHexString());
        expect(res.body.email).toBe(dummyUsers[0].email);
      })
      .end(done);
  });

  it('should return a 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done)
  });
});

describe('POST /users', () => {
  let email = 'joe@test.com';
  let password = 'abc123!';
  it('should create a user', (done) => {
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end(err => {
        if(err) return done(err);

        User.findOne({email})
          .then(user => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe(password);
            done();
          });
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({email: 'joe', 'password': '123'})
      .expect(400)
      .end(done);
  });

  it('should not create a user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({email: dummyUsers[0].email, password})
      .expect(400)
      .end(done);
  });
});
