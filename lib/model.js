const { query } = require('../lib/connection');
const pluralize = require('pluralize');
const conditions = require('./condition');

// This function prepares a WHERE clause for a SQL query based on the provided conditions
function prepareWhereClause(where, conditions) {
  // Initialize the whereClause and whereValues
  let whereClause = '';
  let whereValues = [];

  // Check if there are any conditions to process
  if (Object.keys(where).length) {
    // Initialize an array to hold the individual conditions
    let conditionsArray = [];

    // Loop over each condition
    for (let key in where) {
      // Check if the condition is an array (i.e., it's a complex condition with multiple parts)
      if (Array.isArray(where[key])) {
        // Process each part of the complex condition
        let subConditions = where[key].map(subWhere => {
          // Extract the key and value from the sub-condition
          let subKey = Object.keys(subWhere)[0];
          let subValue = subWhere[subKey];

          // Check if the value is an operator
          let isOperator = typeof subValue === 'object' && subValue !== null && Object.keys(subValue).some(key => conditions[key]);

          // If the value is an operator, process it accordingly
          if (isOperator) {
            // Check if the operator is 'in' or 'notIn'
            if (Object.keys(subValue)[0] === 'in' || Object.keys(subValue)[0] === 'notIn') {
              // Extract the array of values for the 'in' or 'notIn' operator
              let arr = Object.values(subValue)[0];

              // Check if the values are indeed an array
              if (!Array.isArray(arr)) {
                throw new Error('Value of in or notIn must be an array');
              }

              // Format the values correctly
              arr = arr.map(value => typeof value === 'string' ? `'${value}'` : value);
              let str = '(' + arr.join(',') + ')';

              // Return the condition string
              return `${subKey} ${Object.keys(subValue)[0]} ${str}`;
            } else if (Object.keys(subValue)[0] === 'between' || Object.keys(subValue)[0] === 'notBetween') {
              // Extract the array of values for the 'between' or 'notBetween' operator
              let arr = Object.values(subValue)[0];

              // Check if the values are indeed an array of length 2
              if (!Array.isArray(arr) || arr.length !== 2) {
                throw new Error('Value of between must be an array of length 2');
              }

              // Format the values correctly
              arr = arr.map(value => typeof value === 'string' ? `'${value}'` : value);
              let str = arr.join(' AND ');

              // Return the condition string
              return `${subKey} ${Object.keys(subValue)[0]} ${str}`;
            } else if (Object.keys(subValue)[0] === 'isNull' || Object.keys(subValue)[0] === 'isNotNull') {
              // Check if the value is true for the 'isNull' or 'isNotNull' operator
              if (subValue[Object.keys(subValue)[0]] !== true) {
                throw new Error('Value of isNull or isNotNull must be true');
              }

              // Return the condition string
              return `${subKey} ${Object.keys(subValue)[0]}`;
            } else {
              // If the operator is not 'in' or 'notIn', process it accordingly
              if (conditions[Object.keys(subValue)[0]] === 'AND' || conditions[Object.keys(subValue)[0]] === 'OR') {
                throw new Error(`Invalid operator '${Object.keys(subValue)[0]}'`);
              }

              // Extract the value for the operator
              let value = Object.values(subValue)[0];

              // If the value is a string, wrap it in quotes
              if (typeof value === 'string') {
                value = `'${value}'`;
              }

              // Return the condition string
              return `${subKey} ${conditions[Object.keys(subValue)[0]]} ${value}`;
            }
          } else if (conditions[subKey]) {
            // If the subKey is a valid condition, add it to the whereValues and return the condition string
            whereValues.push(subValue);
            return `${subKey} ${conditions[subKey]} ?`;
          } else {
            // If the subKey is not a valid condition, check if the subValue is an object
            if (typeof subValue === 'object') {
              throw new Error(`Invalid operator '${Object.keys(subValue)[0]}'`);
            }

            // Add the subValue to the whereValues and return the condition string
            whereValues.push(subValue);
            return `${subKey} = ?`;
          }
        });

        //if the condition is not AND or OR, throw an error
        if (conditions[key] !== 'AND' && conditions[key] !== 'OR') {
          throw new Error(`Invalid operator '${key}'`);
        }

        // Add the processed complex condition to the conditionsArray
        conditionsArray.push(`(${subConditions.join(` ${conditions[key] || 'AND'} `)})`);
      } else if (typeof where[key] === 'object' && where[key] !== null) {
        // If the condition is an object, process each operator in it
        for (let operator in where[key]) {
          if (conditions[operator]) {
            // If the operator is 'in', 'notIn', 'between', or 'notBetween', process it accordingly
            if (operator === 'in' || operator === 'notIn') {
              let arr = where[key][operator];
              if (!Array.isArray(arr)) {
                throw new Error('Value of in or notIn must be an array');
              }
              arr = arr.map(value => typeof value === 'string' ? `'${value}'` : value);
              let str = arr.join(',');
              conditionsArray.push(`${key} ${conditions[operator]} (${str})`);
            } else if (operator === 'between' || operator === 'notBetween') {
              let arr = where[key][operator];
              if (!Array.isArray(arr) || arr.length !== 2) {
                throw new Error('Value of between must be an array of length 2');
              }
              arr = arr.map(value => typeof value === 'string' ? `'${value}'` : value);
              let str = arr.join(' AND ');
              conditionsArray.push(`${key} ${conditions[operator]} ${str}`);
            } else if (operator === 'isNull' || operator === 'isNotNull') {
              if (where[key][operator] !== true) {
                throw new Error('Value of isNull or isNotNull must be true');
              }
              conditionsArray.push(`${key} ${conditions[operator]}`);
            } else if (operator === 'and' || operator === 'or') {
              throw new Error(`Invalid operator '${operator}'`);
            }
            else {
              // If the operator is not 'in', 'notIn', 'between', or 'notBetween', isNull or isNotNull , add it to the whereValues and conditionsArray
              if (conditions[operator] === 'AND' || conditions[operator] === 'OR') {
                throw new Error(`Invalid operator '${operator}'`);
              }
              conditionsArray.push(`${key} ${conditions[operator]} ?`);
              whereValues.push(where[key][operator]);
            }
          }
          else {
            if (key == 'not') {
              conditionsArray.push(`NOT (${operator} = ?)`);
              whereValues.push(Object.values(where[key])[0]);
            }
          }
        }
      } else {
        // If the condition is not an array or an object, add it to the whereValues and conditionsArray
        conditionsArray.push(`${key} = ?`);
        whereValues.push(where[key]);
      }
    }

    // Join all the conditions with 'AND' to form the whereClause
    whereClause = `WHERE ${conditionsArray.join(' AND ')}`;
  }

  // Return the whereClause and whereValues
  return { whereClause, whereValues };
}

