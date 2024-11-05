const { MappifyModel } = require('../lib/model');
const { query, connection } = require('../lib/connection');
const pluralize = require('pluralize');
const { Database } = require('../lib/database');
const mysql = require('mysql2');

jest.mock('../lib/connection');
jest.mock('mysql2', () => {
  const mMysql = {
    createConnection: jest.fn(),
    createPool: jest.fn(),
  };
  return mMysql;
});

describe('MappifyModel', () => {
  class User extends MappifyModel { }

  beforeAll(async () => {
    if (process.env.DB_USE_POOL === 'true') {
      const mockPool = {
        getConnection: jest.fn((callback) => callback(null, { release: jest.fn(), query: jest.fn() })),
        on: jest.fn(),
        query: jest.fn(),
      };
      mysql.createPool.mockReturnValue(mockPool);
      db = new Database();
      db.createPool();
    } else {
      const mockConnection = {
        connect: jest.fn((callback) => callback(null)),
        on: jest.fn(),
        query: jest.fn(),
      };
      mysql.createConnection.mockReturnValue(mockConnection);
      db = new Database();
      db.createConnection();
    }
  });

  beforeEach(() => {
    query.mockClear();
  });

  afterAll(async () => {
    await connection.end();
  });

  test('tableName should return pluralized, lowercased class name', () => {
    expect(User.tableName).toBe('users');
  });

  test('setProperties should set properties on the instance', () => {
    const user = new User();
    user.setProperties({ name: 'John Doe', email: 'user@example.com' });
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('user@example.com');
  });

  test('save should insert a new record and set the id', async () => {
    query.mockResolvedValueOnce({ insertId: 1 });
    const user = new User({ name: 'John Doe', email: 'user@example.com' });
    const id = await user.save();
    expect(id).toBe(1);
    expect(user.id).toBe(1);
    expect(query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO users'), expect.any(Array));
  });

  test('update should update the record', async () => {
    query.mockResolvedValueOnce({ affectedRows: 1 });
    const user = new User({ id: 1, name: 'John Doe', email: 'user@example.com' });
    user.name = 'Jane Doe';
    const updated = await user.update();
    expect(updated).toBe(true);
    expect(query).toHaveBeenCalledWith(expect.stringContaining('UPDATE users'), expect.any(Array));
  });

  test('delete should delete the record', async () => {
    query.mockResolvedValueOnce({ affectedRows: 1 });
    const user = new User({ id: 1, name: 'John Doe', email: 'user@example.com' });
    const deleted = await user.delete();
    expect(deleted).toBe(true);
    expect(query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM users'), [1]);
  });

  test('fetch should return all records', async () => {
    query.mockResolvedValueOnce([{ id: 1, name: 'John Doe', email: 'user@example.com' }]);
    const users = await User.fetch();
    expect(users).toHaveLength(1);
    expect(users[0]).toBeInstanceOf(User);
    expect(query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM users'));
  });

  test('findOne should return a single record', async () => {
    query.mockResolvedValueOnce([{ id: 1, name: 'John Doe', email: 'user@example.com' }]);
    const user = await User.findOne({ where: { id: 1 } });
    expect(user).toBeInstanceOf(User);
    expect(query).toHaveBeenCalledWith(expect.stringContaining('SELECT'), expect.any(Array));
  });

  test('findById should return a single record by id', async () => {
    query.mockResolvedValueOnce([{ id: 1, name: 'John Doe', email: 'user@example.com' }]);
    const user = await User.findById(1);
    expect(user).toBeInstanceOf(User);
    expect(query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM users WHERE id = ?'), [1]);
  });

  test('findAll should return all records based on options', async () => {
    query.mockResolvedValueOnce([{ id: 1, name: 'John Doe', email: 'user@example.com' }]);
    const users = await User.findAll({ where: { name: 'John Doe' } });
    expect(users).toHaveLength(1);
    expect(users[0]).toBeInstanceOf(User);
    expect(query).toHaveBeenCalledWith(expect.stringContaining('SELECT'), expect.any(Array));
  });

  test('findOrCreate should find or create a record', async () => {
    query.mockResolvedValueOnce([]);
    query.mockResolvedValueOnce({ insertId: 1 });
    const { instance, created } = await User.findOrCreate({ where: { email: 'user@example.com' } }, { name: 'John Doe' });
    expect(instance).toBeInstanceOf(User);
    expect(created).toBe(true);
    expect(query).toHaveBeenCalledTimes(2);
  });

  test('findByIdAndDelete should delete a record by id', async () => {
    query.mockResolvedValueOnce([{ id: 1, name: 'John Doe', email: 'user@example.com' }]);
    query.mockResolvedValueOnce({ affectedRows: 1 });
    const deleted = await User.findByIdAndDelete(1);
    expect(deleted).toBe(true);
    expect(query).toHaveBeenCalledTimes(2);
  });

  test('findOneAndDelete should delete a record based on options', async () => {
    query.mockResolvedValueOnce([{ id: 1, name: 'John Doe', email: 'user@example.com' }]);
    query.mockResolvedValueOnce({ affectedRows: 1 });
    const deleted = await User.findOneAndDelete({ where: { id: 1 } });
    expect(deleted).toBe(true);
    expect(query).toHaveBeenCalledTimes(2);
  });

  test('findOneAndUpdate should update a record based on options', async () => {
    query.mockResolvedValueOnce([{ id: 1, name: 'John Doe', email: 'user@example.com' }]);
    query.mockResolvedValueOnce({ affectedRows: 1 });
    const user = await User.findOneAndUpdate({ where: { id: 1 } }, { name: 'Jane Doe' });
    expect(user).toBeInstanceOf(User);
    expect(user.name).toBe('Jane Doe');
    expect(query).toHaveBeenCalledTimes(2);
  });

  test('findByIdAndUpdate should update a record by id', async () => {
    query.mockResolvedValueOnce([{ id: 1, name: 'John Doe', email: 'user@example.com' }]);
    query.mockResolvedValueOnce({ affectedRows: 1 });
    const user = await User.findByIdAndUpdate(1, { name: 'Jane Doe' });
    expect(user).toBeInstanceOf(User);
    expect(user.name).toBe('Jane Doe');
    expect(query).toHaveBeenCalledTimes(2);
  });

  test('should establish a connection', async () => {
    const mockConnection = {
      connect: jest.fn((callback) => callback(null)),
      on: jest.fn(),
      query: jest.fn(),
    };
    mysql.createConnection.mockReturnValue(mockConnection);

    const db = new Database();
    db.createConnection();

    expect(mockConnection.connect).toHaveBeenCalled();
    expect(mockConnection.on).toHaveBeenCalledWith('error', expect.any(Function));
  });
});