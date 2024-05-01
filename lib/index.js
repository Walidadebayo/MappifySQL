const { connection } = require('./connection');
const { Database } = require('./database');
const { MappifyModel } = require('./model');

// class User extends MappifyModel {
    
// }


// (async () => {
//     try {
//         connection.beginTransaction();
//         let user = new User({ first_name: 'John', last_name: 'Doe' });
//         await user.save();
//         let user2 = new User({ firstname: 'Jane', last_name: 'Doe' });
//         await user2.save();
//          connection.commit();
//     } catch (err) {
//          connection.rollback();
//         console.error(err);
//     }
        
// })();
        

/**
 * Database class for managing MySQL connections.
 * @example const db = new Database();
 * db.createConnection().then((connection) => {
 * console.log('Connection created successfully');
 * } catch (err) {
 * console.error(err);
 * }
 */
module.exports.Database = Database;

/**
 * Model class for managing database records.
 * @example class User extends MappifyModel {}
 */
module.exports.MappifyModel = MappifyModel;
