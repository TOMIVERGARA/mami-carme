//Imports Express, body-parser and cors
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

//Routers folder
const routes = require('../api/routes/routes');

//Rate Limiter
const rateLimiter = require('../api/middlewares/rate-limiter');

//Defines Listening port
const port = process.env.PORT || 3000;

module.exports.startHttpServer = () => {
    try {
       const app = express();

       //Starts required services
       app.use(bodyParser.urlencoded({ extended: true }));
       app.use(bodyParser.json());
       app.use("/api/", rateLimiter);
       app.use(express.static(path.join(`${__dirname}/../../`, 'public')));
       app.use('/api/v1/resources', express.static(path.join(`${__dirname}/../`, 'resources')));

       //Defines Router File
       routes(app);

       //Starts Listening on defined port
       app.listen(port);

       console.log(`Http Server running on port: ${port}`);
    } catch (error) {
       console.log('There was an error while starting the Http Server');
       console.error(`➥ ${error}`);
       throw error
    }
}