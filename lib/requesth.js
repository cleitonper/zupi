/**
  * Supertests wrapper to send authenticated requests.
  * ----------------------------------------------------------------------------
  *                     Usage Example
  * ----------------------------------------------------------------------------
  * const app = require('express')();
  * const Requesth = require('requesth');
  * const request = new Requesth(app);
  * request.init(); // call it to send private requests.
  * request.private().post('/private-route').send({ some: 'data' });
  * request.public().get('/public-route');
  * ----------------------------------------------------------------------------
  * @param { Express } app Express instance.
  * @param { Object } [credentials={email: 'adm@email.com', password: 'adm' }] Signin credentials.
  * @param { string } [signinRoute='/signin'] Endpoint to signin.
**/
const defaults =  require('superagent-defaults');
const supertest = require('supertest');

const DEFAULT_USER_MODEL = require(`${process.cwd()}/src/model/User`);

const DEFAULT_USER = {
  name: 'super',
  email: 'super@user.com',
  password: 'sudo',
  permissions: {
    users: ['read', 'write', 'delete'],
    properties: ['read', 'write', 'delete'],
  }
};

const DEFAULT_CREDENTIALS = {
  email: DEFAULT_USER.email,
  password: DEFAULT_USER.password,
};

const DEFAULT_SIGN_ROUTE = '/signin';

function Request (
  app,
  UserModel = DEFAULT_USER_MODEL,
  credentials = DEFAULT_CREDENTIALS,
  signinRoute = DEFAULT_SIGN_ROUTE
) {
  const _app = app;
  const _UserModel = UserModel;
  const _credentials = credentials;
  const _signinRoute = signinRoute;

  const _request = defaults(supertest(_app));

  let _token;
  let _user;

  this.init = async function() {
    if (!_user) {
      _user = await _UserModel.create(DEFAULT_USER);
    }

    if (!_token) {
      const response = await supertest(app)
        .post(_signinRoute)
        .send(_credentials);
      _token = response.body.token;
    }
  };

  this.public = function() {
    return supertest(_app);
  };

  this.private = function() {
    if (!_token || !_user) {
      throw new Error('Requesth: You need to call init method before to send private requests.');
    }

    return _request.set('authorization', `Bearer ${_token}`);
  };
}

module.exports = Request;
module.exports.DEFAULT_USER = DEFAULT_USER;
module.exports.DEFAULT_CREDENTIALS = DEFAULT_CREDENTIALS;
