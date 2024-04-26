const Database = require('./database');
const db = new Database();
db.createPool().then(() => {
}).catch((err) => {
    console.log(err);
});

var query = db.getQuery();

module.exports = { query };