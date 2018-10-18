const router = require('express').Router();

const PropertyController = require('../controller/PropertyController');
const PaginationMiddleware = require('../middleware/PaginationMiddleware');

router.get('/', PaginationMiddleware.sanitize, PropertyController.index);
router.post('/', PropertyController.store);
router.get('/:id', PropertyController.show);
router.put('/:id', PropertyController.update);
router.delete('/:id', PropertyController.destroy);

module.exports = router;
