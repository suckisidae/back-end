const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const db = require('../module/pool');
const secret_config = require('./secret');
const responseMessage = require('../module/utils/responseMessage');
//포스트맨으로 하지말고 주소창에 쳐서 할 것
//auth/.../kakao 하면 카카오 로그인 치면 창이 나오는데 이 로그인창은 클라이언트는 모르기때문에 이 페이지의 url을 클라이언트한테 줘야한다

module.exports = () => {
    passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
        //사용자의 정보(user)가 세션에 저장, user는 117번째 성공했을 때의 값
        done(null, user); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
    });

    passport.deserializeUser((user, done) => { // 매개변수 user는 serializeUser의 done의 인자 user를 받은 것
        //로그인에 성공하게 되면 Session정보를 저장을 완료했기에 이제 페이지 접근 시마다 사용자 정보를 갖게 Session에 갖게 해준다
        done(null, user);
    });

    passport.use(new LocalStrategy({ // local login 전략
		//어떤 필드(key 값)로부터 아이디와 비밀번호를 전달받을 지 설정하는 옵션
		//동일하게 다 필드를 맞춰줘야함
        usernameField: 'name',
        passwordField: 'pw',
        session: true, // 세션에 저장 여부
        passReqToCallback: false,   //req 객체를 콜백함수에 넘길지 여부. true로 하면 콜밸함수의 인자가  (req, id, pw, done) 임
    }, async (name, pw, done) => { //done은 11번째줄로 올라감, 리턴같은 역할
        //실제 사용자 인증
        const findUserQuery = `SELECT * FROM user WHERE name = ${name}`;
        const findUserResult = await db.queryParam_None(findUserQuery);

        if (!findUserResult) {
            return done(null, false, { message: 'DB 에러' });
        } else if (findUserResult.length == 1) {
            if (findUserResult[0].pw == pw) {
                return done(null, findUserResult[0]);//찾은 첫번째 유저인자를 넣음
            } else {
                return done(null, false, { message: 'ID 혹은 비밀번호가 틀렸습니다' });//실패를 직접 만들고 실패
            }
        } else {
            return done(null, false, { message: 'ID 혹은 비밀번호가 틀렸습니다' });

        }
    }));
	//전략을 카카오와 페이스북 검색을 한번 해봐라
    passport.use(new KakaoStrategy({
        clientID: secret_config.federation.kakao.clientId,//키값이 유출되면 안되기 때문에 모듈로 임시로 긁어서 가져오는것
        callbackURL: secret_config.federation.kakao.callbackUrl
    }, async (accessToken, refreshToken, profile, done) => {//프로필은 사용자의 정보, done은 리턴문
        var _profile = profile._json;
        console.log('Kakao login info');
        console.info(_profile);

        try {//결과값을 다 뜯어서 어떤 컴럼에 넣을지 결정, 똑같이 제이슨값이지만 어떤거에 따라오는지 달라짐
            await loginLogic({
              authType : 1,
                email: null,
              name: _profile.properties.nickname,
              img: _profile.properties.profile_image,
                pw: null
            }, done);
        } catch (err) {
            console.log("Kakao Error => " + err);
            done(err);
        }
    }));

    passport.use(new FacebookStrategy({
        clientID: secret_config.federation.facebook.clientId,
        clientSecret: secret_config.federation.facebook.secretId,
        callbackURL: secret_config.federation.facebook.callbackUrl,
        profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
    }, async (accessToken, refreshToken, profile, done) => {
        var _profile = profile;
        console.log('Facebook login info');
        console.info(_profile);

        try {
            await loginLogic({
                authType : 2,
                email: null,
                name: _profile.displayName,
                img: _profile.profileUrl,
                pw: null
            }, done);
        } catch (err) {
            console.log("Facebook Error => " + err);
            done(err);
        }
    }));

    async function loginLogic(info, done) {
        console.log('process : ' + info.authType);

        const chkUserQuery = 'SELECT * FROM user WHERE name = ?';
        const insertUserQuery = 'INSERT INTO user (name, email, img, authType, pw) VALUES (?, ?, ?, ?, ?)';

        const chkUserResult = await db.queryParam_Arr(chkUserQuery, [info.name]);

        if (!chkUserResult) {
            return done(null, false, {
                message: responseMessage.DB_ERROR
            });
        } else if (chkUserResult.length == 1) { //기존 유저 로그인처리
            done(null, {
                idx: chkUserResult[0].userIdx
            });
        } else { //신규 유저 회원가입
            const insertUserResult = await db.queryParam_Arr(insertUserQuery, [info.name, info.email, info.img, info.authType, info.pw]);

            if (!insertUserResult) {
                return done(null, false, {
                    message: responseMessage.DB_ERROR
                });
            } else {
                done(null, {//이건 세션임
                    idx: insertUserResult.insertId
                });//토큰을 사용하려면 토큰을 만들고 저장한 토큰은 사용자에게 주면 됨, 그리고 여기에 토큰을 넘겨준다고 코딩을 해야함
            }
        }}
};