/**
 * Model class for managing database records.
 * @example class User extends MappifyModel {}
 */
class MappifyModel {
  /**
   * This static getter returns the table name for the model, which is the pluralized, lowercased class name.
   * @example User.tableName // returns 'users'
   * @example using in static functions method -> this.tableName
   * @example using in instance functions method -> this.constructor.tableName
   * @returns {string} The table name.
   */
  static get tableName() {
    return pluralize(this.name.toLowerCase());
  }

  /**
   * This method sets properties on the instance from a given object.
   * @example user.setProperties({ name: 'John Doe', email: 'user@example.com' });
   * @param {object} properties - The properties to set.
   */
  setProperties(properties) {
    for (let key in properties) {
      this[key] = properties[key];
    }
  }


  /**
   * This method is used to define associations between models.
   * @example class Post extends MappifyModel {
   * associations() {
   * this.belongsTo(User, {
   * as: 'user',
   * key: 'id',
   * foreignKey: 'user_id'
   * });
   * }
   * }
  */
  associations() {

  }

  /**
  * The constructor sets properties on the instance from a given object.
  * @example const user = new User({ name: 'John Doe', email: 'user@example.com' });
  * @param {object} properties - The properties to set.
  */
  constructor(properties = {}) {
    this.setProperties(properties);
    this.associations();
  }


