# MappifySQL:A MySQL ORM for Node.js

MappifySQL is a lightweight, easy-to-use Object-Relational Mapping (ORM) library for MySQL databases, designed for use with Node.js. It provides an intuitive, promise-based API for interacting with your MySQL database using JavaScript or TypeScript.

## Features

- **Object-Relational Mapping**: Map your database tables to JavaScript or TypeScript objects for easier and more intuitive data manipulation.
- **CRUD Operations**: Easily perform Create, Read, Update, and Delete operations on your database.
- **Transactions**: Safely execute multiple database operations at once with transaction support.
- **Relationships**: Define relationships between your tables to easily fetch related data.


## Why MappifySQL?

MappifySQL aims to simplify working with MySQL databases in Node.js applications. By providing an object-oriented interface to your database, it allows you to write more readable and maintainable code. Whether you're building a small application or a large, complex system, MappifySQL has the features you need to get the job done.

## Installation

To install MappifySQL, use npm:

```bash
npm install mappifysql
```

## Getting Started

Here's a quick example to create a connection to a MySQL database using MappifySQL:

### Connecting to a Database

To connect to a MySQL database using MappifySQL, you need to create a .env file in the root directory of your project and add the following environment variables:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_DATABASE=mydatabase
DB_PORT=3306 ##(optional)
```

Then, create a new JavaScript file (e.g., connection.js) and one of the following code snippets:


#### Create a single connection to the database
Create a new instance of the Database class and call the createConnection method to establish a single connection to the database

```javascript

const { Database } = require('mappifysql');

const db = new Database();

db.createConnection().then(() => {
    console.log('Database connected successfully');
}).catch((err) => {
    console.error(err);
});

var connection = db.connection;
var query = db.getQuery();

module.exports = { connection, query };

```

<div align="center">
<img src="https://i.ibb.co/BCvQSYL/create-Single-Connection.png" alt="createSingleConnection" border="0">
</div>

#### Create a pool of connections to the database
Call the createPool method to establish a pool of connections to the database. This is useful for managing multiple concurrent database queries, improving performance.

```javascript

const { Database } = require('mappifysql');

const db = new Database();

db.createPool().then(() => {
    console.log('Database connected successfully');
}).catch((err) => {
    console.error(err);
});

var connection = db.connection;
var query = db.getQuery();

module.exports = { connection, query };

```

<div align="center">
<img src="https://i.ibb.co/s3cnW5p/create-Pool-Connection.png" alt="createPoolConnection" border="0">
</div>

### Using the Query Builder

Using the query and the connection object you exported from the connection.js file, you can now perform various database operations using the query builder provided by MappifySQL.

```javascript
const { connection, query } = require('./connection');

// Example: Insert a new record into a table

let addUserData = async (data) => {
    const data = { name: 'John Doe', email: 'john.doe@mappifysql.com' };
    try {
        let result = await query('INSERT INTO users SET ?', data);
        console.log('New record inserted successfully');
    } catch (err) {
        console.error(err);
    }
};

// Example: Fetch all records from a table

let fetchAllUsers = async () => {
    try {
        let results = await connection.query('SELECT * FROM users');
        console.log('Fetched records:', results);
    } catch (err) {
        console.error(err);
    }
};

```

**Note**: The query method returns a promise that resolves with the result of the query. You can use async/await to handle the asynchronous nature of the database operations.

### Using the Model Class

MappifySQL provides a Model class that allows you to define a JavaScript class that represents a table in your database. This class provides methods for performing CRUD operations on the table. 

Here's an example of how to define a model class:
create a new file (e.g., Users.js) and add the following code:

```javascript
const { Model } = require('mappifysql');

class Users extends Model {

}

module.exports = Users;

```

**Note**: By default, the Model class uses the table name derived from the class name and assumes that the table name in the database is the plural form of the class name. If your table name is different, you can override the tableName property in your model class.

```javascript
const { Model } = require('mappifysql');

class Users extends Model {
    static get tableName() {
        return 'my_users_table';
    }
}

module.exports = Users;

```

### Performing CRUD Operations

Once you have defined a model, you can use it to perform CRUD operations on the corresponding table.

```javascript
const Users = require('path/to/Users');

// Example: Fetch all records from the users table

