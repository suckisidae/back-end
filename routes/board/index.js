var express = require('express');
var router = express.Router();

router.use('/category', require('./category'));
router.use('/like', require('./like'));
router.use('/', require('./board'));


module.exports = router;