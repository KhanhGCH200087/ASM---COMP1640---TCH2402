var express = require('express');
var router = express.Router();

//import model before use
var EventModel = require('../models/EventModel');

//------------------------------------------------------------------------
//show all 
router.get('/', async(req, res) => {
    try{
        //retrieve data from collection
        var eventList = await EventModel.find({});
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
router.get('/add', (req, res) => {
    try{
        res.render('event/add');
    }catch(error){
        console.error("Error while making event:", error);
        res.status(500).send("Internal Server Error");
    }
});

//receive form data and insert it to database
router.post('/add', async (req, res) => {
    //get value by form : req.body
    try{
        var event = req.body;
        
        await EventModel.create(event);
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
        var id = req.params.id;
        var event = await EventModel.findById(id);
        res.render('event/edit', {event});
    }catch(error){
        console.error("Error while editing event:", error);
        res.status(500).send("Internal Server Error");
    }
    
});

router.post('/edit/:id', async(req, res) => {
    try{
        var id = req.params.id;
        var data = req.body;
        await EventModel.findByIdAndUpdate(id, data);
        res.redirect('/event');
    }catch(error){
        console.error("Error while editing event:", error);
        res.status(500).send("Internal Server Error");
    }
    
});


module.exports = router;
