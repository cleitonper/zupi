const jwt = require('jsonwebtoken');

const validateToken = async (request, response, next) => {
  let token;

  try {
    token =
    request.body.token
    || request.query.token
    || request.headers['x-access-token']
    || request.headers['authorization'].replace(/^Bearer (.+)/, '$1');
  } catch(error) {
    return response.boom.unauthorized('No auth token provided.');
  }

  try {
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    request.user = decodedToken;
    return next();
  } catch(error) {
    return response.boom.unauthorized('Invalid token.');
  }
};

const validatePermissions = (request, response, next) => {
  const requestedPermission = getPermission(request.method);
  const requestedResource = request.path.replace(/^(\/)(\w+)(.)*/i, '$2');
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

validateToken.except = require('../../lib/except');
validatePermissions.except = require('../../lib/except');

module.exports = {
  validateToken: validateToken,
  validatePermissions: validatePermissions,
};
