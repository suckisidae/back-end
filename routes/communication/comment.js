var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'comment' });
});

router.post('/', async (req, res) => {
  const postMyCommentQuery = "INSERT INTO comment (item_idx, write_idx, text, date) VALUES  (?,?,?,?)";
  const postMyCommentResult = await db.queryParam_Arr(postMyCommentQuery, [1,2,"감사합니다",1]);

  //예외 처리
  if(!postMyCommentResult){
    res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.BAD_REQUEST));
  }else{
    res.status(200).send(utils.successTrue(statusCode.OK , "성공했어요.", postMyCommentResult))
  }

});

module.exports = router;