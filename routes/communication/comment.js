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

//댓글 등록
router.post('/', async(req,res)=>{

	const date = moment().format("YYYY-MM-DD HH:mm:ss");
	const {item_idx, writer_idx, text} = req.body;

	const insertCommentQuery = "INSERT INTO comment (item_idx, writer_idx, text, date) VALUES (?, ?, ?, ?)";
	const insertCommentResult = await db.queryParam_Arr(insertCommentQuery, [item_idx, writer_idx, text, date]);

	if(!insertCommentResult){
		res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.COMMENT_POST_BAD_RESULT));
	}else{
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.COMMENT_POST_SUCCESS, insertCommentResult));
	}

});

//해당 게시글 댓글 조회
router.get('/:item_idx', async(req, res)=>{
    const itemIdx = req.params.item_idx;
	
	const getAllCommentQuery = "SELECT * FROM comment WHERE item_idx = ?";
	const getAllCommentResult = await db.queryParam_Arr(getAllCommentQuery, [itemIdx]);

	if(!getAllCommentQuery){
		res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.COMMENT_GET_BAD_RESULT));
	}else{
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.COMMENT_GET_SUCCESS, getAllCommentResult));
	}
});

//댓글 수정
router.put('/:comment_idx', async(req, res)=>{ //처음에는 해당 게시글idx를 받아오려했는데 댓글 idx를 받아오는게 더 깔끔할것같아서 comment_idx로 했슴다
	const comment_idx = req.params.comment_idx;
	const date = moment().format("YYYY-MM-DD HH:mm:ss");
	const {text} = req.body;

	const updateCommentQuery = "UPDATE comment SET text=?, date=? WHERE comment_idx = ?"; //시간, 텍스트만 수정  작성자 수정x
	const updateCommentResult = await db.queryParam_Arr(updateCommentQuery, [text, date, comment_idx]);

	if(!updateCommentResult){
		res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.COMMENT_UPDATE_BAD_RESULT));
	}else{
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.COMMENT_UPDATE_SUCCESS, updateCommentResult));
	}
});


module.exports = router;