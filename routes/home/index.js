var express = require('express');
var router = express.Router();

router.use('/latelylist', require('./latelylist'));
router.use('/recommendation', require('./recommendation'));

module.exports = router;