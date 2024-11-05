const { Database } = require('../lib/database');
const mysql = require('mysql2');

jest.mock('mysql2', () => {
  const mMysql = {
    createConnection: jest.fn(),
    createPool: jest.fn(),
  };
  return mMysql;
});

describe('Connection', () => {
  let db;

  beforeAll(async () => {
    const mockConnection = {
      connect: jest.fn((callback) => callback(null)),
      on: jest.fn(),
      query: jest.fn(),
    };
    mysql.createConnection.mockReturnValue(mockConnection);

    db = new Database();
    db.createConnection();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a connection', async () => {
    const mockConnection = {
      connect: jest.fn((callback) => callback(null)),
      on: jest.fn(),
      query: jest.fn(),
    };
    mysql.createConnection.mockReturnValue(mockConnection);

    db.createConnection();

    expect(mockConnection.connect).toHaveBeenCalled();
    expect(mockConnection.on).toHaveBeenCalledWith('error', expect.any(Function));
  });

  test('should create a connection pool', async () => {
    const mockPool = {
      getConnection: jest.fn((callback) => callback(null, { release: jest.fn(), query: jest.fn(), on: jest.fn() })),
      on: jest.fn(),
      query: jest.fn(),
    };
    mysql.createPool.mockReturnValue(mockPool);

    db.createPool();

    expect(mockPool.getConnection).toHaveBeenCalled();
    expect(mockPool.on).toHaveBeenCalledWith('error', expect.any(Function));
  });

  test('should get the current connection', async () => {
    const mockConnection = {};
    db.connection = mockConnection;

    const connection = await new Promise((resolve) => {
      db.getConnection((err, conn) => {
        resolve(conn);
      });
    });

    expect(connection).toBe(mockConnection);
  });

  test('should get a connection from the pool', async () => {
    const mockPoolConnection = { release: jest.fn(), query: jest.fn(), on: jest.fn() };
    const mockPool = {
      getConnection: jest.fn((callback) => callback(null, mockPoolConnection)),
      on: jest.fn(),
      query: jest.fn(),
    };
    mysql.createPool.mockReturnValue(mockPool);
    db = new Database();
    await db.createPool();

    const connection = await new Promise((resolve, reject) => {
      db.getConnectionFromPool((err, conn) => {
        if (err) reject(err);
        else resolve(conn);
      });
    });

    expect(connection).toBe(mockPoolConnection);
    expect(mockPool.getConnection).toHaveBeenCalled();
  });

  test('should handle error when getting connection from pool', async () => {
    const mockPool = {
      getConnection: jest.fn((callback) => callback(new Error('Pool connection error'))),
      on: jest.fn(),
      query: jest.fn(),
    };
    mysql.createPool.mockReturnValue(mockPool);
    db = new Database();
    await db.createPool();

    await expect(new Promise((resolve, reject) => {
      db.getConnectionFromPool((err, conn) => {
        if (err) reject(err);
        else resolve(conn);
      });
    })).rejects.toThrow('Pool connection error');
  });

  test('should get the current query function', async () => {
    const mockConnection = { query: jest.fn() };
    db.connection = mockConnection;

    const query = await db.getQuery();

    expect(query).toBeInstanceOf(Function);
  });

  test('should begin a transaction', async () => {
    const mockConnection = {
      beginTransaction: jest.fn((callback) => callback(null)),
    };
    mysql.createConnection.mockReturnValue(mockConnection);
    db = new Database();
    await db.createConnection();

    await expect(db.beginTransaction()).resolves.toBeUndefined();
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
  });

  test('should commit a transaction', async () => {
    const mockConnection = {
      commit: jest.fn((callback) => callback(null)),
    };
    mysql.createConnection.mockReturnValue(mockConnection);
    db = new Database();
    await db.createConnection();

    await expect(db.commit()).resolves.toBeUndefined();
    expect(mockConnection.commit).toHaveBeenCalled();
  });

  test('should rollback a transaction', async () => {
    const mockConnection = {
      rollback: jest.fn((callback) => callback(null)),
    };
    mysql.createConnection.mockReturnValue(mockConnection);
    db = new Database();
    await db.createConnection();

    await expect(db.rollback()).resolves.toBeUndefined();
    expect(mockConnection.rollback).toHaveBeenCalled();
  });
});
