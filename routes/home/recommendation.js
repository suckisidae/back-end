var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');

//추천 상품 조회
router.get('/', authUtils.isLoggedin, async(req, res)=>{

		const userIdx = req.decoded.idx;

        //내가 찜한 목록 가져오기
		const getUserVisitedQuery = "SELECT item_idx FROM heart WHERE user_idx = ?"
        const getUserVisitedResult = await db.queryParam_Parse(getUserVisitedQuery, [userIdx]);

        //내가 찜한 목록들 훑으며 카테고리 카운트 하기
        var getCategoryResult;
        var Category = new Array(0,0,0,0,0);

        //찜한 목록수 만큼 반복
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
        //내가 제일 선호하는 카테고리를 구하였음.
        const favoriteCategoryIndex = Category.indexOf(maxCategory);

        //내가 선호하는 카테고리에서 내가 봤던 물품들을 제외하고 3개 가져옴 (차집합)
        const getRecommendItemQuery = "SELECT thumbnail, title FROM item WHERE NOT EXISTS (SELECT 1 FROM visited WHERE visited.item_idx = item.item_idx AND user_idx = ?) AND category_idx = ? ORDER BY item.views DESC LIMIT 3"
        const getRecommendItemResult = await db.queryParam_Parse(getRecommendItemQuery, [userIdx, favoriteCategoryIndex]);
        
        console.log(getRecommendItemResult)
        
        if(!getRecommendItemResult){	
            res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.ITEM_GET_BAD_RESULT));
        }else{
            res.status(200).send(utils.successTrue(statusCode.OK, resMessage.ITEM_GET_SUCCESS, getRecommendItemResult));
        }

});

module.exports = router;