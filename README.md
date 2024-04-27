# MappifySQL: A MySQL ORM for Node.js

MappifySQL is a lightweight, easy-to-use Object-Relational Mapping (ORM) library for MySQL databases, designed for use with Node.js. It provides an intuitive, promise-based API for interacting with your MySQL database using JavaScript or TypeScript.

## Features

- **Object-Relational Mapping**: Map your database tables to JavaScript or TypeScript objects for easier and more intuitive data manipulation.
- **CRUD Operations**: Easily perform Create, Read, Update, and Delete operations on your database.
<!-- - **Transactions**: Safely execute multiple database operations at once with transaction support. -->
<!-- - **Relationships**: Define relationships between your tables to easily fetch related data. -->
- **Model Class**: Define a model class for each table in your database to encapsulate database operations.
- **Environment Variables**: Use environment variables to store database connection details securely.
- **TypeScript Support**: Use MappifySQL with TypeScript for type-safe database interactions.
- **Custom Queries**: Execute custom SQL queries using the query method.
- **SQL Injection Protection**: Protect your application from SQL injection attacks with parameterized queries.
- **Pagination**: Implement pagination for large datasets with the limit and offset options.


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
DB_PORT=3306 ## (optional) default is 3306
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


### Using the Model Class

MappifySQL provides a Model class that allows you to define a JavaScript class that represents a table in your database. This class provides methods for performing CRUD operations on the table. 

Here's an example of how to define a model class:
create a new file (e.g., Users.js) and add the following code:

```javascript
const { Model } = require('mappifysql');

class User extends Model {

}

module.exports = User;

```

**Note**: By default, the Model class uses the table name derived from the class name and assumes that the table name in the database is the plural form of the class name. If your table name is different, you can override the tableName property in your model class.

```javascript
const { Model } = require('mappifysql');

class User extends Model {
    static get tableName() {
        return 'my_user_table_name';
    }
}

module.exports = User;

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
    User.save().then(() => {
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

// Example: Delete a record

let deleteData = async () => {
    User.findByIdAndDelete(1).then(() => {
        console.log('Record deleted successfully');
    }).catch((err) => {
        console.error(err);
    });
};
```
# Model Class

This file contains a base model class with methods for interacting with a database. Each method corresponds to a common database operation.

## Methods

### MappifySQL save Method

This method inserts a new record into the database. It uses the properties of the instance to determine the column names and values.

Example:
```javascript
let user = new User({ name: 'John Doe', email: 'joh.doe@example.com' });
user.save().then(() => {
    console.log('New record inserted successfully');
}).catch((err) => {
    console.error(err);
});

// save returns the id of the newly inserted record
```

### MappifySQL Update Method

This method updates the record associated with the instance in the database. It uses the properties of the instance to determine the column names and values.

Example:
```javascript
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

This method finds one record in the database that matches the specified conditions, or creates a new record if no matching record is found. This function returns a object with two properties: `record` and `created`. The `record` property contains the record found or created, and the `created` property is a boolean value indicating whether the record was created or not. This function can be useful implementing a third-party login system where you want to find a user by their email or create a new user if they don't exist.

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
let { record, created } = await User.findOrCreate({ where: { email: 'user@example.com' } }, { name: 'John Doe', picture: 'default.jpg', role: 'user' });

if (created) {
    console.log('New user created:', record);
} else {
    console.log('User found:', record);
}

// Find a user using operations
let { record, created } = await User.findOrCreate({ where: { or: [{ email: 'user@example.com' }, { username: 'user' }] } }, { name: 'John Doe', picture: 'default.jpg', role: 'user' });
```

### MappifySQL findByIdAndDelete Method

The `findByIdAndDelete` method finds a single record in the database that matches the specified `id` and deletes it. The parameter is the id of the record to delete.

Example:
```javascript
User.findByIdAndDelete(1).then(() => {
    console.log('Record deleted successfully');
}).catch((err) => {
    console.error(err);
});
```

### MappifySQL findOneAndDelete Method

This method finds one record in the database that matches the specified conditions and deletes it.

**Parameters**:
There are two parameters for this method:
- `options`: This is the first parameter and is an object that specifies the conditions for the record to find. It can contain the following properties:
    - `where`: An object specifying the conditions for the query. <span style="color: red;"> **required** </span>

Example:
```javascript
User.findOneAndDelete({ where: { email: 'user@example.com' } }).then(() => {
    console.log('Record deleted successfully');
}).catch((err) => {
    console.error(err);
});
```


### MappifySQL findOneAndUpdate Method

This method finds one record in the database that matches the specified conditions and updates it. 

**Parameters**:
There are two parameters for this method:
- `options`: This is the first parameter and is an object that specifies the conditions for the record to find. It can contain the following properties:
    - `where`: An object specifying the conditions for the query. <span style="color: red;"> **required** </span>
    - `exclude`: An array of column names to exclude from the result after the update.
    - `attributes`: An array of column names to include in the result after the update.

