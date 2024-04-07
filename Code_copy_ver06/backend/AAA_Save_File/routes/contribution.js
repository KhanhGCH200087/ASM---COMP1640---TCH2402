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
router.get('/', async (req, res) => {
    try {
        var contributionList = await ContributionModel.find({});
        res.status(200).json({ success: true, data: contributionList });
    } catch (error) {
        console.error("Error while fetching contribution list:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

//-----------------------------------------------------------------------
//delete specific contribution
router.delete('/delete/:id', async (req, res) => {
    try {
        const contributionId = req.params.id;
        const deletedContribution = await ContributionModel.findByIdAndDelete(contributionId);
        if (!deletedContribution) {
            res.status(404).json({ success: false, error: "Contribution not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Contribution deleted successfully" });
    } catch (error) {
        console.error("Error while deleting contribution:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

//------------------------------------------------------------------------
//create contribution
//render form for user to input
router.get('/add', async (req, res) => {
    try{
        var studentList = await StudentModel.find({});
        var eventList = await EventModel.find({});
        res.status(200).json({success: true, studentList, eventList})
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
        res.status(201).json({ success: true, message: "Contribution created successfully" });
    } catch (error) {
        if (error.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in error.errors) {
              InputErrors[field] = error.errors[field].message;
           }
            console.error("Error while adding contribution:", error);
            res.status(500).json({ success: false, error: "Internal Server Error", InputErrors });
        }
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
            res.status(404).json({ success: false, error: "Contribution not found" });
            return;
        }
        // Fetch student and event lists for dropdowns
        const studentList = await StudentModel.find({});
        const eventList = await EventModel.find({});
        res.status(200).json({ success: true, contribution, studentList, eventList });
    } catch (error) {
        console.error("Error while fetching contribution details:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Handle form submission for editing a contribution
router.put('/edit/:id', upload.single('contribution'), async (req, res) => {
    try {
        const contributionId = req.params.id;
        const contribution = await ContributionModel.findById(contributionId);
        if (!contribution) {
            res.status(404).json({ success: false, error: "Contribution not found" });
            return;
        }
        // Update contribution details
        contribution.student = req.body.student;
        contribution.choosen = req.body.choosen;
        contribution.comment = req.body.comment;
        contribution.date = req.body.date;
        contribution.event = req.body.event;
        if (req.file) {
            const fileData = fs.readFileSync(req.file.path);
            contribution.contribution = fileData.toString('base64');
        }
        await contribution.save();
        res.status(200).json({ success: true, message: "Contribution updated successfully" });
    } catch (err) {
        if (err.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in err.errors) {
              InputErrors[field] = err.errors[field].message;
           }
            console.error("Error while updating contribution:", err);
            res.status(500).json({ success: false, err: "Internal Server Error", InputErrors });
        }
     }
});


module.exports = router;