  /**
   * This method is used to define a one-to-one relationship between two models.
   * @param {Model} relatedModel - The related model.
   * @param {object} options - The options for the association.
   * @param {string} options.as - The alias for the association.
   * @param {string} options.foreignKey - The foreign key in this model.
   * @example const ShippingAddress = require('path/to/shippingaddressmodel');
   * class Order extends MappifyModel {
   * associations() {
   * this.hasOne(ShippingAddress, {
   * as: 'shippingAddress',
   * foreignKey: 'order_id'
   * });
   * }
   * }
   */
hasOne(relatedModel, options) {
  this.associations[options.as] = {
    type: 'hasOne', // the type of association
    model: relatedModel, // the related model
    foreignKey: options.foreignKey // the foreign key in the related model
  };
}



/**
 * This method is used to define a one-to-one relationship between two models.
 * @param {Model} relatedModel - The related model.
 * @param {object} options - The options for the association.
 * @param {string} options.as - The alias for the association.
 * @param {string} options.key - The primary key in the related model.
 * @param {string} options.foreignKey - The foreign key in this model.
 * @example const Order = require('path/to/ordermodel');
 * class ShippingAddress extends MappifyModel {
 * associations() {
 * this.belongsTo(Order, {
 * as: 'order',
 * key: 'id',
 * foreignKey: 'order_id'
 * });
 * }
 * }
 * @example const Student = require('path/to/studentmodel');
 * const Course = require('path/to/coursemodel');
 * class Enrollment extends MappifyModel {
 * associations() {
 * this.belongsTo(Student, {
 * as: 'student',
 * key: 'id',
 * foreignKey: 'student_id'
 * });
 * this.belongsTo(Course, {
 * as: 'course',
 * key: 'id',
 * foreignKey: 'course_id'
 * });
 * }
 * }
 */
  belongsTo(relatedModel, options) {
    // Store the association in the associations property
    this.associations[options.as] = {
      type: 'belongsTo', // the type of association
      model: relatedModel, // the related model
      key: options.key, // the primary key in the related model
      foreignKey: options.foreignKey, // the foreign key in this model
    };
  }


  /**
   * This method is used to define a one-to-many relationship between two models.
   * @param {Model} relatedModel - The related model.
   * @param {object} options - The options for the association.
   * @param {string} options.as - The alias for the association.
   * @param {string} options.foreignKey - The foreign key in the related model.
   * @example const User = require('path/to/usermodel');
   * class Post extends MappifyModel {
   * associations() {
   * this.hasMany(User, {
   * as: 'user',
   * foreignKey: 'post_id'
   * });
   * }
   * }
   */
  hasMany(relatedModel, options) {
    // Store the association in the associations property
    this.associations[options.as] = {
      type: 'hasMany', // the type of association
      model: relatedModel, // the related model
      foreignKey: options.foreignKey // the foreign key in the related model
    };
  }

  /**
   * This method is used to define a many-to-many relationship between two models.
   * @param {Model} relatedModel - The related model.
   * @param {object} options - The options for the association.
   * @param {string} options.as - The alias for the association.
   * @param {string} options.through - The "join" table that connects the two models. i.e., the table that stores the foreign keys of the two models.
   * @param {string} options.key - The primary key in the related model.
   * @param {string} options.foreignKey - The foreign key in through model for this model.
   * @param {string} options.otherKey - The foreign key in through model for the related model.
   * @example const Enrollment = require('path/to/enrollmentmodel');
   * const Course = require('path/to/coursemodel');
   * class Student extends MappifyModel {
   * associations() {
   * this.belongsToMany(Course, {
   * as: 'courses',
   * through: Enrollment,
   * key: 'id',
   * foreignKey: 'student_id',
   * otherKey: 'course_id'
   * });
   * }
   * }
   * @example const Enrollment = require('path/to/enrollmentmodel');
   * const Student = require('path/to/studentmodel');
   * class Course extends MappifyModel {
   * associations() {
   * this.belongsToMany(Student, {
   * as: 'students',
   * through: Enrollment,
   * key: 'id',
   * foreignKey: 'course_id',
   * otherKey: 'student_id'
   * });
   * }
   * }
   */
  belongsToMany(relatedModel, options) {
    // Store the association in the associations property
    this.associations[options.as] = {
      type: 'belongsToMany',
      model: relatedModel,
      through: options.through, // the "join" table
      key: options.key, // the primary key in the related model
      foreignKey: options.foreignKey, // the foreign key in this model
      otherKey: options.otherKey, // the foreign key in the related model
    };
  }

