var express = require('express');
var router = express.Router();

//import model before use
var EventModel = require('../models/EventModel');
const FacultyModel = require('../models/FacultyModel');

//------------------------------------------------------------------------
//show all 
router.get('/', async(req, res) => {
    try{
        var eventList = await EventModel.find({}).populate('faculty');
        res.status(200).json({ success: true, data: eventList });
    }catch(error){
        console.error("Error while fetching event list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-----------------------------------------------------------------------
//delete specific 
router.delete('/delete/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const deletedEvent = await EventModel.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            res.status(404).json({ success: false, error: "Event not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error while deleting event:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

//------------------------------------------------------------------------
//create 
//render form for user to input
router.get('/add', async (req, res) => {
    try{
        var facultyList = await FacultyModel.find({});
        res.status(200).json({ success: true, message: "Render add event form", data: facultyList });
    }catch(error){
        console.error("Error while making event:", error);
        res.status(500).send("Internal Server Error");
    }
});

//receive form data and insert it to database
router.post('/add', async (req, res) => {
    //get value by form : req.body
    try{
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
router.get('/edit/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const event = await EventModel.findById(id).populate('faculty');
        if (!event) {
            res.status(400).send("Event not found");
        }
        const facultyList = await FacultyModel.find({});
        res.status(200).json({ success: true, message: "Render edit event form", event, facultyList });
    }catch(error){
        console.error("Error while editing event:", error);
        res.status(500).send("Internal Server Error");
    }
    
});

router.put('/edit/:id', async(req, res) => {
    try{
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
