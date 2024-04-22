var express = require('express');
var router = express.Router();

//import model before use
var FacultyModel = require('../models/FacultyModel');
var UserModel = require('../models/UserModel');
const {checkAdminSession, verifyToken} = require('../middlewares/auth');

//---------------------------Phần này cho Admin---------------------------------------------
//show all 
router.get('/', verifyToken, async(req, res) => {
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            var facultyList = await FacultyModel.find({});
            res.status(200).json({ success: true, data: facultyList });
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
//-------------------------------------------------
    }catch(error){
        console.error("Error while fetching faculty list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-----------------------------------------------------------------------
//delete specific 
router.delete('/delete/:id', verifyToken,  async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            const facultyId = req.params.id;
            const deletedFaculty = await FacultyModel.findByIdAndDelete(facultyId);
            if (!deletedFaculty) {
                res.status(404).json({ success: false, error: "Faculty not found" });
                return;
            }
            res.status(200).json({ success: true, message: "Faculty deleted successfully" });
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
//-------------------------------------------------
    } catch (error) {
        console.error("Error while deleting faculty:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

//------------------------------------------------------------------------
//create 
//receive form data and insert it to database
router.post('/add', verifyToken,  async (req, res) => {
    //get value by form : req.body
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            var faculty = req.body;
            const newFaculty = await FacultyModel.create(faculty);
            if(!newFaculty){
                res.status(400).json({ success: false, message: "Error in create Faculty" });
            } else {
                res.status(201).json({ success: true, message: "Faculty is created successfully" });
            }
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
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
router.get('/edit/:id', verifyToken, async (req, res) => {
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            var id = req.params.id;
            var faculty = await FacultyModel.findById(id);
            res.status(200).json({ success: true, message: "Render edit faculty form", data: faculty });
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
    }catch(error){
        console.error("Error while editing faculty:", error);
        res.status(500).send("Internal Server Error");
    }
    
});

router.post('/edit/:id', verifyToken, async(req, res) => {
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            var id = req.params.id;
            var data = req.body;
            const updateFaculty = await FacultyModel.findByIdAndUpdate(id, data);
            if(updateFaculty){
                res.status(200).json({ success: true, message: "Faculty updated successfully" });
            }
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
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
