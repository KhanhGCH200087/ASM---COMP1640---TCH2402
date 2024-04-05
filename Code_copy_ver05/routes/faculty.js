var express = require('express');
var router = express.Router();

//import model before use
var FacultyModel = require('../models/FacultyModel');
var UserModel = require('../models/UserModel');
var MarketingCoordinatorModel = require('../models/MarketingCoordinatorModel');
var EventModel = require('../models/EventModel');
var StudentModel = require('../models/StudentModel');


//---------------------------Phần này cho Admin---------------------------------------------
//show all 
router.get('/', async(req, res) => {
    try{
        var facultyList = await FacultyModel.find({});
        res.status(200).json({ success: true, data: facultyList });
    }catch(error){
        console.error("Error while fetching faculty list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-----------------------------------------------------------------------
//delete specific 
router.delete('/delete/:id', async (req, res) => {
    try {
        const facultyId = req.params.id;
        const deletedFaculty = await FacultyModel.findByIdAndDelete(facultyId);
        if (!deletedFaculty) {
            res.status(404).json({ success: false, error: "Faculty not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Faculty deleted successfully" });
    } catch (error) {
        console.error("Error while deleting faculty:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

//------------------------------------------------------------------------
//create 
//render form for user to input
router.get('/add', (req, res) => {
    res.status(200).json({ success: true, message: "Render add faculty form" });
});

//receive form data and insert it to database
router.post('/add', async (req, res) => {
    //get value by form : req.body
    try{
        var faculty = req.body;
        const newFaculty = await FacultyModel.create(faculty);
        if(!newFaculty){
            res.status(400).json({ success: false, message: "Error in create Faculty" });
        } else {
            res.status(201).json({ success: true, message: "Faculty is created successfully" });
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in error.errors) {
              InputErrors[field] = error.errors[field].message;
           }
            console.error("Error while adding faculty:", error);
            res.status(500).json({ success: false, error: "Internal Server Error", InputErrors });
        }
     }
});

//---------------------------------------------------------------------------
//edit 
router.get('/edit/:id', async (req, res) => {
    try{
        var id = req.params.id;
        var faculty = await FacultyModel.findById(id);
        res.status(200).json({ success: true, message: "Render edit faculty form", data: faculty });
    }catch(error){
        console.error("Error while editing faculty:", error);
        res.status(500).send("Internal Server Error");
    }
    
});

router.post('/edit/:id', async(req, res) => {
    try{
        var id = req.params.id;
        var data = req.body;
        const updateFaculty = await FacultyModel.findByIdAndUpdate(id, data);
        if(updateFaculty){
            res.status(200).json({ success: true, message: "Faculty updated successfully" });
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in error.errors) {
              InputErrors[field] = error.errors[field].message;
           }
            console.error("Error while updating faculty:", error);
            res.status(500).json({ success: false, error: "Internal Server Error", InputErrors });
        }
     }
});

//----------------------------Phần này cho MC ------------------------------------------------




module.exports = router;
