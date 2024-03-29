var express = require('express');
var router = express.Router();

//import model before use
var FacultyModel = require('../models/FacultyModel');
var UserModel = require('../models/UserModel');
var MarketingCoordinatorModel = require('../models/MarketingCoordinatorModel');
var EventModel = require('../models/EventModel');
var StudentModel = require('../models/StudentModel');
const {checkAdminSession, checkMCSession} = require('../middlewares/auth');

//---------------------------Phần này cho Admin---------------------------------------------
//show all 
router.get('/', checkAdminSession, async(req, res) => {
    try{
        //retrieve data from collection
        var facultyList = await FacultyModel.find({});
        //render view and pass data
        res.render('faculty/index', {facultyList});
    }catch(error){
        console.error("Error while fetching faculty list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-----------------------------------------------------------------------
//delete specific 
router.get('/delete/:id',checkAdminSession, async(req, res) => {
    //req.params: get value by url
    try{
        var id = req.params.id;
        await FacultyModel.findByIdAndDelete(id);
        res.redirect('/faculty');
    } catch(error){
        console.error("Error while deleting faculty:", error);
        res.status(500).send("Internal Server Error");
    }
});

//------------------------------------------------------------------------
//create 
//render form for user to input
router.get('/add',checkAdminSession, (req, res) => {
    try{
        res.render('faculty/add');
    }catch(error){
        console.error("Error while making faculty:", error);
        res.status(500).send("Internal Server Error");
    }
});

//receive form data and insert it to database
router.post('/add',checkAdminSession, async (req, res) => {
    //get value by form : req.body
    try{
        var faculty = req.body;
        await FacultyModel.create(faculty);
        res.redirect('/faculty');
    } catch (err) {
        if (err.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in err.errors) {
              InputErrors[field] = err.errors[field].message;
           }
           res.render('faculty/add', { InputErrors, faculty });
        }
     }
});

//---------------------------------------------------------------------------
//edit 
router.get('/edit/:id',checkAdminSession, async (req, res) => {
    try{
        var id = req.params.id;
        var faculty = await FacultyModel.findById(id);
        res.render('faculty/edit', {faculty});
    }catch(error){
        console.error("Error while editing faculty:", error);
        res.status(500).send("Internal Server Error");
    }
    
});

router.post('/edit/:id',checkAdminSession, async(req, res) => {
    try{
        var id = req.params.id;
        var data = req.body;
        await FacultyModel.findByIdAndUpdate(id, data);
        res.redirect('/faculty');
    } catch (err) {
        if (err.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in err.errors) {
              InputErrors[field] = err.errors[field].message;
           }
           res.render('faculty/edit', { InputErrors, faculty });
        }
     }
    
});

//----------------------------Phần này cho MC ------------------------------------------------
//show all information 
router.get('/facultypage', checkMCSession, async(req, res) => {
    try{
        var mcUserId = req.session.user_id;
        var UserData = await UserModel.findById(mcUserId);
      if(UserData){
        var MCData = await MarketingCoordinatorModel.findOne({user: mcUserId});
        facultyID = MCData.faculty;
      } else {
        req.status().send('MC not found');
      }

        var facultyData = await FacultyModel.findOne({_id: facultyID});
        if(facultyData){
            var studentData = await StudentModel.find({faculty: facultyID});
            var eventData = await EventModel.find({faculty: facultyID});
            res.render('faculty/facultypage', {facultyData, eventData, studentData});
        } else {
            req.status().send('Faculty not found');
        }

    }catch(error){
        console.error("Error while fetching faculty list:", error);
        res.status(500).send("Internal Server Error");
    }
});



module.exports = router;