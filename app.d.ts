import { ErrorPacketParams, OkPacketParams, Pool, PoolConnection, Prepare, PrepareStatementInfo } from "mysql2";

/**
 * A module that provides a database connection and a model class for interacting with the database.
 * @example const mappifysql = require('mappifysql');
 * @example const { Database, MappifyModel, query, connection } = require('mappifysql');
 * @module mappifysql
 */
declare module 'mappifysql' {

  /**
   * Model class for managing database records.
   * @example class User extends MappifyModel {}
   */
  export class MappifyModel {
    /**
    * This static getter returns the table name for the model, which is the pluralized, lowercased class name.
    * @example User.tableName // returns 'users'
    * @example using in static functions method -> this.tableName
    * @example using in instance functions method -> this.constructor.tableName
    * @returns {string} The table name.
    */
    static get tableName(): string;


    /**
   * This method sets properties on the instance from a given object.
   * @example user.setProperties({ name: 'John Doe', email: 'user@example.com' });
   * @param {object} properties - The properties to set.
   */
    setProperties(properties: object): void;


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
    associations(): void;


    /**
   * This method is used to define a one-to-one relationship between two models.
   * @param {MappifyModel} relatedModel - The related model.
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
    hasOne(relatedModel: MappifyModel, options: { as: string, foreignKey: string }): void;


    /**
   * This method is used to define a one-to-one relationship between two models.
   * @param {MappifyModel} relatedModel - The related model.
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
    belongsTo(relatedModel: typeof MappifyModel, options: { as: string, key: string, foreignKey: string }): void;


    /**
   * This method is used to define a one-to-many relationship between two models.
   * @param {MappifyModel} relatedModel - The related model.
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
    hasMany(relatedModel: MappifyModel, options: { as: string, foreignKey: string }): void;


    /**
   * This method is used to define a many-to-many relationship between two models.
   * @param {MappifyModel} relatedModel - The related model.
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
    belongsToMany(relatedModel: MappifyModel, options: { as: string, through: MappifyModel, key: string, foreignKey: string, otherKey: string }): void;


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
    populate(relation: string, options?: { attributes?: Array<string>, exclude?: Array<string> }): this;


    /**
   * This method attaches a new record to the related model and associates it with the current instance.
   * @param {MappifyModel} target - The record to attach to the relation.
   * @param {string} relation - The name of the relation to attach to.
   * @param {object} options - The options for the query. - (optional)
   * @param {Array} options.attributes - The columns to include in the result. - (optional)
   * @param {Array} options.exclude - The columns to exclude from the result. - (optional)
   * @example const user = await User.findById(1);
   * const post = new Post({ title: 'Post 1', content: 'This is post 1' });
   * await user.attach(post, 'posts');
   * console.log(user);
   * @example const order = await Order.findOne({ where: { id: 1 } });
   * const shippingAddress = new ShippingAddress({ address: '123 Main St', city: 'Springfield', state: 'IL', zip: '62701' });
   * await order.attach(shippingAddress, 'shippingAddress');
   * console.log(order);
   *@returns {Promise<this>} A promise that resolves to the instance with the related data attached.
   * @throws {Error} Throws an error if the relation is not defined.
   * @throws {Error} Throws an error if the relation is not a hasOne or hasMany relation.
   * @throws {Error} Throws an error if the foreign key is not defined.
   */
    attach(target: MappifyModel, relation: string, options?: { attributes?: Array<string>, exclude?: Array<string> }): Promise<this>;

    /**
   * This method saves the instance to the database.
   * @example const product = new Product({ name: 'Product 1', price: 100 });
   * await product.save();
   * @returns {Promise<number>} The ID of the inserted record.
   */
    save(): Promise<number>;


    /**
   * This method updates the instance in the database.
   * @example var product = await Product.findById(1);
   * product.price = 200;
   * await product.update();
   * @returns {Promise<boolean>} A promise that resolves to true if the record was updated, otherwise false.
   */
    update(): Promise<boolean>;


