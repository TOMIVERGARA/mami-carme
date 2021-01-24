const fs = require('fs-extra');
const { getDynamicStoryImg } = require('./gen-birthday-story');

//EXPRESS ROUTE
module.exports.index = (req, res) => {
  res.sendFile('public/index.html', { root: '.' });
}

//EXPRESS ROUTE
module.exports.birthday = (req, res) => {
  res.sendFile('public/birthday/index.html', { root: '.' });
}

//EXPRESS ROUTE
module.exports.addBirthday = (req, res) => {
    res.sendFile('public/birthday/add-birthday.html', { root: '.' });
}

//EXPRESS ROUTE
module.exports.settings = (req, res) => {
    res.sendFile('public/settings/index.html', { root: '.' });
}

//EXPRESS ROUTE
module.exports.getTodayStory = async (req, res) => {
    const sendFile = () => res.sendFile(`src/resources/img/stories/today/${new Date().getDay()}.png`, { root: '.' });

    //Checks if today's story has already been generated
    if(fs.existsSync(__dirname + `/../resources/img/stories/today/${new Date().getDay()}.png`)) {
        sendFile();
    } else {
       //File doesn't exist
        fs.emptyDir(__dirname + '/../resources/img/stories/today')
            .then(async (deleted) => {
               try {
                 await getDynamicStoryImg();
                 sendFile();
               } catch (error) {
                 return res.status(500).send({ status: 'error', error: { code: '103', message: 'There was an error generating the new story.', target: 'DynamicStoryGenerator', error: error } });
               }
            })
            .catch(error => {
               return res.status(500).send({ status: 'error', error: { code: '102', message: 'There was an error clearing the stories/today folder.', target: 'fs', error: error } });
            })
    }
}