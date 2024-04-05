var mongoose = require('mongoose');
var RoleSchema = mongoose.Schema(
    {
        role: {
            type: String,
            required: [true, 'Enter faculty name'],
            unique: [true, '{VALUE} is existed']
        },
        description: String
    }
);

var RoleModel = mongoose.model("role", RoleSchema, "role");
module.exports = RoleModel;