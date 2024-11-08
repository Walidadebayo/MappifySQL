<div align="center">
<img src="https://i.ibb.co/tmH8Kk4/mappifysql.jpg" alt="mappifysql" style="height: 300px; width: 300px; border-radius: 100%; object-fit: cover;">
</div>

---

<a href="https://www.npmjs.com/package/mappifysql"><img src="https://img.shields.io/npm/v/mappifysql.svg" alt="Version"></a>
<a href="https://www.npmjs.com/package/mappifysql"><img src="https://img.shields.io/npm/dt/mappifysql.svg" alt="Downloads"></a>
<a href="https://www.npmjs.com/package/mappifysql"><img src="https://img.shields.io/npm/l/mappifysql.svg" alt="License"></a>
<a href="https://www.npmjs.com/package/mappifysql"><img src="https://img.shields.io/bundlephobia/min/mappifysql.svg" alt="Size"></a>

# MappifySQL: A MySQL ORM for Node.js and TypeScript

MappifySQL is a lightweight, easy-to-use Object-Relational Mapping (ORM) library for MySQL databases, designed for use with Node.js. It provides an intuitive, promise-based API for interacting with your MySQL database using JavaScript or TypeScript.

## Table of Contents
- [Features](#features)
- [Why MappifySQL?](#why-mappifysql)
- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Connecting to a Database](#connecting-to-a-database)
  - [Class, Function, and Object available in MappifySQL](#class-function-and-object-available-in-mappifysql)
  - [Using the Query Method](#using-the-query-method)
  - [Using the Connection Object](#using-the-connection-object)
  - [Using the Model Class](#using-the-model-class)
  - [Performing CRUD Operations](#performing-crud-operations)
  - [Transactions](#transactions)
  - [Relationships](#relationships)
- [Issues](#issues)
- [License](#license)
- [References](#references)

## Features

- **Object-Relational Mapping**: Map your database tables to JavaScript or TypeScript objects for easier and more intuitive data manipulation.
- **Auto Connection**: Automatically connect to your database using environment variables.
- **Connection Pooling**: Use connection pooling to improve performance and scalability in your application.
- **Model Class**: Define a model class for each table in your database to encapsulate database operations.
- **CRUD Operations**: Easily perform Create, Read, Update, and Delete operations on your database.
- **Transactions**: Safely execute multiple database operations at once with transaction support.
- **Relationships**: Define relationships between your tables to easily fetch related data.
- **Environment Variables**: Use environment variables to store database connection details securely.
- **TypeScript Support**: Use MappifySQL with TypeScript for type-safe database interactions.
- **SQL Injection Protection**: Protect your application from SQL injection attacks with parameterized queries.
- **Custom Queries**: Execute custom SQL queries using the query method.
- **Custom Functions**: Create custom functions in your model classes to encapsulate complex queries or operations.
- **Pagination**: Implement pagination for large datasets with the limit and offset options.


## Why MappifySQL?

MappifySQL aims to simplify working with MySQL databases in Node.js applications. By providing an object-oriented interface to your database, it allows you to write more readable and maintainable code. Whether you're building a small application or a large, complex system, MappifySQL has the features you need to get the job done.

## Installation

To install MappifySQL, use npm:

```bash
npm install mappifysql
```

## Getting Started


### import and use the library in your JavaScript or TypeScript file:

```javascript
const mappifysql = require('mappifysql');

const MappifyModel = mappifysql.MappifyModel;
```

```typescript
import mappifysql from 'mappifysql';

const MappifyModel = mappifysql.MappifyModel;
```

#### import the classes directly in your JavaScript or TypeScript file:

```javascript
const { MappifyModel } = require('mappifysql');
```

```typescript
import { MappifyModel } from 'mappifysql';
```

Here's a quick example to create a connection to a MySQL database using MappifySQL:

### Connecting to a Database

To connect to a MySQL database using MappifySQL, you need to create a .env file in the root directory of your project and add the following environment variables:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=mydatabase
DB_PORT=3306 ## (optional) default is 3306

DB_USE_POOL=true ## (optional) default is false ## For pool connection

# For connection pooling
DB_WAIT_FOR_CONNECTIONS=true ## (optional) default is true
DB_CONNECTION_LIMIT=10 ## (optional) default is 10
DB_MAX_IDLE=10 ## (optional) default is set to the connection limit
DB_IDLE_TIMEOUT=60000 ## (optional) default is 60000
DB_QUEUE_LIMIT=0 ## (optional) default is 0
DB_ENABLE_KEEP_ALIVE=true ## (optional) default is true
DB_KEEP_ALIVE_INITIAL_DELAY=0 ## (optional) default is 0

```

### Class, Function, and Object available in MappifySQL

| Class/Function/Object | Description |
| --- | --- |
| `MappifyModel` | Base class for defining models that represent database tables. |
| `query` | Function for executing SQL queries. |
| `connection` | Object representing the current MySQL connection. |
| `beginTransaction` | Function to begin a new transaction. |
| `commit` | Function to commit the current transaction. |
| `rollback` | Function to roll back the current transaction. |


### Using the Query Method

The query method allows you to execute SQL queries and returns a promise that resolves with the result of the query. You can use this method to perform CRUD operations, fetch data, and more.


Here's an example of how to use the query method to fetch all records from a table:

```javascript
const { query } = require('mappifysql');
// import { query } from 'mappifysql';


let fetchAll = async () => {
    try {
        let results = await query('SELECT * FROM users');
        console.log('Fetched records:', results);
    } catch (err) {
        console.error(err);
    }
};

let addData = async () => {
    try {
        let result = await query('INSERT INTO users (first_name, email) VALUES (?, ?)', ['John Doe', 'example@gmail.com']);
        console.log('New record - inserted id:', result.insertId);
    } catch (err) {
        console.error(err);
    }
};
```
<span style="color:red;"><b>Note</b></span>: The query method returns a promise that resolves with the result of the query. You can use async/await or then and catch to handle the asynchronous nature of the database operations.

### Using the Connection Object

The connection object provides methods for interacting with the database. You can use the query method to execute SQL queries and the other methods to query the database, manage transactions, ping the server, and more.

```javascript
const { connection } = require('mappifysql');
// import { connection } from 'mappifysql';

(async () => {
    let conn = await connection;
    console.log('Connected to database:', conn.threadId);

    // Perform database operations here
    conn.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Fetched records:', results);
        }
    });

    //ping the server
    conn.ping((err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Server pinged successfully');
        }
    });

    // End the connection
    conn.end(); // or conn.release() to release the connection back to the pool


    conn.pause();

    setTimeout(() => {
        conn.resume();
    }, 5000);

})();
```
    

Here's a list of the methods available in the connection object:
you can also use other methods available in the connection object that are not listed here but are available in the mysql library.

| Method | Description | Parameters |
| --- | --- | --- |
| `authorized` | The authorized status of the connection. | None |
| `beginTransaction` | Begins a transaction. | `callback?: (err: any) => void` |
| `changeUser` | Changes the user for the current connection. | `options: any`, `callback?: (err: any) => void` |
| `commit` | Commits the current transaction. | `callback?: (err: any) => void` |
| `destroy` | Destroys the connection. | None |
| `emit` | Synchronously calls each of the listeners registered for the event named eventName. | `event: string | symbol`, `...args: any[]` |
| `end` | Ends the connection. | `callback?: (err: any) => void` |
| `escape` | Escapes a value for SQL. | `value: any` |
| `escapeId` | Escapes an identifier for SQL. | `value: any` |
| `execute` | Executes a SQL query and returns a promise. | `sql: string`, `callback?: any` |
| `format` | Formats a SQL query string. | `sql: string`, `values?: any` |
| `once` | Adds a one-time listener function for the event named eventName. | `event: string | symbol`, `listener: (...args: any[]) => void` |
| `on` | Adds the listener function to the end of the listeners array for the event named eventName. | `event: string | symbol`, `listener: (...args: any[]) => void` |
| `pause` | Pauses the connection. | None |
| `ping` | Pings the server. | `callback?: (err: any) => void` |
| `prepare` | Prepares a SQL statement. | `sql: string`, `callback?: (err: any, statement: PrepareStatementInfo) => void` |
| `promise` | Returns a promise that resolves to the connection. | `promiseImpl?: PromiseConstructor` |
| `query` | Sends a SQL query to the database. | `sql: string`, `values?: any`, `callback?: (error: any, results: any, fields: any) => void` |
| `release` | Releases the connection back to the pool. | None |
| `releaseConnection` | Releases a connection back to the pool. | `connection: PoolConnection` |
| `resume` | Resumes the connection. | None |
| `rollback` | Rolls back the current transaction. | `callback?: (err: any) => void` |
| `sequenceId` | The sequence ID of the connection. | None |
| `serverHandshake` | The server handshake. | `args: any` |
| `threadId` | The thread ID of the connection. | None |
| `unprepare` | Unprepares a previously prepared statement. | `sql: string` |



### Using the Model Class

MappifySQL provides a Model class that allows you to define a JavaScript class that represents a table in your database. This class provides methods for performing CRUD operations on the table. 

Here's an example of how to define a model class:
create a new file (e.g., Users.js) and add the following code:

```javascript
const { MappifyModel } = require('mappifysql');

class User extends MappifyModel {

}

module.exports = User;

```

** Using TypeScript **

```typescript
import { MappifyModel } from 'mappifysql';

interface UserAttributes {
    id?: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    
    //add more attributes here...
}

class User extends MappifyModel {

    id?: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;


    constructor(data: UserAttributes) {
        super();
        this.id = data.id;
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.email = data.email;
        this.password = data.password;

        // add more properties here...
    }
   
}

export default User;

```

**Note**: By default, the Model class uses the table name derived from the class name and assumes that the table name in the database is the plural form of the class name. If your table name is different, you can override the tableName property in your model class.

```javascript
const { MappifyModel } = require('mappifysql');

class User extends MappifyModel {
    static get tableName() {
        return 'my_user_table_name';
    }
}

module.exports = User;

```

** Using TypeScript **

```typescript
import { MappifyModel } from 'mappifysql';

class User extends MappifyModel {
    static get tableName() {
        return 'my_user_table_name';
    }
}

export default User;

```


### Performing CRUD Operations

Once you have defined a model, you can use it to perform CRUD operations on the corresponding table.

```javascript
const User = require('path/to/user.js')

// Example: Fetch all records from the table

let fetchAll = async () => {
    User.findAll().then((results) => {
        console.log('Fetched records:', results);
    }).catch((err) => {
        console.error(err);
    });
};

// Example: Create a new record

let addData = async () => {
    let newUser = new User({ name: 'John Doe', email: 'john.doe@example.com' });
    newUser.save().then(() => {
        console.log('New record inserted successfully');
    }).catch((err) => {
        console.error(err);
    });
};

// Example: Update a record

let updateData = async () => {
    User.findById(1).then((record) => {
        record.setProperties({ name: 'Jane Doe', email: 'jane.doe@example.com' });
        record.update().then(() => {
            console.log('Record updated successfully');
        }).catch((err) => {
            console.error(err);
        });
    }).catch((err) => {
        console.error(err);
    });
};

let updateData = async () => {
    let user = await User.findOneAndUpdate({ where: { email: 'user@example.com' } }, { name: 'Jane Doe', email: 'user2@example.com' });
    if (user) {
        console.log('Record updated successfully');
    } else {
        console.log('Record not found');
    }
};

// Example: Delete a record

let deleteData = async () => {
    User.findByIdAndDelete(1).then(() => {
        console.log('Record deleted successfully');
    }).catch((err) => {
        console.error(err);
    });
};
```

** Import in TypeScript **

```typescript
import User from 'path/to/user.ts'
```


# Model Class

This file contains a base model class with methods for interacting with a database. Each method corresponds to a common database operation.

## Methods

### MappifySQL save Method

This method inserts a new record into the database. It uses the properties of the instance to determine the column names and values.
It returns a promise that resolves with the id of the newly inserted record.

Example:
```javascript
// you can use also Async/Await
let user = new User({ name: 'John Doe', email: 'joh.doe@example.com' });
user.save().then((id) => {
    console.log('New record inserted successfully', id);
}).catch((err) => {
    console.error(err);
});

// save returns the id of the newly inserted record
```

### MappifySQL Update Method

This method updates the record associated with the instance in the database. It uses the properties of the instance to determine the column names and values.
It returns a promise that resolves with a boolean value indicating whether the record was updated successfully.

Example:
```javascript
// you can use also Async/Await
User.findById(1).then((record) => {
    record.setProperties({ name: 'Jane Doe', email: 'janedoe@example.com' });
    record.update().then(() => {
        console.log('Record updated successfully');
    }).catch((err) => {
        console.error(err);
    });
}).catch((err) => {
    console.error(err);
});

// update returns the true if the record was updated successfully
```


### MappifySQL delete Method

This method deletes the record associated with the instance from the database.

Example:
```javascript
// you can use also Async/Await
User.findById(1).then((record) => {
    record.delete().then(() => {
        console.log('Record deleted successfully');
    }).catch((err) => {
        console.error(err);
    });
}).catch((err) => {
    console.error(err);
});

// delete returns the true if the record was deleted successfully
```

### MappifySQL fetch Method

This method fetches all the records associated with the instance from the database.

Example:
```javascript
// you can use also Async/Await
User.fetch().then((records) => {
    console.log('Fetched records:', records);
}).catch((err) => {
    console.error(err);
});

// fetch returns an array of records
```

### MappifySQL findOne Method

This method finds one record in the database that matches the specified conditions. The parameter is an object that can contain the following properties:

- `where`: An object specifying the conditions for the query. - <span style="color: red;"> **required** </span>
- `exclude`: An array of column names to exclude from the result.
- `attributes`: An array of column names to include in the result.

```javascript
// Fetch a user with all columns from the database using the email
const user = await User.findOne({ where: { email: 'user@example.com' } });

// Fetch a product with the id 1 and exclude the 'description' column from the result
const product = await Product.findOne({ where: { id: 1 }, exclude: ['description'] });

// Fetch a user with the role 'admin' and only include the 'id', 'name', and 'email' columns in the result
const admin = await User.findOne({ where: { role: 'admin' }, attributes: ['id', 'name', 'email'] });

// Fetch a record using operations

// Equal to
const user = await User.findOne({ where: { age: { eq: 18 } } });
// run this query: SELECT * FROM users WHERE age = 18;

// Greater than
const user = await User.findOne({ where: { age: { gt: 17 } } });
// run this query: SELECT * FROM users WHERE age > 17;

// Less than
const user = await User.findOne({ where: { age: { lt: 10 } } });
// run this query: SELECT * FROM users WHERE age < 10;

// Greater than or equal to
const user = await User.findOne({ where: { age: { gte: 18 } } });
// run this query: SELECT * FROM users WHERE age >= 18;

// Less than or equal to
const user = await User.findOne({ where: { age: { lte: 10 } } });
// run this query: SELECT * FROM users WHERE age <= 10;

// Not equal to
const user = await User.findOne({ where: { age: { ne: 18 } } });
// run this query: SELECT * FROM users WHERE age <> 18;

//greater than and less than
const user = await User.findOne({ where: { age: { gt: 10, lt: 20 } } });
// run this query: SELECT * FROM users WHERE age > 10 AND age < 20;

//like
const product = await Product.findOne({ where: { name: { like: '%apple%' } } });
// run this query: SELECT * FROM products WHERE name LIKE '%apple%';

//not like
const product = await Product.findOne({ where: { name: { notLike: '%apple%' } } });
// run this query: SELECT * FROM products WHERE name NOT LIKE '%apple%';

//in
const product = await Product.findOne({ where: { category: { in: ['electronics', 'clothing'] } } });
// run this query: SELECT * FROM products WHERE category IN ('electronics', 'clothing');

//not in
const product = await Product.findOne({ where: { category: { notIn: ['electronics', 'clothing'] } } });
// run this query: SELECT * FROM products WHERE category NOT IN ('electronics', 'clothing');

//between
const product = await Product.findOne({ where: { price: { between: [10, 20] } } });
// run this query: SELECT * FROM products WHERE price BETWEEN 10 AND 20;

//not between
const product = await Product.findOne({ where: { price: { notBetween: [10, 20] } } });
// run this query: SELECT * FROM products WHERE price NOT BETWEEN 10 AND 20;

//is null
const product = await Product.findOne({ where: { description: { isNull: true } } });
// run this query: SELECT * FROM products WHERE description IS NULL;

//is not null
const product = await Product.findOne({ where: { description: { isNotNull: true } } });
// run this query: SELECT * FROM products WHERE description IS NOT NULL;

//and
const product = await Product.findOne({ where: { category: 'electronics', price: { gt: 10 } } });
// run this query: SELECT * FROM products WHERE category = 'electronics' AND price > 10;

const product = await Product.findOne({ where: { and: [{ category: 'electronics' }, { price: { gt: 10 } }] } });
// run this query: SELECT * FROM products WHERE (category = 'electronics' AND price > 10);

const product = await Product.findOne({ where: { name: { like: '%apple%' }, and: [{ category: 'electronics' }, { price: { gt: 10 } }] } });
// run this query: SELECT * FROM products WHERE name LIKE '%apple%' AND (category = 'electronics' AND price > 10);

//or
const product = await Product.findOne({ where: { or: [{ category: 'electronics' }, { price: { gt: 10 } }] } });
// run this query: SELECT * FROM products WHERE category = 'electronics' OR price > 10;

const product = await Product.findOne({ where: { name: { like: '%apple%' }, or: [{ category: 'electronics' }, { price: { gt: 10 } }] } });
// run this query: SELECT * FROM products WHERE name LIKE '%apple%' AND (category = 'electronics' OR price > 10);

//not
const product = await Product.findOne({ where: { not: { category: 'electronics' } } });
// run this query: SELECT * FROM products WHERE NOT category = 'electronics';

const product = await Product.findOne({attributes: ['id', 'name', 'price'], where: { not: { category: 'electronics' } }});
// run this query: SELECT id, name, price FROM products WHERE (NOT category = 'electronics');
```

Here is a table for the LIKE operators in the where clause:

| Operator | Description |
| --- | --- |
| `%apple%` | Finds any values that have "apple" in any position |
| `apple%` | Finds any values that start with "apple" |
| `%apple` | Finds any values that end with "apple" |
| `_pple` | Finds any values that have "pple" in the second position |
| `a%e` | Finds any values that start with "a" and end with "e" |
| `a%o` | Finds any values that start with "a" and ends with "o" |
| `a__%` | Finds any values that start with "a" and are at least 3 characters in length |
| `a_%` | Finds any values that start with "a" and are at least 2 characters in length |
| `_r%` | Finds any values that have "r" in the second position |


### MappifySQL findById Method

This method finds one record in the database with the specified id.

Example:
```javascript
User.findById(1).then((record) => {
    console.log('Fetched record:', record);
}).catch((err) => {
    console.error(err);
});
```

### MappifySQL findAll Method

This method finds all records in the database that match the specified conditions. The `options` parameter is an object that can contain the following properties:

- `where`: An object specifying the conditions for the query. 
- `exclude`: An array of column names to exclude from the result.
- `attributes`:An array of column names to include in the result. Default is ['*'] which selects all
- `limit`: The maximum number of records to return.
- `offset`: The number of records to skip before starting to return records.
- `order`: A string specifying the order in which to return the records.
- `group`: A string specifying the column to group the records by. (column_name ASC/DESC);
Example:
```javascript
// Fetch all products from the database
const products = await Product.findAll();
//run this query: SELECT * FROM products;

// Fetch all products with specific properties
const products = await Product.findAll(attributes: ['id', 'name', 'price']);
//run this query: SELECT id, name, price FROM products;

// Fetch all products and exclude specific properties
const products = await Product.findAll(exclude: ['description']);

// Fetch the first 10 products
const products = await Product.findAll({ limit: 10 });
//run this query: SELECT * FROM products LIMIT 10;

// Fetch the second set of 10 products
const products = await Product.findAll({ limit: 10, offset: 2 });
//run this query: SELECT * FROM products LIMIT 10 OFFSET 2;

/* 
offset: 2 will skip the first 10 records and return the next 10 records.
This is particularly useful for implementing pagination. The offset can be set dynamically like so: offset: req.query.page
*/

// Fetch products with the 'electronics' category
const products = await Product.findAll({ where: { category: 'electronics' } });
//run this query: SELECT * FROM products WHERE category = 'electronics';

// Fetch products with the 'electronics' category and exclude the 'description' column from the result
const products = await Product.findAll({ where: { category: 'electronics' }, exclude: ['description'] });

// Fetch the total number of products for each category
const products = await Product.findAll({ attributes: ['category', 'COUNT(*) AS total'], group: 'category' });
//run this query: SELECT category, COUNT(*) AS total FROM products GROUP BY category;

// Fetch all products grouped by category and ordered by price in descending order	
const products = await Product.findAll({ group: 'category', order: 'price DESC' });
//run this query: SELECT * FROM products GROUP BY category ORDER BY price DESC;

//Fetch records using operations

// Equal to
const products = await Product.findAll({ where: { price: { eq: 1000 } } });
// run this query: SELECT * FROM products WHERE price = 1000;

// Greater than
const products = await Product.findAll({ where: { price: { gt: 1000 } } });
// run this query: SELECT * FROM products WHERE price > 1000;

// Less than
const products = await Product.findAll({ where: { price: { lt: 1000 } } });
// run this query: SELECT * FROM products WHERE price < 1000;

// Greater than or equal to
const products = await Product.findAll({ where: { price: { gte: 1000 } } });
// run this query: SELECT * FROM products WHERE price >= 1000;

// Less than or equal to
const products = await Product.findAll({ where: { price: { lte: 1000 } } });
// run this query: SELECT * FROM products WHERE price <= 1000;

// Not equal to
const products = await Product.findAll({ where: { price: { ne: 1000 } } });
// run this query: SELECT * FROM products WHERE price <> 1000;

//greater than and less than
const products = await Product.findAll({ where: { price: { gt: 500, lt: 1000 } } });
// run this query: SELECT * FROM products WHERE price > 500 AND price < 1000;

//like
const products = await Product.findAll({ where: { name: { like: '%apple%' } } });
// run this query: SELECT * FROM products WHERE name LIKE '%apple%';

//not like
const products = await Product.findAll({ where: { name: { notLike: '%apple%' } } });
// run this query: SELECT * FROM products WHERE name NOT LIKE '%apple%';

//in
const products = await Product.findAll({ where: { category: { in: ['electronics', 'clothing'] } } });
// run this query: SELECT * FROM products WHERE category IN ('electronics', 'clothing');

//not in
const products = await Product.findAll({ where: { category: { notIn: ['electronics', 'clothing'] } } });
// run this query: SELECT * FROM products WHERE category NOT IN ('electronics', 'clothing');

//between
const products = await Product.findAll({ where: { price: { between: [500, 1000] } } });
// run this query: SELECT * FROM products WHERE price BETWEEN 500 AND 1000;

//not between
const products = await Product.findAll({ where: { price: { notBetween: [500, 1000] } } });
// run this query: SELECT * FROM products WHERE price NOT BETWEEN 500 AND 1000;

//is null
const products = await Product.findAll({ where: { description: { isNull: true } } });
// run this query: SELECT * FROM products WHERE description IS NULL;

//is not null
const users = await User.findAll({ where: { is_subscribed: { isNotNull: true } } });
// run this query: SELECT * FROM users WHERE is_subscribed IS NOT NULL;

//and
const products = await Product.findAll({ where: { category: 'electronics', price: { gt: 500 } } });
// run this query: SELECT * FROM products WHERE category = 'electronics' AND price > 500;

const products = await Product.findAll({ where: { and: [{ category: 'electronics' }, { price: { gt: 500 } }] }});
// run this query: SELECT * FROM products WHERE (category = 'electronics' AND price > 500);

const products = await Product.findAll({ where: { name: { like: '%apple%' }, and: [{ category: 'electronics' }, { price: { gt: 500 } }] }});
// run this query: SELECT * FROM products WHERE name LIKE '%apple%' AND (category = 'electronics' AND price > 500);

//or
const products = await Product.findAll({ where: { or: [{ category: 'electronics' }, { price: { gt: 500 } }] } });
// run this query: SELECT * FROM products WHERE category = 'electronics' OR price > 500;

const products = await Product.findAll({ where: { name: { like: '%apple%' }, or: [{ category: 'electronics' }, { price: { gt: 500 } }] }});
// run this query: SELECT * FROM products WHERE name LIKE '%apple%' AND (category = 'electronics' OR price > 500);

//not
const products = await Product.findAll({ where: { not: { category: 'electronics' } } });
// run this query: SELECT * FROM products WHERE NOT category = 'electronics';

const products = await Product.findAll({attributes: ['id', 'name', 'price'], where: { not: { category: 'electronics' } }});
// run this query: SELECT id, name, price FROM products WHERE (NOT category = 'electronics');
```
#### Operations
| Operation | Description |
| --- | --- |
| eq | Equal to `=` |
| gt | Greater than `>` |
| lt | Less than `<` |
| gte | Greater than or equal to `>=` |
| lte | Less than or equal to `<=` |
| ne | Not equal to `<>` |
| like | Like `%value%` |
| notLike | Not Like `%value%` |
| in | In `('value1', 'value2')` |
| notIn | Not In `('value1', 'value2')` |
| between | Between `value1 AND value2` |
| notBetween | Not Between `value1 AND value2` |
| isNull | Is Null |
| isNotNull | Is Not Null |
| and | Logical AND |
| or | Logical OR |
| not | Logical NOT |


### MappifySQL findOrCreate Method

This method finds one record in the database that matches the specified conditions, or creates a new record if no matching record is found. This function returns a object with two properties: `instance` and `created`. The `instance` property contains the record found or created, and the `created` property is a boolean value indicating whether the record was created or not. This function can be useful implementing a third-party login system where you want to find a user by their email or create a new user if they don't exist.

**Parameters**:
There are two parameters for this method:
- `options`: This is the first parameter and is an object that specifies the conditions for the record to find. It can contain the following properties:
    - `where`: An object specifying the conditions for the query.  <span style="color: red;"> **required** </span>
    - `exclude`: An array of column names to exclude from the result.
    - `attributes`: An array of column names to include in the result.

- `defaults`: This is the second parameter and is an object that specifies the values to use when creating a new record. If a record is found, these values are ignored. 

Example:
```javascript
// Find a user with the email and create a new user if not found
let { instance, created } = await User.findOrCreate({ where: { email: 'user@example.com' } }, { name: 'John Doe', picture: 'default.jpg', role: 'user' });

if (created) {
    console.log('New user created:', instance);
} else {
    console.log('User found:', instance);
}

// Find a user using operations
let { instance, created } = await User.findOrCreate({ where: { or: [{ email: 'user@example.com' }, { username: 'user' }] } }, { name: 'John Doe', picture: 'default.jpg', role: 'user' });
```

### MappifySQL findByIdAndDelete Method

The `findByIdAndDelete` method finds a single record in the database that matches the specified `id` and deletes it. The parameter is the id of the record to delete.
It returns a promise that resolves with a boolean value indicating whether the record was deleted or null if the record was not found.

Example:
```javascript
User.findByIdAndDelete(1).then((deleted) => {
    if (deleted) {
        console.log('Record deleted successfully');
    } else {
        console.log('Record not found');
    }
}).catch((err) => {
    console.error(err);
});
```

### MappifySQL findOneAndDelete Method

This method finds one record in the database that matches the specified conditions and deletes it. 
It returns a promise that resolves with a boolean value indicating whether the record was deleted or null if the record was not found.

**Parameters**:
There are two parameters for this method:
- `options`: This is the first parameter and is an object that specifies the conditions for the record to find. It can contain the following properties:
    - `where`: An object specifying the conditions for the query. <span style="color: red;"> **required** </span>

Example:
```javascript
// you can also use Async/Await
User.findOneAndDelete({ where: { email: 'user@example.com' } }).then((deleted) => {
    if (deleted) {
        console.log('Record deleted successfully');
    } else {
        console.log('Record not found');
    }
}).catch((err) => {
    console.error(err);
});
```


### MappifySQL findOneAndUpdate Method

This method finds one record in the database that matches the specified conditions and updates it.
It returns a promise that resolves with the updated record or null if the record was not found.

**Parameters**:
There are two parameters for this method:
- `options`: This is the first parameter and is an object that specifies the conditions for the record to find. It can contain the following properties:
    - `where`: An object specifying the conditions for the query. <span style="color: red;"> **required** </span>
    - `exclude`: An array of column names to exclude from the result after the update.
    - `attributes`: An array of column names to include in the result after the update.

- `data`: This is the second parameter and is an object that specifies the values to update.

Example:
```javascript
// you can also use Async/Await
User.findOneAndUpdate({ where: { email: 'user@example.com' } }, { name: 'Jane Doe', picture: 'profile.jpg' }).then((user) => {
    if (user) {
        console.log('Record updated successfully');
    } else {
        console.log('Record not found');
    }
}).catch((err) => {
    console.error(err);
});
```

### MappifySQL findByIdAndUpdate Method`

This method finds one record in the database with the specified id and updates it. 
It returns a promise that resolves with the updated record or null if the record was not found.

**Parameters**:
There are two parameters for this method:
- `id`: This is the first parameter and is the id of the record to update.
- `data`: This is the second parameter and is an object that specifies the values to update.

Example:
```javascript
// you can also use Async/Await
User.findByIdAndUpdate(1, { name: 'Jane Doe', picture: 'profile.jpg' }).then((user) => {
    if (user) {
        console.log('Record updated successfully');
    } else {
        console.log('Record not found');
    }
}).catch((err) => {
    console.error(err);
});
```


### Pagination

You can implement pagination for large datasets using the limit and offset options in the findAll method. The limit option specifies the maximum number of records to return, and the offset option specifies the number of records i.e. the page number you are on.

Example:
By passing the offset dynamically using query parameters, you can fetch the next set of records for each page.
```javascript
// Fetch the 10 records for each page
var page = req.query.page;
const products = await Product.findAll({ limit: 10 , offset: page });
```
### Creating a custom function for a model class to perform a database operation

You can create a custom function for a model class to perform a database operation. This function can be used to encapsulate complex queries or operations that are specific to the model.

Example:
```javascript
const { MappifyModel } = require('mappifysql');

class Product extends MappifyModel {
    static async findElectronics() {
        try {
            let sql = `SELECT * FROM ${this.tableName} WHERE category = ?`;
            let results = await this.query(sql, ['electronics']);
            if (results.length > 0) {
                return results.map(result => new this(result));
            }
            return [];
        } catch (err) {
            throw err;
        }
    }

    // create a custom function using functions in the model class
    static async findElectronics() {
        try {
            let results = await this.findAll(attributes: ['id', 'name', 'price'], and: [{ category: 'electronics' }, { price: { between: [500, 1000] } }]);
            return results;
        } catch (err) {
            throw err;
        }
    }
}
module.exports = User;

```
Usage:
```javascript
const Product = require('path/to/product.js');

Product.findElectronics().then((products) => {
    console.log('Electronics products:', products);
}).catch((err) => {
    console.error(err);
});

```

** Using TypeScript **

```typescript
const { MappifyModel } = require('mappifysql');

interface ProductAttributes {
    id?: number;
    name: string;
    price: number;
    category: string;
}

class Product extends MappifyModel {
    id?: number;
    name: string;
    price: number;
    category: string;

    constructor(data: ProductAttributes) {
        super();
        this.id = data.id;
        this.name = data.name;
        this.price = data.price;
        this.category = data.category;
    }


    // create a custom function using functions in the model class
    static async findElectronics() {
        try {
            let results = await MappifyModel.findAll(attributes: ['id', 'name', 'price'], and: [{ category: 'electronics' }, { price: { between: [500, 1000] } }]);
            return results;
        } catch (err) {
            throw err;
        }
    }
}

export default Product;

```
Usage:
```typescript
import Product from 'path/to/product.ts';

Product.findElectronics().then((products) => {
    console.log('Electronics products:', products);
}).catch((err) => {
    console.error(err);
});

```


### MappifySQL Transactions

MappifySQL supports transactions, allowing you to execute multiple database operations as a single unit of work. This ensures that all operations are completed successfully or none of them are.

#### Starting a Transaction using the beginTransaction, commit, and rollback methods

```javascript
const { query, beginTransaction, commit, rollback } = require('mappifysql');

let performTransaction = async () => {
    try {
        await beginTransaction();
        const user = await query('INSERT INTO users SET ?', { name: 'John Doe'});
        await query('INSERT INTO addresses SET ?', { user_id: user.insertId, address: '123 Main St' });
        await commit();
        console.log('Transaction completed successfully');
    } catch (err) {
        await rollback();
        console.error(err);
    }
};

//using transaction with the model class

let performTransaction = async () => {
    try {
        await beginTransaction();
        let user = new User({ name: 'John Doe' });
        await user.save();
        let address = new Address({ user_id: user.id, address: '123 Main St' });
        await address.save();
        await commit();
        console.log('Transaction completed successfully');
    } catch (err) {
        await rollback();
        console.error(err);
    }
};
    
```

#### Starting a Transaction using the query or connection object directly

<span style="color:red;"><b>Note</b></span>: When using the connection object directly, you must release the connection after the transaction is completed in the finally block and you can't use the connection object directly with the model class as it is not exposed to the model class.

If you wan to use transaction with the model class, you must use the query method or <a href="#starting-a-transaction-using-the-begintransaction-commit-and-rollback-method">using beginTransaction commit, and rollback methods from mappifysql</a>

```javascript
const { query, connection } = require('mappifysql');

let performTransaction = async () => {
    try {
        await query('START TRANSACTION');
        const user = await query('INSERT INTO users SET ?', { name: 'John Doe'});
        await query('INSERT INTO addresses SET ?', { user_id: user.insertId, address: '123 Main St' });
        await query('COMMIT');
        console.log('Transaction completed successfully');
    } catch (err) {
        await query('ROLLBACK');
        console.error(err);
    } 
};

// using query function with the Model class

let performTransaction = async () => {
    try {
        await query('START TRANSACTION');
        let user = new User({ name: 'John Doe' });
        await user.save();
        let address = new Address({ user_id: user.id, address: '123 Main St' });
        await address.save();
        await query('COMMIT');
        console.log('Transaction completed successfully');
    } catch (err) {
        await query('ROLLBACK');
        console.error(err);
    }
};

// using the connection object directly

// Note: You can't use the connection object directly with the model class as it is not exposed to the model class and the connection must be released after the transaction is completed in the finally block.


let performTransaction = async () => {
    let conn = await connection;
    try { 
        conn.beginTransaction();
        const user = conn.query('INSERT INTO users SET ?', { first_name: 'John Doe' });
        conn.query('INSERT INTO addresses SET ?', { user_id: user.insertId, address: '123 Main St' });
        conn.commit();
        console.log('Transaction completed successfully');
    } catch (err) {
        conn.rollback();
        console.error(err);
    } finally {
        conn.release();
    }
};


// using the connection object query method

let performTransaction = async () => {
    let conn = await connection;
    try { 
        conn.query('START TRANSACTION');
        const user = conn.query('INSERT INTO users SET ?', { first_name: 'John Doe' });
        conn.query('INSERT INTO addresses SET ?', { user_id: user.insertId, address: '123 Main St' });
        conn.query('COMMIT');
        console.log('Transaction completed successfully');
    } catch (err) {
        conn.query('ROLLBACK');
        console.error(err);
    } finally {
        conn.release();
    }
};



```

### Relationships
MappifySQL allows you to define relationships between your tables, making it easier to fetch related data.


This table provides a quick reference for the methods available in defining relationships between models.

| Method | Description | Parameters | Example |
| --- | --- | --- | --- |
| `associations` | Defines the associations that a model has with other models. This method is meant to be overridden in subclasses. | None | `associations() { this.belongsTo(User, { as: 'user', key: 'id', foreignKey: 'user_id' }); }` |
| `hasOne` | Defines a one-to-one relationship between two models. | `relatedModel`, `options` | `this.hasOne(ShippingAddress, { as: 'shippingAddress', foreignKey: 'order_id' });` |
| `belongsTo` | Defines a one-to-one relationship where the model belongs to another model. | `relatedModel`, `options` | `this.belongsTo(Order, { as: 'order', key: 'id', foreignKey: 'order_id' });` |
| `hasMany` | Defines a one-to-many relationship where the model has many instances of another model. | `relatedModel`, `options` | `this.hasMany(User, { as: 'user', foreignKey: 'post_id' });` |
| `belongsToMany` | Defines a many-to-many relationship between two models. | `relatedModel`, `options` | `this.belongsToMany(Course, { as: 'courses', through: Enrollment, key: 'id', foreignKey: 'student_id', otherKey: 'course_id' });` |
| `populate` | Fetches the related data for a given relation. | `relation`, `options` (optional) | `await post.populate('user');` |
| `attach` | Attaches a new record to the related model and associates it with the current model. | `target`, `relation`, `options` (optional) | `await post.attach(post, 'posts');` |



This table provides a quick reference for the options available in defining relationships between models.

| Method        | Key           | Description  |
| ------------- |:-------------:| -----:|
| hasOne        | as            | The alias for the association. |
|               | foreignKey    | The foreign key in this model. |
| belongsTo     | as            | The alias for the association. |
|               | key           | The primary key in the related model. |
|               | foreignKey    | The foreign key in this model. |
| hasMany       | as            | The alias for the association. |
|               | foreignKey    | The foreign key in the related model. |
| belongsToMany | as            | The alias for the association. |
|               | through       | The "join" table model that connects the two models. |
|               | key           | The primary key in the related model. |
|               | foreignKey    | The foreign key in through model for this model. |
|               | otherKey      | The foreign key in through model for the related model. |
| populate      | relation      | The name of the relation to fetch. |
|               | attributes    | The columns to include in the result. |
|               | exclude       | The columns to exclude from the result. |
| attach        | target        | The record to attach to the related model. |
|               | relation      | The name of the relation to attach to. |
|               | attributes    | The columns to include in the result. |
|               | exclude       | The columns to exclude from the result. |


Please note that `attributes` and `exclude` keys in the `populate` and `attach` methods are optional and can be used to specify the columns to include or exclude from the result.

<span style="color:red;"><b>Note</b></span>: The `populate` method is used to fetch the related data for a given relation. The `attach` method is used to attach a new record to the related model and associate it with the current model and it can only be used with the `hasOne` and `hasMany` relationships.

#### Defining Relationships

#### One-to-One Relationship

In a one-to-one relationship, each record in one table is associated with exactly one record in another table. For example, each order has exactly one shipping address, and each shipping address belongs to exactly one order.


```javascript
const { MappifyModel } = require('mappifysql');
const ShippingAddress = require('path/to/ShippingAddress');

class Order extends MappifyModel {
    associations() {
        this.hasOne(ShippingAddress, {
            as: 'shippingAddress',
            foreignKey: 'order_id'
        });
    }
}

module.exports = Order;

```


Usage:
```javascript
const Order = require('path/to/Order');

Order.findOne({ where: { id: 1 }}).then(async (order) => {
    if (order) {
        await order.populate('shippingAddress', {exclude: ['created_at', 'updated_at']}).then((order) => {
            console.log('Order with shipping address:', order);
        });
    }
}).catch((err) => {
    console.error(err);
});

Order.findAll().then(async (orders) => {
    await Promise.all(orders.map(async (order) => {
    await order.populate('shippingAddress', {exclude: ['created_at', 'updated_at']});
    }));
console.log('Orders with shipping addresses:', orders);
}).catch((err) => {
    console.error(err);
});


```

```typescript
import { MappifyModel } from 'mappifysql';
import Order from 'path/to/Order';

interface ShippingAddressAttributes {
    id?: number;
    address: string;
    city: string;
    state: string;
}

class ShippingAddress extends MappifyModel {
    id?: number;
    address: string;
    city: string;

    constructor(data: ShippingAddressAttributes) {
        super();
        this.id = data.id;
        this.address = data.address;
        this.city = data.city;
    }
    

    associations() {
        this.belongsTo(Order, {
            as: 'order',
            key: 'id'
            foreignKey: 'order_id'
        });
    }
}

export default ShippingAddress;
```

Usage:
```typescript
import ShippingAddress from 'path/to/ShippingAddress';

ShippingAddress.findByOne({ where: { id: 1 }}).then(async(shippingAddress) => {
   await shippingAddress.populate('order', {attributes: ['id', 'total']}).then((shippingAddress) => {
        console.log('Shipping address with order:', shippingAddress);
    });
}).catch((err) => {
    console.error(err);
});

ShippingAddress.findAll().then(async (shippingAddresses) => {
    await Promise.all(shippingAddresses.map(async (shippingAddress) => {
    await shippingAddress.populate('order', {attributes: ['id', 'total']});
    }));
console.log('Shipping addresses with orders:', shippingAddresses);
}).catch((err) => {
    console.error(err);
});

```

** Using `attach` method **

```javascript
const Order = require('path/to/Order');
const ShippingAddress = require('path/to/ShippingAddress');

let createShippingAddress = async () => {
    var order = await Order.findById(1);
    var shippingAddress = new ShippingAddress({ address: '123 Main St', city: 'New York', state: 'NY' });
    await order.attach(shippingAddress, 'shippingAddress', { exclude: ['created_at', 'updated_at'] });
    console.log('Shipping address created:', shippingAddress);
};

createShippingAddress();

```

```typescript
import Order from 'path/to/Order';
import ShippingAddress from 'path/to/ShippingAddress';

let createShippingAddress = async () => {
    var order = await Order.findOne({ where: { id: 1 } });
    var shippingAddress = new ShippingAddress({ address: '123 Main St', city: 'New York', state: 'NY' });
    await order.attach(shippingAddress, 'shippingAddress');
    console.log('Shipping address created:', shippingAddress);
};

createShippingAddress();

```

#### One-to-Many Relationship

In a one-to-many relationship, each record in one table is associated with one or more records in another table. For example, each user can have multiple orders, but each order belongs to exactly one user.

```javascript
const { MappifyModel } = require('mappifysql');
const Order = require('path/to/Order');

class User extends MappifyModel {
    associations() {
        this.hasMany(Order, {
            as: 'orders',
            foreignKey: 'user_id'
        });
    }
}

module.exports = User;

```

Usage:
```javascript
const User = require('path/to/User');

let fetchUserOrders = async () => {
    var user = await User.findOne({ where: { id: 1 } });
    await user.populate('orders', { exclude: ['created_at', 'updated_at'] });
    console.log('User with orders:', user);
};

fetchUserOrders();

```

```typescript

import { MappifyModel } from 'mappifysql';
import Order from 'path/to/Order';

interface OrderAttributes {
    id?: number;
    total: number;
}


class Order extends MappifyModel {
    id?: number;
    total: number;

    constructor(data: OrderAttributes) {
        super();
        this.id = data.id;
        this.total = data.total;
    }


    associations() {
        this.belongsTo(User, {
            as: 'user',
            key: 'id'
            foreignKey: 'user_id'
        });
    }
}

export default User;

```

Usage:
```typescript
import Order from 'path/to/Order';

let fetchOrderUser = async () => {
    var order = await Order.findOne({ where: { id: 1 } });
    await order.populate('user', {attributes: ['id', 'name']});
    console.log('Order with user:', order);
};

fetchOrderUser();

```

** Using `attach` method **

```javascript
const User = require('path/to/User');
const Order = require('path/to/Order');

let createOrder = async () => {
    var user = await User.findById(1);
    var order = new Order({ total: 1000 });
    await user.attach(order, 'orders');
    console.log('Order created:', order);
};

createOrder();

```

```typescript
import User from 'path/to/User';
import Order from 'path/to/Order';

let createOrder = async () => {
    var user = await User.findOne({ where: { id: 1 } });
    var order = new Order({ total: 1000 });
    await user.attach(order, 'orders');
    console.log('Order created:', order);
};

createOrder();

```


#### Many-to-Many Relationship

In a many-to-many relationship, each record in one table is associated with one or more records in another table, and vice versa. For example, each product can belong to multiple categories, and each category can have multiple products.

<span style="color:red;"><b>Note</b></span>: When using the `belongsToMany` method, import the through model at the bottom of the file to avoid circular dependencies.

```javascript
const { MappifyModel } = require('mappifysql');
const Category = require('path/to/Category');

class Product extends MappifyModel {
    associations() {
        this.belongsToMany(Category, {
            as: 'categories',
            through: ProductCategory,
            key: 'id',
            foreignKey: 'product_id',
            otherKey: 'category_id'
        });
    }
}

module.exports = Product;
const ProductCategory = require('path/to/ProductCategory');

```
Usage:
```javascript
const Product = require('path/to/Product');

Product.findOne({ where: { id: 1 }}).then((product) => {
    product.populate('categories', { exclude: ['created_at', 'updated_at'] }).then((product) => {
        console.log('Product with categories:', product);
    });
}).catch((err) => {
    console.error(err);
});

```

** Using TypeScript **

```typescript
import { MappifyModel } from 'mappifysql';
import Product from 'path/to/Product';

interface CategoryAttributes {
    id?: number;
    name: string;
}

class Category extends MappifyModel {
    id?: number;
    name: string;

    constructor(data: CategoryAttributes) {
        super();
        this.id = data.id;
        this.name = data.name;
    }


    
    associations() {
        this.belongsToMany(Product, {
            as: 'products',
            through: ProductCategory,
            key: 'id',
            foreignKey: 'category_id',
            otherKey: 'product_id'
        });
    }
}

export default Category;
import ProductCategory from 'path/to/ProductCategory';
```

Usage:
```typescript
import Category from 'path/to/Category';

Category.findOne({ where: { id: 1 }}).then((category) => {
    category.populate('products', {attributes: ['id', 'name', 'price']}).then((category) => {
        console.log('Category with products:', category);
    });
}).catch((err) => {
    console.error(err);
});

```
<span style="color:red;"><b>Note</b></span>: The model classes can contain many relationships, and you can define as many relationships as needed for your application. Also, if a model has multiple relationships, you can populate them individually for each relationship.

Example:
```javascript
const { MappifyModel } = require('mappifysql');
const Student = require('path/to/studentmodel');
 const Course = require('path/to/coursemodel');


 class Enrollment extends MappifyModel {
    associations() {
        this.belongsTo(Student, {
            as: 'student',
            key: 'id',
            foreignKey: 'student_id'
        });
        this.belongsTo(Course, {
            as: 'course',
            key: 'id',
            foreignKey: 'course_id'
        });
    }
}

module.exports = Enrollment;

```

Usage:
```javascript
const Enrollment = require('path/to/Enrollment');

Enrollment.findOne({ where: { id: 1 }}).then((enrollment) => {
    enrollment.populate('student', {attributes: ['id', 'name']}).then(() => {
    }).then(() => {
        enrollment.populate('course', {attributes: ['id', 'name']}).then(() => {
            console.log('Enrollment with student and course:', enrollment);
        });
    });
}).catch((err) => {
    console.error(err);
});

```

```typescript
import { MappifyModel } from 'mappifysql';
import Student from 'path/to/studentmodel';
import Course from 'path/to/coursemodel';

interface EnrollmentAttributes {
    id?: number;
    student_id: number;
    course_id: number;
}

class Enrollment extends MappifyModel {
    id?: number;
    student_id: number;
    course_id: number;

    constructor(data: EnrollmentAttributes) {
        super();
        this.id = data.id;
        this.student_id = data.student_id;
        this.course_id = data.course_id;
    }


    associations() {
        this.belongsTo(Student, {
            as: 'student',
            key: 'id',
            foreignKey: 'student_id'
        });
        this.belongsTo(Course, {
            as: 'course',
            key: 'id',
            foreignKey: 'course_id'
        });
    }
}

export default Enrollment;

```

Usage:
```typescript
import Enrollment from 'path/to/Enrollment';

let enroll = async () => {
    var enrollment = await Enrollment.findOne({ where: { id: 1 } });
    await enrollment.populate('student', {attributes: ['id', 'name']});
    await enrollment.populate('course', {attributes: ['id', 'name']});
    console.log('Enrollment with student and course:', enrollment);
};

enroll();

```

##### Issues

If you encounter any issues or have any questions, please feel free to open an issue on the GitHub repository. We are always happy to help and improve the library.

<!-- ##### Contributing

If you would like to contribute to the project, please feel free to fork the repository and submit a pull request. We welcome all contributions and appreciate your help in making the library better. -->

##### License

This project is licensed under the MIT License - see the LICENSE file for details.

<!-- ##### Acknowledgments

We would like to thank all the contributors to the project and the open-source community for their support and feedback. We appreciate your help in making the library better and more useful for developers. -->

##### References

<!-- - [MappifySQL Documentation]( -->

- [MappifySQL GitHub Repository](https://github.com/Walidadebayo/MappifySQL.git)

- [MappifySQL NPM Package](https://www.npmjs.com/package/mappifysql)

<!-- - [MappifySQL Examples]( -->

- [MappifySQL Issues](https://github.com/Walidadebayo/MappifySQL/issues)

- [MappifySQL License](https://github.com/Walidadebayo/mappifysql/blob/main/LICENSE)

<!-- - [MappifySQL Contributors](https://github.com/Walidadebayo/mappifysql/graphs/contributors) -->

<!-- - [MappifySQL Open Source Community]( -->


<a href="https://www.buymeacoffee.com/walidadebayo"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=walidadebayo&button_colour=FFDD00&font_colour=000000&font_family=Comic&outline_colour=000000&coffee_colour=ffffff" /></a>
