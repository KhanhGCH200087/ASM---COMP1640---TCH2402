const { default: mongoose } = require('mongoose');
var mongoos = require('mongoose');
var NotiMCSchema = mongoos.Schema(
    {
        student: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'student'
        },
        contribution: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'contribution'
        },
        event: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'event'
        },
        faculty: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'faculty'
        },
        date: Date,
        status: String
    }
);

var NotificationMCModel = mongoos.model("notificationMC", NotiMCSchema, "notificationMC");
module.exports = NotificationMCModel;