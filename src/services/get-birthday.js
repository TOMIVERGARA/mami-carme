//Imports Model
const { Birthday } = require('../models/Birthday')
//Imports Intl Dates
const Intl = require('intl');

class birthdayList {
    constructor(document){
        //Document Deconstruction
        this.id = document._id;
        this.date = document.date;
        this.people = document.people;
    }

    create(){
        const generateList = (people) => {
            const peopleList = [];
            people.forEach(person => {
                peopleList.push(`> ✪ ***${person.name}*** - ${person.role.charAt(0).toUpperCase()} ${person.class != '' ? `• ${person.class}` : '' }`);
            });
            return peopleList.join('\n');
        };

        return `${generateList(this.people)}`;
    }

    createArray(){
        return this.people;
    }
}


/**
 * Generates a markdown formatted string with today's birthdays.
 * @function
 * @async
 * @returns {String}
 */
module.exports.getTodayBirthdayFormatted = async () => {
    const date = new Date();
    const today = new Intl.DateTimeFormat(process.env.TIMEZONE, {
      day: '2-digit',
      month: '2-digit'
    }).format(date);

    try {
        const document = await Birthday.findOne({date: `${process.env.ENV == 'DEVELOPMENT' ? '1/1' : today}`});
        if(!document) return '> Hoy no hay cumpleaños :(';
        return new birthdayList(document).create();
    } catch (error) {
        return `> Perdon. Tuve un problema para buscar en la DB: ${error}`;
    }

}

/**
 * Gets an array with today's birthdays.
 * @function
 * @async
 * @returns {Array}
 */
module.exports.getTodayBirthdayArray = async () => {
    const date = new Date();
    const today = new Intl.DateTimeFormat(process.env.TIMEZONE, {
      day: '2-digit',
      month: '2-digit'
    }).format(date);

    try {
        const document = await Birthday.findOne({date: `${process.env.ENV == 'DEVELOPMENT' ? '1/1' : today}`});
        if(!document) return [{ name: '¡Hoy no hay cumpleaños!', role: 'Birthday.findOne:Alert', class: 'Alerta' }];
        return new birthdayList(document).createArray();
    } catch (error) {
        return [{ name: 'Error al buscar en la DB.', role: 'DB:Error', class: 'Error - DB' }];
    }

}

//EXPRESS ROUTE
/**
 * Gets the birthday information of a given date.
 * @function
 * @async
 * @param {Object} req
 * @param {Object} res
 * @returns {Object}
 */
module.exports.getBirthdayByDate = async (req, res) => {
    const dateParts = req.query.dateStr.split("-");
    const date = `${dateParts[2].replace(/^0+(?!$)/, '')}/${dateParts[1].replace(/^0+(?!$)/, '')}`;

    try {
        const document = await Birthday.findOne({date: date});
        if(!document) return res.status(200).send({ status: 'success', data: { message: 'Get a birthday document', document: []} });
        return res.status(200).send({ status: 'success', data: { message: 'Get a birthday document', id: document._id, document: new birthdayList(document).createArray()} });
    } catch (error) {
        return res.status(500).send({ status: 'error', error: { code: '103', message: 'There was an error while getting the document.', target: 'db', error: error } });
    }
}