    /**
   * This method deletes the instance from the database.
   * @example var product = await Product.findById(1);
   * await product.delete();
   * @returns {Promise<boolean>} A promise that resolves to true if the record was deleted, otherwise false.
   */
    delete(): Promise<boolean>;


    /**
   * This method fetches all records from the database.
   * @example var products = await Product.fetch();
   * @returns {Promise<Array<MappifyModel>>} An array of instances.
   */
    static fetch(): Promise<Array<MappifyModel>>;


    /**
     * This static method fetches one record from the table based on the provided options.
     * @param {object} options - The options for the query.
     * @param {object} options.where - The WHERE clause for the query.
     * @param {Array} [options.exclude] - The columns to exclude from the result.
     * @param {Array} [options.attributes] - The columns to include in the result.
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
     * @returns {Promise<MappifyModel|null>} An instance of an array or null if no record was found.
     * @throws {Error} Throws an error if the where clause is not provided.
     */
    static findOne(options: { where: object, exclude?: Array<string>, attributes?: Array<string> }): Promise<MappifyModel | null>;


    /**
     * This static method fetches one record from the table based on the provided ID.
     * @param {number} id - The ID of the record to fetch.
     * @example var product = await Product.findById(1);
     * console.log(product);
     * @returns {Promise<MappifyModel|null>} An instance of an array or null if no record was found.
     */
    static findById(id: number): Promise<MappifyModel | null>;


    /**
   * This static method fetches all records from the table based on the provided options.
   * @param {object} [options] - The options for the query.
   * @param {object} [options.where] - The WHERE clause for the query.
   * @param {Array} [options.exclude] - The columns to exclude from the result.
   * @param {Array} [options.attributes] - The columns to include in the result.
   * @param {number} [options.limit] - The maximum number of records to fetch.
   * @param {number} [options.offset] - The number of records to skip.
   * @param {string} [options.order] - The column to order the results by.
   * @param {string} [options.group] - The column to group the results by.
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
    static findAll(options?: { where?: object, exclude?: Array<string>, attributes?: Array<string>, limit?: number, offset?: number, order?: string, group?: string }): Promise<Array<MappifyModel>>;


    /**
     * This static method finds a record based on the provided options, or creates a new record if no record is found.
     * @param {object} options - The options for the query.
     * @param {object} options.where - The WHERE clause for the query.
     * @param {Array} [options.exclude] - The columns to exclude from the result.
     * @param {Array} [options.attributes] - The columns to include in the result.
     * @param {object} defaults - The default values to create the record with.
     * @example var user = await User.findOrCreate({ where: { email: 'user@example.com' } }, { name: 'John Doe', password: 'password' });
     * @returns {Promise<{ instance: Model, created: boolean }>} An object containing the instance and a boolean indicating if the record was created.
     * @throws {Error} Throws an error if the where clause is not provided.
    */
    static findOrCreate(options: { where: object, exclude?: Array<string>, attributes?: Array<string> }, defaults: object): Promise<{ instance: MappifyModel, created: boolean }>;


    /**
  * This static method deletes a record from the table based on its ID.
  * @param {number} id - The ID of the record to delete.
  * @example await User.findByIdAndDelete(1);
  * @returns {Promise<boolean|null>} A promise that resolves to true if the record was deleted, otherwise null.
  * @throws {Error} Throws an error if the ID is not provided or if no record is found.
  * @example await User.findByIdAndDelete(1);
  */
    static findByIdAndDelete(id: number): Promise<boolean>;


    /**
   * This static method updates a record in the table based on the provided options.
   * @param {object} options - The options for the query.
   * @param {object} options.where - The WHERE clause for the query.
   * @example await Product.findOneAndDelete({ where: { name: 'Product 1' } });
   * @returns {Promise<boolean|null>} A promise that resolves to true if the record was deleted, otherwise null.
   * @throws {Error} Throws an error if the where clause is not provided or if no record is found.
   */
    static findOneAndDelete(options: { where: object }): Promise<MappifyModel>;


