const User =     require('../../../src/model/User');
const app =      require('../../../src/app');
const db =       require('../../../src/database');
const Requesth = require('../../../lib/requesth');
const { generateUsers } = require('../../util');

const request = new Requesth(app);

const data = generateUsers();

let inserted;

beforeAll(async () => {
  const DB_CONN = await global.mongod.getConnectionString();
  await db.connect(DB_CONN);
  await request.init();
});

afterAll(async () => {
  await db.disconnect();
});

beforeEach(async () => {
  await User.create(data);
  inserted = await User.find({}).sort('_id').lean().exec();
  inserted = JSON.parse(JSON.stringify(inserted));
});

afterEach(async () => {
  await User.deleteMany({});
  inserted = null;
});

describe('Route Group: Users', () => {
  test('GET    /users - should get all users', async () => {
    const response = await request
      .private()
      .get('/users');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(inserted);
  });

  test('POST   /users - should create a user', async () => {
    const user = { name: 'user3', password: 'secret', email: 'user3@email.com' };
    const { password, ...expected } = user;
    const response = await request
      .private()
      .post('/users')
      .send(user);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(expected);
  });

  test('GET    /users/:id - should retrive a user', async () => {
    let expectedUser = inserted[0];
    const response = await request
      .private()
      .get(`/users/${expectedUser._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expectedUser);
  });

  test('PUT    /users/:id - should update a user', async () => {
    const userToUpdate = inserted[0];
    const newData = { name: 'Ada Lovelace' };
    const { updatedAt, ...updatedUser } = { ...userToUpdate, ...newData };
    const response = await request
      .private()
      .put(`/users/${userToUpdate._id}`)
      .send(newData);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(updatedUser);
  });

  test('DELETE /users/:id - should delete a user', async () => {
    const userToDelete = inserted[0];
    const response = await request
      .private()
      .delete(`/users/${userToDelete._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(userToDelete);
  });
});
