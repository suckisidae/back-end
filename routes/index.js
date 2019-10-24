var express = require('express');
var router = express.Router();

router.use('/board', require('./board'));
router.use('/communication', require('./communication'));
router.use('/notification', require('./notification'));
router.use('/search', require('./search'));
router.use('/home', require('./home/index'));
router.use('/mypage', require('./mypage/index'));
router.use('/user', require('./user/index'));

module.exports = router;