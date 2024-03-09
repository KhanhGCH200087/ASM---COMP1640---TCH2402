var express = require('express');
var router = express.Router();

//import model before use
var FacultyModel = require('../models/FacultyModel');

//------------------------------------------------------------------------
//show all 
router.get('/', async(req, res) => {
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
router.get('/delete/:id', async(req, res) => {
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
router.get('/add', (req, res) => {
    try{
        res.render('faculty/add');
    }catch(error){
        console.error("Error while making faculty:", error);
        res.status(500).send("Internal Server Error");
    }
});

//receive form data and insert it to database
router.post('/add', async (req, res) => {
    //get value by form : req.body
    try{
        var faculty = req.body;
        await FacultyModel.create(faculty);
        res.redirect('/faculty');
    } catch(error){
        console.error("Error while making faculty:", error);
        res.status(500).send("Internal Server Error");
    }
});

//---------------------------------------------------------------------------
//edit 
router.get('/edit/:id', async (req, res) => {
    try{
        var id = req.params.id;
        var faculty = await FacultyModel.findById(id);
        res.render('faculty/edit', {faculty});
    }catch(error){
        console.error("Error while editing faculty:", error);
        res.status(500).send("Internal Server Error");
    }
    
});

router.post('/edit/:id', async(req, res) => {
    try{
        var id = req.params.id;
        var data = req.body;
        await FacultyModel.findByIdAndUpdate(id, data);
        res.redirect('/faculty');
    }catch(error){
        console.error("Error while editing faculty:", error);
        res.status(500).send("Internal Server Error");
    }
    
});


module.exports = router;
