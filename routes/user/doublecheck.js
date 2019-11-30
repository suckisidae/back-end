var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');

// 닉네임 중복확인
router.post('/', async (req, res) => {
    const nickname = req.body.nickname;

    //존재 유무 확인
    const nicknameCheckQuery = `SELECT EXISTS (SELECT * FROM user WHERE nickname = ?) as SUCCESS`;
    const nicknameCheckResult = await db.queryParam_Parse(nicknameCheckQuery, [nickname]);
    
    if (nicknameCheckResult[0]["SUCCESS"] == 0) {
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.ABLE_NICKNAME, nicknameCheckResult));
    } else {
        res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.ALREADY_NICKNAME));
    }
});

module.exports = router;