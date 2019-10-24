var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '마이페이지 조회' });
});

router.put('/', function(req, res, next) {
    res.render('index', { title: '마이페이지 수정' });
  });

module.exports = router;