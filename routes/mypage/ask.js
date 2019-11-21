var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');

// 내가 요청 한 상품 조회
router.get('/', async(req, res)=>{
	//수정중
	
    /*const {user_idx} = req.body;//'나'의 idx, 나중에 token으로 대체
    
	//내가 포함 된 거래의 정보를 읽어온다. 오름차순으로 ->시간순
	const getOtherIdxQuery = "SELECT * FROM trade WHERE from_user_idx = ? ORDER BY date ASC";
	const getOtherIdxResult = await db.queryParam_Parse(getOtherIdxQuery, [user_idx]);

	//아무값도 없다면 값이 비었다는 메세지를 보낸다.
	if(!getOtherIdxResult[0]){
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.NULL_VALUE));
		return;
	}

	console.log(getOtherIdxResult.length);

	
    if(!getOtherIdxResult){
		res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.ASK_ITEM_GET_BAD_RESULT));
	}else{
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.ASK_ITEM_GET_SUCCESS, getOtherIdxResult));
	}*/

});

module.exports = router;