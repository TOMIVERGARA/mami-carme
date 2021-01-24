module.exports = (app) => {
    const { api } = require('../../../config.json')
    const fileSystem = require('../../services/file-system');
    //Web Hub Services
    const addBirthdayServices = require('../../services/add-birthday');
    const getBirthdayServices = require('../../services/get-birthday');
    const removeBirthdayServices = require('../../services/remove-birthday');
    const settingServices = require('../../services/settings');

    //File Server
    app.get(api.endpoints.index, fileSystem.index);
    app.get(api.endpoints.birthday, fileSystem.birthday);
    app.get(api.endpoints.add_birthday, fileSystem.addBirthday);
    app.get(api.endpoints.get_today_birthday_story, fileSystem.getTodayStory);
    app.get(api.endpoints.settings, fileSystem.settings);

    //Services
    app.post(api.endpoints.add_birthday_service, addBirthdayServices.addBirthday);
    app.post(api.endpoints.add_birthday_service, addBirthdayServices.addBirthday);
    app.get(api.endpoints.get_birthday_by_date, getBirthdayServices.getBirthdayByDate);
    app.delete(api.endpoints.remove_single_by_id, removeBirthdayServices.removeSingleByName);
    app.delete(api.endpoints.remove_document_by_id, removeBirthdayServices.removeDocumentById);

    //Setings
    app.get(api.endpoints.get_available_backgrounds, settingServices.getAvailableBackgrounds);
    app.get(api.endpoints.get_available_fonts, settingServices.getAvailableFonts);
    app.delete(api.endpoints.remove_font_by_name, settingServices.removeFontByName);
    app.delete(api.endpoints.remove_background_by_name, settingServices.removeBackgroundByName);
    app.post(api.endpoints.upload_resources, settingServices.uploadResurce.single('resource'), (req, res, next) => {
        try {
            res.status(201).send({ status: 'success', data: { message: 'Succesfully Uploaded File'} });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ status: 'error', error: { code: '107', message: 'There was an error uploading the file', target: 'multer', error: error } });
        }
    })
}