var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');
const encryption = require('../../module/encryption');

//아이디 중복 검사 필요함.
router.post('/', upload.single('photo'), async(req,res) => {
    const {id, nickname, password, intro, pw_ask, pw_answer} = req.body;
    const photo = req.file.location;
    if(!id || !nickname || !password || !intro || !pw_answer || !pw_ask){
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        return;
    }
    const encryptionResult = await encryption.encrypt(password);
    const insertUserQuery = 'INSERT INTO user (id, nickname, password, intro, pw_ask, pw_answer, photo, salt) VALUES (?,?,?,?,?,?,?,?)';
    const insertUserResult = await db.queryParam_Parse(insertUserQuery, [id, nickname, encryptionResult.hashed, intro, pw_ask, pw_answer, photo, encryptionResult.salt]);
    if(!insertUserResult){
        res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.SIGNIN_FAIL));
    } else {
        res.status(200).send(utils.successTrue(statusCode.CREATED, resMessage.SIGNIN_SUCCESS, id))
    }
})

module.exports = router;