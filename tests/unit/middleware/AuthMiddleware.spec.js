const mockExpressResponse = require('node-mocks-http/lib/express/mock-express').response;
const mockRequest = require('node-mocks-http/lib/mockRequest');

const AuthMiddleware = require('../../../src/middleware/AuthMiddleware');
const { generateUsers } = require('../../util');

let request = {};
let response = {};
let next = null;

const user = generateUsers({ single: true });

const token = 'my.token.string';

beforeEach(() => {
  request = mockRequest.createRequest({
    method: 'GET',
    url: '/users/',
    headers: { authorization: `Bearer ${token}` },
  });
  response = mockExpressResponse.createResponse();
  next = jest.fn();
});

afterEach(() => {
  request = {};
  response = {};
  next = null;
});

describe('Middleware: Auth - Error Cases (401)', () => {
  beforeEach(() => {
    response.boom = {
      unauthorized: jest.fn(() => response.statusCode = 401)
    };
  });

  test('validatePermissions [GET]: should respond with 401 status code when user dont have permission to read', () => {
    request.user = { permissions: ['write', 'delete'] };
    request.method = 'GET';
    AuthMiddleware.validatePermissions(request, response, next);
    expect(response.statusCode).toBe(401);
  });

  test('validatePermissions [POST]: should respond with 401 status code when user dont have permission to write', () => {
    request.user = { permissions: ['read', 'delete'] };
    request.method = 'POST';
    AuthMiddleware.validatePermissions(request, response, next);
    expect(response.statusCode).toBe(401);
  });

  test('validatePermissions [PUT]: should respond with 401 status code when user dont have permission to write', () => {
    request.user = { permissions: ['read', 'delete'] };
    request.method = 'PUT';
    AuthMiddleware.validatePermissions(request, response, next);
    expect(response.statusCode).toBe(401);
  });

  test('validatePermissions [DELETE]: should respond with 401 status code when user dont have permission to write', () => {
    request.user = { permissions: ['read', 'write'] };
    request.method = 'DELETE';
    AuthMiddleware.validatePermissions(request, response, next);
    expect(response.statusCode).toBe(401);
  });
});

describe('Middleware: Auth - Success Cases (200)', () => {
  test('validatePermissions: should allow access to the requested resource', () => {
    request.user = { ...user };
    AuthMiddleware.validatePermissions(request, response, next);
    expect(next).toBeCalledTimes(1);
  });
});