  /**
   * This method fetches the related data for a given relation.
   * @param {string} relation - The name of the relation to populate.
   * @param {object} options - The options for the query. - (optional)
   * @param {Array} options.attributes - The columns to include in the result. - (optional)
   * @param {Array} options.exclude - The columns to exclude from the result. - (optional)
   * @example const post = await Post.findById(1);
   * await post.populate('user');
   * console.log(post.user);
   * @example const student = await Student.findById(1);
   * await student.populate('courses');
   * console.log(student.courses);
   * @example const course = await Course.findById(1);
   * await course.populate('students', { exclude: ['created_at', 'updated_at'] });
   * console.log(course.students);
   * @example const enrollment = await Enrollment.findById(1);
   * await enrollment.populate('student', { exclude: ['created_at', 'updated_at'] });
   * await enrollment.populate('course', { attributes: ['name', 'description'] });
   * console.log(enrollment.student);
   * console.log(enrollment.course);
   * @returns {this} The instance of the model with the populated relation.
   */
  async populate(relation, options = {}) {
    // Check if the relation is defined
    if (!this.associations[relation]) {
      throw new Error(`Relation "${relation}" is not defined`);
    }

    // Fetch the related data
    const relatedModel = this.associations[relation].model; // the related model
    const foreignKey = this.associations[relation].foreignKey; // the foreign key in this model
    const key = this.associations[relation].key; // the primary key in the related model

    if (this.associations[relation].type === 'hasOne') { // if the relation is a hasOne relation
      this[relation] = await relatedModel.findOne({
        where: { [foreignKey]: this.id }, // where the foreign key matches the id of this model
        attributes: options?.attributes ? options?.attributes : ['*'], // select all columns by default
        exclude: options?.exclude ? options?.exclude : [] // exclude no columns by default
      }).then((result) => {
        return Object.assign({}, result); // return the result as an object
      }).catch((err) => {
        console.log(err);
      });
    } else if (this.associations[relation].type === 'hasMany') { // if the relation is a hasMany relation
      this[relation] = await relatedModel.findAll({
        where: { [foreignKey]: this.id }, // where the foreign key matches the id of this model
        attributes: options?.attributes ? options?.attributes : ['*'], // select all columns by default
        exclude: options?.exclude ? options?.exclude : [] // exclude no columns by default
      }).then((result) => {
        return result.map((item) => { // return the result as an array of objects
          return Object.assign({}, item); // return the result as an object
        });
      }).catch((err) => {
        console.log(err);
      });
    } else if (this.associations[relation].type === 'belongsTo') { // if the relation is a belongsTo relation
      this[relation] = await relatedModel.findOne({
        where: { [key]: this[foreignKey] }, // where the primary key matches the foreign key of this model
        attributes: options?.attributes ? options?.attributes : ['*'], // select all columns by default
        exclude: options?.exclude ? options?.exclude : [] // exclude no columns by default
      }).then((result) => {
        return Object.assign({}, result); // return the result as an object
      }).catch((err) => {
        console.log(err);
      });
    } else if (this.associations[relation].type === 'belongsToMany') {
      // Fetch the related data
      const throughModel = this.associations[relation].through; // the "join" table that connects the two models
      const otherKey = this.associations[relation].otherKey; // the foreign key in the related model
      const foreignKey = this.associations[relation].foreignKey; // the foreign key in this model

      // Fetch the related data
      var initial = await throughModel.findAll({
        where: { [foreignKey]: this.id }, // where the foreign key matches the id of this model
        attributes: options?.attributes ? options?.attributes : ['*'], // select all columns by default
        exclude: options?.exclude ? options?.exclude : [] // exclude no columns by default
      });

      this[relation] = await Promise.all(initial.map(async (item) => { // return the result as an array of objects
        var result = await relatedModel.findOne({ // find the related model
          where: { [key]: item[otherKey] } // where the primary key matches the foreign key of the related model
        });
        return Object.assign({}, result); // return the result as an object
      }));
    }

  }

  
  /**
   * This method saves the instance to the database.
   * @example const product = new Product({ name: 'Product 1', price: 100 });
   * await product.save();
   * @returns {Promise<number>} The ID of the inserted record.
   */
  async save() {
    var columns = Object.keys(this); // get all the keys of the object
    var values = Object.values(this); // get all the values of the object

    // create the sql query and replace the values with question marks
    var sql = `INSERT INTO ${this.constructor.tableName} (${columns.join(', ')}) VALUES (${'?'.repeat(columns.length).split('').join(', ')})`;

    // execute the query
    var result = await query(sql, values);
    // Set the id properties of the model instance
    this.id = result.insertId;
    return result.insertId;
  }

