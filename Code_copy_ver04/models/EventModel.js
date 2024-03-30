var mongoose = require('mongoose');
var EventSchema = mongoose.Schema(
    {
        requirement: {
            type: String
        },
        deadline1: {
            type: Date
        },
        deadline2: {
            type: Date
        },
        faculty: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'faculty'
        }
    }
);

var EventModel = mongoose.model("event", EventSchema, "event");
module.exports = EventModel;