var express = require('express');
var router = express.Router();

//import model before use
var EventModel = require('../models/EventModel');
const FacultyModel = require('../models/FacultyModel');
var UserModel = require('../models/UserModel');
const {checkAdminSession, verifyToken} = require('../middlewares/auth');
//------------------------------------------------------------------------
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
            var eventList = await EventModel.find({}).populate('faculty');
            res.status(200).json({ success: true, data: eventList });
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
//-------------------------------------------------
        
    }catch(error){
        console.error("Error while fetching event list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-----------------------------------------------------------------------
//delete specific 
router.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            const eventId = req.params.id;
            const deletedEvent = await EventModel.findByIdAndDelete(eventId);
            if (!deletedEvent) {
                res.status(404).json({ success: false, error: "Event not found" });
                return;
            }
            res.status(200).json({ success: true, message: "Event deleted successfully" });
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
    } catch (error) {
        console.error("Error while deleting event:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

//------------------------------------------------------------------------
//create 
//render form for user to input
router.get('/add', verifyToken,  async (req, res) => {
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
            res.status(200).json({ success: true, message: "Render add event form", data: facultyList });
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
//-------------------------------------------------
    }catch(error){
        console.error("Error while making event:", error);
        res.status(500).send("Internal Server Error");
    }
});

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
            const requirement = req.body.requirement;
            const deadline1 = req.body.deadline1;
            const deadline2 = req.body.deadline2;
            const faculty = req.body.faculty;
            await EventModel.create(
                {
                    requirement: requirement,
                    deadline1:deadline1,
                    deadline2:deadline2,
                    faculty: faculty,
                }
            );
            res.status(201).json({ success: true, message: "Event created successfully" });
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
            console.error("Error while adding event:", error);
            res.status(500).json({ success: false, error: "Internal Server Error", InputErrors });
        }
     }
});

//---------------------------------------------------------------------------
//edit 
router.get('/edit/:id', verifyToken,  async (req, res) => {
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            const id = req.params.id;
            const event = await EventModel.findById(id).populate('faculty');
            if (!event) {
                res.status(400).send("Event not found");
            }
            const facultyList = await FacultyModel.find({});
            res.status(200).json({ success: true, message: "Render edit event form", event, facultyList });
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
//-------------------------------------------------
    }catch(error){
        console.error("Error while editing event:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.put('/edit/:id', verifyToken,  async(req, res) => {
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            const id = req.params.id;
            const event = await EventModel.findById(id);
            if (!event) {
                res.status(400).send("Event not found");
            }
            // Update student details
            event.requirement = req.body.requirement;
            event.deadline1 = req.body.deadline1;
            event.deadline2 = req.body.deadline2;
            event.faculty = req.body.faculty;
    
            await event.save();
            res.status(200).json({ success: true, message: "Create Event successfully" });
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
            console.error("Error while updating event:", error);
            res.status(500).json({ success: false, error: "Internal Server Error", InputErrors });
        }
     }
    
});

module.exports = router;
