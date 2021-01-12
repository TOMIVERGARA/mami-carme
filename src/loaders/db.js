//Imports Mongoose
const mongoose = require('mongoose')

module.exports.startConnection =  () => {
    mongoose.connect(process.env.MONGODB_CLUSTER_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
      .then(console.log("Succesfuly Connected to Database"))
      .catch(error => {
         console.log("There was an error while connecting to the db. The bot is not available.");
         console.error(`➥ ${error}`);
         throw error
      })
}

