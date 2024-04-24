const mysql = require('mysql2');
const util = require('util');

// Create a connection.
class Connection {
    constructor(dbname, username, password, host, port) {
        this.connection = this.createConnection(dbname, username, password, host, port);
    }

    createConnection(dbname, username, password, host, port) {
        const connection = mysql.createConnection({
            host: host,
            user: username,
            password: password,
            database: dbname,
            port: port
        });

        connection.connect(function(err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
            console.log('connected as id ' + connection.threadId);
        });

        // Promisify for Node.js async/await.
        connection.query = util.promisify(connection.query);

        return connection;
    }
}

// Create a connection pool.
class Pool {
    constructor(dbname, username, password, host, port) {
        this.pool = this.createPool(dbname, username, password, host, port);
    }

    // Create a connection pool.
    createPool(dbname, username, password, host, port) {
        const pool = mysql.createPool({
            host: host,
            user: username,
            password: password,
            database: dbname,
            port: port
        }); 

        //connect to the database
        pool.getConnection(function(err, connection) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
            console.log('connected as id ' + connection.threadId);
        });

        
        pool.query = util.promisify(pool.query);

        return pool;
    }
}

module.exports = { Connection, Pool };
