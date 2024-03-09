var mongoose = require('mongoose');
var FacultySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Enter faculty name'],
            unique: [true, '{VALUE} is existed']
        },
        description: String
    }
);

var FacultyModel = mongoose.model("faculty", FacultySchema, "faculty");
module.exports = FacultyModel;