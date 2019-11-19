var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');

/* 
-notification type
0 : new asked	-> exchange.js
1 : exchange result	-> 
2 : new comment	-> comment.js
*/

router.get('/', function(req, res, next) {
  res.render('index', { title: 'comment' });
});

module.exports = router;