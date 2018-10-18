const HomeController = require('../../../src/controller/HomeController');

const request = {};
const response = { json: jest.fn() };

describe('Controller: Home', () => {
  test('index: should return the API version', () => {
    HomeController.index(request, response);
    expect(response.json).toBeCalledWith(expect.objectContaining({ version: expect.any(String) }));
  });
});
