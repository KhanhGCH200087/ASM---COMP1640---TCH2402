var mongoose = require('mongoose');
var MMSchema = mongoose.Schema(
    {
        name: String,
        dob: Date,
        gender: String,
        address: String,
        image: String,
        role: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'role'
        }, 
        email: String,
        password: String
    }
);

var MMModel = mongoose.model("marketing_manager", MMSchema, "marketing_manager");
module.exports = MMModel;