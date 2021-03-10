//Imports Model
const { Client } = require('../../models/Client');

const deleteClient = async (email) => {
    try {
        const deletedClient = await Client.deleteOne({ email: email }, { returnOriginal: true });
        if(deletedClient.deletedCount == 0) return false;
        return deletedClient;
    } catch (error) {
        throw error;
    }
}

//EXPRESS ROUTE
module.exports.deleteClientByEmail = (req, res) => {
    if(!req.body.email) return res.status(400).send({ status: 'error', error: { code: '130', message: 'Missing fields: Your request is missing some of the required fields.', target: 'ui' } });
    deleteClient(req.body.email)
       .then(client => {
           if(!client) return res.status(400).send({ status: 'error', error: { code: '138', message: 'The specified email doesnt have an associated client.', target: 'db' } });
           return res.status(200).send({ status: 'success', data: { message: 'Deleted client by email', deletedClient: client }});
       })
       .catch(error => {
           return res.status(500).send({ status: 'error', error: { code: '139', message: 'There was an error deleting the client.', target: 'db', error: error } });
       })
}