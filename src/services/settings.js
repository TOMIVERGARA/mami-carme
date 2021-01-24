const fs = require('fs-extra');
const path = require("path");
const multer = require("multer");


//Uploader
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      // Uploads is the Upload_folder_name
      cb(null, __dirname + `${file.mimetype == "image/png" ? '/../resources/img/stories': '/../resources/fonts'}`);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + `${file.mimetype == "image/png" ? '.png': '.ttf'}`);
  }
})

const fileFilter = (req, file, cb) => {
      // Set the filetypes, it is optional
      var filetypes = /png|ttf/;
      var mimetype = filetypes.test(file.mimetype);

      var extname = filetypes.test(path.extname(
                  file.originalname).toLowerCase());

      if (mimetype && extname) {
          return cb(null, true);
      }

      cb("Error: File upload only supports the "
              + "following filetypes - " + filetypes);
}

module.exports.uploadResurce = multer({ storage: storage, fileFilter: fileFilter });


//EXPRESS ROUTE
module.exports.getAvailableBackgrounds = (req, res) => {
    const fileNames = fs.readdirSync(__dirname + '/../resources/img/stories').filter(file => file.endsWith('.png'));
    res.status(200).send({ status: 'success', data: { message: 'List all availabe backgrounds', files: fileNames} });
}

//EXPRESS ROUTE
module.exports.getAvailableFonts = (req, res) => {
    const fileNames = fs.readdirSync(__dirname + '/../resources/fonts').filter(file => file.endsWith('.ttf'));
    res.status(200).send({ status: 'success', data: { message: 'List all availabe fonts', files: fileNames} });
}

//EXPRESS ROUTE
module.exports.removeFontByName = async (req, res) => {
    try {
        await fs.unlink(__dirname + `/../resources/fonts/${req.body.filename}`);
        res.status(200).send({ status: 'success', data: { message: 'Deleted font file', files: [req.body.filename]} });
    } catch (error) {
        return res.status(500).send({ status: 'error', error: { code: '105', message: 'There was an error deleting the font', target: 'fs', error: error } });
    }
}

//EXPRESS ROUTE
module.exports.removeBackgroundByName = async (req, res) => {
    try {
        await fs.unlink(__dirname + `/../resources/img/stories/${req.body.filename}`);
        res.status(200).send({ status: 'success', data: { message: 'Deleted background file', files: [req.body.filename]} });
    } catch (error) {
        return res.status(500).send({ status: 'error', error: { code: '105', message: 'There was an error deleting the background img', target: 'fs', error: error } });
    }
}