    /**
    * This static method updates a record in the table based on the provided options.
    * @param {object} options - The options for the query.
    * @param {object} options.where - The WHERE clause for the query.
    * @param {Array} [options.exclude] - The columns to exclude from the result.
    * @param {Array} [options.attributes] - The columns to include in the result.
    * @param data The new data for the record.
    * @example await Product.findOneAndUpdate({ where: { id: 1 } }, { price: 200 });
    * @returns {Promise<MappifyModel|null>} The updated instance or null if no record was found.
    * @throws {Error} Throws an error if the where clause is not provided or if no record is found.
  */
    static findOneAndUpdate(options: { where: object, attributes?: object, exclude?: object }, data: object): Promise<MappifyModel | null>;


    /**
   * This static method updates a record in the table based on the provided ID.
   * @param {number} id - The ID of the record to update.
   * @param {object} data - The new data for the record.
   * @example await Product.findByIdAndUpdate(1, { price: 200 });
   * @returns {Promise<MappifyModel|null>} The updated instance or null if no record was found.
   * @throws {Error} Throws an error if the ID is not provided or if no record is found.
   */
    static findByIdAndUpdate(id: number, data: object): Promise<MappifyModel | null>;
  }

  /**
   * Executes a MySQL query.
   * @example const { query } = require('mappifysql');
   * query('SELECT * FROM users').then((results) => {
   * console.log(results);
   * } catch (err) {
   * console.error(err);
   * }
   * @param {string} sql - The SQL query string.
   * @param {any} [values] - Optional values for parameterized SQL queries.
   * @returns {Promise<any>} The results of the query.
   */
  export function query(sql: string, values?: any): Promise<any>;

  /**
  * Begins a new transaction.
  * @example const { beginTransaction } = require('mappifysql');
  * await beginTransaction();
  * @returns {Promise<void>}
  */
 export function beginTransaction(): Promise<void>;
 
 /**
  * Commits the current transaction.
  * @example const { commit } = require('mappifysql');
  * await commit();
  * @returns {Promise<void>}
  */
  export function commit(): Promise<void>;
 
 /**
  * Rolls back the current transaction.
  * @example const { rollback } = require('mappifysql');
  * await rollback();
  * @returns {Promise<void>}
  */
  export function rollback(): Promise<void>;

  /**
   * The current MySQL connection.
   * @example const { connection } = require('mappifysql');
   * connection.query('SELECT * FROM users').then((results) => {
   * console.log(results);
   * } catch (err) {
   * console.error(err);
   * }
   */
  export const connection: Connection;

  interface Connection {
    /**
     * Begins a transaction. This allows you to execute multiple queries as part of a single transaction.
     * @param {function} [callback] - Optional callback function.
     * @example const { connection } = require('mappifysql');
     * const conn = await connection;
     * conn.beginTransaction((err, connection) => {
     * if (err) {
     * console.error(err);
     * }
     * });0.4
     */
    beginTransaction(callback?: (err: any) => void): void;

    /**
     * Commits the current transaction. This saves all changes made since the last call to beginTransaction.
     * @param {function} [callback] - Optional callback function.
     * @example const { connection } = require('mappifysql');
     * const conn = await connection;
     * conn.commit((err) => {
     * if (err) {
     * console.error(err);
     * }
     */
    commit(callback?: (err: any) => void): void;

    /**
     * Rolls back the current transaction. This undoes all changes made since the last call to beginTransaction.
     * @param {function} [callback] - Optional callback function.
     * @example const { connection } = require('mappifysql');
     * const conn = await connection;
     * conn.rollback((err) => {
     * if (err) {
     * console.error(err);
     * }
     * });
     * @example connection.rollback();
     */
    rollback(callback?: (err: any) => void): void;

    /**
     * Sends a SQL query to the database.
     * @example const { connection } = require('mappifysql');
     * const conn = await connection;
     * conn.query('SELECT * FROM users', (err, results) => {
     * if (err) {
     * console.error(err);
     * }
     * @type {Function}
     * @param {string} sql - The SQL query string.
     * @param {any} [values] - Optional values for parameterized SQL queries.
     * @param {function} [callback] - Optional callback function.
     * @returns {void}
     */
    query(sql: string, values?: any, callback?: (error: any, results: any, fields: any) => void): void;

