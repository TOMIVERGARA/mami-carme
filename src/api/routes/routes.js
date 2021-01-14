module.exports = (app) => {
    const { api } = require('../../../config.json')
    const fileSystem = require('../../services/file-system');
    //Web Hub Services
    const addBirthdayServices = require('../../services/add-birthday');
    const getBirthdayServices = require('../../services/get-birthday');
    const removeBirthdayServices = require('../../services/remove-birthday');

    //File Server
    app.get(api.endpoints.index, fileSystem.index);
    app.get(api.endpoints.birthday, fileSystem.birthday);
    app.get(api.endpoints.add_birthday, fileSystem.addBirthday);
    app.get(api.endpoints.get_today_birthday_story, fileSystem.getTodayStory);

    //Services
    app.post(api.endpoints.add_birthday_service, addBirthdayServices.addBirthday);
    app.post(api.endpoints.add_birthday_service, addBirthdayServices.addBirthday);
    app.get(api.endpoints.get_birthday_by_date, getBirthdayServices.getBirthdayByDate);
    app.delete(api.endpoints.remove_single_by_id, removeBirthdayServices.removeSingleByName);
}