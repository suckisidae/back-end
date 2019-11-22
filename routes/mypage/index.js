var express = require('express');
var router = express.Router();

router.use('/', require('./mypage'));
router.use('/ask', require('./ask'));
router.use('/exchangelist', require('./exchangelist'));
router.use('/myproduct', require('./myproduct'));
router.use('/requested', require('./requested'));

module.exports = router;