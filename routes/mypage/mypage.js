var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');

// 마이페이지 조회
router.get('/', authUtils.isLoggedin, async(req, res) => {
    const userIdx = req.decoded.idx
    console.log(userIdx)
});

// 마이페이지 수정
router.put('/', authUtils.isLoggedin, async(req, res) => {
    res.render('index', { title: '마이페이지 조회' });
});

module.exports = router;