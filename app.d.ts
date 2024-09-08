/**
 * A module that provides a database connection and a model class for interacting with the database.
 * @example const mappifysql = require('mappifysql');
 * @example const { Database, MappifyModel } = require('mappifysql');
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
    hasOne(relatedModel: Class, options: object): void;


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
    belongsTo(relatedModel: Class, options: object): void;


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
    hasMany(relatedModel: Class, options: object): void;


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
    belongsToMany(relatedModel: Class, options: object): void;


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
    populate(relation: string, options?: object): Promise<this>;


    /**
   * This method attaches a new record to the related model and associates it with the current instance.
   * @param {Model} target - The record to attach to the relation.
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
  attach(target: Model, relation: string, options?: object): Promise<this>;

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
   * @returns {Promise<Array<Model>>} An array of instances.
   */
    static fetch(): Promise<Array<MappifyModel>>;


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
     * @returns {Promise<Object|null>} An instance of an array or null if no record was found.
     */
    static findOne(options: object): Promise<Object<MappifyModel>>;


    /**
     * This static method fetches one record from the table based on the provided ID.
     * @param {number} id - The ID of the record to fetch.
     * @example var product = await Product.findById(1);
     * console.log(product);
     * @returns {Promise<Object|null>} An instance of an array or null if no record was found.
     */
    static findById(id: number): Promise<Object<MappifyModel>>;


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
    static findAll(options?: object): Promise<Array<MappifyModel>>;


    /**
   * This static method finds a record based on the provided options, or creates a new record if no record is found.
   * @param {object} options - The options for the query.
   * @param {object} data - The data to create the record with.
   * @example var user = await User.findOrCreate({ where: { email: 'user@example.com' } }, { name: 'John Doe', password: 'password' });
   * @returns {Promise<{ instance: Model, created: boolean }>} An object containing the instance and a boolean indicating if the record was created.
   * @throws {Error} Throws an error if the where clause is not provided.
   */
    static findOrCreate(options: object, data: object): Promise<{ instance: MappifyModel, created: boolean }>;


    /**
  * This static method deletes a record from the table based on its ID.
  * @param {number} id - The ID of the record to delete.
  * @example await User.findByIdAndDelete(1);
  * @returns {Promise<boolean>} A promise that resolves to true if the record was deleted, otherwise false.
  * @throws {Error} Throws an error if the ID is not provided or if no record is found.
  * @example await User.findByIdAndDelete(1);
  */
    static findByIdAndDelete(id: number): Promise<boolean>;


    /**
   * This static method updates a record in the table based on the provided options.
   * @param {object} options - The options for the query.
   * @param {object} options.where - The WHERE clause for the query.
   * @param {object} data - The new data for the record.
   * @example await Product.findOneAndDelete({ where: { name: 'Product 1' } });
   * @returns {Promise<Model|null>} The updated instance or null if no record was found.
   * @throws {Error} Throws an error if the where clause is not provided or if no record is found.
   */
    static findOneAndDelete(options: object): Promise<MappifyModel>;


/**
 * This static method updates a record in the table based on the provided options.
 * @param options The options for the query.
 * @param options.where The WHERE clause for the query.
 * @param options.attributes The columns to include in the result.
 * @param options.exclude The columns to exclude from the result.
 * @param data The new data for the record.
 * @example await Product.findOneAndUpdate({ where: { id: 1 } }, { price: 200 });
 * @returns The updated instance or null if no record was found.
 * @throws Throws an error if the where clause is not provided or if no record is found.
 */
static findOneAndUpdate(options: { where?: object, attributes?: object, exclude?: object }, data: object): Promise<Model | null>;


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
 * Database class for managing MySQL connections.
 * @example const db = new Database();
 * db.createConnection().then((connection) => {
 * console.log('Connection created successfully');
 * } catch (err) {
 * console.error(err);
 * }
 */
  export class Database {



    /**
    * Creates a new MySQL connection using the configuration.
    * @example const db = new Database();
    * db.createConnection().then((connection) => {
    *  console.log('Connection created successfully');
    * } catch (err) {
    * console.error(err);
    * }
    * @returns {Promise} A promise that resolves to the connection if successful, otherwise rejects with an error.
    */
    createConnection(): Promise<any>;

    /**
     * Creates a new MySQL connection pool using the configuration.
     * This method should be used when multiple connections are required.
     * @example const db = new Database();
     * db.createPool().then((pool) => {
     *   console.log('Pool created successfully');
     * } catch (err) {
     *  console.error(err);
     * }
     * @returns {Promise} A promise that resolves to the connection pool if successful, otherwise rejects with an error.
     */
    createPool(): Promise<any>;

    /**
   * Gets a promisified version of the query method from the connection.
   * This method should be used to query the database.
   * @example const db = new Database();
   * const query = db.getQuery();
   * query('SELECT * FROM users').then((results) => {
   *  console.log(results);
   * } catch (err) {
   * console.error(err);
   * }
   * @returns {Function} The promisified query method.
   */
    getQuery(): Function;

    /**
     * Gets the current connection.
     * @example const db = new Database();
     * db.createConnection().then(() => {
     * }).catch((err) => {
     * console.log(err);
     * });
     * const connection = db.getConnection();
     * @returns {Connection} The current connection
   */
    getConnection(): Connection;

  }
  interface Connection {
    /**
 * Begins a transaction.
 * @param {function} [callback] - Optional callback function.
 */
    beginTransaction(callback?: (err: any) => void): void;

    /**
     * Commits the current transaction.
     * @param {function} [callback] - Optional callback function.
     */
    commit(callback?: (err: any) => void): void;

    /**
     * Rolls back the current transaction.
     * @param {function} [callback] - Optional callback function.
     */
    rollback(callback?: (err: any) => void): void;

    /**
     * Sends a SQL query to the database.
     * @param {string} sql - The SQL query string.
     * @param {any} [values] - Optional values for parameterized SQL queries.
     * @param {function} [callback] - Optional callback function.
     */
    query(sql: string, values?: any, callback?: (error: any, results: any, fields: any) => void): void;

    /**
     * Ends the connection.
     * @param {function} [callback] - Optional callback function.
     */
    end(callback?: (err: any) => void): void;

    /**
     * Destroys the connection.
     */
    destroy(): void;

    /**
     * Pauses the connection.
     */
    pause(): void;

    /**
     * Resumes the connection.
     */
    resume(): void;

    /**
     * Escapes a value for SQL.
     * @param {any} value - The value to escape.
     * @returns {string} The escaped value.
     */
    escape(value: any): string;

    /**
     * Escapes an identifier for SQL.
     * @param {any} value - The identifier to escape.
     * @returns {string} The escaped identifier.
     */
    escapeId(value: any): string;

    /**
     * Formats a SQL query string.
     * @param {string} sql - The SQL query string.
     * @param {any} [values] - Optional values for parameterized SQL queries.
     * @returns {string} The formatted SQL query string.
     */
    format(sql: string, values?: any): string;

    /**
     * Pings the server.
     * @param {function} [callback] - Optional callback function.
     */
    ping(callback?: (err: any) => void): void;

    /**
     * Changes the user for the current connection.
     * @param {any} options - The options for changing user.
     * @param {function} [callback] - Optional callback function.
     */
    changeUser(options: any, callback?: (err: any) => void): void;
  }
}
