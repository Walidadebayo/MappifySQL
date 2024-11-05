const { Database } = require('./database');
const db = new Database();
let connectionPromise;

if (process.env.DB_USE_POOL === 'true') {
    console.log('Using connection pool');
    connectionPromise = db.createPool();
} else {
    connectionPromise = db.createConnection();
}

connectionPromise.then(async () => {
    console.log('Connection created successfully');
}).catch((err) => {
    console.log(err);
});

let query = async (sql, values) => {
    const queryFunction = await db.getQuery();
    return queryFunction(sql, values);
};

let connection;
let beginTransaction = async () => await db.beginTransaction();
let commit = async () => await db.commit();
let rollback = async () => await db.rollback();

if (process.env.DB_USE_POOL === 'true') {
    connection = new Promise((resolve, reject) => {
        db.getConnectionFromPool((err, conn) => {
            if (err) {
                db.pool.emit('error', err);
                reject(err);
            } else {
                resolve(conn);
            }
        });
    });
} else {
    connection = new Promise((resolve, reject) => {
        db.getConnection((err, conn) => {
            if (err) {
                reject(err);
            } else {
                resolve(conn);
            }
        });
    });
}

module.exports = { query, connection, beginTransaction, commit, rollback };