  /**
   * This method updates the instance in the database.
   * @example var product = await Product.findById(1);
   * product.price = 200;
   * await product.update();
   * @returns {Promise<boolean>} A promise that resolves to true if the record was updated, otherwise false.
   */
  async update() {
    var columns = Object.keys(this);
    var values = Object.values(this);
    var sql = `UPDATE ${this.constructor.tableName} SET ${columns.map(column => `${column} = ?`).join(', ')} WHERE id = ?`;
    var result = await query(sql, [...values, this.id]);
    this.updated_at = result.updated_at;
    return result.affectedRows > 0;
  }

  /**
   * This method deletes the instance from the database.
   * @example var product = await Product.findById(1);
   * await product.delete();
   * @returns {Promise<boolean>} A promise that resolves to true if the record was deleted, otherwise false.
   */
  async delete() {
    var sql = `DELETE FROM ${this.constructor.tableName} WHERE id = ?`;
    var result = await query(sql, [this.id]);
    return result.affectedRows > 0;
  }

  /**
   * This method fetches all records from the database.
   * @example var products = await Product.fetch();
   * @returns {Promise<Array<Model>>} An array of instances.
   */
  static async fetch() {
    var sql = `SELECT * FROM ${this.tableName}`;
    var rows = await query(sql);
    return rows.map(row => new this(row));
  }

  /**
   * This static method fetches one record from the table based on the provided options.
   * @param {object} options - The options for the query.
   * @param {object} options.where - The WHERE clause for the query.
   * @param {Array} options.exclude - The columns to exclude from the result.
   * @param {Array} options.attributes - The columns to include in the result.
   * @example var product = await Product.findOne({ where: { id: 1 } });
   * @example var product = await Product.findOne({ where: { name: 'Product 1' }, exclude: ['created_at', 'updated_at'] });
   * @example var product = await Product.findOne({ where: { price: { gt: 100 } }, attributes: ['name', 'price'] });
   * @example var product = await Product.findOne({ where: { price: { gt: 100, lt: 200 } } });
   * @example var product = await Product.findOne({ where: { price: { in: [100, 200] } } });
   * @example var product = await Product.findOne({ where: { price: { notIn: [100, 200] } } });
   * @example var product = await Product.findOne({ where: { price: { between: [100, 200] } } });
   * @example var product = await Product.findOne({ where: { price: { notBetween: [100, 200] } } });
   * @example var product = await Product.findOne({ where: { name: { like: 'Product%' } } });
   * @example var product = await Product.findOne({ where: { name: { notLike: 'Product%' } } });
   * @example var product = await Product.findOne({ where: { name: { isNull: true } } });
   * @example var product = await Product.findOne({ where: { name: { isNotNull: true } } });
   * @example var product = await Product.findOne({ where: { not: { name: 'Product 1' } } });
   * @example var product = await Product.findOne({ where: { and: [{ name: 'Product 1' }, { price: 100 }] } });
   * @example var product = await Product.findOne({ where: { or: [{ name: 'Product 1' }, { price: 100 }] } });
   * @returns {Promise<Array|null>} An instance of an array or null if no record was found.
   */
  static async findOne(options = {}) {
    // Destructure options
    const { where = {}, exclude = [], attributes = ['*'] } = options;

    // Prepare SELECT clause
    const selectedAttributes = attributes[0] === '*' ? '*' : attributes.join(', ');

    // Prepare WHERE clause
    if (Object.keys(where).length === 0) {
      throw new Error('Where clause must be provided');
    }
    const { whereClause, whereValues } = prepareWhereClause(where, conditions);

    // Construct SQL query
    const sql = `SELECT ${selectedAttributes} FROM ${this.tableName} ${whereClause}`;
    var result = await query(sql, whereValues);
    if (result.length > 0) {
      exclude.forEach(key => delete result[0][key]);
      return new this(result[0]);
    }
    return null;
  }

