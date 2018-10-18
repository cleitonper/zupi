const router = require('express').Router();

const UserController = require('../controller/UserController');
const PaginationMiddleware = require('../middleware/PaginationMiddleware');

router.get('/', PaginationMiddleware.sanitize, UserController.index);
router.post('/', UserController.store);
router.get('/:id', UserController.show);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.destroy);

module.exports = router;
