var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');

// 거래내역 조회
router.get('/', authUtils.isLoggedin, async(req, res) => {

    const user_idx = req.decoded.idx;

	//거래 완료된 내 아이템, 상대 아이템 인덱스를 DB에서 읽어옴
	const tradeHistoryQuery = "SELECT my_item_idx My, other_item_idx Other FROM trade WHERE state = 2 AND my_item_idx IN (SELECT item_idx FROM item WHERE writer_idx = ?)"
	const tradeHistoryResult = await db.queryParam_Parse(tradeHistoryQuery, [user_idx]);

	var tradeMyItemInfoResult;
	var result = [];
	// 받아온 아이템 인덱스 목록들 순회
	for(i in tradeHistoryResult){
		//내 아이템 인덱스를 기반으로 썸네일, 제목을 얻어옴
		const tradeMyItemInfoQuery = "SELECT thumbnail, title, item_idx FROM item WHERE item_idx = ?";
		tradeMyItemInfoResult = await db.queryParam_Parse(tradeMyItemInfoQuery, [tradeHistoryResult[i].My]);
		//상대 아이템 인덱스를 기반으로 썸네일, 제목을 얻어옴
		const tradeOtherItemInfoQuery = "SELECT thumbnail, title, item_idx FROM item WHERE item_idx = ?";
		const tradeOtherItemInfoResult = await db.queryParam_Parse(tradeOtherItemInfoQuery, [tradeHistoryResult[i].Other]);

		//내 아이템 정보와 상대 아이템 정보를 한 곳에 모음.
		tradeMyItemInfoResult[0].other_thumbnail = tradeOtherItemInfoResult[0].thumbnail;
		tradeMyItemInfoResult[0].other_title = tradeOtherItemInfoResult[0].title;
		
		//불필요한 정보 제거
		delete tradeMyItemInfoResult[0].item_idx;
		
		//클라이언트에게 보기 쉽게 보내주기 위해 배열에 담음
		result[i] = tradeMyItemInfoResult;
	}

	if(!result){	
		res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.GET_BAD_RESULT));
	}else{
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.SUCCESS_GET_ITEM, result));
	}

});

module.exports = router;