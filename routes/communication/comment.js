var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');

router.get('/', async(req,res) => {
    const getCategoryNameQuery = "SELECT category_name FROM category WHERE category_idx = 1";
    const getCategoryNameResult = await db.queryParam_None(getCategoryNameQuery);
  })


module.exports = router;