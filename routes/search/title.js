var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');

// 제목 검색
router.get('/', async(req, res) => {
    const keyword = req.query.keyword;
    const getSearchQuery = `SELECT DISTINCT item_idx, title, user.nickname, thumbnail, text FROM item, user WHERE item.title LIKE '%${keyword}%' AND user.user_idx = item.writer_idx ORDER BY date DESC`;
    const getSearchResult = await db.queryParam_Parse(getSearchQuery)

    if(getSearchResult[0] == null){
        res.status(400).send(utils.successFalse(statusCode.NOT_FOUND, resMessage.SEARCH_TITLE_BAD_RESULT));
    } else {
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.SEARCH_TITLE_SUCCESS, getSearchResult))
    }
});

module.exports = router;