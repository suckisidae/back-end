var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');

// 
router.get('/', async (req, res) => {
	const keyword = req.query.keyword;
	const getSearchQuery = `SELECT DISTINCT item_idx, title, user.nickname, thumbnail, text FROM item, user WHERE item.text LIKE '%${keyword}%' AND user.user_idx = item.writer_idx ORDER BY date DESC`;
	const getSearchResult = await db.queryParam_Parse(getSearchQuery)

	if (getSearchResult[0] == null) {
		res.status(400).send(utils.successFalse(statusCode.NOT_FOUND, resMessage.SEARCH_TEXT_FAIL));
	} else {
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.SEARCH_TEXT_SUCCESS, getSearchResult))
	}
});

module.exports = router;