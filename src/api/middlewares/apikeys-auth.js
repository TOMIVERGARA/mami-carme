const configFile = require('../../../config.json');
const auth = require('./auth');

module.exports = async (req, res, next) => {
    if(req.headers.authorization.split(' ')[1]){
       if(req.body.authType == 'jwtAuth') return auth(req, res, next);
       const apiKey = req.headers.authorization.split(' ')[1];
       const isValidKey = () => {
          let test = false;
          configFile.api_keys.forEach(key => {
              if(key.key === apiKey && key.data.active) test = true;
          });
          return test;
       }

       if(isValidKey()){
           next();
       }else{
           return res.status(401).send({ status: 'error', error: { code: '115', message: 'Unauthorized: the API Key is invalid or expired.', target: 'auth'} });
       }
    }else{
        return res.status(401).send({ status: 'error', error: { code: '115', message: 'Unauthorized: you must specify the API key as Bearer Token.', target: 'auth'} });
    }
}