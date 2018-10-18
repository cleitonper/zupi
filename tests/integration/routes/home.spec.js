const app =     require('../../../src/app');
const request = require('supertest')(app);

describe('Route Group: Home', () => {
  test('GET / - should return the API version', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('version');
  });
});
