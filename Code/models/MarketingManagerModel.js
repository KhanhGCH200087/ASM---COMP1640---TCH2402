var mongoose = require('mongoose');
var MarketingManagerSchema = mongoose.Schema(
    {
        name: String,
        gender: String,
        address : String,
        email: String,
        password: String,
        image: String,
        dob: Date
    }
);

var MarketingManagerModel = mongoose.model("marketing_manager", MarketingManagerSchema, "marketing_manager");
module.exports = MarketingManagerModel;