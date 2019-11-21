var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');

// 거래 요청받은 상품 조회
// 대기:0 거절:1 수락:2
router.get('/', async(req, res) => {
	const {user_idx} = req.body;//'나'의 idx, 나중에 token으로 대체
    let result = [];//최종결과물
	//교환요청을 받은 모든 물품을 가져온다
	const getAllTradeQuery = "SELECT DISTINCT to_item_idx FROM trade ORDER BY date ASC"; //중복제거
	const getAllTradeResult = await db.queryParam_Parse(getAllTradeQuery);
	
	//아무값도 없다면 값이 비었다는 메세지를 보낸다.
	if(!getAllTradeResult){
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.NULL_VALUE));
		return;
	}

	let myItem = [];
	for(let i = 0; i < getAllTradeResult.length; i++){
		const getMyItemQuery = "SELECT item_idx FROM item WHERE item_idx = ? AND writer_idx = ?";
		const getMyItemResult = await db.queryParam_Parse(getMyItemQuery,[getAllTradeResult[i].to_item_idx,user_idx]);
		
		if(!getMyItemResult[0]){
			continue;
		}
		myItem.push(getMyItemResult[0]);
	}

	//내 거래 내역을 가져온다
	let myTrade = [];
	for(let i = 0; i < myItem.length; i++){
		
		const getMyTradeQuery = "SELECT * FROM trade WHERE to_item_idx = ? AND state = 0 ORDER BY date ASC";
		const getMyTradeResult = await db.queryParam_Parse(getMyTradeQuery,[myItem[i].item_idx]);
		
		if(!getMyTradeResult[0]){
			continue;
		}
		
		for(let k = 0; k < getMyTradeResult.length; k++){
			myTrade.push(getMyTradeResult[k]);
		}
		
	}

	if(!myTrade){
		res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.REQUESTED_ITEM_GET_BAD_RESULT));
	}else{
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.REQUESTED_ITEM_GET_SUCCESS, myTrade));
	}
});

module.exports = router;