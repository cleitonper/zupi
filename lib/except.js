/**
  * Used for specify routes that
  * will not be tracked by a middleware
  * ------------------------------------------------------
  *                     Usage Example
  * ------------------------------------------------------
  * const myMiddleare function(req, res, next) {
  * ...some code here
  * };
  * mymiddleware.except = require('except');
  * route.use('/', myMiddleware.except(['/home']))
  * ------------------------------------------------------
  * @param routes: Array - Routes that will not be tracked
**/

module.exports = function(routes) {
  const middleware = this;

  return function(request, response, next) {
    const path = request.path.replace(/\/?($)/, '/');

    routes = routes.map((route) => {
      return route.replace(/(^)\/?([a-z\-]+)\/?($)/, '/$2/');
    });

    if (routes.includes(path)) {
      return next();
    }

    middleware(request, response, next);
  };
}