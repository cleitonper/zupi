const router = require('express').Router();

const AuthMiddleware = require('../middleware/AuthMiddleware');

const openRoutes = ['/', '/signin', '/signup'];

router.use('/', AuthMiddleware.validateToken.except(openRoutes));
router.use('/', AuthMiddleware.validatePermissions.except([...openRoutes, '/signout']));

router.use('/', require('./auth'));
router.use('/', require('./home'));
router.use('/users', require('./users'));
router.use('/properties', require('./properties'));

module.exports = router;
