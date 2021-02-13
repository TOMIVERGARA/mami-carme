//Imports Mongoose
const mongoose = require('mongoose');

//Creates Schema
const ClientSchema = mongoose.Schema({
     name: {
         type: String,
         required: true
     },
     email: {
         type: String,
         required: true
     },
     phone: {
         type: Number,
         required: false,
         default: 1111111111
     },
     address: {
         type: String,
         required: false,
         default: 'S/N Unknown St.'
     },
     city: {
         type: String,
         required: false,
         default: 'Unknown'
     },
     region: {
         type: String,
         required: false,
         default: 'Unknown'
     },
     postal_code: {
         type: Number,
         required: false,
         default: 0000
     },
     country: {
         type: String,
         required: false,
         default: 'Unknown'
     },
     customer_code: {
         type: String,
         required: true
     },
     points_balance: {
         type: Number,
         required: false,
         default: 0
     },
     note: {
         type: String,
         required: true
     },
     exported: {
         type: Boolean,
         required: false,
         default: false
     }
}, { timestamps: true });

//Exports Model
module.exports.Client = mongoose.model('Client', ClientSchema)