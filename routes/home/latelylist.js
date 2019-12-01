var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');

// 홈화면에서 보이는 카테고리별 최근 6개의 물품들
router.get('/', async(req, res)=>{
	//식료품
	const getRecentFoodQuery = "SELECT * FROM item WHERE category_idx = ? ORDER BY date DESC LIMIT 6";
	const getRecentFoodResult = await db.queryParam_Parse(getRecentFoodQuery,[1]);
	//it가전기기
	const getRecentITQuery = "SELECT * FROM item WHERE category_idx = ? ORDER BY date DESC LIMIT 6";
	const getRecentITResult = await db.queryParam_Parse(getRecentITQuery,[2]);
	//옷
	const getRecentClothesQuery = "SELECT * FROM item WHERE category_idx = ? ORDER BY date DESC LIMIT 6";
	const getRecentClothesResult = await db.queryParam_Parse(getRecentClothesQuery,[3]);
	//서적
	const getRecentBookQuery = "SELECT * FROM item WHERE category_idx = ? ORDER BY date DESC LIMIT 6";
	const getRecentBookResult = await db.queryParam_Parse(getRecentBookQuery,[4]);

	//총 집합

	//임시
	let temp = [];
	temp.push(getRecentFoodResult);
	temp.push(getRecentITResult);
	temp.push(getRecentClothesResult);
	temp.push(getRecentBookResult);
	//찐
	const getAllRecentResult = temp;
	
	if(!getAllRecentResult){
		res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.RECENT_ITEM_GET_BAD_RESULT));
	}else{
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.RECENT_ITEM_GET_SUCCESS, getAllRecentResult));
	}
});

module.exports = router;