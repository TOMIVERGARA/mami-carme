//Imports Model
const { Client } = require('../../models/Client');

//Tools
const { downloadResource } = require('../tools/download-resource');

const exportClients = async (setExported) => {
    try {
        const documents = await Client.find({ exported: false }, ['_id', 'name', 'email', 'phone', 'address', 'city', 'region', 'postal_code', 'country', 'customer_code', 'points_balance', 'note']);
        return documents;
    } catch (error) {
        console.log(error);
    }
}

//EXPRESS ROUTE
module.exports.exportClients = async (req, res) => {
    const fields = [
        {
          label: 'Customer ID',
          value: '_id'
        },
        {
          label: 'Customer name',
          value: 'name'
        },
        {
         label: 'Email',
          value: 'email'
        },
        {
         label: 'Phone',
          value: 'phone'
        },
        {
         label: 'Address',
          value: 'address'
        },
        {
         label: 'City',
          value: 'city'
        },
        {
         label: 'Region',
          value: 'region'
        },
        {
         label: 'Postal code',
          value: 'postal_code'
        },
        {
         label: 'Country',
          value: 'country'
        },
        {
         label: 'Customer code',
          value: 'customer_code'
        },
        {
         label: 'Points balance',
          value: 'points_balance'
        },
        {
         label: 'Note',
          value: 'note'
        },
    ];

    exportClients(req.body.setExported ? req.body.setExported : false)
       .then(clientsArray => {
          return downloadResource(res, 'newclients.csv', fields, clientsArray);
       })
       .catch(error => {
          return res.status(500).send({ status: 'error', error: { code: '100', message: 'There was an error updating the document.', target: 'db', error: error } });
       })
}