let fetchAllUsers = async () => {
    Users.findAll().then((results) => {
        console.log('Fetched records:', results);
    }).catch((err) => {
        console.error(err);
    });
};

// Example: Create a new record

let addUserData = async () => {
    const data = { name: 'John Doe', email: 'john.doe@mappifysql.com' };
    Users.create(data).then(() => {
        console.log('New record inserted successfully');
    }).catch((err) => {
        console.error(err);
    });
};

// Example: Update a record

let updateUserData = async () => {
    const id = 1;
    const data = { name: 'Jane Doe' };
    Users.findByIdAndUpdate(id, data).then(() => {
        console.log('Record updated successfully');
    }).catch((err) => {
        console.error(err);
    });
};

// Example: Delete a record

let deleteUserData = async () => {
    const id = 1;
    Users.findByIdAndDelete(id).then(() => {
        console.log('Record deleted successfully');
    }).catch((err) => {
        console.error(err);
    });
};

```

# Model Class

This file contains a base model class with methods for interacting with a database. Each method corresponds to a common database operation.

## Methods

### `save()`

This method inserts a new record into the database. It uses the properties of the instance to determine the column names and values.

Example:
```javascript
let user = new User({name: 'John', email: 'john@example.com'});
await user.save();
```

### `update()`

This method updates the record associated with the instance in the database. It uses the properties of the instance to determine the column names and values.

Example:
```javascript
let user = await User.findById(1);
user.name = 'John Doe';
await user.update();
```

### `delete()`

This method deletes the record associated with the instance from the database.

Example:
```javascript
let user = await User.findById(1);
await user.delete();
```

### `fetch()`

This method fetches all the records associated with the instance from the database.

Example:
```javascript
let users = await User.fetch();
```

### `findOne()`

This method finds one record in the database that matches the specified conditions. The `options` parameter is an object that can contain the following properties:

- `where`: An object specifying the conditions for the query. (where: {my_column: 'my_value'})
- `exclude`: An array of column names to exclude from the result. (exclude: ['password'])
- `attributes`: An array of column names to include in the result. (attributes: ['id', 'name', 'email'])
- `operation`: A string specifying the logical operator to use when combining conditions if multiple conditions are specified in the `where` property. (Available options: 'AND', 'OR')(optional);

```javascript
let user = await User.findOne({where: {email: 'john@example.com'}});
```

### `findById(id)`

This method finds one record in the database with the specified id.

Example:
```javascript
let user = await User.findById(1);
```

### `findAll(options)`

This method finds all records in the database that match the specified conditions. The `options` parameter is an object that can contain the following properties:

- `where`: An object specifying the conditions for the query. (where: {is_active: 1, role: 'admin'})
- `exclude`: An array of column names to exclude from the result. (exclude: ['password'])
- `attributes`: An array of column names to include in the result. (attributes: ['id', 'name', 'email'])
- `limit`: The maximum number of records to return. (limit: 10)
- `offset`: The number of records to skip before starting to return records. (offset: req.query.page || 1)
- `order`: A string specifying the order in which to return the records. (order: 'created_at DESC')
- `operation`: A string specifying the logical operator to use when combining conditions if multiple conditions are specified in the `where` property. (Available options: 'AND', 'OR')(optional); default: 'AND'
Example:
```javascript
let users = await User.findAll({attributes: ['id', 'name', 'email'], limit: 10, offset: 0, order: 'created_at DESC'});
```

### `findOrCreate(options, defaults)`

This method finds one record in the database that matches the specified conditions, or creates a new record if no matching record is found. The `defaults` parameter is an object specifying the values to use when creating a new record. The `options` parameter is an object that can contain the following properties:

- `where`: An object specifying the conditions for the query. (where: {email: 'john@xample.com'})
- `exclude`: An array of column names to exclude from the result. (exclude: ['password'])
- `attributes`: An array of column names to include in the result. (attributes: ['id', 'name', 'email'])
- `operation`: A string specifying the logical operator to use when combining conditions if multiple conditions are specified in the `where` property. (Available options: 'AND', 'OR')(optional);

Example:
```javascript
let user = await User.findOrCreate({where: {email: 'john@example.com'}}, {name: 'John'});
```

### `findAndDestroyOne(id)`

This method finds one record in the database with the specified id and deletes it.
The `id` parameter is the id of the record to delete.

Example:
```javascript
await User.findAndDestroyOne(1);
```

### `findOneAndUpdate(options, defaults)`

This method finds one record in the database that matches the specified conditions and updates it.  The `defaults` parameter is an object specifying the values to update. The `options` parameter is an object that can contain the following properties:

- `where`: An object specifying the conditions for the query. (where: {email: 'j.d@example.com'})
- `exclude`: An array of column names to exclude from the result. (exclude: ['password'])
- `attributes`: An array of column names to include in the result. (attributes: ['id', 'name', 'email'])
- `operation`: A string specifying the logical operator to use when combining conditions if multiple conditions are specified in the `where` property. (Available options: 'AND', 'OR')(optional);


Example:
```javascript
let user = await User.findOneAndUpdate({where: {email: 'john@example.com'}}, {name: 'John Doe'});
```

### `findByIdAndUpdate(id, defaults)`

This method finds one record in the database with the specified id and updates it. The `defaults` parameter is an object specifying the values to update. The `id` parameter is the id of the record to update.

Example:
```javascript
let user = await User.findByIdAndUpdate(1, {name: 'John Doe'});
```

### `findByIdAndDelete(id)`

This method finds one record in the database with the specified id and deletes it. The `id` parameter is the id of the record to delete.

Example:
```javascript
await User.findByIdAndDelete(1);
```

### `findByEmail(options)`

This method finds one record in the database with the specified email. The `options` parameter is an object that must contain the `where` property with the email value.

- `where`: An object specifying the conditions for the query. (where: {email: 'johndoe@gmail.com'})
- `exclude`: An array of column names to exclude from the result. (exclude: ['password'])
- `attributes`: An array of column names to include in the result. (attributes: ['id', 'name', 'email'])

Example:
```javascript
let user = await User.findByEmail({where: {email: 'john@example.com'}});
```

### `findByUsername(options)`

This method finds one record in the database with the specified username. The `options` parameter is an object that must contain the `where` property with the username value.

- `where`: An object specifying the conditions for the query. (where: {username: 'adeal'})
- `exclude`: An array of column names to exclude from the result. (exclude: ['password'])
- `attributes`: An array of column names to include in the result. (attributes: ['id', 'name', 'email'])


Example:
```javascript
let user = await User.findByUsername({where: {username: 'adeal'}});
```

### `findByEmailOrUsername(options)`

This method finds one record in the database with the specified email or username. The `options` parameter is an object that must contain the `where` property with the email or username value.

- `where`: An object specifying the conditions for the query. (where: {username: 'adeal'})
- `exclude`: An array of column names to exclude from the result. (exclude: ['password'])
- `attributes`: An array of column names to include in the result. (attributes: ['id', 'name', 'email'])

Example:
```javascript
let user = await User.findByEmailOrUsername({where: {username: 'john'}});
```



<!-- ### Transactions

MappifySQL supports transactions, allowing you to execute multiple database operations as a single unit of work. This ensures that all operations are completed successfully or none of them are.

```javascript
const { connection, query } = require('./connection');

let performTransaction = async () => {
    try {
        await connection.beginTransaction();
        await query('INSERT INTO users SET ?', { name: 'John Doe'});
        await query('INSERT INTO addresses SET ?', { user_id: 1, address: '123 Main St'});
        await connection.commit();
        console.log('Transaction completed successfully');
        query('SELECT * FROM users').then((results) => {
            console.log('Fetched records:', results);
        });
    } catch (err) {
        await connection.rollback();
        console.error(err);
    }
};
    
```

### Relationships

MappifySQL allows you to define relationships between your tables, making it easier to fetch related data.

```javascript
const { Model } = require('mappifysql');

class Users extends Model {
    constructor() {
        super('users');
        this.hasMany('addresses', 'user_id');
    }
}

class Addresses extends Model {
    constructor() {
        super('addresses');
        this.belongsTo('users', 'user_id');
    }
}

module.exports = { Users, Addresses };

```

```javascript
const { Users, Addresses } = require('path/to/models');

// Example: Fetch a user and their addresses

let fetchUserWithAddresses = async () => {
    Users.findOne(1, { include: 'addresses' }).then((user) => {
        console.log('User:', user);
    }).catch((err) => {
        console.error(err);
    });
};

```
 -->

## more examples and documentation coming soon...