  /**
   * This static method fetches one record from the table based on the provided ID.
   * @param {number} id - The ID of the record to fetch.
   * @example var product = await Product.findById(1);
   * console.log(product);
   * @returns {Promise<Array|null>} An instance of an array or null if no record was found.
   */
  static async findById(id) {
    var sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    var result = await query(sql, [id]);
    if (result.length > 0) {
      return new this(result[0]);
    }
    return null;
  }

  /**
   * This static method fetches all records from the table based on the provided options.
   * @param {object} options - The options for the query.
   * @param {object} options.where - The WHERE clause for the query.
   * @param {Array} options.exclude - The columns to exclude from the result.
   * @param {Array} options.attributes - The columns to include in the result.
   * @param {number} options.limit - The maximum number of records to fetch.
   * @param {number} options.offset - The number of records to skip.
   * @param {string} options.order - The column to order the results by.
   * @param {string} options.group - The column to group the results by.
   * @example var products = await Product.findAll();
   * @example var products = await Product.findAll({ where: { price: { gt: 100 } } });
   * @example var products = await Product.findAll({ where: { price: { gt: 100, lt: 200 } } });
   * @example var products = await Product.findAll({ where: { price: { in: [100, 200] } } });
   * @example var products = await Product.findAll({ where: { price: { notIn: [100, 200] } } });
   * @example var products = await Product.findAll({ where: { price: { between: [100, 200] } } });
   * @example var products = await Product.findAll({ where: { price: { notBetween: [100, 200] } } });
   * @example var products = await Product.findAll({ where: { name: { like: 'Product%' } } });
   * @example var products = await Product.findAll({ where: { name: { notLike: 'Product%' } } });
   * @example var products = await Product.findAll({ where: { name: { isNull: true } } });
   * @example var products = await Product.findAll({ where: { name: { isNotNull: true } } });
   * @example var products = await Product.findAll({ where: { not: { name: 'Product 1' } } });
   * @example var products = await Product.findAll({ where: { and: [{ name: 'Product 1' }, { price: 100 }] } });
   * @example var products = await Product.findAll({ where: { or: [{ name: 'Product 1' }, { price: 100 }] } });
   * @example var products = await Product.findAll({ exclude: ['created_at', 'updated_at'] });
   * @example var products = await Product.findAll({ attributes: ['name', 'price'] });
   * @example var products = await Product.findAll({ limit: 10, offset: 0 });
   * @example var products = await Product.findAll({ order: 'price DESC' });
   * @example var products = await Product.findAll({ group: 'category' });
   * @returns {Promise<Array<Model>>} An array of instances.
   */
  static async findAll(options = {}) {
    const { attributes = ['*'], exclude = [], where = {}, limit, offset, order, group } = options;

    // Prepare SELECT clause
    const selectedAttributes = attributes[0] === '*' ? '*' : attributes.join(', ');

    // Prepare WHERE clause
    const { whereClause, whereValues } = prepareWhereClause(where, conditions);


    // Prepare LIMIT and OFFSET clauses

    const limitClause = limit ? `LIMIT ${limit}` : '';
    const offsetClause = offset && limit ? `OFFSET ${(offset - 1) * limit}` : '';

    // Prepare ORDER BY clause
    const orderClause = order ? `ORDER BY ${order}` : '';

    // Prepare GROUP BY clause
    const groupClause = group ? `GROUP BY ${group}` : '';

    // Construct SQL query
    const sql = `SELECT ${selectedAttributes} FROM ${this.tableName} ${whereClause} ${groupClause} ${orderClause} ${limitClause} ${offsetClause}`;
    console.log(sql, whereValues);
    // Execute query
    let result = await query(sql, whereValues);
    // Exclude unwanted attributes
    result = result.map(row => {
      exclude.forEach(key => delete row[key]);
      return new this(row);
    });

    return result;
  }

