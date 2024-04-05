var mongoose = require('mongoose');
var UserSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required']
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        role: {
            type: mongoose.Schema.ObjectId,
            ref: 'role'
        }
    }
);

var UserModel = mongoose.model("user", UserSchema, "user");
module.exports = UserModel;