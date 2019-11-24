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
	const tradeHistoryQuery = "SELECT my_item_idx My, other_item_idx Other FROM trade WHERE state = 1 AND my_item_idx IN (SELECT item_idx FROM item WHERE writer_idx = ?)"
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

//해당 거래 별점주기
router.put('/:trade_idx', async(req, res)=>{ //trade_idx는 거래내역 안에 있는 거래이므로 무조건 state가 1일 것이다.
	const trade_idx = req.params.trade_idx;
	const {user_idx, grade} = req.body; //내가 trade_idx의 to_user_idx일수 있고 from_user_idx일 수 있으며 trade와 별개로 내가 별점을 준다면 star테이블에서는 from_user_idx가 된다.


	//별점은 한번만 줄 수 있다.
	//STAR테이블에 기록된 거래인지 확인한다. trade_idx에서 별점을 준 사람이 '나' 인 경우 (상대도 나에게 별점을 줄 수 있다=>하나의 거래에 두개의 평점이 메겨질 수 있음)
	const getStarQuery = "SELECT star_idx FROM star WHERE trade_idx = ? AND from_user_idx = ?";
	const getStarResult = await db.queryParam_Parse(getStarQuery, [trade_idx, user_idx]);
	//한번 별점을 준 상태라면 오류메세지와 리턴시킨다.
	if(getStarResult[0]){ 
		//존재한다면
		res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.ALREADY_STAR_DONE));
        return;
	}
	
	//존재하지 않는다면
	console.log("별점주기 가능");
	
	
});


module.exports = router;