const db =       require('../../../src/database');
const Property = require('../../../src/model/Property');
const { generateProperties } = require('../../util');

const SORT_BY = 'title';

const data = generateProperties({ fieldToSort: SORT_BY });

describe('Model: Property', () => {
  let inserted;

  beforeAll(async () => {
    const DB_CONN = await global.mongod.getConnectionString();
    db.connect(DB_CONN);
  });

  afterAll(async () => {
    await db.disconnect();
  });

  beforeEach(async () => {
    await Property.create(data);
    inserted = await Property.find({}).sort(SORT_BY).lean().exec();
  });

  afterEach(async () => {
    await Property.deleteMany({});
    inserted = null;
  });

  test('should create a property', async () => {
    const expected = data;
    expect(inserted).toMatchObject(expected);
  });

  test('should find a property by id',async () => {
    const expected = inserted[0];
    const conditions = { _id: expected._id };
    const property = await Property.findOne(conditions);
    expect(property).toMatchObject(expected);
  });

  test('should find all properties', async () => {
    const expected = data;
    const properties = inserted;
    expect(properties).toMatchObject(expected);
  });

  test('should update a property', async () => {
    const toUpdate = inserted[0];
    const newData = { title: 'Cobertura' };
    const { updatedAt, ...expected } = { ...toUpdate, ...newData };
    const conditions = { _id: toUpdate._id };
    const options = { new: true, lean: true };
    const updated = await Property.findOneAndUpdate(conditions, newData, options);
    expect(updated).toMatchObject(expected);
  });

  test('should delete a property', async () => {
    const expectedLength = data.length - 1;
    const toDelete = inserted[0];
    const conditions = { _id: toDelete._id };
    await Property.deleteOne(conditions);
    const length = await Property.countDocuments({});
    expect(length).toBe(expectedLength);
  });
});
