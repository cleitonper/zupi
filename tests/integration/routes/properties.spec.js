const Property = require('../../../src/model/Property');
const app =      require('../../../src/app');
const db =       require('../../../src/database');
const Requesth = require('../../../lib/requesth');
const { generateProperties } = require('../../util');

const request = new Requesth(app);

const data = generateProperties();

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
  inserted = await Property.create(data);
  inserted = JSON.parse(JSON.stringify(inserted));
});

afterEach(async () => {
  await Property.deleteMany({});
  inserted = null;
});

describe('Route Group: Properties', () => {
  test('GET    /properties - should get all properties', async () => {
    const response = await request
      .private()
      .get('/properties');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(inserted);
  });

  test('POST   /properties - should create a property', async () => {
    const property = { title: 'B' };
    const response = await request
      .private()
      .post('/properties')
      .send(property);
    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject(property);
  });

  test('GET    /properties/:id - should retrive a property', async () => {
    let expectedProperty = inserted[0];
    const response = await request
      .private()
      .get(`/properties/${expectedProperty._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expectedProperty);
  });

  test('PUT    /properties/:id - should update a property', async () => {
    const propertyToUpdate = inserted[0];
    const newData = { title: 'New Title' };
    const { updatedAt, ...updatedProperty } = { ...propertyToUpdate, ...newData };
    const response = await request
      .private()
      .put(`/properties/${propertyToUpdate._id}`)
      .send(newData);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(updatedProperty);
  });

  test('DELETE /properties/:id - should delete a property', async () => {
    const propertyToDelete = inserted[0];
    const response = await request
      .private()
      .delete(`/properties/${propertyToDelete._id}`);
    expect(response.statusCode).toBe(204);
  });
});