    /**
     * Ends the connection. This allows the connection to be closed and removed from the pool.
     * @param {function} [callback] - Optional callback function.
     * @example const { connection } = require('mappifysql');
     * const conn = await connection;
     * conn.end((err) => {
     * if (err) {
     * console.error(err);
     * }
     * });
     * @example connection.end();
     * @returns {void}
     */
    end(callback?: (err: any) => void): void;

    /**
     * Destroys the connection. This allows the connection to be closed and removed from the pool.
     * @example const { connection } = require('mappifysql');
     * const conn = await connection;
     * conn.destroy();
     * @returns {void}
     */
    destroy(): void;

    /**
     * Pauses the connection. This allows the connection to be temporarily disabled.
     * @example const { connection } = require('mappifysql');
     * const conn = await connection;
     * conn.pause();
     * @returns {void}
     */
    pause(): void;

    /**
     * Resumes the connection.
     */
    resume(): void;



    /**
     * Changes the user for the current connection.
     * @param {any} options - The options for changing user.
     * @param {function} [callback] - Optional callback function.
     */
    changeUser(options: any, callback?: (err: any) => void): void;

    /**
     * Executes a SQL query and returns a promise.
     * @param {string} sql - The SQL query string.
     * @param {Function} [callback] - Optional callback function.
     * @returns {Promise<any>} The results of the query.
     * @example const { connection } = require('mappifysql');
     * const conn = await connection;
     * const results = await conn.execute('SELECT * FROM users');
     * console.log(results);
     */
    execute(sql: string, callback?: any): Promise<any>;

    /**
     * Synchronously calls each of the listeners registered for the event named eventName, in the order they were registered, passing the supplied arguments to each.
    
    *Returns `true` if the event had listeners, `false` otherwise.
     */
    emit(event: string | symbol, ...args: any[]): boolean;

    
    /**
    * Adds a **one-time** `listener` function for the event named `eventName`. The
    * next time `eventName` is triggered, this listener is removed and then invoked.
    *
    * @example const { connection } = require('mappifysql');
    * const conn = await connection;
    * conn.once('connection', (stream) => {
    *   console.log('Ah, we have our first user!');
    * });
    *
    * Returns a reference to the `EventEmitter`, so that calls can be chained.
    * @returns {Function} The promisified query method.
    * @param {string | symbol} event The name of the event.
    * @param {Function} listener The callback function.
    */
    once(event: string | symbol, listener: (...args: any[]) => void): this;

    /**
     * Adds the `listener` function to the end of the listeners array for the event
     * named `eventName`. No checks are made to see if the `listener` has already
     * been added. Multiple calls passing the same combination of `eventName` and
     * `listener` will result in the `listener` being added, and called, multiple times.
     *
     *
     * @example const { connection } = require('mappifysql');
     * const conn = await connection;
     * conn.on('connection', (stream) => {
     *   console.log('someone connected!');
     * });
     *
     * Returns a reference to the `EventEmitter`, so that calls can be chained.
     * @returns {Function} The promisified query method.
     * @param {string | symbol} event The name of the event.
     * @param {Function} listener The callback function.
    */
    on(event: string | symbol, listener: (...args: any[]) => void): this;



    /**
     * unprepares a previously prepared statement.
     * @example const { connection } = require('mappifysql');
     * const conn = await connection;
     * conn.unprepare('SELECT * FROM users WHERE id = ?', (err) => {
     * if (err) {
     * console.error(err);
     * }
     * });
     * @param {string} sql - The SQL query string.
     * @returns {void}
     */
    unprepare(sql: string): PrepareStatementInfo

