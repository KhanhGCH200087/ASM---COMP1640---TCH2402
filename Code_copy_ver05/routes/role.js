var express = require('express');
var router = express.Router();

//import model before use
var RoleModel = require('../models/RoleModel');

//------------------------------------------------------------------------
//show all 
router.get('/', async(req, res) => {
    try{
        var roleList = await RoleModel.find({});
        res.status(200).json({ success: true, data: roleList });
    }catch(error){
        console.error("Error while fetching role list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//edit 
router.get('/edit/:id', async (req, res) => {
    try{
        var id = req.params.id;
        var role = await RoleModel.findById(id);
        if(!role){
            res.status(404).json({ success: false, error: "Role not found" });
            return;
        }
        res.status(200).json({ success: true, data: role });
    }catch(error){
        console.error("Error while editing role list:", error);
        res.status(500).send("Internal Server Error");
    }
    
});

router.put('/edit/:id', async(req, res) => {
    try{
        var id = req.params.id;
        var data = req.body;
        const updateRole = await RoleModel.findByIdAndUpdate(id, data);
        if(!updateRole){
            res.status(404).json({ success: false, error: "Update role fail" });
            return;
        } else {
            res.status(200).json({ success: true, error: "Update role success" });
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in error.errors) {
              InputErrors[field] = error.errors[field].message;
           }
            console.error("Error while updating role:", error);
            res.status(500).json({ success: false, error: "Internal Server Error", InputErrors });
        }
     }
});

module.exports = router;
