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


// Re-export for ESM support
/**
 * Exports the Database class from the mappifysql module.
 * @type {Class}
 */
module.exports.Database = mappifysql.Database;

/**
 * Exports the MappifyModel class from the mappifysql module.
 * @type {Class}
 */
module.exports.MappifyModel = mappifysql.MappifyModel;