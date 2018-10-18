const router = require('express').Router();

const HomeController = require('../controller/HomeController');

router.get('/', HomeController.index);

module.exports = router;
