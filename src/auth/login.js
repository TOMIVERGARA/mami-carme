const { validateOtp } = require('./otp');
const { createJwt, validateJwt } = require('./jwt');

//EXPRESS ROUTE
module.exports.login = async (req, res) => {
    const userOtp = req.body.otp;

    //DEV LOGIN
    if(process.env.ENV == 'DEVELOPMENT'){
        if(userOtp == process.env.DEV_LOGIN_PASSWD){
            const userObject = {
                timestamp: new Date(),
                otp: userOtp,
                appVersion: "DEVELOPMENT"
            };
            const jwt = await createJwt(userObject);
            return res.status(200).send({ status: 'success', data: { message: 'Login Service', token: jwt}})
        }else{
            return res.status(400).send({ status: 'error', error: { code: '111', message: 'The OTP is invalid', target: 'login'} });
        }
    }

    //PROPER LOGIN
    if(validateOtp(userOtp)){
        const userObject = {
            timestamp: new Date(),
            otp: userOtp,
            appVersion: req.body.appVersion
        };
        const jwt = await createJwt(userObject);
        return res.status(200).send({ status: 'success', data: { message: 'Login Service', token: jwt}})
    }{
        return res.status(400).send({ status: 'error', error: { code: '111', message: 'The OTP is invalid', target: 'login'} });
    }
}

//EXPRESS ROUTE
module.exports.validateJwt = async (req, res) => {
    try {
        const validate = await validateJwt(req.body.token)
        if(validate){
            return res.status(200).send({ status: 'success', data: { message: 'JWT Validation', body: validate}})
        }else{
            return res.status(401).send({ status: 'error', error: { code: '115', message: 'Unauthorized: the JWT is invalid or expired.', target: 'auth'} });
        }
    } catch (error) {
        return res.status(500).send({ status: 'error', error: { code: '113', message: 'There was an error validating the JWT', target: 'auth'} });
    }
}