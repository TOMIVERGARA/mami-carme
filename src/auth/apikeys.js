const crypto = require('crypto');
const _ = require('lodash')
const configFile = require('../../config.json');
const { v4: uuid4 } = require('uuid');
const fs = require('fs-extra');
const { toLowercase } = require('../services/tools/to-lowercase')
const { toTitleCase } = require('../services/tools/to-title-case');

const generateApiKey = (authorizedDomain, serviceName, keyCreator, appAccess) => {
   const document = {
       id: uuid4(),
       date: new Date(),
       active: true,
       authorizedDomains: toLowercase(authorizedDomain),
       serviceName: toTitleCase(serviceName),
       keyCreator:  toTitleCase(keyCreator),
       appAccess: appAccess
    };
   const documentString = JSON.stringify(document);
   const hash = crypto.createHash('sha256').update(documentString).digest('base64');

   return {
       data: document,
       key: hash
   }
}

//EXPRESS ROUTE
module.exports.createApiKey = (req, res) => {
    if(req.body.authorizedDomain && req.body.serviceName && req.body.keyCreator && req.body.appAccess){
        const hashMap = generateApiKey(req.body.authorizedDomain, req.body.serviceName, req.body.keyCreator, req.body.appAccess);
        configFile.api_keys.push(hashMap);
        fs.writeFile(__dirname + '/../../config.json', JSON.stringify(configFile, null, 2), error => {
             if (error) return res.status(500).send({ status: 'error', error: { code: '131', message: 'There was an error updating the config file', target: 'config', error: error } });
             return res.status(200).send({ status: 'success', data: { message: 'Created new api key.', private_key: hashMap.key, key_data: hashMap.data } });
        });
    }else{
        return res.status(400).send({ status: 'error', error: { code: '130', message: 'Missing fields: Your request is missing some of the required fields.', target: 'ui' } });
    }
}

//EXPRESS ROUTE
module.exports.getApiKeys = (req, res) => {
    const keys = configFile.api_keys.map(key => {
        return {
            data: {
                id: key.data.id,
                active: key.data.active,
                authorizedDomains: key.data.authorizedDomains,
                serviceName: key.data.serviceName,
                keyCreator: key.data.keyCreator,
                appAccess: key.data.appAccess
            }
        };
    });
    return res.status(200).send({ status: 'success', data: { message: 'List all Api keys.', active_keys: keys } });
}

//EXPRESS ROUTE
module.exports.deleteApiKey = (req, res) => {
    if(!req.body.keyId) return res.status(400).send({ status: 'error', error: { code: '130', message: 'Missing fields: Your request is missing some of the required fields.', target: 'ui' } });
    _.remove(configFile.api_keys, key => key.data.id == req.body.keyId);
    fs.writeFile(__dirname + '/../../config.json', JSON.stringify(configFile, null, 2), error => {
         if (error) return res.status(500).send({ status: 'error', error: { code: '131', message: 'There was an error updating the config file', target: 'config', error: error } });
         return res.status(200).send({ status: 'success', data: { message: 'Delete an API Key' } });
    });
}

//EXPRESS ROUTE
module.exports.pauseApiKey = (req, res) => {
    if(!req.body.keyId) return res.status(400).send({ status: 'error', error: { code: '130', message: 'Missing fields: Your request is missing some of the required fields.', target: 'ui' } });
    const objIndex = configFile.api_keys.findIndex((key => key.data.id == req.body.keyId));
    const previousActiveStatus = configFile.api_keys[objIndex].data.active
    configFile.api_keys[objIndex].data.active = !previousActiveStatus;
    fs.writeFile(__dirname + '/../../config.json', JSON.stringify(configFile, null, 2), error => {
         if (error) return res.status(500).send({ status: 'error', error: { code: '131', message: 'There was an error updating the config file', target: 'config', error: error } });
         return res.status(200).send({ status: 'success', data: { message: 'Udpated API Key Status' }, keyId: req.body.keyId });
    });
}

