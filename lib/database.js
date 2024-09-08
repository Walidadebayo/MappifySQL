const mysql = require('mysql2');
const util = require('util');
const dotenv = require('dotenv');
dotenv.config();


/**
 * Database class for managing MySQL connections.
 * @example const db = new Database();
 * db.createConnection().then((connection) => {
 * console.log('Connection created successfully');
 * } catch (err) {
 * console.error(err);
 * }
 */
class Database {
    /**
     * Constructor for the Database class.
     */
    constructor() {
        this.config = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,
            connectTimeout: 5000000,
        };

        this.connection = this.createConnection() || this.createPool();
    }

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
    createConnection() {
        return new Promise((resolve, reject) => {
            this.connection = mysql.createConnection(this.config);
            this.connection.connect((err) => {
                if (err) {
                    reject(new Error('error connecting: ' + err.stack));
                }
                else {
                    this.initializeConnection();
                    resolve(this.connection);
                }
            });
        });
    }

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
    createPool() {
        return new Promise((resolve, reject) => {
            this.connection = mysql.createPool(this.config);
            this.connection.getConnection((err, connection) => {
                if (err) {
                    reject(new Error('error connecting: ' + err.stack));
                }
                else {
                    connection.release();
                    this.initializeConnection();
                    resolve(this.connection);
                }
            })
        });
    }

    // initialize connection when connection is lost
    initializeConnection() {
        this.query = util.promisify(this.connection.query).bind(this.connection);
        this.connection.on('error', (err) => {
            if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
                console.log('Database connection lost. Reconnecting...');
                if (this.connection.connect) {
                    this.connect();
                }
            } else {
                throw new Error('Database connection error: ' + err);
            }
        });
    }   

    /**
     * Gets the current connection.
     * @example const db = new Database();
     * db.createConnection().then(() => {
     * }).catch((err) => {
     * console.log(err);
     * });
     * const connection = db.getConnection();
     * @returns {any} The current connection.
     */
    getConnection() {
        return this.connection;
    }


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
    getQuery() {
        return this.query = util.promisify(this.connection.query).bind(this.connection);
    }
}

module.exports.Database = Database;

