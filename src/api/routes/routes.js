module.exports = (app) => {
    const { api } = require('../../../config.json')
    const fileSystem = require('../../services/file-system');
    //Web Hub Services
    const addBirthdayServices = require('../../services/add-birthday');
    const getBirthdayServices = require('../../services/get-birthday');
    const removeBirthdayServices = require('../../services/remove-birthday');
    const addClientServices = require('../../services/clients/add-client');
    const getClientServices = require('../../services/clients/get-clients');
    const settingServices = require('../../services/settings');
    const authServices = require('../../auth/login');

    //Authentication
    const auth = require('../middlewares/auth');

    //File Server
    app.get(api.endpoints.index, fileSystem.index);
    app.get(api.endpoints.birthday, fileSystem.birthday);
    app.get(api.endpoints.add_birthday, fileSystem.addBirthday);
    app.get(api.endpoints.get_today_birthday_story, fileSystem.getTodayStory);
    app.get(api.endpoints.settings, fileSystem.settings);
    app.get(api.endpoints.login, fileSystem.login);

    //Services - Birthday
    app.post(api.endpoints.add_birthday_service, auth, addBirthdayServices.addBirthday);
    app.post(api.endpoints.add_birthday_service, auth, addBirthdayServices.addBirthday);
    app.get(api.endpoints.get_birthday_by_date, auth, getBirthdayServices.getBirthdayByDate);
    app.delete(api.endpoints.remove_single_by_id, auth, removeBirthdayServices.removeSingleByName);
    app.delete(api.endpoints.remove_document_by_id, auth, removeBirthdayServices.removeDocumentById);

    //Services - Clients
    app.post(api.endpoints.add_client_service, auth, addClientServices.addClient);
    app.get(api.endpoints.export_clients, getClientServices.exportClients);

    //Setings
    app.get(api.endpoints.get_available_backgrounds, auth, settingServices.getAvailableBackgrounds);
    app.get(api.endpoints.get_available_fonts, auth, settingServices.getAvailableFonts);
    app.delete(api.endpoints.remove_font_by_name, auth, settingServices.removeFontByName);
    app.delete(api.endpoints.remove_background_by_name, auth, settingServices.removeBackgroundByName);
    app.post(api.endpoints.upload_resources, auth, settingServices.uploadResurce.single('resource'), (req, res, next) => {
        try {
            res.status(201).send({ status: 'success', data: { message: 'Succesfully Uploaded File'} });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ status: 'error', error: { code: '107', message: 'There was an error uploading the file', target: 'multer', error: error } });
        }
    });
    app.put(api.endpoints.toggle_setting, auth, settingServices.toggleSetting);
    app.get(api.endpoints.get_settings, auth, settingServices.getSettings);

    //Auth
    app.post(api.endpoints.login_with_otp, authServices.login);
    app.post(api.endpoints.validate_jwt, authServices.validateJwt);
}