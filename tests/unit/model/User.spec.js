const db =   require('../../../src/database');
const User = require('../../../src/model/User');
const { generateUsers } = require('../../util');

const SORT_BY = 'email';

const data = generateUsers({ fieldToSort: SORT_BY });

let inserted;

beforeAll(async () => {
  const DB_CONN = await global.mongod.getConnectionString();
  db.connect(DB_CONN);
});

afterAll(async () => {
  await db.disconnect();
});

beforeEach(async () => {
  await User.create(data);
  inserted = await User.find({}).sort(SORT_BY).lean().exec();
});

afterEach(async () => {
  await User.deleteMany({});
  inserted = null;
});

describe('Model: User - CRUD', () => {
  test('should create a user', () => {
    expect(inserted).toBeTruthy();
  });

  test('should find a user by id', async () => {
    const expected = inserted[0];
    const conditions = { _id: expected._id };
    const user = await User.findById(conditions).lean().exec();
    expect(user).toEqual(expected);
  });

  test('should find all users', async () => {
    const expected = data
      .map(({password, ...userWithoutPassword}) => userWithoutPassword);
    const users = inserted;
    expect(users).toMatchObject(expected);
  });

  test('should update a user', async () => {
    const toUpdate = inserted[0];
    const newData = { name: 'updated-user' };
    const conditions = { _id: toUpdate._id };
    const options = { new: true };
    const updated = await User.findOneAndUpdate(conditions, newData, options).lean().exec();
    const { updatedAt, ...expected } = { ...toUpdate, ...newData };
    expect(updated).toMatchObject(expected);
  });

  test('should delete a user', async () => {
    const expected = inserted[0];
    const conditions = { _id: expected._id };
    const deleted = await User.findOneAndDelete(conditions).lean().exec();
    expect(deleted).toEqual(expected);
  });
});

describe('Model: User - Validation', () => {
  let user;

  beforeEach(() => {
    user = { ...data[0], email: 'valid@email.com' };
  });

  afterEach(() => {
    user = null;
  });

  test('should throw a error when name is empty', async () => {
    delete user.name;
    await expect(User.create(user)).rejects.toThrow();
  });

  test('should throw a error when email is not unique', async () => {
    user.email = 'user1@email.com';
    await expect(User.create(user)).rejects.toThrow();
  });

  test('should throw a error when email is invalid', async () => {
    user.email = 'ivalid#email,coms';
    await expect(User.create(user)).rejects.toThrow();
  });

  test('should throw a error when email is empty', async () => {
    delete user.email;
    await expect(User.create(user)).rejects.toThrow();
  });

  test('should throw a error when password is empty', async () => {
    delete user.password;
    await expect(User.create(user)).rejects.toThrow();
  });

  test('should throw a error when permissions is not an object', async () => {
    user.permissions = [];
    await expect(User.create(user)).rejects.toThrow();
    user.permissions = 2;
    await expect(User.create(user)).rejects.toThrow();
  });

  test('should throw a error when permissions is empty', async () => {
    user.permissions = {};
    await expect(User.create(user)).rejects.toThrow();
  });

  test('should throw a error when permission list is not an array', async () => {
    user.permissions = { users: 2 };
    await expect(User.create(user)).rejects.toThrow();
  });

  test('should throw a error when permission list is empty', async () => {
    user.permissions = { users: [] };
    await expect(User.create(user)).rejects.toThrow();
  });

  test('should throw a error when permission list contains an invalid permission', async () => {
    user.permissions = { users: ['invalid'] };
    await expect(User.create(user)).rejects.toThrow();
  });
});
