const { between } = require('./condition');
const Database = require('./database');
const MappifyModel = require('./model');

class User extends MappifyModel {
    static get tableName() {
        return 'users';
    }

}

module.exports = {
    Database,
    MappifyModel
};
