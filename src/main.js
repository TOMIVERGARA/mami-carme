//Loads DotEnv Files
const { config } = require('dotenv');
config();

//Imports DB Connection Starter
const { startConnection } = require('./loaders/db');
//Imports Discord Bot Controller Starter
const { startBot } = require('./loaders/bot');
//Imports Http Server Starter
const { startHttpServer } = require('./loaders/server')

try {
   console.log('***STARTING SERVER***')
   //Starts DB Connection
   startConnection();
   //Starts Discord Bot Controller
   startBot();
   //Starts the Http Server
   startHttpServer();
} catch (error) {
   console.error('There was a fatal error while starting the server. Exit Code 5')
   return process.exit(5)
}


