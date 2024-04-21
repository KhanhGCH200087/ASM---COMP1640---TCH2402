var express = require('express');
var router = express.Router();

//import model before use
var FacultyModel = require('../models/FacultyModel');

const {checkAdminSession, verifyToken} = require('../middlewares/auth');

//---------------------------Phần này cho Admin---------------------------------------------
//show all 
router.get('/', verifyToken, checkAdminSession, async(req, res) => {
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
router.delete('/delete/:id', verifyToken, checkAdminSession, async (req, res) => {
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
//receive form data and insert it to database
router.post('/add', verifyToken, checkAdminSession, async (req, res) => {
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
router.get('/edit/:id', verifyToken, checkAdminSession, async (req, res) => {
    try{
        var id = req.params.id;
        var faculty = await FacultyModel.findById(id);
        res.status(200).json({ success: true, message: "Render edit faculty form", data: faculty });
    }catch(error){
        console.error("Error while editing faculty:", error);
        res.status(500).send("Internal Server Error");
    }
    
});

router.post('/edit/:id', verifyToken, checkAdminSession, async(req, res) => {
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


module.exports = router;
