//Imports Model
const { Client } = require('../../models/Client');

//Tools
const { toTitleCase } = require('../tools/to-title-case');
const { toLowercase } = require('../tools/to-lowercase');

//Imports UUID
const { v4: uuidv4 } = require('uuid');

class clientHandler {
    constructor(name, email, phone, grade){
        this.name = toTitleCase(name);
        this.email = toLowercase(email);
        this.phone = phone;
        this.grade = grade;
        this.document;
    }

    async exists(){
        try {
            const name = await Client.findOne({ name: this.name });
            const email = await Client.findOne({ email: this.email });
            if(!name && !email){
                return false;
            }else{
                return true;
            }
        } catch (error) {
            return error;
        }
    }

    async addNewClientDocument(){
        const newClient = {
            name: this.name,
            email: this.email,
            phone: this.phone,
            customer_code: uuidv4(),
            note: `Clase: ${this.grade}`
        }
        const document = new Client(newClient);

        try {
            const insert = await document.save();
            return insert;
        } catch (error) {
            throw error;
        }
    }
}

//EXPRESS ROUTE
module.exports.addClient = async (req, res) => {
    const handler = new clientHandler(req.body.name, req.body.email, req.body.phone, req.body.grade );
    if(await handler.exists()){
        return res.status(400).send({ status: 'error', error: { code: '120', message: 'The name or email specified have already been used.', target: 'clerr'} });
    }else{
        handler.addNewClientDocument()
           .then(result => {
               return res.status(200).send({ status: 'success', data: { message: 'Inserted new client document.', document: result} });
           })
           .catch(error => {
               return res.status(500).send({ status: 'error', error: { code: '100', message: 'There was an error updating the document.', target: 'db', error: error } });
           })
    }
}