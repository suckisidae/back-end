var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');

//대화 목록 조회
router.get('/', async(req, res)=>{
	//내가 누구들과 대화를 하고있는지! 내가 대화를 나누고있는 사람들 목록과 그 사람들과의 가장 최근 메세지를 반환한다.
	const {from_user_idx} = req.body; //"나" , 나중에 토큰으로 변경
	
	//'나'가 포함된 채팅들 중 가장 최신의 것을 뽑아낸다.
	const getRecentMeListQuery = "SELECT * FROM chat WHERE from_user_idx = ? OR to_user_idx = ? ORDER BY date DESC";
	const getRecentMeListResult = await db.queryParam_Parse(getRecentMeListQuery, [from_user_idx,from_user_idx]);

	console.log(getRecentMeListResult.length);
	let buf = [];
	for(let a = 0; a < getRecentMeListResult.length; a++){
		if(a === 0){ //buf가 비었을 경우
			console.log(a);
			buf.push(getRecentMeListResult[a]);
			console.log(buf.from_user_idx);
		}else{
			/*for(let b = 0; b < buf.length; b++){
				console.log(a,b);
				if(((buf[b].from_user_idx==getRecentMeListResult[a].from_user_idx)&&(buf[b].to_user_idx==getRecentMeListResult[a].to_user_idx))
				||((buf[b].from_user_idx==getRecentMeListResult[a].to_user_idx)&&(buf[b].to_user_idx==getRecentMeListResult[a].from_user_idx))){
					console.log(`${a}와 ${b}대화했어요 안넣어요!`);
					continue;
				}
			}*/
		}
	}
	const result = buf;
	if(!result){
		res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.TALK_LIST_GET_BAD_RESULT));
	}else{
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.TALK_LIST_GET_SUCCESS,  result));
	}

	/*if(!getPeopleListResult){
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.NULL_VALUE));
		return;
	}

	for(let i = 0; i < getPeopleListResult.length; i++){
		console.log(getPeopleListResult[i]);
	}*/
/*
	const getAllTalkListQuery = "SELECT DISTINCT to_user_idx, from_user_idx textd FROM chat WHERE from_user_idx = ?";
	const getAllTalkListResult = await db.queryParam_Parse(getAllTalkListQuery, [from_user_idx]);

	if(!getAllTalkListResult){
		res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.TALK_LIST_GET_BAD_RESULT));
	}else{
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.TALK_LIST_GET_SUCCESS, getAllTalkListResult));
	}*/
});

module.exports = router;