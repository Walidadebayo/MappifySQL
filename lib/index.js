const { connection, query, beginTransaction, commit, rollback } = require('./connection');
const { MappifyModel } = require('./model');

/**
 * Model class for managing database records.
 * @example class User extends MappifyModel {}
 */
module.exports.MappifyModel = MappifyModel;

/**
 * Function for executing MySQL queries.    
 * @example const { query } = require('mappifysql');
 * query('SELECT * FROM users').then((results) => {
 * console.log(results);
 * } catch (err) {
 * console.error(err);
 * }
 *
 * const results = await query('SELECT * FROM users');
 * console.log(results);
 * @param {string} sql - The SQL query string.
 * @param {any} [values] - Optional values for parameterized SQL queries.
 * @returns {Promise<any>} The results of the query.
 */
module.exports.query = query;

/**
 * The current MySQL connection.
 * @example const { connection } = require('mappifysql');
 * connection.query('SELECT * FROM users').then((results) => {
 * console.log(results);
 * } catch (err) {
 * console.error(err);
 * }
 */
module.exports.connection = connection;

/**
 * Begins a new transaction.
 * @example const { beginTransaction } = require('mappifysql');
 * await beginTransaction();
 * @returns {Promise<void>}
 */
module.exports.beginTransaction = beginTransaction;

/**
 * Commits the current transaction.
 * @example const { commit } = require('mappifysql');
 * await commit();
 * @returns {Promise<void>}
 */
module.exports.commit = commit;

/**
 * Rolls back the current transaction.
 * @example const { rollback } = require('mappifysql');
 * await rollback();
 * @returns {Promise<void>}
 */
module.exports.rollback = rollback;

