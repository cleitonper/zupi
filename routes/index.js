const router = require('express').Router();

const AuthMiddleware = require('../middleware/AuthMiddleware');

const openRoutes = ['/', '/signin', '/siginup', '/signuout'];

router.use('/', AuthMiddleware.check({ except: openRoutes }));

router.use('/', require('./auth'));
router.use('/', require('./home'));
router.use('/users', require('./users'));
router.use('/properties', require('./properties'));

module.exports = router;