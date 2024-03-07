var express = require('express');
var router = express.Router();

//import model before use
var RoleModel = require('../models/RoleModel');

//------------------------------------------------------------------------
//show all 
router.get('/', async(req, res) => {
    //retrieve data from collection
    var roleList = await RoleModel.find({});
    //render view and pass data
    res.render('role/index', {roleList});
});

//-----------------------------------------------------------------------
//delete specific 
router.get('/delete/:id', async(req, res) => {
    //req.params: get value by url
    var id = req.params.id;
    await RoleModel.findByIdAndDelete(id);
    res.redirect('/role');
});

//------------------------------------------------------------------------
//create 
//render form for user to input
router.get('/add', (req, res) => {
    res.render('role/add');
})

//receive form data and insert it to database
router.post('/add', async (req, res) => {
    //get value by form : req.body
    var role = req.body;
    await RoleModel.create(role);
    res.redirect('/role');
})

//---------------------------------------------------------------------------
//edit 
router.get('/edit/:id', async (req, res) => {
    var id = req.params.id;
    var role = await RoleModel.findById(id);
    res.render('role/edit', {role});
})

router.post('/edit/:id', async(req, res) => {
    var id = req.params.id;
    var data = req.body;
    await RoleModel.findByIdAndUpdate(id, data);
    res.redirect('/role');
})


module.exports = router;