- `data`: This is the second parameter and is an object that specifies the values to update.

Example:
```javascript
User.findOneAndUpdate({ where: { email: 'user@example.com' } }, { name: 'Jane Doe', picture: 'profile.jpg' }).then(() => {
    console.log('Record updated successfully');
}).catch((err) => {
    console.error(err);
});
```

### MappifySQL findByIdAndUpdate Method`

This method finds one record in the database with the specified id and updates it. 

**Parameters**:
There are two parameters for this method:
- `id`: This is the first parameter and is the id of the record to update.
- `data`: This is the second parameter and is an object that specifies the values to update.

Example:
```javascript
User.findByIdAndUpdate(1, { name: 'Jane Doe', picture: 'profile.jpg' }).then(() => {
    console.log('Record updated successfully');
}).catch((err) => {
    console.error(err);
});
```

### Custom Queries

You can execute custom SQL queries using the query method provided by MappifySQL. This method allows you to execute any SQL query and returns a promise that resolves with the result of the query.

Example:
```javascript
const { connection, query } = require('./connection');

let customQuery = async () => {
    try {
        let results = await query('SELECT * FROM users WHERE role = ?', ['admin']);
        console.log('Fetched records:', results);
    } catch (err) {
        console.error(err);
    }
};

// you can also use the connection object directly
let customQuery = async () => {
    try {
        let results = await connection.query('SELECT * FROM products WHERE name LIKE ?', ['%apple%']);
        console.log('Fetched records:', results);
    } catch (err) {
        console.error(err);
    }
};

```
<span style="color:red;"><b>Note</b></span>: The query method returns a promise that resolves with the result of the query. You can use async/await to handle the asynchronous nature of the database operations.

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
const { Model } = require('mappifysql');

class Product extends Model {
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

### Using TypeScript

#### Connecting to a Database

To connect to a MySQL database using MappifySQL with TypeScript, you need to create a .env file in the root directory of your project and add the following environment variables:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_DATABASE=mydatabase
DB_PORT=3306 ## (optional) default is 3306
```

Then, create a new TypeScript file (e.g., connection.ts) and add the following code:

```typescript
import { Database } from 'mappifysql';

const db = new Database();

db.createConnection().then(() => {
    console.log('Database connected successfully');
}).catch((err) => {
    console.error(err);
});

var connection = db.connection;
var query = db.getQuery();

export { connection, query };
```

#### Using the Model Class

MappifySQL can be used with TypeScript for type-safe database interactions. You can define interfaces for your models to ensure that the properties of your objects match the columns in your database tables.

Example:
```typescript
import { Model } from 'mappifysql';

interface ProductData {
    name: string;
    price: number;
}

class Product extends Model {
    id: number;
    name: string;
    price: number;

    constructor(data: ProductData) {
        super();
        this.name = data.name;
        this.price = data.price;
    }
    async save() {
        await super.save();
    }

    async update() {
        await super.update();
    }

    async delete() {
        await super.delete();
    }

    static async findAll() {
        let results = await super.findAll();
        return results.map(result => new Product(result));
    }

    static async findById(id: number){
        let result = await super.findById(id);
        return new Product(result);
    }

    static async findOne(options: { where: object }) {
        let result = await super.findOne(options);
        return new Product(result);
    }
    
    static async findOrCreate(options: object, defaults: object) {
        let { record, created } = await super.findOrCreate(options, defaults);
        return { record: new Product(record), created };
    }

    static async findByIdAndDelete(id: number) {
        await super.findByIdAndDelete(id);
    }

    static async findOneAndDelete(options: { where: object }) {
        await super.findOneAndDelete(options);
    }

    static async findOneAndUpdate(options: { where: object }, data: object) {
        await super.findOneAndUpdate(options, data);
    }

    static async findByIdAndUpdate(id: number, data: object) {
        await super.findByIdAndUpdate(id, data);
    }

    static async customQuery() {
        let sql = `SELECT * FROM ${super.tableName} WHERE category = ?`;
        let results = await super.query(sql, ['electronics']);
        return results.map(result => new Product(result));
    }

    static async findElectronics() {
        let results = await super.findAll(attributes: ['id', 'name', 'price'], and: [{ category: 'electronics' }, { price: { between: [500, 1000] } }]);
        return results.map(result => new Product(result));
    }
}

export default Product;
```

```typescript
import Product from 'path/to/product.ts';

let product = new Product({ name: 'Samsung S24', price: 1000 });

product.save().then(() => {
    console.log('New product inserted successfully');
}).catch((err) => {
    console.error(err);
});

Product.findAll().then((products) => {
    console.log('Fetched products:', products);
}).catch((err) => {
    console.error(err);
});
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
