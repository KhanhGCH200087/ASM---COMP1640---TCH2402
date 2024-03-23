var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');

var ContributionModel = require('../models/ContributionModel');
var StudentModel = require('../models/StudentModel');
var EventModel = require('../models/EventModel');

//-------------------------------------------------------------------------
// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/contributions/') // Set the destination folder where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()) // Set the filename to avoid name conflicts
    }
});

const upload = multer({ storage: storage });


//------------------------------------------------------------------------
//show all 
router.get('/', async(req, res) => {
    try{
        var contributionList = await ContributionModel.find({}).populate('student').populate('event');
        //render view and pass data
        res.render('contribution/index', {contributionList});
    } catch (error){
        console.error("Error while fetching contribution list:", error);
        res.status(500).send("Internal Server Error");
    }  
});

//-----------------------------------------------------------------------
//delete specific contribution
router.get('/delete/:id', async(req, res) => {
    //req.params: get value by url
    try{
        var id = req.params.id;
        await ContributionModel.findByIdAndDelete(id);
        res.redirect('/contribution');
    } catch (error){
        console.error("Error while deleting contribution list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//------------------------------------------------------------------------
//create contribution
//render form for user to input
router.get('/add', async (req, res) => {
    try{
        var studentList = await StudentModel.find({});
        var eventList = await EventModel.find({});
        res.render('contribution/add', {studentList, eventList});
    } catch (error){
        console.error("Error while making new contribution:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/add', upload.single('contribution'), async (req, res) => {
    //get value by form : req.body
    try{
        
        const student = req.body.student;
        const choosen = req.body.choosen;
        const comment = req.body.comment;
        const contribution = req.file 
        const date = req.body.date;
        const event = req.body.event;
    
        //read the file
        const fileData = fs.readFileSync(contribution.path);
        //convert file data to base 64
        const base64File = fileData.toString('base64');
        await ContributionModel.create(
            {
                student: student,
                choosen: choosen,
                comment: comment,
                contribution: base64File,
                date: date,
                event: event
            }
        );
        res.redirect('/contribution');
    }catch(error){
        console.error("Error while making new contribution:", error);
        res.status(500).send("Internal Server Error");
    }
});

//---------------------------------------------------------------------------
// edit contribution
// Render form for editing a specific contribution
router.get('/edit/:id', async (req, res) => {
    try {
        // Fetch contribution details by ID
        const contributionId = req.params.id;
        const contribution = await ContributionModel.findById(contributionId).populate('student').populate('event');
        if (!contribution) {
            throw new Error('Contribution not found');
        }
        // Fetch student and event lists for dropdowns
        const studentList = await StudentModel.find({});
        const eventList = await EventModel.find({});
        // Render edit form with contribution details and dropdown options
        res.render('contribution/edit', { contribution, studentList, eventList });
    } catch (error) {
        // Handle errors (e.g., contribution not found)
        console.error(error);
        res.status(404).send('Contribution not found');
    }
});

// Handle form submission for editing a contribution
router.post('/edit/:id', upload.single('contribution'), async (req, res) => {
    try {
        // Fetch contribution by ID
        const contributionId = req.params.id;
        const contribution = await ContributionModel.findById(contributionId);
        if (!contribution) {
            throw new Error('Contribution not found');
        }
        // Update contribution details
        contribution.student = req.body.student;
        contribution.choosen = req.body.choosen;
        contribution.comment = req.body.comment;
        contribution.date = req.body.date;
        contribution.event = req.body.event;
        // If a new file is uploaded, update it
        if (req.file) {
            const fileData = fs.readFileSync(req.file.path);
            contribution.contribution = fileData.toString('base64');
        }
        // Save updated contribution to the database
        await contribution.save();
        // Redirect to contribution list page
        res.redirect('/contribution');
    } catch (error) {
        // Handle errors (e.g., contribution not found, validation errors)
        console.error(error);
        res.status(400).send(error.message);
    }
});






//-----------------------------------
module.exports = router;
