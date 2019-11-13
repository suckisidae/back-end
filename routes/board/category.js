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
router.get('/:categoryItemList', async(req, res) =>{

  const itemList = req.params.categoryItemList;

  const getCategoryListInfoQuery = "SELECT thumbnail, title FROM item WHERE category_idx = ?"
  const getCategoryListInfoResult = await db.queryParam_Parse(getCategoryListInfoQuery, [itemList])

  if(!getCategoryListInfoResult[0]){
      res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.GET_BAD_CATEGORY));
  }else{
      res.status(200).send(utils.successTrue(statusCode.OK, resMessage.SUCCESS_GET_CATEGORY, getCategoryListInfoResult));
  }
    
});


// 카테고리에 해당하는 모든 아이템 불러오기 (품목 전체보기)
router.get('/list/:listIdx', async(req, res)=>{

  const cateIdx = req.params.listIdx;
  const getCateInfoQuery = "SELECT * FROM category WHERE category_idx = ?"
  const getCateInfoResult = await db.queryParam_Parse(getCateInfoQuery, [cateIdx])


  if(!getCateInfoResult){
      res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.GET_BAD_CATEGORY));
  }else{
      res.status(200).send(utils.successTrue(statusCode.OK, resMessage.SUCCESS_GET_CATEGORY, getCateInfoResult));
  }

    
});

module.exports = router;