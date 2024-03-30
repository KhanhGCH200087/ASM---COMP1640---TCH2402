var express = require('express');
var router = express.Router();

//import model before use
var RequirementModel = require('./RequirementModel');

//------------------------------------------------------------------------
//show all 
router.get('/', async(req, res) => {
    try{
        //retrieve data from collection
        var requirementList = await RequirementModel.find({});
        //render view and pass data
        res.render('requirement/index', {requirementList});
    }catch(error){
        console.error("Error while fetching requirement list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-----------------------------------------------------------------------
//delete specific 
router.get('/delete/:id', async(req, res) => {
    //req.params: get value by url
    try{
        var id = req.params.id;
        await RequirementModel.findByIdAndDelete(id);
        res.redirect('/requirement');
    } catch(error){
        console.error("Error while deleting requirement:", error);
        res.status(500).send("Internal Server Error");
    }
});

//------------------------------------------------------------------------
//create 
//render form for user to input
router.get('/add', (req, res) => {
    try{
        res.render('requirement/add');
    }catch(error){
        console.error("Error while making requirement:", error);
        res.status(500).send("Internal Server Error");
    }
});

//receive form data and insert it to database
router.post('/add', async (req, res) => {
    //get value by form : req.body
    try{
        var requirement = req.body;
        await RequirementModel.create(requirement);
        res.redirect('/requirement');
    } catch(error){
        console.error("Error while making requirement:", error);
        res.status(500).send("Internal Server Error");
    }
});

//---------------------------------------------------------------------------
//edit 
router.get('/edit/:id', async (req, res) => {
    try{
        var id = req.params.id;
        var requirement = await RequirementModel.findById(id);
        res.render('requirement/edit', {requirement});
    }catch(error){
        console.error("Error while editing requirement:", error);
        res.status(500).send("Internal Server Error");
    }
    
});

router.post('/edit/:id', async(req, res) => {
    try{
        var id = req.params.id;
        var data = req.body;
        await RequirementModel.findByIdAndUpdate(id, data);
        res.redirect('/requirement');
    }catch(error){
        console.error("Error while editing requirement:", error);
        res.status(500).send("Internal Server Error");
    }
    
});


module.exports = router;
