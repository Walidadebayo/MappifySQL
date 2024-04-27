const mappifysql = require('./lib/');

/**
 * Module exports.
 * @public
 * @type {Object}
 * @property {Function} Database - Database class for managing MySQL connections.
 * @property {Function} Model - Model class for creating models.
 */
module.exports = mappifysql;

module.exports.default = mappifysql;
module.exports.mappifysql = mappifysql;

// Re-export for ESM support
module.exports.Database = mappifysql.Database;
module.exports.Model = mappifysql.Model;

