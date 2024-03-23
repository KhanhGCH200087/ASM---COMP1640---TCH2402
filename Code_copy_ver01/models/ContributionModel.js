var mongoose = require('mongoose');
var ContributionSchema = mongoose.Schema(
    {
        student: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'student'
        },
        event: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'event'
        },
        choosen: {
            type: String
        },
        comment: {
            type: String
        },
        contribution: {
            type: String
        },
        date: {
            type: Date
        }
    }
);

var ContributionModel = mongoose.model("contribution", ContributionSchema, "contribution");
module.exports = ContributionModel;