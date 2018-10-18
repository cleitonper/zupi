const mockExpressResponse = require('node-mocks-http/lib/express/mock-express').response;
const mockRequest = require('node-mocks-http/lib/mockRequest');

const Property = require('../../../src/model/Property');
const PropertyController = require('../../../src/controller/PropertyController');
const { generateProperties } = require('../../util');

const data = generateProperties();

let request;
let response;

beforeEach(() => {
  request = mockRequest.createRequest();
  response = mockExpressResponse.createResponse();
  response.json = jest.fn();
});

afterEach(() => {
  request = null;
  response = null;
});

describe('Controller: Property - Success Cases', () => {
  test('index: should retrive a properties list', async () => {
    const properties = data;
    const find = jest
    .spyOn(Property, 'find')
    .mockImplementation(() => properties);
    await PropertyController.index(request, response);
    expect(find).toBeCalled();
    expect(response.statusCode).toBe(200);
    expect(response.json).toBeCalledWith(properties);
  });

  test('store: should create a property', async () => {
    const property = data[0];
    const create = jest
    .spyOn(Property, 'create')
    .mockImplementation(() => property);
    await PropertyController.store(request, response);
    expect(create).toBeCalled();
    expect(response.statusCode).toBe(200);
    expect(response.json).toBeCalledWith(property);
  });

  test('show: should retrive a property', async () => {
    const property = data[0];
    const findById = jest
    .spyOn(Property, 'findById')
    .mockImplementation(() => property);
    await PropertyController.show(request, response);
    expect(findById).toBeCalled();
    expect(response.statusCode).toBe(200);
    expect(response.json).toBeCalledWith(property);
  });

  test('update: should update a property', async () => {
    const property = data[0];
    const findOneAndUpdate = jest
    .spyOn(Property, 'findOneAndUpdate')
    .mockImplementation(() => property);
    await PropertyController.update(request, response);
    expect(findOneAndUpdate).toBeCalled();
    expect(response.statusCode).toBe(200);
    expect(response.json).toBeCalledWith(property);
  });

  test('destroy: should delete a property', async () => {
    const property = data[0];
    const findOneAndDelete = jest
    .spyOn(Property, 'findOneAndDelete')
    .mockImplementation(() => property);
    await PropertyController.destroy(request, response);
    expect(findOneAndDelete).toBeCalled();
    expect(response.statusCode).toBe(200);
    expect(response.json).toBeCalledWith(property);
  });
});

describe('Controller: Property - Error Cases (404)', () => {
  const expectedStatusCode = 404;
  const expectedError = { message: 'resource not found.' };

  test('index: should return a error when none property be found.', async () => {
    const find = jest
    .spyOn(Property, 'find')
    .mockImplementation(() => []);
    await PropertyController.index(request, response);
    expect(find).toBeCalled();
    expect(response.statusCode).toBe(expectedStatusCode);
    expect(response.json).toBeCalledWith(expectedError);
  });

  test('show: should return a error when the requested property not be found.', async () => {
    const findById = jest
    .spyOn(Property, 'findById')
    .mockImplementation(() => ({}));
    await PropertyController.show(request, response);
    expect(findById).toBeCalled();
    expect(response.statusCode).toBe(expectedStatusCode);
    expect(response.json).toBeCalledWith(expectedError);
  });

  test('update: should return a error when the requested property not be found.', async () => {
    const findOneAndUpdate = jest
    .spyOn(Property, 'findOneAndUpdate')
    .mockImplementation(() => ({}));
    await PropertyController.update(request, response);
    expect(findOneAndUpdate).toBeCalled();
    expect(response.statusCode).toBe(expectedStatusCode);
    expect(response.json).toBeCalledWith(expectedError);
  });

  test('destroy: should return a error when the requested property not be found.', async () => {
    const findOneAndDelete = jest
    .spyOn(Property, 'findOneAndDelete')

    .mockImplementation(() => ({}));
    await PropertyController.destroy(request, response);
    expect(findOneAndDelete).toBeCalled();
    expect(response.statusCode).toBe(expectedStatusCode);
    expect(response.json).toBeCalledWith(expectedError);
  });
});

describe('Controller: Property - Error Cases (500)', () => {
  const expectedError = { message: 'something wrong' };
  const expectedStatusCode = 500;

  test('index: should return a error when mongoose throw a error', async () => {
    const find = jest
    .spyOn(Property, 'find')
    .mockImplementation(() => Promise.reject(expectedError));
    await PropertyController.index(request, response);
    expect(find).toBeCalled();
    expect(response.statusCode).toBe(expectedStatusCode);
    expect(response.json).toBeCalledWith(expectedError);
  });

  test('store: should return a error when mongoose throw a error', async () => {
    const create = jest
    .spyOn(Property, 'create')
    .mockImplementation(() => Promise.reject(expectedError));
    await PropertyController.store(request, response);
    expect(create).toBeCalled();
    expect(response.statusCode).toBe(expectedStatusCode);
    expect(response.json).toBeCalledWith(expectedError);
  });

  test('show: should return a error when mongoose throw a error', async () => {
    const findById = jest
    .spyOn(Property, 'findById')
    .mockImplementation(() => Promise.reject(expectedError));
    await PropertyController.show(request, response);
    expect(findById).toBeCalled();
    expect(response.statusCode).toBe(expectedStatusCode);
    expect(response.json).toBeCalledWith(expectedError);
  });

  test('update: should return a error when mongoose throw a error', async () => {
    const findOneAndUpdate = jest
    .spyOn(Property, 'findOneAndUpdate')
    .mockImplementation(() => Promise.reject(expectedError));
    await PropertyController.update(request, response);
    expect(findOneAndUpdate).toBeCalled();
    expect(response.statusCode).toBe(expectedStatusCode);
    expect(response.json).toBeCalledWith(expectedError);
  });

  test('destroy: should return a error when mongoose throw a error', async () => {
    const findOneAndDelete = jest
    .spyOn(Property, 'findOneAndDelete')
    .mockImplementation(() => Promise.reject(expectedError));
    await PropertyController.destroy(request, response);
    expect(findOneAndDelete).toBeCalled();
    expect(response.statusCode).toBe(expectedStatusCode);
    expect(response.json).toBeCalledWith(expectedError);
  });
});
