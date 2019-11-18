var express = require('express');
var router = express.Router();

router.use('/asked', require('./asked'));
router.use('/', require('./notification'));
router.use('/result', require('./result'));

module.exports = router;