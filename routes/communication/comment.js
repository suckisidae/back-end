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

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'comment' });
// });

router.get('/', async(req,res) => {
  const getCategoryNameQuery = "SELECT category_name FROM category WHERE category_idx = 1";
  const getCategoryNameResult = await db.queryParam_None(getCategoryNameQuery);

  console.log(getCategoryNameResult);
})
router.post('/', async(req,res) => {
  const postMyCommentQuery = "INSERT INTO comment (item_idx, writer_idx, text, date) VALUES (?, ?, ?, ?)";
  const postMyCommentResult = await db.queryParam_Arr(postMyCommentQuery, [1, 2, '감사합니다', moment().format('YYYY-MM-DD HH:mm:ss')]);

  if(!postMyCommentResult){
    res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.BAD_REQUEST));
  } else {
    res.status(200).send(utils.successTrue(statusCode.OK, "성공했어요", postMyCommentResult));
  }
});
// router.put('/', upload.single('img'), authUtil.isLoggedin, async (req, res) => {
// 	let img = req.file.location;
// 	const intro = req.body.intro;
// 	const name = req.body.name;
// 	if (!img  || !name) {
// 		res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.NO_USER_DATA));
// 	} else {
// 		const updateUserInfoQuery = "UPDATE user SET user_img = ?, user_intro = ?, user_name = ? WHERE user_idx = ?";
// 		const updateUserInfoResult = await db.queryParam_Arr(updateUserInfoQuery, [img, intro, name, req.decoded.idx]);
// 		if (!updateUserInfoResult) {
// 			res.status(200).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.UPDATE_USER_DATA_FAIL));
// 		} else {
// 			res.status(200).send(utils.successTrue(statusCode.OK, resMessage.UPDATE_USER_DATA_SUCCESS,updateUserInfoResult));
// 		}
// 	}
// });
module.exports = router;