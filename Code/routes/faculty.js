var express = require('express');
var router = express.Router();

//import model before use
var FacultyModel = require('../models/FacultyModel');

//------------------------------------------------------------------------
//show all 
router.get('/', async(req, res) => {
    //retrieve data from collection
    var facultyList = await FacultyModel.find({});
    //render view and pass data
    res.render('faculty/index', {facultyList});
});

//-----------------------------------------------------------------------
//delete specific 
router.get('/delete/:id', async(req, res) => {
    //req.params: get value by url
    var id = req.params.id;
    await FacultyModel.findByIdAndDelete(id);
    res.redirect('/faculty');
});

//------------------------------------------------------------------------
//create 
//render form for user to input
router.get('/add', (req, res) => {
    res.render('faculty/add');
})

//receive form data and insert it to database
router.post('/add', async (req, res) => {
    //get value by form : req.body
    var faculty = req.body;
    await FacultyModel.create(faculty);
    res.redirect('/faculty');
})

//---------------------------------------------------------------------------
//edit 
router.get('/edit/:id', async (req, res) => {
    var id = req.params.id;
    var faculty = await FacultyModel.findById(id);
    res.render('faculty/edit', {faculty});
})

router.post('/edit/:id', async(req, res) => {
    var id = req.params.id;
    var data = req.body;
    await FacultyModel.findByIdAndUpdate(id, data);
    res.redirect('/faculty');
})


module.exports = router;
