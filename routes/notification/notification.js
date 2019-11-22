var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');

/* 
-notification type
0 : new asked	-> exchange.js
1 : exchange result	-> 
2 : new comment	-> comment.js
*/

//클라이언트에게 읽지 않은(존재 하는) 모든 알림 반환
router.get('/', authUtils.isLoggedin, async (req, res) => {
	// 0: 댓글 , 1: 거래결과 (나랑 거래를 하는지? 타인과 거래를 하는지?) 2 : 타인에게 거래 요청이 들어온 것
	const userIdx = req.decoded.idx;

	//상품 제목, 썸네일 / 알림 유형 DB에서 얻어옴
	const getAllNotificationQuery = "SELECT i.title, i.thumbnail, n.type FROM item i, notification n WHERE i.item_idx IN (SELECT item_idx FROM notification WHERE user_idx = ?)"
	const getAllNotificationResult = await db.queryParam_Parse(getAllNotificationQuery, [userIdx]);

	if (!getAllNotificationResult) {
		res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.notification_GET_BAD_RESULT));
	} else {
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.notification_GET_SUCCESS, getAllNotificationResult));
	}

});

//알림 읽기 (알림 삭제)
router.delete('/:notification_idx', authUtils.isLoggedin, async (req, res) => {

	const notificationIdx = req.params.notification_idx;
	const delReadNotificationQuery = "Delete FROM notification WHERE notification_idx = ?";
	const delReadNotificationResult = await db.queryParam_Parse(delReadNotificationQuery, [notificationIdx]);

	if (!delReadNotificationResult) {
		res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NOTIFICATION_DELETE_BAD_RESULT));
	} else {
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.NOTIFICATION_DELETE_SUCCESS, delReadNotificationResult));
	}
});

module.exports = router;