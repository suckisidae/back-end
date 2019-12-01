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


// 최신순 조회
router.get('/byDate', async (req, res) => {
	const keyword = req.query.keyword;
	const getSearchQuery = `SELECT DISTINCT item_idx, title, user.nickname, thumbnail, text FROM item, user WHERE item.hashtag LIKE '%${keyword}%' AND user.user_idx = item.writer_idx ORDER BY date DESC`;
	const getSearchResult = await db.queryParam_Parse(getSearchQuery)

	let result = [];

	for(i in getSearchResult) {
		result[i] = getSearchResult[i];
	}

	if (getSearchResult[0] == null) {
		res.status(400).send(utils.successFalse(statusCode.NOT_FOUND, resMessage.SEARCH_HASHTAG_FAIL));
	} else {
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.SEARCH_HASHTAG_SUCCESS, result));
	}
});

// 조회순 조회
router.get('/byView', async (req, res) => {
	const keyword = req.query.keyword;
	const getSearchQuery = `SELECT DISTINCT item_idx, title, user.nickname, thumbnail, text FROM item, user WHERE item.hashtag LIKE '%${keyword}%' AND user.user_idx = item.writer_idx ORDER BY date DESC`;
	const getSearchResult = await db.queryParam_Parse(getSearchQuery)

	const result = sort.byViews(getSearchResult);

	if (getSearchResult[0] == null) {
		res.status(400).send(utils.successFalse(statusCode.NOT_FOUND, resMessage.SEARCH_HASHTAG_FAIL));
	} else {
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.SEARCH_HASHTAG_SUCCESS, result));
	}
});

// 좋아요순 조회
router.get('/byLike', async (req, res) => {
	const keyword = req.query.keyword;
	const getSearchQuery = `SELECT DISTINCT item_idx, title, user.nickname, thumbnail, text FROM item, user WHERE item.hashtag LIKE '%${keyword}%' AND user.user_idx = item.writer_idx ORDER BY date DESC`;
	const getSearchResult = await db.queryParam_Parse(getSearchQuery)

	const result = sort.byLikes(getSearchResult);

	if (getSearchResult[0] == null) {
		res.status(400).send(utils.successFalse(statusCode.NOT_FOUND, resMessage.SEARCH_HASHTAG_FAIL));
	} else {
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.SEARCH_HASHTAG_SUCCESS, result));
	}
});

module.exports = router;