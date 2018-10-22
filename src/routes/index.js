const router =    require('express').Router();
const jwt =       require('express-jwt');
const blacklist = require('express-jwt-blacklist');
blacklist.configure({ tokenId: 'id' });

const AuthMiddleware = require('../middleware/AuthMiddleware');
const ErrorMiddleware = require('../middleware/ErrorMiddleware');

const OPEN_ROUTES = ['/', '/signin', '/signup'];

const JWT_OPTIONS = {
  secret: process.env.JWT_SECRET,
  isRevoked: blacklist.isRevoked
};

router.use(jwt(JWT_OPTIONS).unless({ path: OPEN_ROUTES }));
router.use(AuthMiddleware.validatePermissions.unless({ path: [ ...OPEN_ROUTES, '/signout' ] }));
router.use(ErrorMiddleware.unauthorized);

router.use('/', require('./auth'));
router.use('/', require('./home'));
router.use('/users', require('./users'));
router.use('/properties', require('./properties'));

module.exports = router;
