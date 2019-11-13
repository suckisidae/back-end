var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');

// 내가 등록한 상품 조회
router.get('/', authUtils.isLoggedin, async(req, res) => {
    const userIdx = req.decoded.idx;
    
    const getMyProductQuery = `SELECT thumbnail, title, date FROM item WHERE writer_idx = '${userIdx}' ORDER BY date DESC`;
    const getMyProductResult = await db.queryParam_Parse(getMyProductQuery);

    if(!getMyProductResult){
        res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST,resMessage.GET_MY_PRODUCT_FAIL))
    } else {
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.GET_MY_PRODUCT_SUCCESS, getMyProductResult));
    }
});

module.exports = router;