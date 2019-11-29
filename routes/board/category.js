var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');

// 카테고리 리스트 불러오기
router.get('/:category_idx', async (req, res) => {

    const itemList = req.params.category_idx;

    const getCategoryListInfoQuery = "SELECT thumbnail, title FROM item WHERE category_idx = ? ORDER BY views ASC";
    const getCategoryListInfoResult = await db.queryParam_Parse(getCategoryListInfoQuery, [itemList]);

    if (!getCategoryListInfoResult[0]) {
        res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.GET_BAD_CATEGORY));
    } else {
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.SUCCESS_GET_CATEGORY, getCategoryListInfoResult));
    }
});


module.exports = router;