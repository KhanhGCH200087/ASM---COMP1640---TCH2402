var mongoose = require('mongoose');
var StudentSchema = mongoose.Schema(
    {
        name: String,
        dob: Date,
        gender: String,
        address: String,
        image: String,
        faculty: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'faculty'
        }, 
        role: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'role'
        }, 
        email: String,
        password: String
    }
);

var StudentModel = mongoose.model("student", StudentSchema, "student");
module.exports = StudentModel;