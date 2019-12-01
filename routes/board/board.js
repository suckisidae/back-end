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


//게시물 조회 (게시물 하나)
router.get('/:item_idx', authUtils.isLoggedin, async(req, res)=>{
    const userIdx = req.decoded.idx;
    const itemIdx = req.params.item_idx;
    const getAllItemInfoQuery = "SELECT * FROM item WHERE item_idx = ?"
    const getAllItemInfoResult = await db.queryParam_Parse(getAllItemInfoQuery, [itemIdx])

    //아이템 존재 유무 판단
    const checkItemExistQuery = 'SELECT EXISTS (SELECT item_idx FROM item WHERE item_idx = ?) as SUCCESS'
    const checkItemExistResult = await db.queryParam_Parse(checkItemExistQuery, [itemIdx])
    //아이템이 없을 경우
    if(checkItemExistResult[0]["SUCCESS"] == 0){
        res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.ITEM_GET_BAD_RESULT));
        return;
    }

    if(!getAllItemInfoResult){
        res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.ITEM_GET_BAD_RESULT));
    }else{

        //조회수 증가 쿼리
        const addItemViewsQuery = "UPDATE item set views = views + 1 WHERE item_idx = ?"
        const addItemViewsResult = await db.queryParam_Parse(addItemViewsQuery, [itemIdx])

        //visited 쿼리 (유저가 본 상품 추가)
        const addVisitedQuery = "INSERT INTO visited (user_idx, item_idx) VALUES (?,?)";
        const addVisitedResult = await db.queryParam_Parse(addVisitedQuery, [userIdx, itemIdx]);

        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.ITEM_GET_SUCCESS, getAllItemInfoResult));
    }
});

//게시물 등록하기
router.post('/',  upload.single('thumbnail'), authUtils.isLoggedin, async(req, res) =>{

    const writer_idx = req.decoded.idx;
    const date = moment().format("YYYY-MM-DD HH:mm:ss");
    const {hashtag, text, category_idx, title} = req.body;
    const thumbnail = req.file.location;

    const insertItemQuery = "INSERT INTO item (writer_idx, date , thumbnail, hashtag, text, category_idx, title) VALUES (?,?,?,?,?,?,?)";
    const insertItemResult = await db.queryParam_Parse(insertItemQuery, [writer_idx, date , thumbnail, hashtag, text, category_idx, title]);

    if(!insertItemResult){
        res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.ITEM_POST_BAD_RESULT));
    }else{
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.ITEM_POST_SUCCESS, insertItemResult));
    }
});

//게시물 수정하기
router.put('/:item_idx', authUtils.isLoggedin, async(req, res) =>{

    const itemIdx = req.params.item_idx;
    const writer_idx = req.decoded.idx;
    const date = moment().format("YYYY-MM-DD HH:mm:ss");
    const {thumbnail,hashtag, text, category_idx, title} = req.body;

    const itemUpdateQuery = "UPDATE item SET date = ?, thumbnail = ?, hashtag = ?, text = ?, category_idx = ?, title = ? WHERE item_idx = ?"    
    const itemUpdateResult = await db.queryParam_Parse(itemUpdateQuery, [date , thumbnail, hashtag, text, category_idx, title, itemIdx]);

    if(!itemUpdateResult){
        res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.ITEM_PUT_BAD_RESULT));
    }else{
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.ITEM_PUT_SUCCESS, itemUpdateResult));
    }
});

//게시물 삭제하기
router.delete('/:item_idx', authUtils.isLoggedin, async(req, res) =>{
    const userIdx = req.decoded.idx;
    const itemIdx = req.params.item_idx;

    const selectWriterIdxQuery = `SELECT writer_idx FROM item WHERE item_idx = ${itemIdx}`;
    const selectWriterIdxResult = await db.queryParam_Parse(selectWriterIdxQuery);

    if(!selectWriterIdxResult[0]){
        res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.ITEM_DELETE_BAD_RESULT));
        return;
    }
    if(selectWriterIdxResult[0].writer_idx != userIdx){
        res.status(401).send(utils.successFalse(statusCode.UNAUTHORIZED, resMessage.UNAUTHORIZED));
        return;
    }

    const itemDeleteQuery = "DELETE FROM item WHERE item_idx = ?";
    const itemDeleteResult = await db.queryParam_Parse(itemDeleteQuery, [itemIdx]);

    if(!itemDeleteResult){
        res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.ITEM_DELETE_BAD_RESULT));
    }else{
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.ITEM_DELETE_SUCCESS, itemDeleteResult));
    }
});



module.exports = router;
