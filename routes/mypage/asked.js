var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');

// 내가 요청받은 상품 조회
router.get('/', async(req, res)=>{
    
    /*const {user_idx} = req.body;//'나'의 idx, 나중에 token으로 대체
    
    //내가 거래를 요청받은 상품들의 목록(나에게 거래를 요청한 모든 물품들.)
	const getAskedItemQuery = "SELECT  FROM trade JOIN item ON item.item_idx = trade.to_item_idx WHERE writer_idx = ?";
	const getAskedItemResult = await db.queryParam_Parse(getAskedItemQuery, [user_idx]);

    if(!getAskedItemResult){
		res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.ASKED_ITEM_GET_BAD_RESULT));
	}else{
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.ASKED_ITEM_GET_SUCCESS, getAskedItemResult));
	}*/
});

module.exports = router;