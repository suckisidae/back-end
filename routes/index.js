var express = require('express');
var router = express.Router();

router.use('/home', require('./home/index'));
router.use('/mypage', require('./mypage/index'));
router.use('/user', require('./user/index'));

module.exports = router;