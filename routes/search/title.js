var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const sort = require('../../module/quicksort');

// 최신순 조회
router.get('/byDate', async (req, res) => {
	const keyword = req.query.keyword;
	const getSearchQuery = `SELECT DISTINCT item_idx, title, user.nickname, thumbnail, text, views, like_count FROM item, user WHERE item.title LIKE '%${keyword}%' AND user.user_idx = item.writer_idx ORDER BY date DESC`;
	const getSearchResult = await db.queryParam_Parse(getSearchQuery)

	let result = [];

	for(i in getSearchResult) {
		result[i] = getSearchResult[i];
	}

	if (getSearchResult[0] == null) {
		res.status(400).send(utils.successFalse(statusCode.NOT_FOUND, resMessage.SEARCH_TITLE_BAD_RESULT));
	} else {
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.SEARCH_TITLE_SUCCESS, getSearchResult));
	}
});

// 조회순 조회
router.get('/byView', async (req, res) => {
	const keyword = req.query.keyword;
	const getSearchQuery = `SELECT DISTINCT item_idx, title, user.nickname, thumbnail, text, views, like_count FROM item, user WHERE item.title LIKE '%${keyword}%' AND user.user_idx = item.writer_idx ORDER BY date DESC`;
	const getSearchResult = await db.queryParam_Parse(getSearchQuery)

	const result = sort.byViews(getSearchResult);

	if (getSearchResult[0] == null) {
		res.status(400).send(utils.successFalse(statusCode.NOT_FOUND, resMessage.SEARCH_TITLE_BAD_RESULT));
	} else {
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.SEARCH_TITLE_SUCCESS, getSearchResult));
	}
});

// 좋아요순 조회
router.get('/byLike', async (req, res) => {
	const keyword = req.query.keyword;
	const getSearchQuery = `SELECT DISTINCT item_idx, title, user.nickname, thumbnail, text, views, like_count FROM item, user WHERE item.title LIKE '%${keyword}%' AND user.user_idx = item.writer_idx ORDER BY date DESC`;
	const getSearchResult = await db.queryParam_Parse(getSearchQuery)

	const result = sort.byLikes(getSearchResult);

	if (getSearchResult[0] == null) {
		res.status(400).send(utils.successFalse(statusCode.NOT_FOUND, resMessage.SEARCH_TITLE_BAD_RESULT));
	} else {
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.SEARCH_TITLE_SUCCESS, getSearchResult));
	}
});

module.exports = router;