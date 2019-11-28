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
const encryption = require('../../module/encryption');

//비밀번호 찾기
router.get('/', async(req, res)=>{
	//유저idx, 질문idx, 대답
	const {user_id, pw_ask, pw_answer} = req.body;

	//디비의 정보와 일치한지 확인
	const getFindPWQuery = "SELECT * FROM user WHERE id = ? AND pw_ask = ? AND pw_answer = ?";
	const getFindPWResult = await db.queryParam_Parse(getFindPWQuery, [user_id, pw_ask, pw_answer]);
	
	if(!getFindPWResult[0]){
		//비밀번호 찾기 실패
		res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.FIND_PW_BAD_RESULT));
	}else{
		//비밀번호 찾기 성공
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.FIND_PW_SUCCESS, getFindPWResult));
	}
});

//비밀번호 재설정
router.put('/', async(req, res)=>{

	const {user_id, password} = req.body;

	//비밀번호가 비어있는 경우
	if(!password){
		res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        return;
	}

	//비밀번호 재설정
	const encryptionResult = await encryption.encrypt(password);//암호화
	const updatePWQuery = "UPDATE user SET password = ?, salt = ? WHERE id = ?";
	const updatePWResult = await db.queryParam_Parse(updatePWQuery, [encryptionResult.hashed, encryptionResult.salt, user_id]);
	
	if(!(updatePWResult.affectedRows === 1)){
		res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.PW_UPDATE_BAD_RESULT));
	}else{
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.PW_UPDATE_SUCCESS, updatePWResult));
	}
});

module.exports = router;