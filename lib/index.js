const Database = require('./database');
const Model = require('./model');

const connection = new Database('adealtutor', 'root', '', 'localhost');

connection.createConnection();

// var query = connection.query;
// query('SELECT * FROM users').then((result) => {
//     console.log(result);
// }).catch((err) => {
//     console.log(err);
// });
module.exports = {
    Database,
    Model
};