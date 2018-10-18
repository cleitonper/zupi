const User =     require('../../../src/model/User');
const app =      require('../../../src/app');
const db =       require('../../../src/database');
const Requesth = require('../../../lib/requesth');

const { DEFAULT_CREDENTIALS } = require('../../../lib/requesth');

const request = new Requesth(app);

beforeAll(async () => {
  const DB_CONN = await global.mongod.getConnectionString();
  await db.connect(DB_CONN, { useNewUrlParser: true });
  await request.init();
});

afterAll(async () => {
  await User.deleteMany({});
  await db.disconnect();
});

describe('Route Group: Auth', () => {
  test('POST /signin - should return a token', async () => {
    const response = await request
      .public()
      .post('/signin')
      .send(DEFAULT_CREDENTIALS);
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
  });

  test('POST /signout - should return a token with null value', async () => {
    const expectedStatusCode = 200;
    const expectedResponse = { token: null };
    const response = await request.private().post('/signout');
    expect(response.statusCode).toBe(expectedStatusCode);
    expect(response.body).toEqual(expectedResponse);
  });

  test('POST /signup - should create a user', async () => {
    const user = {
      name: 'James',
      email: 'james@email.com',
      password: '123456'
    };
    const response = await request
      .public()
      .post('/signup')
      .send(user);
    delete user.password;
    const createdUser = response.body;
    expect(response.statusCode).toBe(200);
    expect(createdUser).toMatchObject(user);
  });
});
