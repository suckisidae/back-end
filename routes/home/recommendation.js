var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');

//추천 상품 조회
router.get('/', async(req, res)=>{

		const userIdx = req.body.user_idx;
    
        //내가 찜한 목록 가져오기
		const getUserVisitedQuery = "SELECT item_idx FROM heart WHERE user_idx = ?"
        const getUserVisitedResult = await db.queryParam_Parse(getUserVisitedQuery, [userIdx]);

        //내가 찜한 목록들 훑으며 카테고리 카운트 하기
        var getCategoryResult;
        var Category = new Array(0,0,0,0,0);

        for(var i = 0 ; i < getUserVisitedResult.length ; i++){
            const getCategoryQuery = "SELECT category_idx FROM item WHERE item_idx = ?"
            getCategoryResult = await db.queryParam_Parse(getCategoryQuery, [getUserVisitedResult[i].item_idx]);
            
            if(getCategoryResult[0].category_idx == 1){
                Category[1]++;
            }else if(getCategoryResult[0].category_idx == 2){
                Category[2]++;
            }else if(getCategoryResult[0].category_idx == 3){
                Category[3]++;
            }else if(getCategoryResult[0].category_idx == 4){
                Category[4]++;
            }
        }
        const maxCategory = Math.max.apply(Math, Category); 
        const favoriteCategoryIndex = Category.indexOf(maxCategory);

        //카테고리에 해당하는 물건 읽어오기

		//const getAllItemQuery = "SELECT item_idx FROM item WHERE category_idx = ? ";
        const getAllItemQuery = "SELECT DISTINCT item.item_idx, item.category_idx FROM visited, item WHERE visited.user_idx != ? AND visited.item_idx = item.item_idx AND "
        const getAllItemResult = await db.queryParam_Parse(getAllItemQuery, [userIdx]);
        
        for(var i = 0 ; i < getAllItemResult.length ; i++){
            if(getAllItemResult[i].category_idx != favoriteCategoryIndex)
            delete getAllItemResult[i];
        }

        const result = getAllItemResult.filter(function(val) { return val !== null; });
        console.log(result)
        
});




module.exports = router;