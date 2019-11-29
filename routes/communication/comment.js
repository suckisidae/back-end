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
router.post('/:item_idx', authUtils.isLoggedin, async(req,res)=>{

	const date = moment().format("YYYY-MM-DD HH:mm:ss");
	const text = req.body;
	const item_idx = req.params.item_idx;
	const writer_idx = req.decoded.idx;
	
	if(!writer_idx | !text){
		res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        return;
	}
	// 댓글 등록과 댓글 알림 트랜잭션 처리
	const postCommentTransaction = await db.Transaction(async(connection) => {
		const insertCommentQuery = "INSERT INTO comment (item_idx, writer_idx, text, date) VALUES (?, ?, ?, ?)";
		const insertCommentResult = await connection.query(insertCommentQuery, [item_idx, writer_idx, text, date]);
		// 댓글 등록에 성공했을 경우 알림
		const getItemWriterResult = await connection.query(`SELECT writer_idx FROM item WHERE item_idx = ${item_idx}`);
		const itemWriterIdx = getItemWriterResult[0].writer_idx
		const pushCommentNotificationResult = await connection.query(`INSERT INTO notification (type, user_idx, item_idx, date) VALUES (2, ${itemWriterIdx}, ${item_idx}, '${date}')`);
	});
	if(!postCommentTransaction) {
		res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.COMMENT_POST_BAD_RESULT));
	} else {
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.COMMENT_POST_SUCCESS, postCommentTransaction));
	}
});

//해당 게시글 댓글 조회
router.get('/:item_idx', async(req, res)=>{
    const itemIdx = req.params.item_idx;
	
	const getAllCommentQuery = "SELECT * FROM comment WHERE item_idx = ?";
	const getAllCommentResult = await db.queryParam_Parse(getAllCommentQuery, [itemIdx]);

	if(getAllCommentResult[0] == undefined){
		res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.COMMENT_GET_BAD_RESULT));
	}else{
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.COMMENT_GET_SUCCESS, getAllCommentResult));
	}
});

//댓글 수정
router.put('/:comment_idx', authUtils.isLoggedin, async(req, res)=>{ //처음에는 해당 게시글idx를 받아오려했는데 댓글 idx를 받아오는게 더 깔끔할것같아서 comment_idx로 했슴다
	const comment_idx = req.params.comment_idx;
	const date = moment().format("YYYY-MM-DD HH:mm:ss");
	const {text} = req.body;
	const userIdx = req.decoded.idx;

	//댓글이 비어있는 경우
	if(!comment_idx | !date | !text){
		res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        return;
	}
	// 댓글의 작성자를 불러오는 쿼리
	const selectWriterIdxQuery = `SELECT writer_idx FROM comment WHERE comment_idx = ${comment_idx}`;
	const selectWriterIdxResult = await db.queryParam_Parse(selectWriterIdxQuery);

	// 작성자와 수정하고자 하는 사람의 idx가 같지 않을경우 권한없음 오류
	if(selectWriterIdxResult[0].writer_idx != userIdx){
		res.status(401).send(utils.successFalse(statusCode.UNAUTHORIZED, resMessage.UNAUTHORIZED));
		return;
	}
	const updateCommentQuery = "UPDATE comment SET text=?, date=? WHERE comment_idx = ?"; //시간, 텍스트만 수정  작성자 수정x
	const updateCommentResult = await db.queryParam_Parse(updateCommentQuery, [text, date, comment_idx]);

	if(!updateCommentResult){
		res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.COMMENT_UPDATE_BAD_RESULT));
	}else{
		res.status(200).send(utils.successTrue(statusCode.OK, resMessage.COMMENT_UPDATE_SUCCESS, updateCommentResult));
	}
});

//댓글 삭제
router.delete('/:comment_idx', authUtils.isLoggedin, async(req, res) =>{ //comment_idx를 받아온다.
	const userIdx = req.decoded.idx;
	const comment_idx = req.params.comment_idx;
	
	// 댓글의 작성자를 불러오는 쿼리
	const selectWriterIdxQuery = `SELECT writer_idx FROM comment WHERE comment_idx = ${comment_idx}`;
	const selectWriterIdxResult = await db.queryParam_Parse(selectWriterIdxQuery);
	
	// 작성자와 수정하고자 하는 사람의 idx가 같지 않을경우 권한없음 오류
	if(selectWriterIdxResult[0].writer_idx != userIdx){
		res.status(401).send(utils.successFalse(statusCode.UNAUTHORIZED, resMessage.UNAUTHORIZED));
		return;
	}
    const commentDeleteQuery = "DELETE FROM comment WHERE comment_idx = ?"
    const commentDeleteResult = await db.queryParam_Parse(commentDeleteQuery, [comment_idx])

    if(!commentDeleteResult){
        res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.COMMENT_DELETE_BAD_RESULT));
    }else{
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.COMMENT_DELETE_SUCCESS, commentDeleteResult));
    }
});


module.exports = router;