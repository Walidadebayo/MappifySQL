/**
 * A module that provides a database connection and a model class for interacting with the database.
 * @module mappifysql
 */
const mappifysql = require('./lib/');

/**
 * A MapifySQL module that provides a database connection and a model class for interacting with the database.
 * @module mappifysql
 */
module.exports = mappifysql;

/**
 * Default export for the mappifysql module.
 * @type {Object}
 */
module.exports.default = mappifysql;

/**
 * Named export for the mappifysql module.
 * @type {Object}
 */
module.exports.mappifysql = mappifysql;


/** 
 * Exports the query function from the mappifysql module.
 * @type {Function}
 */
module.exports.query = mappifysql.query;

/**
 * Exports the connection object from the mappifysql module.
 * @type {Object}
 */
module.exports.connection = mappifysql.connection;

/**
 * Exports the beginTransaction function from the mappifysql module.
 * @type {Function}
 */
module.exports.beginTransaction = mappifysql.beginTransaction;

/**
 * Exports the commit function from the mappifysql module.
 * @type {Function}
 */
module.exports.commit = mappifysql.commit;

/**
* Exports the rollback function from the mappifysql module.
* @type {Function}
*/
module.exports.rollback = mappifysql.rollback;

/**
 * Exports the MappifyModel class from the mappifysql module.
 * @type {Class}
 */
module.exports.MappifyModel = mappifysql.MappifyModel;

