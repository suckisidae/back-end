var express = require('express');
var router = express.Router();

router.use('/comment', require('./comment'));
router.use('/exchange', require('./exchange'));
router.use('/talk', require('./talk'));
router.use('/talkList', require('./talkList'));

module.exports = router;