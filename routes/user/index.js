var express = require('express');
var router = express.Router();

router.use('/doublecheck', require('./doublecheck'));
router.use('/findpw', require('./findpw'));
router.use('/idcheck', require('./idcheck'));
router.use('/signin', require('./signin'));
router.use('/signup', require('./signup'));

module.exports = router;