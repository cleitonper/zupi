var jwt = require('jsonwebtoken');

const AuthController = require('../../../src/controller/AuthController');
const User = require('../../../src/model/User');
const { generateUsers } = require('../../util');

const user = generateUsers({ single: true });

let request = {};
let response = {};

beforeEach(() => {
  request.body = { ...user };
  response.statusCode = 200;
  response.json = jest.fn();
  response.boom = {
    unauthorized: jest.fn(() => response.statusCode = 401),
    badImplementation: jest.fn(() => response.statusCode = 500)
  };
});

afterEach(() => {
  request = {};
  response = {};
});

describe('Controller: Auth', () => {
  test('signin: should respond with 401 status code when email is empty', async () => {
    delete request.body.email;
    await AuthController.signin(request, response);
    expect(response.statusCode).toBe(401);
  });

  test('signin: should respond with 401 status code when password is empty', async () => {
    delete request.body.password;
    await AuthController.signin(request, response);
    expect(response.statusCode).toBe(401);
  });

  test('signin: should respond with 401 status code when user is not found', async () => {
    const findOne = jest
    .spyOn(User, 'findOne')
    .mockImplementation(() => null);
    await AuthController.signin(request, response);
    expect(response.statusCode).toBe(401);
    expect(findOne).toBeCalledWith({ email: request.body.email });
  });

  test('signin: should respond with 401 status code when password is wrong', async () => {
    const verifyPassword = jest.fn(() => Promise.resolve(false));
    const findOne = jest
    .spyOn(User, 'findOne')
    .mockImplementation(() => ({ ...user, verifyPassword }));
    await AuthController.signin(request, response);
    expect(response.statusCode).toBe(401);
    expect(findOne).toBeCalledWith({ email: request.body.email });
  });

  test('signin: should respond with a 500 status code when the user model throw a error', async () => {
    jest
    .spyOn(User, 'findOne')
    .mockImplementation(() => Promise.reject({ message: 'Some model error' }));
    await AuthController.signin(request, response);
    expect(response.statusCode).toBe(500);
  });

  test('signin: should respond with a 500 status code when password validation throw a error', async () => {
    const verifyPassword = jest.fn(() => Promise.reject({}));
    jest
    .spyOn(User, 'findOne')
    .mockImplementation(() => Promise.resolve({ ...user, verifyPassword }));
    await AuthController.signin(request, response);
    expect(response.statusCode).toBe(500);
  });

  test('signin: should return a token', async () => {
    const expectedToken = 'my.token.string';
    const verifyPassword = jest.fn(() => Promise.resolve(true));
    const findOne = jest
    .spyOn(User, 'findOne')
    .mockImplementation(() => ({ ...user, verifyPassword }));
    const jwtSignin = jest
    .spyOn(jwt, 'sign')
    .mockImplementation(() => expectedToken);
    await AuthController.signin(request, response);
    expect(response.statusCode).toBe(200);
    expect(findOne).toBeCalledWith({ email: request.body.email });
    expect(jwtSignin).toBeCalled();
    expect(response.json).toBeCalledWith({ token: expectedToken });
  });

  test('signout: should return a token with null value', () => {
    const expectedResponse = { token: null };
    AuthController.signout(request, response);
    expect(response.statusCode).toBe(200);
    expect(response.json).toBeCalledWith(expectedResponse);
  });
});
