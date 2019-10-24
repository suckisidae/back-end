var express = require('express');
var router = express.Router();

router.use('/board', require('./board'));
router.use('/communication', require('./communication'));
router.use('/notification', require('./notification'));
router.use('/search', require('./search'));


module.exports = router;