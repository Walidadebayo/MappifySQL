const Database = require('./database');
class Model {
  static get tableName() {
    return this.name.toLowerCase();
  } 

  setProperties(properties) {
    for (let key in properties) {
      this[key] = properties[key];
    }
  }

  constructor(properties = {}) {
    this.setProperties(properties);
  }

  static async create() {
    var columns = Object.keys(this);
    var values = Object.values(this);

    var sql = `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${'?'.repeat(columns.length).split('').join(', ')})`;
    

  }
}


module.exports = Model;