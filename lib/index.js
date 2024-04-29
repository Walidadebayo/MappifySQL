const { Database } = require('./database');
const { MappifyModel } = require('./model');

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
