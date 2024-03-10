var mongoose = require('mongoose');
var AdminSchema = mongoose.Schema(
    {
        name: {
            type: String,
            min: [2, 'Name is required at least 2 character,'],
            max: [15, 'Max name is 15 characters'],
            unique: [true, 'Name is existed']
        },
        dob: {
            type: Date,
            required: [true, 'Pls choose the birth']
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
        role: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'role'
        }, 
        email: {
            type: String,
            required:[true, 'Pls enter email'],
            unique: [true, 'Email is existed']
        },
        password: {
            type: String,
            required:[true, 'Pls enter password']
        }
    }
);

var AdminModel = mongoose.model("admin", AdminSchema, "admin");
module.exports = AdminModel;