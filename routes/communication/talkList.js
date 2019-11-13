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
	
	//'나'가 포함된 채팅들을 내림차순 정리한다.(최신순)
	const getRecentMeListQuery = "SELECT * FROM chat WHERE from_user_idx = ? OR to_user_idx = ? ORDER BY date DESC";
	const getRecentMeListResult = await db.queryParam_Parse(getRecentMeListQuery, [from_user_idx,from_user_idx]);

	//목록이 빈 경우
	if(!getRecentMeListResult){
		res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NO_TALK_LIST));
		return;
	}

	let buf = [];

	//이미 대화를 나눈 상대라면 buf에 추가하지 않는다.
	for(let count = 0; count < getRecentMeListResult.length; count++){
		let temp = getRecentMeListResult[count];
		if(count === 0){ //buf가 비었을 경우 가장 최근의 대화를 넣어준다.
			buf.push(temp);
		}else{
			//기존buf들과 새로운 getRecentMeListResult[count]와 비교를 해준다.
			for(let origin = 0; origin < buf.length; origin++){
				//기존의 모든 buf 요소들과 비교
				if((buf[origin].to_user_idx === temp.to_user_idx && buf[origin].from_user_idx === temp.from_user_idx)||
				(buf[origin].to_user_idx === temp.from_user_idx && buf[origin].from_user_idx === temp.to_user_idx)){
					//이전과 대화를 했다면 가차없이 나갑니다.
					break;
				}else{
					if(origin === buf.length-1){
						//마지막 검사까지 통과했다면 push해줍니다!
						buf.push(temp);
					}
				}
			}
		}
	}

	const result = buf;
	if(!result){
		res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.TALK_LIST_GET_BAD_RESULT));
	}else{
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.TALK_LIST_GET_SUCCESS, result));
	}
});

module.exports = router;