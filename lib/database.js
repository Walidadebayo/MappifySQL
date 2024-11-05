const mysql = require('mysql2');
const util = require('util');
const dotenv = require('dotenv');
const { ne } = require('./condition');
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
        this.connectionConfig = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT) || 3306,
            connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT) || 10000,
        };

        this.poolConfig = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT) || 3306,
            waitForConnections: true || (process.env.DB_WAIT_FOR_CONNECTIONS === 'true'), // default to true
            connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10, // default to 10
            idleTimeout: Number(process.env.DB_IDLE_TIMEOUT) || 60000, // default to 60 seconds
            queueLimit: Number(process.env.DB_QUEUE_LIMIT) || 0, // default to 0
            enableKeepAlive: true || (process.env.DB_ENABLE_KEEP_ALIVE === 'true'), // default to true
            keepAliveInitialDelay: Number(process.env.DB_KEEP_ALIVE_INITIAL_DELAY) || 0, // default to 0
        };

        // Assign maxIdle after poolConfig is defined
        this.poolConfig.maxIdle = Number(process.env.DB_MAX_IDLE) || this.poolConfig.connectionLimit; // default to connection limit

        this.connection = null;
        this.pool = null;
        this.currentPoolConnection = null;
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
            this.connection = mysql.createConnection(this.connectionConfig);
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
            this.pool = mysql.createPool(this.poolConfig);
            this.pool.getConnection((err, connection) => {
                if (err) {
                    reject(new Error('error connecting: ' + err.stack));
                }
                else {
                    connection.release();
                    this.initializePool();
                    resolve(this.pool);
                }
            })
        });
    }

    // initialize connection when connection is lost
    async initializeConnection() {
        this.connection.on('error', (err) => {
            if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
                console.log('Database connection lost. Reconnecting...');
                this.createConnection().catch(console.error);
            } else {
                throw new Error('Database connection error: ' + err);
            }
        });
    }


    initializePool() {
        this.pool.on('error', (err) => {
            if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
                console.log('Database connection lost. Reconnecting...');
                this.createPool().catch(console.error);
            } else {
                throw new Error('Database connection error: ' + err);
            }
        });
    }


    /**
     * Gets connection from the connection
     * @param {Function} callback - The callback function to handle the connection or error.
     */
    getConnection(callback) {
        if (!this.connection) {
            callback(new Error('No connection available'), null);
        } else {
            callback(null, this.connection);
        }
    }

    /**
     * Gets a connection from the pool.
     * @param {Function} callback - The callback function to handle the connection or error.
     */
    getConnectionFromPool(callback) {
        if (!this.pool) {
            callback(new Error('No pool available'), null);
        } else {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    this.pool.emit('error', err);
                    callback(err, null);
                } else {
                    connection.on('error', (err) => {
                       this.pool.emit('error', err);
                    });
                    callback(null, connection);
                }
            });
        }
    }

    getConnectionFromPoolAsync() {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(connection);
                }
            });
        });
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
    async getQuery() {
        if (this.connection) {
            return this.createQueryFunction(this.connection);
        } else if (this.pool) {
            if (!this.currentPoolConnection) {
                this.currentPoolConnection = await this.getConnectionFromPoolAsync();
            }
            return this.createQueryFunction(this.currentPoolConnection);
        } else {
            throw new Error('No connection or pool available');
        }
    }

    createQueryFunction(connection) {
        return async (sql, values) => {
            try {
                const query = util.promisify(connection.query).bind(connection);
                return await query(sql, values);
            } catch (err) {
                throw new Error('Error executing query: ' + err);
            }
        };
    }

    async beginTransaction() {
        if (this.connection) {
            return util.promisify(this.connection.beginTransaction).bind(this.connection)();
        } else if (this.pool) {
            if (!this.currentPoolConnection) {
                this.currentPoolConnection = await this.getConnectionFromPoolAsync();
            }
            return util.promisify(this.currentPoolConnection.beginTransaction).bind(this.currentPoolConnection)();
        } else {
            throw new Error('No connection or pool available');
        }
    }

    async commit() {
        if (this.connection) {
            return util.promisify(this.connection.commit).bind(this.connection)();
        } else if (this.pool) {
            if (!this.currentPoolConnection) {
                throw new Error('No active transaction');
            }
            const result = await util.promisify(this.currentPoolConnection.commit).bind(this.currentPoolConnection)();
            this.currentPoolConnection.release();
            this.currentPoolConnection = null;
            return result;
        } else {
            throw new Error('No connection or pool available');
        }
    }

    async rollback() {
        if (this.connection) {
            return util.promisify(this.connection.rollback).bind(this.connection)();
        } else if (this.pool) {
            if (!this.currentPoolConnection) {
                throw new Error('No active transaction');
            }
            const result = await util.promisify(this.currentPoolConnection.rollback).bind(this.currentPoolConnection)();
            this.currentPoolConnection.release();
            this.currentPoolConnection = null;
            return result;
        } else {
            throw new Error('No connection or pool available');
        }
    }
}

module.exports.Database = Database;