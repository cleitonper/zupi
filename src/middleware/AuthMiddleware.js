const validatePermissions = (request, response, next) => {
  const requestedPermission = getPermission(request.method);
  const requestedResource = request.path.replace(/^(\/)(\w+)(.)*/i, '$2');
  const userPermissions = request.user.permissions[requestedResource];

  if (userPermissions && userPermissions.includes(requestedPermission)) {
    return next();
  }

  return response.boom.forbidden('You dont have permission to do this.');
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

validatePermissions.unless = require('express-unless');

module.exports = {
  validatePermissions: validatePermissions,
};
