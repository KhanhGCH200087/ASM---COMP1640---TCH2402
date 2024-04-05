var mongoose = require('mongoose');
var MMSchema = mongoose.Schema(
    {
        name: {
            type: String,
            min: [2, 'Name is required at least 2 character,'],
            max: [15, 'Max name is 15 characters'],
            unique: [true, 'Name is existed']
        },
        dob: {
            type: Date,
            required: [true, 'Pls choose the birth'],
            max: ['2000-01-01', 'Must after 2000'],
            min: ['1900-01-01', 'Must before 1900']
        },
        gender: {
            type: String,
            required: [true, 'Pls choose gender'],
            enum: {
                values: ['Male', 'Female'],
                message: '{VALUE} is not supported'
            }
        },
        address: {
            type: String,
            min: [2, 'Address is required at least 2 character,'],
            max: [15, 'Max address is 50 characters']
        },
        image: String,
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user'
        }
    }
);

var MMModel = mongoose.model("marketing_manager", MMSchema, "marketing_manager");
module.exports = MMModel;