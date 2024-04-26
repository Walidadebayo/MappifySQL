const Database = require('./database');
const Model = require('./model');

const db = new Database();
db.createPool().then(() => {
    console.log('Database connected successfully');
}).catch((err) => {
    console.error(err);
});

var query = db.getQuery();
var query = db.getQuery();

class User extends Model {
    static get tableName() {
        return 'users';
    }
}


// User.findByEmail({where:{email:'adebayowalid@gmail.com'}}).then((result) => {
//     console.log(result);
// }).catch((err) => {
//     console.error(err);
// });

// (async () => {
// User.findAll({
//         attributes: ['id', 'first_name', 'email', 'created_at', 'password', 'is_subscribed', 'verified'],
//         exclude: ['password'],
//         // where: {
//         //     verified: 0,
//         //     is_subscribed: 0,
//         //     // is_subscribed: 1
//         // },
//         // operation: 'AND',
//         // order: 'created_at DESC',
//         limit: 2,
//         offset: 1,
//     }).then((result) => {
//         console.log(result);
//     }).catch((err) => {
//         console.error(err);
//     });

// })();
// })();


module.exports = {
    Database,
    Model
};
