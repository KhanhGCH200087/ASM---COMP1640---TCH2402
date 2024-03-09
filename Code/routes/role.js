var express = require('express');
var router = express.Router();

//import model before use
var RoleModel = require('../models/RoleModel');

//------------------------------------------------------------------------
//show all 
router.get('/', async(req, res) => {
    //retrieve data from collection
    try{
        var roleList = await RoleModel.find({});
        //render view and pass data
        res.render('role/index', {roleList});
    }catch(error){
        console.error("Error while fetching role list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-----------------------------------------------------------------------
//delete specific 
router.get('/delete/:id', async(req, res) => {
    //req.params: get value by url
    try{
        var id = req.params.id;
        await RoleModel.findByIdAndDelete(id);
        res.redirect('/role');
    }catch{
        console.error("Error while deleting role list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//------------------------------------------------------------------------
//create 
//render form for user to input
router.get('/add', (req, res) => {
    try{
        res.render('role/add');
    }catch(error){
        console.error("Error while adding role list:", error);
        res.status(500).send("Internal Server Error");
    } 
});

//receive form data and insert it to database
router.post('/add', async (req, res) => {
    //get value by form : req.body
    try{
        var role = req.body;
        await RoleModel.create(role);
        res.redirect('/role');
    }catch(error){
        console.error("Error while adding role list:", error);
        res.status(500).send("Internal Server Error");
    }
    
});

//---------------------------------------------------------------------------
//edit 
router.get('/edit/:id', async (req, res) => {
    try{
        var id = req.params.id;
        var role = await RoleModel.findById(id);
        res.render('role/edit', {role});
    }catch(error){
        console.error("Error while editing role list:", error);
        res.status(500).send("Internal Server Error");
    }
    
});

router.post('/edit/:id', async(req, res) => {
    try{
        var id = req.params.id;
        var data = req.body;
        await RoleModel.findByIdAndUpdate(id, data);
        res.redirect('/role');
    }catch(error){
        console.error("Error while editing role list:", error);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;
