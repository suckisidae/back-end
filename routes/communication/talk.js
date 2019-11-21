var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');
const moment = require('moment');

/* GET home page. */
router.get('/:to_user_idx', async(req, res)=>{ //대화 상대를 받아온다
	//최근이 아래 =>오름차순
	
	const {from_user_idx} = req.body; //나중에 토큰으로 처리
	const to_user_idx = req.params.to_user_idx;
	
	//조회 시 '내가 보낸 메세지' 와 '상대에게서 받은 메세지'가 다 보여야 하므로 or로 나눠준다.
	const getAllTalkQuery = "SELECT * FROM chat WHERE (from_user_idx = ? AND to_user_idx = ?) OR (to_user_idx = ? AND from_user_idx = ?) ORDER BY date ASC";
	const getAllTalkResult = await db.queryParam_Parse(getAllTalkQuery, [from_user_idx,to_user_idx,from_user_idx,to_user_idx]);
	
	//대화 상대와의 메세지를 하면 읽음으로 표시를 바꾼다. 단, 여기서 나에게 보낸 상대 메세지 상태만 바꾼다.
	//=>현실적으로 상대가 나의 메세지를 읽어야 답장을 하고 내가 그 메세지를 읽는 순서기 때문.
	const updateReadCheckQuery = "UPDATE chat SET readCheck = 1 WHERE from_user_idx = ? AND to_user_idx = ?"
	const updateReadCheckResult = await db.queryParam_Parse(updateReadCheckQuery, [to_user_idx,from_user_idx]);

	if(!updateReadCheckResult){
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.READ_CHECK_UPDATE_FAIL));
		return;
	}

	if(!getAllTalkResult){
		res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.TALK_GET_BAD_RESULT));
	}else{
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.TALK_GET_SUCCESS, getAllTalkResult));
	}
});

//채팅 메세지 추가
router.post('/', async(req,res)=>{
	//from_user_idx :지금 메세지 보내는 '나'
	//to_user_idx :상대방
	//text 
	//date 
	const date = moment().format("YYYY-MM-DD HH:mm:ss");
	const {from_user_idx, to_user_idx, text} = req.body;
	
	//주고받는 사람, 텍스트가 비었는지 확인
	if(!from_user_idx | !to_user_idx | !text){
		res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        return;
	}

	const insertTalkQuery = "INSERT INTO chat (from_user_idx, to_user_idx, text, date) VALUES (?, ?, ?, ?)";
	const insertTalkResult = await db.queryParam_Parse(insertTalkQuery, [from_user_idx, to_user_idx, text, date]);

	if(!insertTalkResult){
		res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.TALK_POST_BAD_RESULT));
	}else{
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.TALK_POST_SUCCESS, insertTalkResult));
	}

});

module.exports = router;