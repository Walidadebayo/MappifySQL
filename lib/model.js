const { query } = require('../lib/connection');


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
    var columns = Object.keys(this); // get all the keys of the object
    var values = Object.values(this); // get all the values of the object

    // create the sql query
    var sql = `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${'?'.repeat(columns.length).split('').join(', ')})`; 
    // execute the query
    var result = await query(sql, values);
    this.id = result.insertId; // set the id of the object
    this.created_at = result.created_at; // set the created_at of the object
    this.updated_at = result?.updated_at; // set the updated_at of the object
    return result;
  }

  async update() {
    var columns = Object.keys(this);
    var values = Object.values(this);
    var sql = `UPDATE ${this.constructor.tableName} SET ${columns.map(column => `${column} = ?`).join(', ')} WHERE id = ?`;
    var result = await query(sql, [...values, this.id]);
    this.updated_at = result.updated_at;
    return result.affectedRows > 0;
  }

  async delete() {
    var sql = `DELETE FROM ${this.constructor.tableName} WHERE id = ?`;
    var result = await query(sql, [this.id]);
    return result.affectedRows > 0;
  }


  static async findOne(options = {}) {
    // Destructure options
    const { where = {}, exclude = [], attributes = ['*'], operation } = options;

    // Prepare SELECT clause
    const selectedAttributes = attributes[0] === '*' ? '*' : attributes.join(', ');
      
    // check if where clause has multiple conditions and operation is not provided
    if (Object.keys(where).length > 1 && !operation) {
      throw new Error('Operation must be provided when where clause has multiple conditions');
    }else if(Object.keys(where).length > 1 && operation !== 'AND' && operation !== 'OR'){
      throw new Error('Operation must be AND or OR');
    } else if(Object.keys(where).length === 0){
      throw new Error('Where clause must be provided');
    }
    
    // Prepare WHERE clause
    const whereClause = Object.keys(where).length ? `WHERE ${Object.keys(where).map(key => `${key} = ?`).join(` ${operation || 'AND'} `)}` : '';
    const whereValues = Object.values(where);

    // Construct SQL query
    const sql = `SELECT ${selectedAttributes} FROM ${this.tableName} ${whereClause}`;
    var result = await query(sql, whereValues);
    if (result.length > 0) {
      exclude.forEach(key => delete result[0][key]);
      return new this(result[0]);
    }
    return null;
  }

  static async findById(id) {
    var sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    var result = await query(sql, [id]);
    if (result.length > 0) {
      return new this(result[0]);
    }
    return null;
  }

  static async findAll(options = {}) {
    const { attributes = ['*'], exclude = [], where = {}, limit, offset, order, operation } = options;

    // Prepare SELECT clause
    const selectedAttributes = attributes[0] === '*' ? '*' : attributes.join(', ');

    // check if where clause has multiple conditions and operation is not provided
    if (Object.keys(where).length > 1 && !operation) {
      throw new Error('Operation must be provided when where clause has multiple conditions');
    }else if(Object.keys(where).length > 1 && operation !== 'AND' && operation !== 'OR'){
      throw new Error('Operation must be AND or OR');
    }

    // Prepare WHERE clause
    const whereClause = Object.keys(where).length ? `WHERE ${Object.keys(where).map(key => `${key} = ?`).join(` ${operation || 'AND'} `)}` : '';
    const whereValues = Object.values(where);

    // Prepare LIMIT and OFFSET clauses
    if ((offset && !limit) || (!offset && limit)) {
      throw new Error('Both limit and offset must be provided together');
    }
    const limitClause = limit ? `LIMIT ${limit}` : '';
    const offsetClause = offset ? `OFFSET ${(offset - 1) * limit}` : '';

    // Prepare ORDER BY clause
    const orderClause = order ? `ORDER BY ${order}` : '';

    // Construct SQL query
    const sql = `SELECT ${selectedAttributes} FROM ${this.tableName} ${whereClause} ${orderClause} ${limitClause} ${offsetClause}`;

    // Execute query
    let result = await query(sql, whereValues);

    // Exclude unwanted attributes
    result = result.map(row => {
      exclude.forEach(key => delete row[key]);
      return new this(row);
    });

    return result;
  }
  static async findOrCreate(options = {}, defaults) {
    var instance = await this.findOne(options);
    if (instance) {
      return instance;
    }
    var { where } = options;
    if (Object.keys(where).length === 0) {
      throw new Error('Defaults must be provided');
    }
    instance = new this({ ...where, ...defaults });
    await instance.create();
    return { instance, created: true }
  }

  static async findAndDestroyOne(id) {
    if (!id) {
      throw new Error('ID must be provided');
    }
    var instance = await this.findById(id);
    if (instance) {
      await instance.delete();
      return true;
    }
    throw new Error('No record found');
  }



  static async findOneAndUpdate(options = {}, defaults) {
    var instance = await this.findOne(options);
    if (instance) {
      for (let key in defaults) {
        instance[key] = defaults[key];
      }
      await instance.update();
      return instance;
    }
    throw new Error('No record found');
  }

  static async findByIdAndUpdate(id, defaults) {
    var instance = await this.findById(id);
    if (instance) {
      for (let key in defaults) {
        instance[key] = defaults[key];
      }
      await instance.update();
      return instance;
    }
    return null;
  }

  static async findByIdAndDelete(id) {
    var instance = await this.findById(id);
    if (instance) {
      await instance.delete();
      return true;
    }
    throw new Error('No record found');
  }

  static async findByEmail(option = {}) {
    const { where = {} } = option;
    if (!where.email) {
      throw new Error('Email must be provided');
    }
    return this.findOne(option);

  }

  static async findByUsername(options = {}) {
    const { where = {} } = options;
    if (!where.username) {
      throw new Error('Username must be provided');
    }
    return this.findOne(options);
  }

  static async findByEmailOrUsername(options = {}) {
    const { where = {} } = options;
    if (!where.email && !where.username) {
      throw new Error('Email or username must be provided');
    } else if (Object.keys(where).length > 1) {
      throw new Error('Only email or username must be provided');
    }
    return this.findOne(options);
  };

}

module.exports = Model;