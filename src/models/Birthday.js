//Imports Mongoose
const mongoose = require('mongoose');

//Creates Schema
const BirthdaySchema = mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    people: [
        {
            name: { type: String, required: true },
            role: { type: String, required: true },
            class: { type: String, required: true }
        }
    ]
}, { timestamps: true });

//Exports Model
module.exports.Birthday = mongoose.model('Birthday', BirthdaySchema)
