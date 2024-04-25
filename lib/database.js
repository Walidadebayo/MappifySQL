const mysql = require('mysql2');
const util = require('util');

class Database {
    constructor(database, username, password, host, port) {
        this.config = {
            host: host,
            user: username,
            password: password,
            database: database,
            port: port || 3306,
            connectTimeout: 5000000,
        };
    }
    getConfig() {
        return this.config;
    }

    // create connection for createConnection on mysql
    createConnection() {
        this.connection = mysql.createConnection(this.config);
        this.connection.connect((err) => {
            if (err) {
                throw new Error('error connecting: ' + err.stack);
            }
            console.log(`Successfully connected to ${this.config.database} database as id ${this.connection.threadId}`);
        });
        this.initializeConnection();
    }

    // create connection for createPool on mysql
    createPool() {
        this.connection = mysql.createPool(this.config);
        this.connection.getConnection((err, connection) => {
            if (err) {
                throw new Error('error connecting: ' + err.stack);
            }
            console.log(`Successfully connected to ${this.config.database} database as id ${connection.threadId}`);
            connection.release();
        });
        this.initializeConnection();
    }

    // initialize connection when connection is lost
    initializeConnection() {
        this.connection.on('error', (err) => {
            if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
                console.log('Database connection lost or reset. Reconnecting...');
                if (this.connection.connect) {
                this.connect();
                }
            } else {
                throw new Error('Database connection error: ' + err);
            }
        });

        this.connection.query = util.promisify(this.connection.query).bind(this.connection); // Bind connection.query to connection
        this.query = this.connection.query; // Assign connection.query to query
    }
}

module.exports = Database;

