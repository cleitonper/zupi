const jwt = require('jsonwebtoken');

const validateToken = (request, response, next) => {
  let token;

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

const validatePermissions = (request, response, next) => {
  const requestedPermission = getPermission(request.method);
  const requestedResource = request.path.replace(/^(\/)(\w+)(.)*/i, "$2");
  const userPermissions = request.user.permissions[requestedResource];

  if (userPermissions && userPermissions.includes(requestedPermission)) {
    return next();
  }

  return response.boom.unauthorized('You dont have permission to do this.');
};

const getPermission = (method) => {
  const permission = {
    GET: 'read',
    PUT: 'write',
    PATCH: 'write',
    POST: 'write',
    DELETE: 'delete',
  };

  return permission[method];
};

validateToken.except = require('../lib/except');
validatePermissions.except = require('../lib/except');

module.exports = {
  validateToken: validateToken,
  validatePermissions: validatePermissions,
};