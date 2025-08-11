const mongoose = require('mongoose');

categorySchema = mongoose.Schema({
    category : {type : String , enum: ['important', 'very important', 'not so important']},
})
