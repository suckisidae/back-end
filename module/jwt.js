const jwt = require('jsonwebtoken');
const secretOrPrivateKey = "tmakdlfrpdlxm19!";

module.exports = {
    sign: function (user) {
        const options = {
            algorithm: 'HS256',
            expiresIn: "5h",
            issuer: "junjnami"
        };
        const payload = {
            idx: user.idx,
            id: user.id,
            grade : user.grade
        };
        let token = jwt.sign(payload, secretOrPrivateKey, options);
        return token;
    },
    verify: function (token) {
        let decoded;
        try {
            decoded = jwt.verify(token, secretOrPrivateKey);
        } catch (err) {
            if (err.message === 'jwt expired') {
                console.log('expired token');
                return -3;
            } else if (err.message === 'invalid token') {
                console.log('invalid token');
                return -2;
            } else {
                console.log("invalid token")
                return -2;
            }
        }
        return decoded;
    }
};