module.exports = {
    federation: {
        facebook: {
            clientId: '페이스북 앱 ID',
            secretId: '앱 시크릿 코드',
            callbackUrl: '/auth/login/facebook/callback'
        },
        kakao: {
            clientId: '카카오 앱 REST API 키',
            callbackUrl: '/auth/login/kakao/callback'
        }
    }
};