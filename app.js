const mappifysql = require('./lib/');

module.exports = mappifysql;

module.exports.default = mappifysql;
module.exports.mappifysql = mappifysql;

// Re-export for ESM support
module.exports.Database = mappifysql.Database;
module.exports.MappifyModel = mappifysql.MappifyModel;

