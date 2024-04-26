const mysql = require('mysql2');
const util = require('util');
const dotenv = require('dotenv');
dotenv.config();

class Database {
    constructor() {
        this.config = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,
            connectTimeout: 5000000,
        };
    }

    // create connection for createConnection on mysql
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

    // create connection for createPool on mysql
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
    }

    getQuery() {
        return this.query = util.promisify(this.connection.query).bind(this.connection);
    }
}

module.exports = Database;

