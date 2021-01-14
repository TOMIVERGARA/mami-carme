//Imports Lodash
const _ = require('lodash');
//Imports Model
const { Birthday } = require('../models/Birthday')

//EXPRESS ROUTE
module.exports.removeSingleByName = async (req, res) => {
    const documentId = req.body.documentId;
    const personName = req.body.personName;

    try {
        var document = await Birthday.findById(documentId);
    } catch (error) {
        return res.status(400).send({ status: 'error', error: { code: '103', message: 'There was an error while getting the document.', target: 'db', error: error } });
    }

    //Returns if docuemnt is null/doesnt exist
    if(!document) return res.status(400).send({ status: 'error', error: { code: '104', message: 'There is no document for the specified ID', target: 'db'} });
    //Removes person from people array
    _.remove(document.people, (person) => {
        return person.name == personName;
    });

    try {
        const update = await Birthday.findByIdAndUpdate(documentId, document, { new: true })
        return res.status(200).send({ status: 'success', data: { message: 'Deleted a birthday from a document.', document: update} });
    } catch (error) {
        return res.status(500).send({ status: 'error', error: { code: '100', message: 'There was an error updating the document.', target: 'db', error: error } });
    }


}

//EXPRESS ROUTE
module.exports.removeDocumentById = (req, res) => {

}