var express = require('express');
var router = express.Router();

router.use('/asked', require('./asked'));
router.use('/comment', require('./comment'));
router.use('/result', require('./result'));

module.exports = router;