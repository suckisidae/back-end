var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');
const sort = require('../../module/quicksort');

// 카테고리 최신순 리스트 불러오기
router.get('/byDate/:category_idx', async (req, res) => {

    const itemList = req.params.category_idx;

    const getCategoryListInfoQuery = "SELECT item_idx, thumbnail, title, views, like_count FROM item WHERE category_idx = ? ORDER BY views ASC";
    const getCategoryListInfoResult = await db.queryParam_Parse(getCategoryListInfoQuery, [itemList]);

    let result = [];

    for(i in getCategoryListInfoResult) {
        result[i] = getCategoryListInfoResult[i];
    }

    if (!getCategoryListInfoResult[0]) {
        res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.GET_BAD_CATEGORY));
    } else {
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.SUCCESS_GET_CATEGORY, getCategoryListInfoResult));
    }
});

// 카테고리 조회순 리스트 불러오기
router.get('/byView/:category_idx', async (req, res) => {

    const itemList = req.params.category_idx;

    const getCategoryListInfoQuery = "SELECT item_idx, thumbnail, title, views, like_count FROM item WHERE category_idx = ? ORDER BY views ASC";
    const getCategoryListInfoResult = await db.queryParam_Parse(getCategoryListInfoQuery, [itemList]);

    let result = sort.byViews(getCategoryListInfoResult);

    if (!getCategoryListInfoResult[0]) {
        res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.GET_BAD_CATEGORY));
    } else {
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.SUCCESS_GET_CATEGORY, getCategoryListInfoResult));
    }
});

// 카테고리 좋아요순 리스트 불러오기
router.get('/byLike/:category_idx', async (req, res) => {

    const itemList = req.params.category_idx;

    const getCategoryListInfoQuery = "SELECT item_idx, thumbnail, title, views, like_count FROM item WHERE category_idx = ? ORDER BY views ASC";
    const getCategoryListInfoResult = await db.queryParam_Parse(getCategoryListInfoQuery, [itemList]);

    let result = sort.byLikes(getCategoryListInfoResult);

    if (!getCategoryListInfoResult[0]) {
        res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.GET_BAD_CATEGORY));
    } else {
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.SUCCESS_GET_CATEGORY, getCategoryListInfoResult));
    }
});

module.exports = router;