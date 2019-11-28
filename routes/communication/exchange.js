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

// trade state
// 0 : 거래요청
// 1 : 거래완료

/* 거래요청하기 */
router.post('/:item_idx', authUtils.isLoggedin, async (req, res) => {
    const otherItemIdx = req.params.item_idx;
    const myItemIdx = req.body.myItemIdx;// 문자열 배열로 주기 ex) [15, 16, 78]
    const user_idx = req.decoded.idx;
    const date = moment().format("YYYY-MM-DD HH:mm:ss");

    if(myItemIdx.length > 3){   // 내 물건이 3개 초과일때 에러
        res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.OVER_THREE_PRODUCT))
    }
    
    // 상품 요청과 상품요청 알림 트랜잭션 처리
    const postExchangeTransaction = await db.Transaction(async(connection) => {
        // 한개씩 db에 넣기
        const exchangeAskQuery = `INSERT INTO trade (from_user_idx, from_item_idx, to_item_idx, date, state) VALUE (?, ?, ?, ?, ?)`;
        for (i of myItemIdx){   // 한개씩 post
            let exchangeAskResult = await connection.query(exchangeAskQuery, [user_idx ,i, otherItemIdx, date, 0]);
        }
        // 거래요청 완료 알림
        const getItemWriterResult = await connection.query(`SELECT writer_idx FROM item WHERE item_idx = ${myItemIdx[0]}`);
        const itemWriterIdx = getItemWriterResult[0].writer_idx
        const pushExchangeNotificationQuery = `INSERT INTO notification (type, user_idx, item_idx, date) VALUES (0, ?, ?, ?)`;
        const pushExchangeNotificationResult = await connection.query(pushExchangeNotificationQuery, [itemWriterIdx, otherItemIdx, date]);
    })
    
    if (!postExchangeTransaction) {   // 실패시 에러
        res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.ASK_EXCHANGE_FAIL))
    } else {    // 성공시 출력  11/18 멘트 조금 바꿈 -세영
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.ASK_EXCHANGE_SUCCESS, `${myItemIdx}번 물품이 ${otherItemIdx}번물품에게 교환신청 성공`));
    }
});

/* 거래요청 수락*/
router.put('/', authUtils.isLoggedin, async(req, res) => {
    const {to_item_idx, from_item_idx} = req.body;
    const date = moment().format("YYYY-MM-DD HH:mm:ss");
    
    // 거래요청 수락 트랜잭션
    const allowExchangeTransaction = await db.Transaction(async(connection) => {
        // 거래요청 수락한 row의 status는 1로 바뀜(거래 완료)
        const updateExchangeStatusQuery = `UPDATE trade SET state = 1 WHERE from_item_idx = ? AND to_item_idx = ?`;
        const updateExchangeStatusResult = await connection.query(updateExchangeStatusQuery, [from_item_idx, to_item_idx]);

        // 요청보낸 물품들의 유저들의 인덱스와 물품들의 인덱스를 불러옴
        const selectOtherUserInfoQuery = `SELECT DISTINCT from_user_idx, from_item_idx FROM trade WHERE to_item_idx = ? AND from_item_idx NOT IN (?)`;
        const selectOtherUserInfoResult = await connection.query(selectOtherUserInfoQuery, [to_item_idx, from_item_idx]);

        // from_user_idx를 구한다
        const selectFromUserInfoQuery = `SELECT writer_idx FROM item WHERE item_idx = ${from_item_idx}`;
        const selectFromUserInfoResult = await connection.query(selectFromUserInfoQuery);

        // 이와 동시에 삭제된 내역의 유저들에게 알림이 감
        const insertExchangeNotificationQuery = `INSERT INTO notification (type, user_idx, item_idx, date) VALUES (?, ?, ?, '${date}')`;
        for (i in selectOtherUserInfoResult) {
            if (selectFromUserInfoResult[0].writer_idx != selectOtherUserInfoResult[i].from_user_idx){
                let insertExchangeNotificationResult = await connection.query(insertExchangeNotificationQuery, [1, selectOtherUserInfoResult[i].from_user_idx, selectOtherUserInfoResult[i].from_item_idx])
            }
        }
        // (from = x or to = x) or (from = y or to = y) and state = 0
        // 거래시 to_item_idx 또는 from_item_idx에 관련된 다른 거래내역은 모두 삭제됨
        const deleteOtherExchangeQuery = `DELETE FROM trade WHERE (to_item_idx = ? OR to_item_idx = ? OR from_item_idx = ? OR from_item_idx = ?) AND state = 0`;
        const deleteOtherExchangeResult = await connection.query(deleteOtherExchangeQuery, [to_item_idx, from_item_idx, to_item_idx, from_item_idx]);
    })

    if (!allowExchangeTransaction){
        res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.ALLOW_EXCHANGE_FAIL));
    } else {
        res.status(201).send(utils.successTrue(statusCode.CREATED, resMessage.ALLOW_EXCHANGE_SUCCESS));
    }
});

/* 거래요청 취소*/
router.delete('/', authUtils.isLoggedin, async (req, res) => {
    const to_item_idx = req.from.to_item_idx;
    const from_item_idx = req.body.from_item_idx;

    const deleteExchangeQuery = `DELETE FROM trade WHERE from_item_idx = ${from_item_idx} AND to_item_idx = ${to_item_idx} ORDER BY date DESC LIMIT 1`;
    const deleteExchangeResult = await db.queryParam_Parse(deleteExchangeQuery);

    if (!deleteExchangeResult) {
        res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.DELETE_EXCHANGE_FAIL));
    } else {
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.DELETE_EXCHANGE_SUCCESS, deleteExchangeResult));
    }
});

module.exports = router;