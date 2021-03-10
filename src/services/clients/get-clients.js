//Imports Model
const { Client } = require('../../models/Client');

//Tools
const { downloadResource } = require('../tools/download-resource');

const exportClients = async (setExported) => {
    try {
        const documents = await Client.find({ exported: false }, ['_id', 'name', 'email', 'phone', 'address', 'city', 'region', 'postal_code', 'country', 'customer_code', 'points_balance', 'note']);
        if(setExported){
          await Client.updateMany({ exported: false }, { exported: true });
        }
        return documents;
    } catch (error) {
        throw error;
    }
}

const getClients = async () => {
    try {
        const documents = await Client.find();
        return documents;
    } catch (error) {
        throw error;
    }
}

const getClientsReport = async () => {
    const report = {
       total_clients: null,
       unexported_clients: null,
       new_clients: null //Last 24 hours
    }

    try {
        report.total_clients = await Client.countDocuments()
        report.unexported_clients = await Client.countDocuments({ exported: false });
        report.new_clients = await Client.countDocuments({ createdAt: { $lt: new Date(), $gte: new Date(new Date().setDate(new Date().getDate()-1)) } });
        return report;
    } catch (error) {
      throw error;
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

//EXPRESS ROUTE
module.exports.clientsReport = (req, res) => {
    getClientsReport()
       .then(report => {
          return res.status(200).send({ status: 'success', data: { message: 'Get clients report', report: report }});
       })
       .catch(error => {
          return res.status(500).send({ status: 'error', error: { code: '121', message: 'There was an error generating the report', target: 'db', error: error } });
       })
}

//EXPRESS ROUTE
module.exports.getClients = (req, res) => {
    getClients()
       .then(clientsArray => {
        return res.status(200).send({ status: 'success', data: { message: 'Get clients list', clients: clientsArray }});
       })
       .catch(error => {
          return res.status(500).send({ status: 'error', error: { code: '122', message: 'There was an error geting the clients array', target: 'db', error: error } });
       })
}