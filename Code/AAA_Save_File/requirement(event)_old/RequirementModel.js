var mongoose = require('mongoose');
var RequirementSchema = mongoose.Schema(
    {
        requirement: {
            type: String,
            required: [true, 'Enter requirement'],
        },
        deadline1: {
            type: Date,
            required: [true, 'Pls choose the deadline'],
        },
        deadline2: {
            type: Date,
            required: [true, 'Pls choose the deadline'],
        }
    }
);

var RequirementModel = mongoose.model("requirement", RequirementSchema, "requirement");
module.exports = RequirementModel;