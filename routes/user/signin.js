var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');
const encryption = require('../../module/encryption')

router.post('/', async (req, res) => {
	const {id, password} = req.body;
	
	console.log(id);
	console.log(password);

	if (!id || !password){
		res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
		return;
	}
	const getUserPasswordQuery = `SELECT user_idx, password, salt FROM user WHERE id = '${id}'`
	const getUserPasswordResult = await db.queryParam_None(getUserPasswordQuery)

	if(!getUserPasswordResult){
		res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NOT_FIND_USER));
		return;
	}
	const passwordHashed = await encryption.encryptWithSalt(password, getUserPasswordResult[0].salt);
	
	if(getUserPasswordResult[0].password == passwordHashed.hashed){
		const getToken = jwt.sign(getUserPasswordResult[0].user_idx);
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.LOGIN_SUCCESS, getToken));
		return;
	} else {
		res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.LOGIN_FAIL));
	}

});

module.exports = router;