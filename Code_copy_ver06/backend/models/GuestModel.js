var mongoose = require('mongoose');
var GuestSchema = mongoose.Schema({
    name: String,
    faculty: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'faculty'
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    }
});

var GuestModel = mongoose.model("guest", GuestSchema, "guest");
module.exports = GuestModel;