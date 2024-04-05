var express = require('express');
var router = express.Router();
const fs = require('fs');

var MarketingCoordinatorModel = require('../models/MarketingCoordinatorModel');
var UserModel = require('../models/UserModel');

//
router.get('/profile', async (req, res) => {
    try{
        var mcUserId = req.session.user_id;
        var UserData = await UserModel.find({mcUserId});
      if(UserData){
        var mcMCData = await MarketingCoordinatorModel.findOne({user: mcUserId});
      } else {
        req.status().send('MC not found');
      }
        res.render('marketingcoordinator/profile', {UserData});
    }catch(error){
        console.error("Error while fetching M0:", error);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;
