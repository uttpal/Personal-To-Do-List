// app/models/todo.js

var mongoose = require('mongoose');

// todo schema for mongoDB
var todoSchema = mongoose.Schema({

    email    	: String,
    content     : String,
    done		: { type: Number, default: 0 },
    location    : String,
    due_time	: { type: Number, default: 24 },
    updated_at  : Date

});


// model exposure to app
module.exports = mongoose.model('todo', todoSchema);
