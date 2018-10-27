const router = require('express').Router();

const AuthController = require('../controller/AuthController');
const UserController = require('../controller/UserController');

router.post('/signin', AuthController.signin);
router.post('/signout', AuthController.signout);
router.post('/signup', UserController.store);
router.post('/forgot-password', AuthController.forgotPassword);
router.get('/reset-password/:token', AuthController.resetPassword);

module.exports = router;
