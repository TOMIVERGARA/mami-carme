//Imports Model
const { Birthday } = require('../models/Birthday')
//Tools
const { toTitleCase } = require('./tools/to-title-case');
//Imports Intl Dates
const Intl = require('intl');

class birthdayHandler {
    constructor(name, role, classes, date){
        this.name = toTitleCase(name);
        this.role = role;
        this.classes = classes;
        this.date = date;
    }

    async exists(){
        try {
            const document = await Birthday.findOne({date: this.date});
            if(document){
                this.document = document;
                return document._id
            }else{
                return false
            }
        } catch (error) {
            return error;
        }
    }

    async addBirthdayToDocument(){
        this.document.people.push({ name: this.name, role: this.role, class: this.classes });
        try {
            const update = await Birthday.findByIdAndUpdate(this.document._id, this.document, { new: true, runValidators: true });
            return update;
        } catch (error) {
            throw error;
        }
    }

    async addNewBirthdayDocument(){
        const newBirthday = {
            date: this.date,
            people: [
                { name: this.name, role: this.role, class: this.classes }
            ]
        }
        const document = new Birthday(newBirthday);

        try {
            const insert = await document.save();
            return insert;
        } catch (error) {
            throw error;
        }
    }
}

//EXPRESS ROUTE
module.exports.addBirthday = async (req, res) => {
    const dateParts = req.body.birthday.split("-");
    const today = `${dateParts[2].replace(/^0+(?!$)/, '')}/${dateParts[1].replace(/^0+(?!$)/, '')}`;

    const handler = new birthdayHandler(req.body.name, req.body.role, req.body.class, today);
    if(await handler.exists()){
        handler.addBirthdayToDocument()
           .then(result => {
               return res.status(200).send({ status: 'success', data: { message: 'Updated a birthday document.', document: result} });
           })
           .catch(error => {
               return res.status(500).send({ status: 'error', error: { code: '100', message: 'There was an error updating the document.', target: 'db', error: error } });
           })
    }else{
        handler.addNewBirthdayDocument()
           .then(result => {
               return res.status(200).send({ status: 'success', data: { message: 'Inserted new birthday document.', document: result} });
           })
           .catch(error => {
               return res.status(500).send({ status: 'error', error: { code: '100', message: 'There was an error updating the document.', target: 'db', error: error } });
           })
    }
}