const jwt = require('jsonwebtoken');

const check = (options = { except: [] }) => {
  return function(request, response, next) {
    let token;

    const path = request.path.replace(/\/?($)/, '/');
    options.except = options.except.map((exceptPath) => {
      return exceptPath.replace(/(^)\/?([a-z\-]+)\/?($)/, '/$2/');
    });

    if (options.except.includes(path)) {
      return next();
    }

    try {
      token =
      request.body.token
      || request.query.token
      || request.headers['x-access-token']
      || request.headers['authorization'].replace(/^Bearer (.+)/, '$1');
    } catch(e) {
      return response.boom.unauthorized('No auth token provided.');
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET,
      function(error, decodedToken) {
        if (error) {
          return response.boom.unauthorized('Invalid token.', { errors: error });
        }
        request.user = decodedToken;
        return next();
      }
    );
  };
};

module.exports = {
  check: check,
};