module.exports = (app) => {
    const { api } = require('../../../config.json')
    const fileSystem = require('../../services/file-system');
    //Web Hub Services
    const addBirthdayServices = require('../../services/add-birthday');

    //File Server
    app.get(api.endpoints.add_birthday, fileSystem.addBirthday);
    app.get(api.endpoints.get_today_birthday_story, fileSystem.getTodayStory);

    //Services
    app.post(api.endpoints.add_birthday_service, addBirthdayServices.addBirthday);
}