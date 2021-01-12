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

module.exports.getTodayBirthday = async () => {
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

