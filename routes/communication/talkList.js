var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');

//대화 목록 조회
router.get('/', authUtils.isLoggedin, async(req, res)=>{
	//내가 누구들과 대화를 하고있는지! 내가 대화를 나누고있는 사람들 목록과 그 사람들과의 가장 최근 메세지를 반환한다.
	const from_user_idx = req.decoded.idx; //"나"
	
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
	
	//마지막 메세지가 '나' 인 것은 안읽은 메세지 개수가 0이다.
	//마지막 메세지가 '나' 가 아닌 것에서는 상대를 기억하고 그 사람과 나의 채팅 중 읽음표시가 아닌 것의 개수를 세서 돌려준다. 각 객체에 추가할수있나?
	
	//안읽은 메세지 개수 구하기
	let noReadcount = [];
	
	//count.push(2);
	for(let i = 0; i < buf.length; i++){ //각각의 안읽은 메세지 개수를 구해야하니 전체목록을 한번 훑는다.
		if(buf[i].from_user_idx == from_user_idx){ 
			//마지막 메세지가 '나' 인 경우는 안읽은 메세지 개수가 0이다.
			noReadcount[i] = {"COUNT(readCheck)": 0};
		}else{
			//마지막 메세지가 '나' 가 아닌 경우는 안읽은 메세지 개수를 count해야한다.

			//메세지 목록에서 from과 to가 같은 메세지들 중 상대 메세지만 시간기준 내림차순으로 뽑아서 그 챗 인덱스의 noREAD = 0인 것을 count한다
			const getNoReadQuery = "SELECT COUNT(CASE WHEN readCheck=0 THEN 1 END) FROM chat WHERE from_user_idx = ? AND to_user_idx = ? ORDER BY date DESC";
			const getNoReadResult = await db.queryParam_Parse(getNoReadQuery, [buf[i].from_user_idx,from_user_idx]);
			
			//결과가 빈 경우
			if(!getNoReadResult){
				res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NO_READ_GET_BAD_RESULT));
				return;
			}
			
			

			//결과를 저장한다.
			noReadcount[i] = getNoReadResult[0];
		
		}
	}
	
	//각 객체에 안읽은 메세지 개수 추가
	for(let i = 0; i < buf.length; i++){
		buf[i].noRead = noReadcount[i];
	}


	//상대방 아이디와 닉네임 추가
	for(let i = 0; i < buf.length; i++){
		const getFromInfoQuery= "SELECT nickname, id FROM user WHERE user_idx = ?";
		const getFromInfoResult = await db.queryParam_Parse(getFromInfoQuery, [buf[i].from_user_idx]);
		
		//결과가 빈 경우
		if(!getFromInfoResult){
			res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.GET_BAD_INFO));
			return;
		}
		buf[i].from_user_id = getFromInfoResult[0].id;
		buf[i].from_user_nickname = getFromInfoResult[0].nickname;

		const getToInfoQuery= "SELECT nickname, id FROM user WHERE user_idx = ?";
		const getToInfoResult = await db.queryParam_Parse(getToInfoQuery, [buf[i].to_user_idx]);
		
		//결과가 빈 경우
		if(!getToInfoResult){
			res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.GET_BAD_INFO));
			return;
		}
		buf[i].to_user_id = getToInfoResult[0].id;
		buf[i].to_user_nickname = getToInfoResult[0].nickname;
	}

	const result = buf;
	if(!result[0]){
		res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.TALK_LIST_GET_BAD_RESULT));
	}else{
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.TALK_LIST_GET_SUCCESS, result));
	}
});

module.exports = router;