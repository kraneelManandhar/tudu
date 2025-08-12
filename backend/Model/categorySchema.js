const mongoose = require('mongoose');
const task = require('./TaskSchema')

categorySchema = mongoose.Schema({
    category : {type : String , enum: ['important', 'very important', 'not so important']},
    tasks : { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }
})

module.exports = mongoose.model('Category',categorySchema);