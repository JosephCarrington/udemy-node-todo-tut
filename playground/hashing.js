const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = '123abc!';

bcrypt.genSalt(12, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

let hashedPassword = '$2a$12$1OU7rQ9fncqfQo3jUKfcPu7NXcbzjOy292P3CzwTAEqJdKpMHjfYK';

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});
