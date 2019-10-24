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
  res.render('index', { title: 'category' });
});

router.get('/list', function(req, res, next) {
    res.render('index', { title: 'category-list' });
    
  });


module.exports = router;