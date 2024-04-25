# MappifySQL:A MySQL ORM for Node.js

MappifySQL is a lightweight, easy-to-use Object-Relational Mapping (ORM) library for MySQL databases, designed for use with Node.js. It provides an intuitive, promise-based API for interacting with your MySQL database using JavaScript or TypeScript.

## Features

- **Object-Relational Mapping**: Map your database tables to JavaScript or TypeScript objects for easier and more intuitive data manipulation.
- **CRUD Operations**: Easily perform Create, Read, Update, and Delete operations on your database.
- **Transactions**: Safely execute multiple database operations at once with transaction support.
- **Relationships**: Define relationships between your tables to easily fetch related data.
- **Migrations**: Keep your database schema in sync with your code by defining migrations.

## Why MappifySQL?

MappifySQL aims to simplify working with MySQL databases in Node.js applications. By providing an object-oriented interface to your database, it allows you to write more readable and maintainable code. Whether you're building a small application or a large, complex system, MappifySQL has the features you need to get the job done.

## Installation

To install MappifySQL, use npm:

```bash
npm install mappifysql
```

## Getting Started

Here's a quick example to create a connection to a MySQL database using MappifySQL:

```javascript

const { Database } = require('mappifysql');

// Call the createConnection method to establish a single connection to the database
connection.createConnection();

<div align="center">
---
**OR**
---
</div>

// Call the createPool method to establish a pool of connections to the database. 
// This is useful for managing multiple concurrent database queries, improving performance.
connection.createPool();
var query =  connection.query;

module.exports = {
    connection,
    query
}

```

<div align="center">
<img src="https://i.ibb.co/pJ5bbFW/createpool.png" alt="createpool" border="0">
</div>

## more examples and documentation coming soon...
