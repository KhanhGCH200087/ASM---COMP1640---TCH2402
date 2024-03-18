var express = require('express');
var router = express.Router();

//import model before use
var EventModel = require('../models/EventModel');
const FacultyModel = require('../models/FacultyModel');

//------------------------------------------------------------------------
//show all 
router.get('/', async(req, res) => {
    try{
        //retrieve data from collection
        var eventList = await EventModel.find({}).populate('faculty');
        //render view and pass data
        res.render('event/index', {eventList});
    }catch(error){
        console.error("Error while fetching event list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-----------------------------------------------------------------------
//delete specific 
router.get('/delete/:id', async(req, res) => {
    //req.params: get value by url
    try{
        var id = req.params.id;
        await EventModel.findByIdAndDelete(id);
        res.redirect('/event');
    } catch(error){
        console.error("Error while deleting event:", error);
        res.status(500).send("Internal Server Error");
    }
});

//------------------------------------------------------------------------
//create 
//render form for user to input
router.get('/add', async (req, res) => {
    try{
        var facultyList = await FacultyModel.find({});
        res.render('event/add', {facultyList});
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
        res.redirect('/event');
    } catch(error){
        console.error("Error while making event:", error);
        res.status(500).send("Internal Server Error");
    }
});

//---------------------------------------------------------------------------
//edit 
router.get('/edit/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const event = await EventModel.findById(id).populate('faculty');
        if (!event) {
            throw new Error('Event not found');
        }
        const facultyList = await FacultyModel.find({});
        res.render('event/edit', {event, facultyList});
    }catch(error){
        console.error("Error while editing event:", error);
        res.status(500).send("Internal Server Error");
    }
    
});

router.post('/edit/:id', async(req, res) => {
    try{
        const id = req.params.id;
        const event = await EventModel.findById(id);
        if (!event) {
            throw new Error('Event not found');
        }
        // Update student details
        event.requirement = req.body.requirement;
        event.deadline1 = req.body.deadline1;
        event.deadline2 = req.body.deadline2;
        event.faculty = req.body.faculty;

        await event.save();
        res.redirect('/event');
    }catch(error){
        console.error("Error while editing event:", error);
        res.status(500).send("Internal Server Error");
    }
    
});


module.exports = router;
