const router =    require('express').Router();
const jwt =       require('express-jwt');
const blacklist = require('express-jwt-blacklist');
blacklist.configure({ tokenId: 'id' });

const AuthMiddleware = require('../middleware/AuthMiddleware');
const LoggerMiddleware = require('../middleware/LoggerMiddleware');
const ErrorMiddleware = require('../middleware/ErrorMiddleware');

const OPEN_ROUTES = [
  '/',
  '/signin', '/signup',
  '/forgot-password', /\/reset-password\/./
];
const OPEN_FORMATS = ['css', 'svg', 'ico'];

const JWT_OPTIONS = {
  secret: process.env.JWT_SECRET,
  isRevoked: blacklist.isRevoked
};

router.use(jwt(JWT_OPTIONS).unless({ path: OPEN_ROUTES, ext: OPEN_FORMATS }));
router.use(AuthMiddleware.validatePermissions.unless({ path: [ ...OPEN_ROUTES, '/signout' ], ext: OPEN_FORMATS }));
router.use(LoggerMiddleware.access);
router.use(LoggerMiddleware.error);
router.use(ErrorMiddleware.unauthorized);

router.use('/', require('./auth'));
router.use('/', require('./home'));
router.use('/users', require('./users'));
router.use('/properties', require('./properties'));

module.exports = router;
