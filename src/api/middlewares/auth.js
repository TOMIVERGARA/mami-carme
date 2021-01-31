const { validateJwt } = require('../../auth/jwt');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const validate = await validateJwt(token);
        if(validate){
            next();
        }else{
            throw 'Invalid JWT';
        }
    } catch (error) {
        return res.status(401).send({ status: 'error', error: { code: '115', message: 'Unauthorized: the JWT is invalid or expired.', target: 'auth'} });
    }
}