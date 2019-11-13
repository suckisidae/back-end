var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');

// 마이페이지 조회
router.get('/', authUtils.isLoggedin, async(req, res) => {
    const userIdx = req.decoded.idx;
    
    const userAllInfoQuery = `SELECT nickname, intro, photo, star FROM user WHERE user_idx = ${userIdx}`;
    const userAllInfoResult = await db.queryParam_Parse(userAllInfoQuery);

    if(!userAllInfoResult[0]){
        res.status(400).send(utils.successFalse(statusCode.NO_CONTENT, resMessage.NOT_FIND_USER));
    } else {
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.USER_SELECTED, userAllInfoResult));
    }
});

// 마이페이지 수정
router.put('/', authUtils.isLoggedin, upload.single('photo'), async(req, res) => {
    const {nickname, intro} = req.body;
    const photo = req.file.location;
    const userIdx = req.decoded.idx;

    if (!nickname || !intro || !photo){
        res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    }
    const updateUserInfoQuery = `UPDATE user SET nickname = ?, intro = ?, photo = ? WHERE user_idx = ?`;
    const updateUserInfoResult = await db.queryParam_Parse(updateUserInfoQuery, [nickname, intro, photo, userIdx]);
    
    if(!updateUserInfoResult){
        console.log(err);
        res.status(500).send(utils.successFalse(statusCode.DB_ERROR, resMessage.UPDATE_USER_INFO_FAIL));
    } else {
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.UPDATE_USER_INFO_SUCCESS, updateUserInfoResult));
    }
});

module.exports = router;