  /**
   * This static method finds a record based on the provided options, or creates a new record if no record is found.
   * @param {object} options - The options for the query.
   * @param {object} data - The data to create the record with.
   * @example var user = await User.findOrCreate({ where: { email: 'user@example.com' } }, { name: 'John Doe', password: 'password' });
   * @returns {Promise<{ instance: Model, created: boolean }>} An object containing the instance and a boolean indicating if the record was created.
   * @throws {Error} Throws an error if the where clause is not provided.
   */
  static async findOrCreate(options = {}, data) {
    var record = await this.findOne(options);
    if (record) {
      return record;
    }
    var { where } = options;
    if (Object.keys(where).length === 0) {
      throw new Error('Where clause must be provided');
    }
    record = new this({ ...where, ...data });
    await record.create();
    return { instance: record, created: true }
  }

  /**
    * This static method deletes a record from the table based on its ID.
    * @param {number} id - The ID of the record to delete.
    * @example await User.findByIdAndDelete(1);
    * @returns {Promise<boolean>} A promise that resolves to true if the record was deleted, otherwise false.
    * @throws {Error} Throws an error if the ID is not provided or if no record is found.
    * @example await User.findByIdAndDelete(1);
    */
  static async findByIdAndDelete(id) {
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

  /**
   * This static method updates a record in the table based on the provided options.
   * @param {object} options - The options for the query.
   * @param {object} options.where - The WHERE clause for the query.
   * @param {object} data - The new data for the record.
   * @example await Product.findOneAndDelete({ where: { name: 'Product 1' } });
   * @returns {Promise<Model|null>} The updated instance or null if no record was found.
   * @throws {Error} Throws an error if the where clause is not provided or if no record is found.
   */
  static async findOneAndDelete(options = {}) {
    if (Object.keys(options).length > 1) {
      throw new Error('Only where clause must be provided');
    }
    var instance = await this.findOne(options);
    if (instance) {
      await instance.delete();
      return true;
    }
    throw new Error('No record found');
  }

  /**
   * This static method updates a record in the table based on the provided options.
   * @param {object} options - The options for the query.
   * @param {object} options.where - The WHERE clause for the query.
   * @param {object} options.attributes - The columns to include in the result.
   * @param {object} options.exclude - The columns to exclude from the result.
   * @param {object} data - The new data for the record.
   * @example await Product.findOneAndUpdate({ where: { id: 1 } }, { price: 200 });
   * @returns {Promise<Model|null>} The updated instance or null if no record was found.
   * @throws {Error} Throws an error if the where clause is not provided or if no record is found.
   */
  static async findOneAndUpdate(options = {}, data) {
    var instance = await this.findOne(options);
    if (instance) {
      for (let key in data) {
        instance[key] = data[key];
      }
      await instance.update();
      return instance;
    }
    throw new Error('No record found');
  }

  /**
   * This static method updates a record in the table based on the provided ID.
   * @param {number} id - The ID of the record to update.
   * @param {object} data - The new data for the record.
   * @example await Product.findByIdAndUpdate(1, { price: 200 });
   * @returns {Promise<Model|null>} The updated instance or null if no record was found.
   * @throws {Error} Throws an error if the ID is not provided or if no record is found.
   */
  static async findByIdAndUpdate(id, data) {
    var instance = await this.findById(id);
    if (instance) {
      for (let key in data) {
        instance[key] = data[key];
      }
      await instance.update();
      return instance;
    }
    return null;
  }

}

module.exports = MappifyModel;