const { between } = require('./condition');
const Database = require('./database');
const Model = require('./model');

class User extends Model {
    static get tableName() {
        return 'users';
    }

}

// User.findAll(
//     { group: 'category', order: 'price DESC' }
// ).then((records) => {
//     console.log(records);
// }).catch((err) => {
//     console.error(err);
// });

// // { where: { bonus_balance: { gt:200, lt: 100 }, and: ['id', 'name'] } }
// User.findOne(
//     { where: { first_name: { like: 'w%d' } } }
// )
// .then((record) => {
//     console.log(record);
// }).catch((err) => {
//     console.error(err);
// });

// User.findById(1).then((record) => {
//     record.setProperties({ columnName: 'new value', columnName: 'new value'})
//     record.update().then(() => {
//         console.log('Record updated successfully');
//     }).catch((err) => {
//         console.error(err);
//     });
// }).catch((err) => {
//     console.error(err);
// });

module.exports = {
    Database,
    Model
};
