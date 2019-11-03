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


// 전체 목록 가져오기
router.get('/', async(req,res) => {
    const item_idx = 3
    const getItemQuery = "SELECT category_idx FROM item WHERE item_idx = 3";
    const getCateItemQuery = "SELECT category_name FROM category WHERE category_idx = ?";
    const getItemResult = await db.queryParam_Arr(getItemQuery)
    const cateIdx = getItemResult[0].category_idx
    console.log(cateIdx)
    const getCateItemResult = await db.queryParam_Parse(getCateItemQuery,[cateIdx])

    if(!getItemResult){
        res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.POST_BAD_RESULT))
    } else{
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.SUCCESS_POST_ITEM, getCateItemResult))
    }
})
//naver.com/news/{숫자}
// 게시물 하나 가져오기
router.get('/:item_idx', async(req, res) => {
    const itemIdx = req.params.item_idx
    
    const getAllItemInfoQuery = "SELECT * FROM item WHERE item_idx = ?"
    const getAllItemInfoResult = await db.queryParam_Arr(getAllItemInfoQuery, [itemIdx])

    res.status(200).send(utils.successTrue(statusCode.OK, resMessage.SUCCESS_POST_ITEM, getAllItemInfoResult))
})



// 게시물 등록
router.post('/', async(req, res) => {
    const date = moment().format("YYYY-MM-DD HH:mm:ss");
    const {writer_idx, thumbnail, hashtag, text, category_idx, title} = req.body;

    const insertItemQuery = "INSERT INTO item (writer_idx, date, thumbnail, hashtag, text, category_idx, title) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const insertItemResult = await db.queryParam_Arr(insertItemQuery, [writer_idx, date, thumbnail, hashtag, text, category_idx, title]);

    if(!insertItemResult){
        res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.POST_BAD_RESULT))
    } else{
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.SUCCESS_POST_ITEM, insertItemResult))
    }
})

module.exports = router; 