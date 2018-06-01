const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 10
};

let token = jwt.sign(data, '123abc');
console.log('Token: ', token);

let decoded = jwt.verify(token, '123abc');
console.log('Decoded: ', decoded)

// let message = 'I am user 3';
// let hash = SHA256(message).toString();
//
// console.log('Message: ', message);
// console.log('Hash: ', hash);
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'myserversecret').toString()
// }
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data).toString());
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'myserversecret').toString();
//
// if(resultHash === token.hash) {
//   console.log('data was not changed');
// } else {
//   console.log('data was changed. Do not trust!')
// };
