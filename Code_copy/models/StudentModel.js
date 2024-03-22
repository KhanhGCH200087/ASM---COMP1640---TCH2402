var mongoose = require('mongoose');
var StudentSchema = mongoose.Schema(
    {
        name: {
            type: String,
            min: [2, 'Name is required at least 2 character,'],
            max: [15, 'Max name is 15 characters'],
        },
        dob: {
            type: Date,
            required: [true, 'Pls choose the birth'],
            max: ['2010-01-01', 'Must before 2010'],
            min: ['2007-01-01', 'Must after 2007']
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
        faculty: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'faculty'
        }, 
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user'
        }
    }
);

var StudentModel = mongoose.model("student", StudentSchema, "student");
module.exports = StudentModel;