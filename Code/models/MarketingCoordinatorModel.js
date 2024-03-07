var mongoose = require('mongoose');
var MCSchema = mongoose.Schema(
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

var MCModel = mongoose.model("marketing_coordinator", MCSchema, "marketing_coordinator");
module.exports = MCModel;