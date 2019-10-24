var express = require('express');
var router = express.Router();

router.use('/contents', require('./contents'));
router.use('/tag', require('./tag'));
router.use('/title', require('./title'));


module.exports = router;