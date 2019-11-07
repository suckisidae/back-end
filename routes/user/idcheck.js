var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');

router.get('/', async(req, res) => {
    const id = req.body.id;

    const idCheckQuery = `SELECT id FROM user WHERE id = '${id}'`;
    const idCheckResult = await db.queryParam_Parse(idCheckQuery);
    console.log(idCheckResult);
    console.log(id)

    if(!idCheckResult[0]){
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.ABLE_ID));
    } else {
        res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.ALREADY_ID));
    }
});

module.exports = router;