    /**
     * Prepares a SQL statement.
     * @example const { connection } = require('mappifysql');
     * const statement = connection.prepare('SELECT * FROM users WHERE id = ?');
     * @param {string} sql - The SQL query string.
     * @param {function} [callback] - Optional callback function.
     * @returns {Prepare} The prepared statement.
     * @throws {Error} Throws an error if the SQL statement is not provided.
     * @example const { connection } = require('mappifysql');
     * const conn = await connection;
     * const statement = con.prepare('SELECT * FROM users WHERE id = ?');
     * console.log(statement);
     * @example const { connection } = require('mappifysql');
     */
    prepare(sql: string, callback?: (err: any, statement: PrepareStatementInfo) => void): Prepare;

    /**
     * Escapes an identifier for SQL.
     * @example const { connection } = require('mappifysql');
     * const conn = await connection;
     * const identifier = conn.escapeId('id');
     * console.log(identifier);
     * @param {string} value - The identifier to escape.
     * @returns {string} The escaped identifier.
     * @example const { connection } = require('mappifysql');
     * const identifier = connection.escapeId('id');
     * console.log(identifier);
     */
    escapeId(value: string): string;

    /**
     * Escapes a value for SQL.
     * @example const { connection } = require('mappifysql');
     * const conn = await connection;
     * const value = conn.escape('John Doe');
     * console.log(value);
     * @param {any} value - The value to escape.
     * @returns {string} 
     */
    escape(value: any): string;

    /**
     * Formats a SQL query string. This is used to escape values for SQL.
     * @example const { connection } = require('mappifysql');
     * const conn = await connection;
     * const sql = conn.format('SELECT * FROM users WHERE id = ?', [1]);
     * console.log(sql);
     * @param {string} sql - The SQL query string.
     * @param {any | any[] | { [param: string]: any }} values - The values for the query.
     * @returns {string} The formatted SQL query string.
     */
    format(sql: string, values: any): string;

    /**
     * Pings the server. This is used to check if the server is still connected.
     * @example const { connection } = require('mappifysql');
     * const conn = await connection;
     * conn.ping((err) => {
     * if (err) {
     * console.error(err);
     * }
     * });
     * @param {function} [callback] - Optional callback function.
     */
    ping(callback?: (err: any) => void): void;


    /**
     * The server handshake. This is used to establish a connection to the server.
     * @example const { connection } = require('mappifysql');
     * const conn = await connection;
     * conn.serverHandshake((err) => {
     * if (err) {
     * console.error(err);
     * }
     * });
     * @param {any} args - The arguments for the handshake.
     */
    serverHandshake(args: any): any;


    /**
     * Returns a promise that resolves to the connection. This allows you to use async/await with the connection.
     * @example const { connection } = require('mappifysql');
     * const conn = await connection;
     * const promise = conn.promise();
     * const results = await promise.query('SELECT * FROM users');
     * console.log(results);
     * @param {PromiseConstructor} [promiseImpl] - Optional values for parameterized SQL queries.
     * @returns {Promise<any>} The results of the query.
     */
    promise(promiseImpl?: PromiseConstructor): Pool;

    // authorized 
    /**
     * The authorized status of the connection.
     * @example const { connection } = require('mappifysql');
     * const conn = await connection;
     * const authorized = conn.authorized;
     * if (authorized) {
     * console.log('Authorized');
     * } else {
     * console.log('Not authorized');
     * }
     * @returns {boolean} The authorized status.
     */
    authorized: boolean;
    

    /**
     * The thread ID of the connection.
     * @example const { connection } = require('mappifysql');
     * const conn = await connection;
     * const threadId = conn.threadId;
     * console.log(threadId);
     * @returns {number} The thread ID.
     */
    threadId: number;

    /**
     * The sequence ID of the connection.
     * @example const { connection } = require('mappifysql');
     * const conn = await connection;
     * const sequenceId = conn.sequenceId;
     * console.log(sequenceId);
     * @returns {number} The sequence ID.
     */
    sequenceId: number;

    /**
     * Releases the connection back to the pool. This allows the connection to be reused.
     * @note This method is only available when using a pool.
     * @example const { connection } = require('mappifysql');
     * const conn = await connection;
     * conn.release();
     * @returns {void}
     */
    release(): void;
  }
}
