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
    } catch (err) {
        if (err.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in err.errors) {
              InputErrors[field] = err.errors[field].message;
           }
           res.render('role/add', { InputErrors, role });
        }
     }
});


module.exports = router;
