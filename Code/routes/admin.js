var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');

var AdminModel = require('../models/AdminModel');
var RoleModel = require('../models/RoleModel');

//-------------------------------------------------------------------------
// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/') // Set the destination folder where uploaded files will be stored
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
        var adminList = await AdminModel.find({}).populate('role');
        //render view and pass data
        res.render('admin/index', {adminList});
    }catch(error){
        console.error("Error while fetching admin list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-----------------------------------------------------------------------
//delete specific admin
router.get('/delete/:id', async(req, res) => {
    //req.params: get value by url
    try{
        var id = req.params.id;
        await AdminModel.findByIdAndDelete(id);
        res.redirect('/admin');
    }catch(error){
        console.error("Error while deleting admin:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/edit/:id', async (req, res) => {
    try {
        // Fetch admin details by ID
        const adminId = req.params.id;
        const admin = await AdminModel.findById(adminId).populate('role');
        if (!admin) {
            throw new Error('Admin not found');
        }
        // Fetch role and faculty lists for dropdowns
        const roleList = await RoleModel.find({});
        // Render edit form with admin details and dropdown options
        res.render('admin/edit', { admin, roleList });
    } catch (error) {
        // Handle errors (e.g., admin not found)
        console.error(error);
        res.status(404).send('Admin not found');
    }
});

// Handle form submission for editing a admin
router.post('/edit/:id', upload.single('image'), async (req, res) => {
    try {
        // Fetch admin by ID
        const adminId = req.params.id;
        const admin = await AdminModel.findById(adminId);
        if (!admin) {
            throw new Error('Admin not found');
        }
        // Update admin details
        admin.name = req.body.name;
        admin.dob = req.body.dob;
        admin.role = req.body.role;
        admin.gender = req.body.gender;
        admin.address = req.body.address;
        admin.email = req.body.email;
        admin.password = req.body.password;
        // If a new image is uploaded, update it
        if (req.file) {
            const imageData = fs.readFileSync(req.file.path);
            admin.image = imageData.toString('base64');
        }
        // Save updated admin to the database
        await admin.save();
        // Redirect to admin list page
        res.redirect('/admin');
    } catch (error) {
        // Handle errors (e.g., admin not found, validation errors)
        console.error(error);
        res.status(400).send(error.message);
    }
});



//-----------------------------------
module.exports = router;
