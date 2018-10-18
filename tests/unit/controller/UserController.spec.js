const mockExpressResponse = require('node-mocks-http/lib/express/mock-express').response;
const mockRequest = require('node-mocks-http/lib/mockRequest');

const UserController = require('../../../src/controller/UserController');
const User = require('../../../src/model/User');
const { generateUsers } = require('../../util');

const users = generateUsers();

let request;
let response;

const makeTest = async (
  controllerMethod,
  internalMethod,
  expectedStatusCode,
  expectedResponse,
) => {
  const spy = jest
  .spyOn(User, internalMethod)
  .mockImplementation(() => expectedResponse);
  await UserController[controllerMethod](request, response);
  expect(spy).toBeCalled();
  expect(response.statusCode).toBe(expectedStatusCode);
  if (expectedStatusCode === 200) expect(response.json).toBeCalledWith(expectedResponse);
};

beforeEach(() => {
  request = mockRequest.createRequest();
  response = mockExpressResponse.createResponse();
  response.json = jest.fn();
  response.boom = {
    notFound: jest.fn(() => response.statusCode = 404),
    badData: jest.fn(() => response.statusCode = 422),
    badImplementation: jest.fn(() => response.statusCode = 500),
  };
});

afterEach(() => {
  request = null;
  response = null;
});

describe('Controller: User - Success Cases', () => {
  test('index: should return a user list', async () => {
    await makeTest('index', 'find', 200, users);
  });

  test('store: should return the created user', async () => {
    await makeTest('store', 'create', 200, users[0]);
  });

  test('show: should find a user by id', async () => {
    await makeTest('show', 'findById', 200, users[0]);
  });

  test('update: should update a user', async () => {
    await makeTest('update', 'findOneAndUpdate', 200, users[0]);
  });

  test('destroy: should delete a user', async () => {
    await makeTest('destroy', 'findOneAndDelete', 200, users[0]);
  });
});

describe('Controller: User - Error Cases (404)', () => {
  test('index: should return a error when no user be found.', async () => {
    await makeTest('index', 'find', 404, []);
  });

  test('show: should return a error when no user be found.', async () => {
    await makeTest('show', 'findById', 404, null);
  });

  test('update: should return a error when no user be found.', async () => {
    await makeTest('update', 'findOneAndUpdate', 404, null);
  });

  test('destroy: should return a error when no user be found.', async () => {
    await makeTest('destroy', 'findOneAndDelete', 404, null);
  });
});

describe('Controller: User - Error Cases (422)', () => {
  const validationError = {
    name: 'ValidationError',
    _message: 'Some validation error message',
    errors: {},
  };

  test('store: should return a error when model validation fail', async () => {
    await makeTest('store', 'create', 422, Promise.reject(validationError));
  });

  test('update: should return a error when model validation fail', async () => {
    await makeTest('update', 'findOneAndUpdate', 422, Promise.reject(validationError));
  });
});

describe('Controller: User - Error Cases (500)', () => {
  test('index: should return a error when the model throw a error', async () => {
    await makeTest('index', 'find', 500, Promise.reject({}));
  });

  test('store: should return a error when the model throw a error', async () => {
    await makeTest('store', 'create', 500, Promise.reject({}));
  });

  test('show: should return a error when the model throw a error', async () => {
    await makeTest('show', 'findById', 500, Promise.reject({}));
  });

  test('update: should return a error when the model throw a error', async () => {
    await makeTest('update', 'findOneAndUpdate', 500, Promise.reject({}));
  });

  test('destroy: should return a error when the model throw a error', async () => {
    await makeTest('destroy', 'findOneAndDelete', 500, Promise.reject({}));
  });
});
